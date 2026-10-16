"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { updateAuthUser, logoutUser } from "@/lib/slices/authAction";
import { IoIosArrowForward } from "react-icons/io";
import { FiUser, FiLogOut, FiUsers } from "react-icons/fi";
import Link from "next/link";
import MacModal from "./MacModal";
import SeguridadPerfil from "./SeguridadPerfil";

// Título de la barra según la ruta (primer prefijo que coincide).
const TITULOS = [
  ["/admin/userRegistration", "Registro de Usuarios"],
  ["/admin/clientRegistration", "Registro de Clientes"],
  ["/admin/clientMenu/Pages/EditClient", "Edición de Clientes"],
  ["/admin/clientMenu", "Menú Clientes"],
  ["/admin/distributorRegistration", "Registro de Distribuidores"],
  ["/admin/distributorMenu", "Lista Distribuidores"],
  ["/admin/customerMenu/distribuitorMenu", "Lista Distribuidores"],
  ["/admin/userMenu", "Menú de Usuarios"],
  ["/admin/devicesMenu/Pages/EditDevice", "Edición de Dispositivo"],
  ["/admin/deviceMenu/Pages/EditDevice", "Edición de Dispositivo"],
  ["/admin/devicesMenu", "Menú de Dispositivos"],
  ["/admin/devicesRegistration", "Registro de Dispositivos"],
  ["/admin/geolocatorMenu", "Mapa de Dispositivos"],
];

const campoCls =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [menuOpen, setMenuOpen] = useState(false);
  const [perfilOpen, setPerfilOpen] = useState(false);
  const [form, setForm] = useState({ Name: "", Email: "", Telefono: "", DNI: "", Password: "" });
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const menuRef = useRef(null);

  const isAdminRoot = pathname === "/admin";
  const isAdminSubroute = pathname.startsWith("/admin/");
  const titulo = isAdminRoot
    ? "Menú Administrador"
    : TITULOS.find(([ruta]) => pathname.startsWith(ruta))?.[1] || "";

  // Un solo contenedor (avatar + menú) y el cierre por clic afuera / Esc.
  // Antes el menú quedaba fuera del ref y el listener global lo cerraba antes
  // de que el clic en "Actualizar Perfil"/"Logout" llegara a su onClick.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const abrirPerfil = () => {
    setForm({
      Name: user?.Name || "",
      Email: user?.Email || "",
      Telefono: user?.Telefono || "",
      DNI: user?.DNI ?? "",
      Password: "",
    });
    setError("");
    setOk("");
    setMenuOpen(false);
    setPerfilOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "DNI" && !/^\d*$/.test(value)) return;
    if (name === "Telefono" && !/^[\d+\s-]*$/.test(value)) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const guardar = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");
    const { Name, Email, Telefono, DNI, Password } = form;
    if (!Name.trim() || !Email.trim() || !DNI) {
      setError("Nombre, correo y DNI son obligatorios.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(Email.trim())) {
      setError("El correo no es válido.");
      return;
    }
    if (Password && Password.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    const payload = { Name: Name.trim(), Email: Email.trim(), DNI: Number(DNI) };
    if (Telefono) payload.Telefono = Telefono;
    if (Password) payload.Password = Password;

    const exito = await dispatch(updateAuthUser(user.id, payload));
    if (exito) {
      setOk("Perfil actualizado.");
      setForm((prev) => ({ ...prev, Password: "" }));
      setTimeout(() => setPerfilOpen(false), 900);
    } else {
      setError("No se pudo actualizar el perfil. Revisá los datos e intentá de nuevo.");
    }
  };

  const handleLogout = () => {
    setMenuOpen(false);
    dispatch(logoutUser());
    router.replace("/login");
  };

  const nombre = user?.Name || "Administrador";
  const correo = user?.Email || "";

  return (
    <div className="z-40 flex flex-col justify-between border-b-2 border-[#12141D] bg-[#F2F5F6] p-3 px-4 text-[#191920] shadow-sm shadow-[#35334426] md:flex-row md:px-8">
      <div className="flex flex-row items-center justify-center gap-2 md:gap-4">
        {isAdminSubroute && (
          <Link href="/admin" aria-label="Volver">
            <IoIosArrowForward className="mac-press h-8 w-10 rotate-180 cursor-pointer" />
          </Link>
        )}
        {titulo && (
          <h2 className="mac-fade-up text-sm font-bold md:text-base" key={titulo}>
            {titulo}
          </h2>
        )}
      </div>

      <div className="mt-2 flex flex-row items-center justify-end gap-2 md:mt-0 md:gap-3">
        <Link href="/admin/userMenu">
          <button className="mac-press flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            <FiUsers /> Usuarios
          </button>
        </Link>

        <div className="text-right">
          <p className="text-xs font-semibold md:text-base">{nombre}</p>
          {correo && <p className="text-xs opacity-60">{correo}</p>}
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="mac-press block rounded-full ring-2 ring-transparent focus:outline-none focus-visible:ring-blue-400">
            <Image
              width={40}
              height={40}
              src="/UserIcon5.jpeg"
              alt="Perfil"
              className="rounded-full"
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="mac-pop mac-glass absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl py-1.5">
              <div className="border-b border-black/5 px-4 py-2.5">
                <p className="truncate text-sm font-semibold">{nombre}</p>
                {correo && <p className="truncate text-xs text-gray-500">{correo}</p>}
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={abrirPerfil}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-blue-500 hover:text-white">
                <FiUser /> Actualizar perfil
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-500 hover:text-white">
                <FiLogOut /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>

      <MacModal
        isOpen={perfilOpen}
        onClose={() => setPerfilOpen(false)}
        title="Mi perfil"
        footer={false}
        maxWidth="max-w-xl">
        <form onSubmit={guardar} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Nombre completo
            <input name="Name" value={form.Name} onChange={handleChange} className={campoCls} maxLength={45} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Correo electrónico
            <input name="Email" type="email" value={form.Email} onChange={handleChange} className={campoCls} maxLength={45} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              DNI
              <input name="DNI" inputMode="numeric" value={form.DNI} onChange={handleChange} className={campoCls} maxLength={10} />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Teléfono
              <input name="Telefono" inputMode="tel" value={form.Telefono} onChange={handleChange} className={campoCls} maxLength={15} />
            </label>
          </div>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Nueva contraseña <span className="font-normal text-gray-500">(dejala vacía para no cambiarla)</span>
            <input name="Password" type="password" autoComplete="new-password" value={form.Password} onChange={handleChange} className={campoCls} />
          </label>

          {error && <p className="mac-shake rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
          {ok && <p className="rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700">{ok}</p>}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setPerfilOpen(false)} className="mac-press rounded-xl border border-gray-300 px-5 py-2 text-sm font-medium hover:bg-gray-100">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="mac-press rounded-xl bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-60">
              {loading ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </form>

        <SeguridadPerfil />
      </MacModal>
    </div>
  );
}

export default Navbar;
