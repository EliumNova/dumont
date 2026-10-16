'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  deviceUpdate,
  deviceDelete,
} from '@/lib/slices/dispositivos/dispositivoAction';
import InputField from '../../components/InputField';

function EditDeviceBtn({ datos, onCloseModal }) {
  const dispatch = useDispatch();

  const [editDevice, setEditDevice] = useState(false);
  const [deviceDelete, setDeviceDelete] = useState(false);
  const [deviceSave, setDeviceSave] = useState(false);
  const [registerDevice, setRegisterDevice] = useState({
    Marca: '',
    Modelo: '',
    Tamaño: '',
    NumeroSerie: '',
    Cliente: '', // Cambiar según los datos del cliente asociado
  });
  const [errorMessage, setErrorMessage] = useState('');

  // Maneja la apertura del modal y el llenado de datos
  const handleModalOpen = () => {
    setRegisterDevice({
      Marca: datos.Marca || '',
      Modelo: datos.Modelo || '',
      Tamaño: datos.Tamaño || '',
      NumeroSerie: datos.NumeroSerie || '',
      Cliente: datos.Cliente || '', // Asegúrate de que 'Cliente' esté disponible en los datos
    });
    setEditDevice(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const processedValue = name === 'admin' ? value === 'true' : value;

    const validations = {
      Marca: /^[a-zA-Z\s]*$/,
      Modelo: /^[a-zA-Z0-9\s]*$/, // Podrías cambiar esto si tu modelo tiene restricciones específicas
      NumeroSerie: /^[a-zA-Z0-9]*$/, // Validación para número de serie
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

    return setRegisterDevice((prev) => ({
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

    // Validar los campos
    const { Marca, Modelo, Tamaño, NumeroSerie, Cliente } = registerDevice;
    if (!Marca || !Modelo || !Tamaño || !NumeroSerie || !Cliente) {
      setErrorMessage('Todos los campos son obligatorios');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }


    dispatch(deviceUpdate(datos.idDispositivo, registerDevice));
    handleCloseModal();
  };

  const handleDelete = () => {
    setDeviceDelete(!deviceDelete);
    setEditDevice(!editDevice);

    dispatch(deviceDelete(datos.idDispositivo));
    onCloseModal();
  };

  const handleCloseModal = () => {
    setTimeout(() => {
      setEditDevice(false);
      onCloseModal();
    }, '500');
  };

  return (
    <div className="flex p-1 gap-5">
      <button
        onClick={handleModalOpen}
        className=" text-white flex items-center justify-center"
      >
        <img src="/svg/editDevice.svg" alt="Edit Device" />
      </button>
      {editDevice && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40 p-2 lg:p-10">
          <div className="relative flex flex-col bg-white p-8 rounded-lg shadow-lg xl:w-[600px] w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-4xl font-semibold mb-7 text-black">
              Editar Dispositivo
            </h2>

            <InputField
              label="Marca"
              id="Marca"
              name="Marca"
              value={registerDevice.Marca}
              onChange={handleChange}
              required
              className="gap-3 font-light p-0 text-black"
              labelClassName="font-light "
              inputClassName="rounded-2xl text-black"
            />
            <InputField
              label="Modelo"
              id="Modelo"
              name="Modelo"
              value={registerDevice.Modelo}
              onChange={handleChange}
              required
              className="gap-3 font-light p-0 text-black"
              labelClassName="font-light"
              inputClassName="rounded-2xl text-black"
            />
            <InputField
              label="Tamaño"
              id="Tamaño"
              name="Tamaño"
              value={registerDevice.Tamaño}
              onChange={handleChange}
              required
              className="gap-3 font-light p-0 text-black"
              labelClassName="font-light"
              inputClassName="rounded-2xl text-black"
            />
            <InputField
              label="Número de Serie"
              id="NumeroSerie"
              name="NumeroSerie"
              value={registerDevice.NumeroSerie}
              onChange={handleChange}
              required
              className="gap-3 font-light p-0 text-black"
              labelClassName="font-light"
              inputClassName="rounded-2xl text-black"
            />
            <InputField
              label="Cliente Asociado"
              id="Cliente"
              name="Cliente"
              value={registerDevice.Cliente}
              onChange={handleChange}
              required
              className="gap-3 font-light p-0 text-black"
              labelClassName="font-light"
              inputClassName="rounded-2xl text-black"
            />

            <div className="flex gap-10 flex-col lg:flex-row my-4">
              <button
                onClick={() => setDeviceSave(!deviceSave)}
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
              onClick={() => setDeviceDelete(!deviceDelete)}
              className="w-full font-semibold text-red-500 py-4 px-6 rounded-2xl text-xl border-solid border-2 border-red-500 flex justify-center gap-5 hover:bg-red-300"
            >
              <img src="/svg/trashIcon.svg" alt="Eliminar" />
              Eliminar Dispositivo
            </button>
          </div>
        </div>
      )}

      {deviceDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-10">
          <div className="bg-white h-96 w-96 rounded-3xl flex flex-col place-items-center justify-center gap-10 ">
            <img src="/svg/alertIcon.svg" alt="" />
            <p className="">
              ¿Estás seguro que deseas eliminar este Dispositivo?
            </p>
            <div className="flex gap-5 flex-col lg:flex-row">
              <button
                onClick={() => setDeviceDelete(!deviceDelete)}
                className="xl:w-6/12 text-blue-500 py-4 px-6 rounded-2xl text-xl border-solid border-2 border-blue-500 font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 font-semibold xl:w-6/12 text-white py-4 px-6 rounded-2xl text-xl"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {deviceSave && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-10">
          <div className="bg-white h-96 w-96 rounded-3xl flex flex-col place-items-center justify-center gap-10 ">
            <img src="/svg/alertIcon.svg" alt="" />
            <p className="text-lg text-black">
              ¿Deseas descartar la edición del Dispositivo?
            </p>
            <div className="flex gap-5 flex-col lg:flex-row">
              <button
                onClick={() => {
                  setDeviceSave(!deviceSave);
                  handleCloseModal();
                }}
                className="xl:w-6/12 text-blue-500 py-4 px-6 rounded-2xl text-xl border-solid border-2 border-blue-500 font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setDeviceSave(!deviceSave);
                  setEditDevice(!editDevice);
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

export default EditDeviceBtn;
