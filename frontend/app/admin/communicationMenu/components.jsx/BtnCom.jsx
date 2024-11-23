"use client";
import { SiWhatsapp } from "react-icons/si";
import { FiPhone } from "react-icons/fi";
import { FiMail } from "react-icons/fi";

function BtnCom() {
        

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col space-y-14 items-center text-white text-[18pt] font-semibold">
          <div className="flex flex-direction rounded-lg h-[5rem] bg-[#12141DD9] hover:scale-110 transition-all duration-200">
            <SiWhatsapp
              className="w-[4rem] h-[4rem] mt-2 ml-2"
              style={{ color: "#28348c" }}
            />
            <a href="https://wa.me/1234567890?text=Hello" target="_blank" rel="noopener noreferrer">
            <button className="w-[26rem] h-[4rem] mt-2">
             Message
            </button>
            </a>
          </div>
          <div className="flex flex-direction rounded-lg h-[5rem] bg-[#12141DD9] hover:scale-110 transition-all duration-200">
            <FiMail
              className="w-[4rem] h-[4rem] mt-2 ml-2"
              style={{ color: "#28348c" }}
            />
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=example@example.com&su=Hello&body=Hola,%20buenos%20dias" target="_blank" rel="noopener noreferrer">
            <button className="w-[26rem] h-[4rem] mt-2">
              Mail
            </button>
            </a>
          </div>
          <div className="flex flex-direction rounded-lg h-[5rem] bg-[#12141DD9] hover:scale-110 transition-all duration-200">
            <FiPhone
              className="w-[4rem] h-[4rem] mt-2 ml-2"
              style={{ color: "#28348c" }}
            />
            <a href="tel:+012345-6789" >
            <button className="w-[26rem] h-[4rem] mt-2">
              Call
            </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default BtnCom;
