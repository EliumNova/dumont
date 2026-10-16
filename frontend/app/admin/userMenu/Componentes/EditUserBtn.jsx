'use client';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userUpdate, usuarioDelete } from '@/lib/slices/users/userAction';
import InputField from '../../components/InputField';

function EditUserBtn({ datos, onCloseModal }) {
  const dispatch = useDispatch();
  //const router = useRouter();
  //const {id} = router.query

  const [editUser, setEditUser] = useState(false);
  const [userDelete, setUserDelete] = useState(false);
  const [userSave, setUserSave] = useState(false);
  const [registerUser, setRegisterUser] = useState({
    Name: '',
    Email: '',
    isAdmin: false,
    DNI: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  // Maneja la apertura del modal y el llenado de datos
  const handleModalOpen = () => {
    setRegisterUser({
      Name: datos.Name || '',
      Email: datos.Email || '',
      isAdmin: datos.Admin || false,
      DNI: datos.DNI || '',
    });
    setEditUser(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const processedValue = name === 'admin' ? value === 'true' : value;

    const validations = {
      DNI: /^[0-9]*$/,
      Name: /^[a-zA-Z\s]*$/,
      Email: /^[a-zA-Z@.\s]*$/,
    };

    if (name in validations) {
      if (value === '' || validateInput(processedValue, validations[name])) {
        registrar(name, processedValue);
      } else {
        errorMessageBox();
      }
    } else {
      registrar(name, processedValue);
    }
  };

  const validateInput = (value, regex) => regex.test(value);

  const registrar = (name, processedValue) => {

    return setRegisterUser((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const errorMessageBox = () => {
    setErrorMessage('Caracteres inválidos en el campo.');
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //Validar los campos
    const { Name, Email, DNI } = registerUser;
    if (!Name || !Email || !DNI) {
      setErrorMessage('Todos los campos son obligatorios');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    dispatch(userUpdate(datos.idUsuarios, registerUser));
    handleCloseModal();
  };

  const handleDelete = () => {
    setUserDelete(!userDelete);
    setEditUser(!editUser);

    dispatch(usuarioDelete(datos.idUsuarios));
    onCloseModal();
  };

  const handleCloseModal = () => {
    setTimeout(() => {
      setEditUser(false);
      onCloseModal();
    }, '500');
  };

  return (
    <div className="flex p-1 gap-5">
      <button
        onClick={handleModalOpen}
        className=" text-white flex items-center justify-center"
      >
        <img src="/svg/editUser.svg" alt="" />
      </button>
      {editUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40 p-2 lg:p-10">
          <div className="relative flex flex-col bg-white p-8 rounded-lg shadow-lg xl:w-[600px] w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-4xl font-semibold mb-7 text-black">
              Editar Usuario
            </h2>

            <InputField
              label="Nombre Completo"
              id="Name"
              name="Name"
              value={registerUser.Name}
              onChange={handleChange}
              required
              className="gap-3 font-light p-0 text-black"
              labelClassName="font-light "
              inputClassName="rounded-2xl text-black"
            />
            <InputField
              label="Correo Electrónico"
              id="Email"
              name="Email"
              type="email"
              placeholder="Esther.howard@example.com"
              value={registerUser.Email}
              onChange={handleChange}
              required
              className="gap-3 font-light p-0 text-black"
              labelClassName="font-light"
              inputClassName="rounded-2xl text-black"
            />
            <InputField
              label="DNI"
              id="DNI"
              name="DNI"
              type="number"
              placeholder="40644249"
              value={registerUser.DNI}
              onChange={handleChange}
              required
              className="gap-3 font-light p-0 text-black"
              labelClassName="font-light"
              inputClassName="rounded-2xl text-black"
            />
            <div className="flex flex-col gap-3 w-full my-2">
              <label htmlFor="admin" className="text-sm font-light text-black">
                Rol Administrador
              </label>
              <select
                id="isAdmin"
                name="isAdmin"
                value={registerUser.isAdmin ? 'true' : 'false'}
                onChange={handleChange}
                className="bg-[#E2E5E5] h-14 rounded-2xl p-4 text-base text-black"
                required
              >
                <option value="true" className="text-black">
                  Sí
                </option>
                <option value="false" className="text-black">
                  No
                </option>
              </select>
            </div>

            <div className="flex gap-10 flex-col lg:flex-row my-4">
              <button
                onClick={() => setUserSave(!userSave)}
                className="xl:w-6/12 text-blue-500 py-4 px-6 rounded-2xl text-xl border-solid border-2 border-blue-500 font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 font-semibold xl:w-6/12 text-white py-4 px-6 rounded-2xl text-xl"
              >
                Guardar
              </button>
            </div>
            <button
              onClick={() => setUserDelete(!userDelete)}
              className="w-full font-semibold text-red-500 py-4 px-6 rounded-2xl text-xl border-solid border-2 border-red-500 flex justify-center gap-5 hover:bg-red-300"
            >
              <img src="/svg/trashIcon.svg" alt="Eliminar" />
              Eliminar Usuario
            </button>
          </div>
        </div>
      )}

      {userDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-10">
          <div className="bg-white h-96 w-96 rounded-3xl flex flex-col place-items-center justify-center gap-10 ">
            <img src="/svg/alertIcon.svg" alt="" />
            <p className="">¿Estas seguro que deseas eliminar este usuario?</p>
            <div className="flex gap-5 flex-col lg:flex-row">
              <button
                onClick={() => setUserDelete(!userDelete)}
                className="xl:w-6/12 text-blue-500 py-4 px-6 rounded-2xl text-xl border-solid border-2 border-blue-500 font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={
                  handleDelete
                  //   () => {
                  //   setUserDelete(!userDelete);
                  //   setEditUser(!editUser);
                  // }
                }
                className="bg-red-500 font-semibold xl:w-6/12 text-white py-4 px-6 rounded-2xl text-xl"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {userSave && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-10">
          <div className="bg-white h-96 w-96 rounded-3xl flex flex-col place-items-center justify-center gap-10 ">
            <img src="/svg/alertIcon.svg" alt="" />
            <p className="text-lg text-black">
              ¿Deseas descartar la edición del usuario?
            </p>
            <div className="flex gap-5 flex-col lg:flex-row">
              <button
                onClick={() => {
                  setUserSave(!userSave);
                  handleCloseModal();
                }}
                className="xl:w-6/12 text-blue-500 py-4 px-6 rounded-2xl text-xl border-solid border-2 border-blue-500 font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setUserSave(!userSave);
                  setEditUser(!editUser);
                }}
                className="bg-red-500 font-semibold xl:w-6/12 text-white py-4 px-6 rounded-2xl text-xl"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditUserBtn;
