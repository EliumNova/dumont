'use client';
import React, { useState, useEffect } from 'react';
import InputField from '../../../components/InputField';

function EditUserBtn({ datos }) {
  const [editUser, setEditUser] = useState(false);
  const [userDelete, setUserDelete] = useState(false);
  const [userSave, setUserSave] = useState(false);
  const [registerUser, setRegisterUser] = useState({
    name: '',
    email: '',
    admin: false,
    dni: '',
  });

  // Maneja la apertura del modal y el llenado de datos
  const handleModalOpen = () => {
    setRegisterUser({
      name: datos.name || '',
      email: datos.email || '',
      admin: datos.admin || false,
      dni: datos.dni || '',
    });
    setEditUser(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === 'admin' ? value === 'true' : value;

    const validations = {
      dni: /^[0-9]*$/,
      name: /^[a-zA-Z\s]*$/,
      email: /^[a-zA-Z@.\s]*$/,
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
            <h2 className="text-4xl font-semibold mb-7">Editar Usuario</h2>

            <InputField
              label="Nombre Completo"
              id="name"
              name="name"
              value={registerUser.name}
              onChange={handleChange}
              required
              className="gap-3 font-light p-0"
              labelClassName="font-light"
              inputClassName="rounded-2xl"
            />
            <InputField
              label="Correo Electrónico"
              id="email"
              name="email"
              type="email"
              placeholder="Esther.howard@example.com"
              value={registerUser.email}
              onChange={handleChange}
              required
              className="gap-3 font-light p-0"
              labelClassName="font-light"
              inputClassName="rounded-2xl "
            />
            <InputField
              label="DNI"
              id="dni"
              name="dni"
              type="number"
              placeholder="40644249"
              value={registerUser.dni}
              onChange={handleChange}
              required
              className="gap-3 font-light p-0"
              labelClassName="font-light"
              inputClassName="rounded-2xl"
            />
            <div className="flex flex-col gap-3 w-full my-2">
              <label htmlFor="admin" className="text-sm font-light">
                Rol Administrador
              </label>
              <select
                id="admin"
                name="admin"
                value={registerUser.admin ? 'true' : 'false'}
                onChange={handleChange}
                className="bg-[#E2E5E5] h-14 rounded-2xl p-4 text-base"
                required
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
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
                onClick={() => setEditUser(false)}
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
                onClick={() => {
                  setUserDelete(!userDelete);
                  setEditUser(!editUser);
                }}
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
            <p className="text-lg">¿Deseas descartar la edición del usuario?</p>
            <div className="flex gap-5 flex-col lg:flex-row">
              <button
                onClick={() => setUserSave(!userSave)}
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
