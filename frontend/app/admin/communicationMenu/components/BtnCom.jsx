'use client';
import React from 'react';
import { SiWhatsapp } from 'react-icons/si';
import { FiPhone, FiMail } from 'react-icons/fi';

const OPCIONES = [
  {
    nombre: 'WhatsApp',
    detalle: 'Chatear',
    href: 'https://wa.me/1234567890?text=Hello',
    externo: true,
    Icono: SiWhatsapp,
    color: '#25D366',
    fondo: 'rgba(37, 211, 102, 0.12)',
  },
  {
    nombre: 'Email',
    detalle: 'Enviar un correo',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=example@example.com&su=Hello&body=Hola,%20buenos%20dias',
    externo: true,
    Icono: FiMail,
    color: '#427EF3',
    fondo: 'rgba(66, 126, 243, 0.12)',
  },
  {
    nombre: 'Llamada',
    detalle: 'Llamar ahora',
    href: 'tel:+012345-6789',
    externo: false,
    Icono: FiPhone,
    color: '#7C3AED',
    fondo: 'rgba(124, 58, 237, 0.12)',
  },
];

function BtnCom() {
  return (
    <div className="flex w-full items-center justify-center p-4 sm:p-8">
      <ul className="grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-3">
        {OPCIONES.map(({ nombre, detalle, href, externo, Icono, color, fondo }, i) => (
          <li key={nombre} className="mac-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
            <a
              href={href}
              {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="mac-press group flex h-full flex-col items-center gap-4 rounded-3xl border border-black/5 bg-white/90 px-6 py-8 text-[#191920] shadow-lg backdrop-blur transition-shadow hover:shadow-2xl">
              <span
                className="flex h-20 w-20 items-center justify-center rounded-3xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: fondo, color }}>
                <Icono className="h-9 w-9" />
              </span>
              <span className="text-center">
                <span className="block text-lg font-semibold">{nombre}</span>
                <span className="block text-sm text-gray-500">{detalle}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BtnCom;
