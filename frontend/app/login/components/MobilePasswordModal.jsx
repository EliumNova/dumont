import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";


function MobilePasswordModal({setMobileMethod,setAbleNewPassword }) {
    const [values, setValues] = useState(['', '', '', '']);
    const [codeCorrectly, setCodeCorrectly] = useState(true);

    const handleCode = () => {
      if (codeCorrectly) {
        setMobileMethod(false);
        setAbleNewPassword(true);
      } else console.log("codigo incorrecto");
    };
  
    const handleChange = (index, value) => {
      if (!/^[0-9]$/.test(value) && value !== '') return;
      const newValues = [...values];
      newValues[index] = value;
      setValues(newValues);
      if (value !== '' && index < values.length - 1) {
        document.getElementById(`input-${index + 1}`).focus();
      }
    };
  return (
    <div className="fixed inset-0  bg-gray-600 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white pb-32
     w-[50rem] h-[35rem] text-black p-10 pt-6 rounded-[20px] shadow-lg max-w-xl flex justify-start  flex-col ">
      <button
        className=" self-end relative top-4 cursor-pointer"
        onClick={() => setMobileMethod(false)}
      >
        <IoClose className="w-8 h-8  " />
      </button>
      <h2 className="text-4xl font-bold mb-4 ">Escribe el codigo</h2>
      <p className="mb-4 p-4 pt-0 pl-0 pr-6">
        Ingresa el código que te pasamos por SMS.
      </p>
      <div className="flex flex-col gap-2 justify-center items-center">
      <div>
      {values.map((value, index) => (
        <input
          key={index}
          id={`input-${index}`}
          type="text"
          maxLength="1"
          value={value}
          onChange={(e) => handleChange(index, e.target.value)}
          style={{ margin: '0 5px', textAlign: 'center', }}
          className='border-b-4 border-[#353344] w-20 h-12 text-4xl font-semibold text-[#353344]'
        />
      ))}
    </div>
        <button onClick={handleCode} className="bg-[#427EF3] w-[31rem] rounded-lg h-12 mt-12 text-white">
          Siguiente
        </button>
      </div>
    </div>
  </div>
  )
}

export default MobilePasswordModal