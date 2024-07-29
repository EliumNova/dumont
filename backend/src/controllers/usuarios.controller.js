import expressAsyncHandler from "express-async-handler";
import { Usuarios } from "../models/Usuarios.js";
import { generateToken } from "../../utils/utilsUsuarios.js";
import { handleError } from "../../utils/utilsErrors.js";
import bcrypt from "bcryptjs";

const createUsuarios = expressAsyncHandler(async (req, res) => {
  try {
    const { Name, Email, DNI, Password } = req.body;
    const newUser = new Usuarios({
      Name,
      Email,
      DNI,
      Password,
    });
    const user = await newUser.save();
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
    const { Name, Email, DNI, Password } = req.body;
    const usuario = await Usuarios.findByPk(req.params.id);
    if (usuario) {
      usuario.Name = Name ?? usuario.Name;
      usuario.Email = Email ?? usuario.Email;
      usuario.DNI = DNI ?? usuario.DNI;
      usuario.Password = Password ?? usuario.Password;
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
      if (bcrypt.compareSync(Password, usuario.Password)) {
        const token = generateToken(usuario);
        res.send({
          id: usuario.idUsuarios,
          Name: usuario.Name,
          Email: usuario.Email,
          token,
        });
        return;
      }
    }
    res.status(401).send({ message: "Email o contraseña incorrectos" });
  } catch (error) {
    handleError(error, res);
  }
});

const UsuariosController = {
  createUsuarios,
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  loginUsuario,
};

export default UsuariosController;
