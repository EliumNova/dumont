'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';
import { SiWhatsapp } from 'react-icons/si';
import { FiPhone } from 'react-icons/fi';
import { FiMail } from 'react-icons/fi';

function BtnCom() {
  const usuarioIniciado = useSelector((state) => state.auth.user);
  console.log('user:', usuarioIniciado);
  return (
    <div className="w-full p-6 flex items-center justify-center">
      <ul className="flex flex-wrap items-center justify-center gap-x-20 gap-y-10 w-full max-w-[60rem] p-4 text-black">
        <li className="hover:scale-110 transition-all duration-200">
          <a
            href="https://wa.me/1234567890?text=Hello"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="w-[12rem] h-[12rem] rounded-lg bg-[#12141DD9] p-4 flex flex-col justify-center items-center gap-2 font-semibold cursor-pointer shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
              <SiWhatsapp
                className="w-[4rem] h-[4rem] mt-2"
                style={{ color: '#28348c' }}
              />

              <h3 className="text-center text-white">WhatsApp</h3>
            </div>
          </a>
        </li>

        <li className="hover:scale-110 transition-all duration-200">
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=example@example.com&su=Hello&body=Hola,%20buenos%20dias"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="w-[12rem] h-[12rem] rounded-lg bg-[#12141DD9] p-4 flex flex-col justify-center items-center gap-2 font-semibold cursor-pointer shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
              <FiMail
                className="w-[4rem] h-[4rem] mt-2"
                style={{ color: '#28348c' }}
              />

              <h3 className="text-center text-white">Email</h3>
            </div>
          </a>
        </li>

        <li className="hover:scale-110 transition-all duration-200">
          <a href="tel:+012345-6789">
            <div className="w-[12rem] h-[12rem] rounded-lg bg-[#12141DD9] p-4 flex flex-col justify-center items-center gap-2 font-semibold cursor-pointer shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
              <FiPhone
                className="w-[4rem] h-[4rem] mt-2"
                style={{ color: '#28348c' }}
              />

              <h3 className="text-center text-white">Llamada</h3>
            </div>
          </a>
        </li>
      </ul>
    </div>
  );
}

export default BtnCom;
