import InputField from '@/app/admin/components/InputField';
import ModalWindow from '@/app/admin/components/ModalWindow';
import Joi from 'joi';
import { useState } from 'react';

export default function NewDevice({ onFormularioEnviado }) {
  const [errorMessage, setErrorMessage] = useState('');

  const [datos, setDatos] = useState({
    marca: '',
    modelo: '',
    pulgadas: '',
    serie: '',
  });

  // Definir el esquema de validación con Joi
  const schema = Joi.object({
    marca: Joi.string().min(2).required().messages({
      'string.empty': 'La marca es obligatoria.',
      'string.min': 'La marca debe tener al menos 2 caracteres.',
    }),
    modelo: Joi.string().min(2).required().messages({
      'string.empty': 'El modelo es obligatorio.',
      'string.min': 'El modelo debe tener al menos 2 caracteres.',
    }),
    pulgadas: Joi.number().positive().required().messages({
      'number.base': 'Las pulgadas deben ser un número.',
      'number.positive': 'Las pulgadas deben ser un número positivo.',
      'any.required': 'Las pulgadas son obligatorias.',
    }),
    serie: Joi.string().min(5).required().messages({
      'string.empty': 'El número de serie es obligatorio.',
      'string.min': 'El número de serie debe tener al menos 5 caracteres.',
    }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar los datos usando el esquema de Joi
    const { error } = schema.validate(datos, { abortEarly: true });

    if (error) {
      // Si hay errores de validación, mostramos el primer mensaje de error
      const errorMessages = error.details.map((err) => err.message).join(', ');

      setErrorMessage(errorMessages);
      return;
    } else {
      setErrorMessage('');
      onFormularioEnviado();

      // Aquí puedes manejar la lógica para registrar el dispositivo
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDatos((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Imprimir el valor actual que se está escribiendo
    console.log(name, value);
  };

  return (
    <div className="container mx-auto flex justify-center">
      <div className="w-5/12">
        <h2 className="text-4xl font-semibold">Registro de Dispositivos</h2>
        <form className="flex flex-col gap-5 mt-10" onSubmit={handleSubmit}>
          <InputField
            label={'Marca del dispositivo'}
            id={'marca'}
            name={'marca'}
            value={datos.marca}
            onChange={handleChange}
            placeholder={'Ingrese la marca del dispositivo'}
            type="text"
            className="gap-2"
            inputClassName="rounded-xl"
          />
          <InputField
            label={'Modelo'}
            id={'modelo'}
            name={'modelo'}
            value={datos.modelo}
            onChange={handleChange}
            placeholder={'Ingrese el modelo del dispositivo'}
            type="text"
            className="gap-2"
          />
          <InputField
            label={'Cantidad de pulgadas'}
            id={'pulgadas'}
            name={'pulgadas'}
            value={datos.pulgadas}
            onChange={handleChange}
            placeholder={'Ingrese la cantidad de pulgadas del dispositivo'}
            type="number"
            className="gap-2"
          />
          <InputField
            label={'Número de serie'}
            id={'serie'}
            name={'serie'}
            value={datos.serie}
            onChange={handleChange}
            placeholder={'Ingrese el número de serie del dispositivo'}
            type="text"
            className="gap-2"
          />
          {errorMessage && (
            <div className="p-2 h-8 text-xs rounded flex justify-center items-center bg-red-700 text-white font-medium">
              {errorMessage}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 py-4 text-white rounded-2xl"
          >
            Registrar dispositivo
          </button>
        </form>
      </div>
    </div>
  );
}
