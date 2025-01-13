import { setPrincipales } from '@/lib/slices/newCustomerSlice';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import InputField from './InputField';
import SelectField from './SelectedField';

function Principales({ setInUbication, setProgress, setInPrincipales }) {
  //Estado global de principales
  const storePrincipales = useSelector(
    (state) => state.newCustomer.principales
    // console.log(`STORE PRINCIPALES: ${storePrincipales}`);
  );

  const dispatch = useDispatch();

  const [principalesInfo, setPrincipalesInfo] = useState({
    customerCode: storePrincipales?.customerCode || '',
    segmentacion: storePrincipales?.segmentacion || '',
    codeDistribuidor: storePrincipales?.codeDistribuidor || '',
    email: storePrincipales?.email || '',
    webPage: storePrincipales?.webPage || '',
    alcoholAccess: storePrincipales?.alcoholAccess || '',
    phone: storePrincipales?.phone || '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const validateURL = (value) => /^www\.[a-zA-Z0-9]+\.com$/.test(value);

  const validateInput = (value) => /^[a-zA-Z0-9@.\s]*$/.test(value);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      !validateInput(value) &&
      name !== 'alcoholAccess' &&
      name !== 'segmentacion'
    ) {
      setErrorMessage('Caracteres inválidos en el campo.');
      return;
    }

    setPrincipalesInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === 'webPage' && value && !validateURL(value)) {
      setErrorMessage('La URL debe empezar con www y terminar con .com');
    } else {
      setErrorMessage('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      customerCode,
      segmentacion,
      codeDistribuidor,
      email,
      webPage,
      alcoholAccess,
    } = principalesInfo;

    // Validar campos requeridos
    if (
      !customerCode ||
      !segmentacion ||
      !codeDistribuidor ||
      !email ||
      !webPage ||
      !alcoholAccess
    ) {
      setErrorMessage('Todos los campos son obligatorios.');
      return;
    }

    // Validar email
    if (!validateEmail(email)) {
      setErrorMessage('El email debe tener un formato válido.');
      return;
    }

    // Validar URL
    if (!validateURL(webPage)) {
      setErrorMessage('La URL debe empezar con www y terminar con .com');
      return;
    }

    // // Si todas las validaciones pasan, enviar datos
    dispatch(setPrincipales(principalesInfo));
    console.log(principalesInfo);
    setInUbication(true);
    setProgress(66);
    setInPrincipales(false);
  };

  return (
    <div className="container mx-auto flex flex-col items-center">
      <div className="w-10/12 h-auto grid grid-rows-2 grid-cols-1 xl:grid-cols-1 w-full">
        {/* Código del cliente */}

        <InputField
          label="Código del cliente"
          name="customerCode"
          value={principalesInfo.customerCode}
          onChange={handleChange}
          placeholder="Ingresa tu numero de cliente"
          inputClassName="justify-self-start w-full"
        />

        {/* Segmentación */}
        <SelectField
          label="Segmentación"
          name="segmentacion"
          value={principalesInfo.segmentacion}
          onChange={handleChange}
          options={[
            { value: '', label: 'Selecciona...' },
            { value: 'kiosco', label: 'Kiosco' },
            { value: 'no', label: 'No' },
          ]}
          inputClassName="justify-self-end w-full"
        />
        {/* Código del distribuidor */}
        <InputField
          label="Código del distribuidor"
          name="codeDistribuidor"
          value={principalesInfo.codeDistribuidor}
          onChange={handleChange}
          placeholder="Ingresa tu código de distribuidor"
          inputClassName="justify-self-start w-full"
        />
        {/* Correo electrónico */}
        <InputField
          label="Correo electrónico"
          name="email"
          type="email"
          value={principalesInfo.email}
          onChange={handleChange}
          placeholder="Ingresa tu correo electrónico"
          inputClassName="justify-self-end w-full"
        />
        {/* Página web */}
        <InputField
          label="Página Web"
          name="webPage"
          value={principalesInfo.webPage}
          onChange={handleChange}
          placeholder="Ingresa tu página web"
          inputClassName="justify-self-start w-full"
        />
        {/* Permiso de venta de alcohol */}
        <SelectField
          label="Permiso Venta Alcohol"
          name="alcoholAccess"
          value={principalesInfo.alcoholAccess}
          onChange={handleChange}
          options={[
            { value: '', label: 'Selecciona...' },
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' },
          ]}
          inputClassName="justify-self-end w-full"
        />
        {/* Teléfono */}

        <InputField
          label="Teléfono"
          name="phone"
          value={principalesInfo.phone}
          onChange={handleChange}
          placeholder="Ingresa tu número de teléfono"
          inputClassName="justify-self-start w-full"
        />
      </div>

      <div>
        {/* Mensaje de error */}
        {errorMessage && (
          <div className="p-2 h-8 text-xs rounded flex justify-center items-center bg-red-700 text-white font-medium ">
            {errorMessage}
          </div>
        )}
        <div className="flex gap-5 flex-col xl:flex-row">
          <Link href={'/admin/customerMenu'}>
            <button
              // onClick={handleBack}
              className="w-[15rem] h-14 relative top-11
          bg-transparent border-principal border-2 rounded-xl text-principal text-lg tracking-wide font-semibold"
            >
              Cancelar
            </button>
          </Link>

          <button
            onClick={handleSubmit}
            className="w-[15rem] h-14 relative top-11 bg-[#427EF3] rounded-xl text-white text-lg tracking-wide font-semibold"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

export default Principales;
