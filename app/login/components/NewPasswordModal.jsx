import React, { useState } from "react";
import { GoEye } from "react-icons/go";
import { RiEyeCloseLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";

function NewPasswordModal({setAbleNewPassword}) {
  const [changePassword, setChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [show2doPassword, setShow2doPassword] = useState(false);
  const [password, setPassword] = useState();
  const [replicatePassword, setReplicatePassword] = useState();

  return (
    <div className="fixed inset-0  bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div
        className={`bg-white pb-32
     w-[50rem] ${
       changePassword ? "h-[28rem]" : "h-[35rem]"
     } text-black p-10 pt-6 rounded-[20px] shadow-lg max-w-xl flex justify-start  flex-col`}
      >
        <button
          className=" self-end relative top-4 cursor-pointer"
          onClick={() => setAbleNewPassword(false)}
        >
          <IoClose className="w-8 h-8  " />
        </button>
        {changePassword ? (
          <div className=" flex flex-col gap-6 items-center justify-center my-16">
            <div className="w-36 h-36 rounded-full bg-[#427EF3] flex items-center justify-center">
              <FaCheck className="text-white w-24 h-24" />
            </div>
            <h3 className="text-2xl font-bold m-auto ">
              ¡Contraseña cambiada con éxito!
            </h3>
          </div>
        ) : (
          <>
            {" "}
            <h2 className="text-4xl font-bold mb-4 ">Crea una contraseña</h2>
            <p className="mb-4 p-4 pt-0 pl-0 pr-6">
              Crea una contraseña nueva y segura que no uses en otros sitios
              web.
            </p>
            <div className="flex flex-col gap-2 justify-center items-center">
              <div className=" flex flex-col gap-2 w-[32rem] pt-1 p-4 my-2 ">
                <div className=" flex flex-col gap-2 w-100 pt-1 p-4  ">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Crear nueva contraseña"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-control bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
                  />

                  {showPassword ? (
                    <GoEye
                      onClick={() => setShowPassword((prevState) => !prevState)}
                      className="relative self-end bottom-11 right-4 w-5 h-5  cursor-pointer"
                    />
                  ) : (
                    <RiEyeCloseLine
                      onClick={() => setShowPassword((prevState) => !prevState)}
                      className="relative self-end bottom-11 right-4 w-5 h-5  cursor-pointer"
                    />
                  )}
                </div>
                <div className=" flex flex-col gap-2 w-100 pt-1 p-4 ">
                  <input
                    type={show2doPassword ? "text" : "password"}
                    id="password"
                    placeholder="Crear nueva contraseña"
                    onChange={(e) => setReplicatePassword(e.target.value)}
                    required
                    className="form-control bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
                  />

                  {show2doPassword ? (
                    <GoEye
                      onClick={() =>
                        setShow2doPassword((prevState) => !prevState)
                      }
                      className="relative self-end bottom-11 right-4 w-5 h-5  cursor-pointer"
                    />
                  ) : (
                    <RiEyeCloseLine
                      onClick={() =>
                        setShow2doPassword((prevState) => !prevState)
                      }
                      className="relative self-end bottom-11 right-4 w-5 h-5  cursor-pointer"
                    />
                  )}
                </div>
              </div>
              <button
                className="bg-[#427EF3] w-[31rem] rounded-lg h-12  text-white"
                onClick={() => setChangePassword(true)}
              >
                Guardar contraseña nueva
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default NewPasswordModal;
