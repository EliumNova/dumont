import InputField from '@/app/admin/components/InputField';
import { useState } from 'react';

export default function NewDeviceModal() {
  const [errorMessage, setErrorMessage] = useState('');
  const [datos, setDatos] = useState({
    marca: '',
    modelo: '',
    pulgadas: '',
    serie: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const { marca, modelo, pulgadas, serie } = datos;

    if (!marca || !modelo || !pulgadas || !serie) {
      setErrorMessage('Todos los campos son obligatorios.');
      return;
    } else {
      setErrorMessage('');
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
            id={'marca'} // Cambié esto para que coincida con el nombre del campo
            value={datos.marca}
            onChange={handleChange}
            placeholder={'Ingrese el dispositivo'}
            type="text"
            className="gap-2"
            inputClassName="rounded-xl"
          />
          <InputField
            label={'Modelo'}
            id={'modelo'}
            value={datos.modelo}
            onChange={handleChange}
            placeholder={'Ingrese el modelo del dispositivo'}
            type="text"
            className="gap-2"
          />
          <InputField
            label={'Cantidad de pulgadas'}
            id={'pulgadas'}
            value={datos.pulgadas}
            onChange={handleChange}
            placeholder={'Ingrese la cantidad de pulgadas del dispositivo'}
            type="number"
            className="gap-2"
          />
          <InputField
            label={'Número de serie'}
            id={'serie'}
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
