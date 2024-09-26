import expressAsyncHandler from "express-async-handler";
import { Usuarios } from "../models/Usuarios.js";
import { generateToken } from "../../utils/utilsUsuarios.js";
import { handleError } from "../../utils/utilsErrors.js";
import bcrypt from "bcryptjs";
import { transporter } from "../../utils/mailer.js";
import { verifyEmailTemplate } from "../../utils/htmlEmails.js";
import { PublishCommand } from '@aws-sdk/client-sns';
import { snsClient } from "../../utils/utilsVerify.js";

const createUsuarios = expressAsyncHandler(async (req, res) => {
  try {
    const { Name, Email, DNI, Password, Telefono, isAdmin } = req.body;
    const newUser = new Usuarios({
      Name,
      Email,
      Telefono,
      isAdmin,
      DNI,
      Password,
      verifyToken: Math.random().toString().substring(2, 6),
      expireToken: Date.now() + 2 * 60,
    });
    const user = await newUser.save();
    await sendMail(req, user.verifyToken);
    const token = generateToken(newUser);
    res.send({ user, token });
  } catch (error) {
    handleError(error, res);
  }
});

const getUsuarios = expressAsyncHandler(async (req, res) => {
  try {
    const usuarios = await Usuarios.findAll();
    res.send(usuarios);
  } catch (error) {
    handleError(error, res);
  }
});

const getUsuarioById = expressAsyncHandler(async (req, res) => {
  try {
    const usuario = await Usuarios.findByPk(req.params.id);
    res.send(usuario);
  } catch (error) {
    handleError(error, res);
  }
});

const updateUsuario = expressAsyncHandler(async (req, res) => {
  try {
    const { Name, Email, DNI, Password, Telefono, isAdmin } = req.body;
    const usuario = await Usuarios.findByPk(req.params.id);
    if (usuario) {
      usuario.Name = Name ?? usuario.Name;
      usuario.Email = Email ?? usuario.Email;
      usuario.DNI = DNI ?? usuario.DNI;
      usuario.Password = Password ?? usuario.Password;
      usuario.Telefono = Telefono ?? usuario.Telefono;
      usuario.isAdmin = isAdmin ?? usuario.isAdmin;
      const updatedUsuario = await usuario.save();
      res.send(updatedUsuario);
    } else {
      res.status(404).send({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    handleError(error, res);
  }
});

const deleteUsuario = expressAsyncHandler(async (req, res) => {
  try {
    await Usuarios.destroy({
      where: {
        idUsuarios: req.params.id,
      },
    });
    res.send({ message: "Usuario eliminado" });
    res.status(404).send({ message: "Usuario no encontrado" });
  } catch (error) {
    handleError(error, res);
  }
});

const loginUsuario = expressAsyncHandler(async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const usuario = await Usuarios.findOne({ where: { Email } });
    console.log(usuario.Password);
    if (usuario) {
      if (!usuario.isVerified) {
        await sendMail(req, res);
        res.status(401).send({
          message: "Usuario no verificado, enviando mail de verificacion",
        });
      } else {
        if (bcrypt.compareSync(Password, usuario.Password)) {
          const token = generateToken(usuario);
          res.status(400).send({
            id: usuario.idUsuarios,
            Name: usuario.Name,
            Email: usuario.Email,
            token,
          });
        }
      }
    }
    res.status(401).send({ message: "Email o contraseña incorrectos" });
  } catch (error) {
    handleError(error, res);
  }
});

const verifyEmailUsuarios = expressAsyncHandler(async (req, res) => {
  try {
    const { Email, verifyToken } = req.body;
    const usuario = await Usuarios.findOne({ where: { Email } });
    if (usuario) {
      if (Date.now() > usuario.expireToken) {
        res.status(401).send({
          message: "Token de verificación expirado",
        });
      }
      if (usuario.verifyToken === verifyToken) {
        usuario.isVerified = true;
        usuario.verifyToken = "";
        usuario.expireToken = "";
        await usuario.save();
        res.status(400).send({
          usuario,
          message: "Usuario verificado",
        });
      }
    }
    res.status(401).send({ message: "Token de verificación incorrecto" });
  } catch (error) {
    handleError(error, res);
  }
});

const sendMail = expressAsyncHandler(async (req, verifyToken) => {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: req.body.Email,
    subject: "Verificación de correo",
    html: verifyEmailTemplate(req, req.body, verifyToken),
  });
  return;
});
const verifySms = expressAsyncHandler(async( req, res) => {
  try {
      const {idUsuarios} = req.body;
      const usuario = await Usuarios.findByPk(idUsuarios);
      console.log(usuario.Telefono);

      const formattedPhoneNumber = usuario.Telefono.startsWith('+') ? usuario.Telefono : `+${usuario.Telefono}`;
      const codeVerify = Math.random().toString().substring(2,6) //cuatro digitos
      const params = {
        Message: "Tu codigo Dumont es: " + `${codeVerify}`, 
        PhoneNumber: formattedPhoneNumber //usuario.CelPhone
      }

      const command = new PublishCommand(params);
      const data = await snsClient.send(command);
      console.log(data);
      
      res.status(200).send(codeVerify)
      
  } catch (err) {
      res.status(500)(`Falló el envío del mensaje :${err.message}`)
  }
  
});

const UsuariosController = {
  createUsuarios,
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  loginUsuario,
  verifyEmailUsuarios,
  verifySms,
};

export default UsuariosController;
