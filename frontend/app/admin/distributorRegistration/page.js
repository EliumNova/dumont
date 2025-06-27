'use client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import InputField from '../components/InputField';
import ModalWindow from '../components/ModalWindow';
import { distribuidorCreate } from '@/lib/slices/distribuidores/distribuidorAction';

function DistribuidorRegistration() {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState('');
  const [registerDist, setRegisterDist] = useState({
    Calle: '',
    CodigoDistribuidor: '',
    SegundoTelefono: '',
    Email: '',
    EntreCalles: '',
    Localidad: '',
    NombreComercial: '',
    RazonSocial: '',
    Telefono: '',
    CUIT: '',
  });
  const [modal, setModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      Calle,
      CodigoDistribuidor,
      SegundoTelefono,
      Email,
      EntreCalles,
      Localidad,
      NombreComercial,
      RazonSocial,
      Telefono,
    } = registerDist;

    // Validar que todos los campos están llenos
    if (
      !Calle ||
      !CodigoDistribuidor ||
      !SegundoTelefono ||
      !Email ||
      !EntreCalles ||
      !Localidad ||
      !NombreComercial ||
      !RazonSocial ||
      !Telefono
    ) {
      setErrorMessage('Todos los campos son obligatorios.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    dispatch(distribuidorCreate(registerDist));

    // Resetear el formulario
    setRegisterDist({
      Calle: '',
      CodigoDistribuidor: '',
      SegundoTelefono: '',
      Email: '',
      EntreCalles: '',
      Localidad: '',
      NombreComercial: '',
      RazonSocial: '',
      Telefono: '',
      CUIT: '',
    });

    setModal(true);
    setTimeout(() => {
      setModal(false);
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const processedValue = name === 'admin' ? value === 'true' : value;

    const validations = {
      CUIT: /^[0-9]*$/,
      Telefono: /^[0-9\s()]*$/,
      NombreComercial: /^[a-zA-Z\s]*$/,
      Email: /^[a-zA-Z0-9@.\s]*$/,
    };

    if (name === 'Telefono') {
      const maskedValue = e.target.inputElement
        ? e.target.inputElement.value
        : value;
      registrar(name, maskedValue);
    } else if (name in validations) {
      if (value === '' || validateInput(processedValue, validations[name])) {
        registrar(name, processedValue);
      } else {
        errorMessageBox();
      }
    } else {
      registrar(name, processedValue);
    }
  };

  const errorMessageBox = () => {
    setErrorMessage('Caracteres inválidos en el campo.');
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const validateInput = (value, regex) => regex.test(value);

  const registrar = (name, processedValue) => {
    return setRegisterDist((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center my-5">
      {modal ? (
        <ModalWindow text={'¡Usuario creado con èxito!'} />
      ) : (
        <div></div>
      )}

      <h2 className="text-white text-3xl md:text-5xl font-semibold my-2 place-self-center xl:place-self-start xl:pl-[11%] 2xl:pl-[14%]">
        Crear una cuenta
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full lg:w-9/12 xl:w-10/12 px-4 text-white"
      >
        <div className="container mx-auto grid grid-cols-1 w-full  items-center xl:grid-cols-2 justify-items-center xl:items-center ">
          <InputField
            label="Distribuidor"
            id="NombreComercial"
            name="NombreComercial"
            value={registerDist.NombreComercial}
            onChange={handleChange}
            required
            className="col-span-1 xl:col-start-1 row-start-1 lg:w-[32rem] gap-3 font-semibold px-4"
            inputClassName="font-light text-black"
          />
          <InputField
            label="Razon Social"
            id="RazonSocial"
            name="RazonSocial"
            value={registerDist.RazonSocial}
            onChange={handleChange}
            required
            className="col-span-1 xl:col-start-2 xl:row-start-1 lg:w-[32rem] font-semibold px-4"
            inputClassName="font-light text-black"
          />
          <InputField
            label="Codigo Distribuidor"
            id="CodigoDistribuidor"
            name="CodigoDistribuidor"
            type="number"
            value={registerDist.CodigoDistribuidor}
            onChange={handleChange}
            required
            className="col-span-1 xl:col-start-1 xl:row-start-2 lg:w-[32rem] font-semibold px-4"
            inputClassName="font-light text-black"
          />
          <InputField
            label="CUIT"
            id="CUIT"
            name="CUIT"
            value={registerDist.CUIT}
            onChange={handleChange}
            required
            className="col-span-1 xl:col-start-2 xl:row-start-2 flex flex-col w-full lg:w-[32rem] px-4"
            inputClassName="font-light text-black"
          />
          <InputField
            label="Calle"
            id="Calle"
            name="Calle"
            value={registerDist.Calle}
            onChange={handleChange}
            required
            className="col-span-1 xl:col-start-1 xl:row-start-3 flex flex-col w-full lg:w-[32rem] px-4"
            inputClassName="font-light text-black"
          />
          <InputField
            label="EntreCalles"
            id="EntreCalles"
            name="EntreCalles"
            value={registerDist.EntreCalles}
            onChange={handleChange}
            required
            className="col-span-1 xl:col-start-2 xl:row-start-3 flex flex-col w-full lg:w-[32rem] px-4"
            inputClassName="font-light text-black"
          />
          <InputField
            label="Localidad"
            id="Localidad"
            name="Localidad"
            value={registerDist.Localidad}
            onChange={handleChange}
            required
            className="col-span-1 xl:col-start-1 xl:row-start-4 flex flex-col w-full lg:w-[32rem] px-4"
            inputClassName="font-light text-black"
          />
          <InputField
            label="Email"
            id="Email"
            name="Email"
            value={registerDist.Email}
            onChange={handleChange}
            required
            className="col-span-1 xl:col-start-2 xl:row-start-4 flex flex-col w-full lg:w-[32rem] px-4"
            inputClassName="font-light text-black"
          />
          <InputField
            label="Telefono"
            id="Telefono"
            name="Telefono"
            value={registerDist.Telefono}
            onChange={handleChange}
            required
            className="col-span-1 xl:col-start-1 xl:row-start-6 flex flex-col w-full lg:w-[32rem] px-4"
            inputClassName="font-light text-black"
          />
          <InputField
            label="Segundo Teléfono (Jefe de Ventas)"
            id="SegundoTelefono"
            name="SegundoTelefono"
            value={registerDist.SegundoTelefono}
            onChange={handleChange}
            required
            className="col-span-1 xl:col-start-2 xl:row-start-6 flex flex-col w-full lg:w-[32rem] px-4"
            inputClassName="font-light text-black"
          />
        </div>
        {errorMessage && (
          <div className="p-2 h-8 text-xs rounded flex justify-center items-center bg-red-700 text-white font-medium relative">
            {errorMessage}
          </div>
        )}
        <button
          type="submit"
          className="w-11/12 lg:w-[30rem] p-4 relative top-11 bg-[#427EF3] rounded-xl text-white text-lg tracking-wide font-semibold"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}

export default DistribuidorRegistration;
