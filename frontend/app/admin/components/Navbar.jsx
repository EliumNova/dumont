'use client';
import Image from 'next/image';
import React from 'react';
import { useEffect, useState, useRef} from 'react';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { updateAuthUser, logoutUser } from '@/lib/slices/authAction';
import { IoIosArrowForward } from 'react-icons/io';
import Link from 'next/link';
import InputField from '../customerRegistration/Componentes/InputField';


function Navbar() {
  const pathname = usePathname();
  console.log('ruta: ', pathname);
  const dispatch = useDispatch();  
  const {user} = useSelector(state => state.auth)
  const [dropProfile, setDropProfile] = useState(false);
  const dropRef = useRef(null);
  const [editUser, setEditUser] = useState(false);
  const [userDelete, setUserDelete] = useState(false);
  const [userSave, setUserSave] = useState(false);
  const [registerUser, setRegisterUser] = useState({
    Name: '',
    Email: '',
    isAdmin: "",
    DNI: '',
  });
  const [errorMessage, setErrorMessage] = useState('')
  console.log(user);
  //console.log(editUser);

  useEffect(() => {
    if (user) {
      setRegisterUser({
        Name: user.Name,
        Email: user.Email,
        isAdmin: user.isAdmin,
        DNI: user.DNI
      });
    }
  }, [user]);
  

  const handleDropProfile = () => {  //esta funcion desplega el menu        
    setDropProfile(!dropProfile)      
  }  
  
  const handleClickOutside = (event) => {                               //esta funcion pliega el menu del perfil al hacer click en otro lado
    if (dropRef.current && !dropRef.current.contains(event.target)) {
      setDropProfile(false);
    }
  };

  useEffect(() => {
    if (dropProfile) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropProfile]);

    const handleModalOpen = (e) => {
      setRegisterUser({
        Name: user.Name || '',
        Email: user.Email || '',
        isAdmin: user.isAdmin || '',
        DNI: user.DNI || '',
      });
      setEditUser(true);
    };
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      console.log("handleChange", name, value);
      
      const processedValue = name === 'admin' ? value === 'true' : value;
  
      const validations = {
        DNI: /^[0-9]*$/,
        Name: /^[a-zA-Z\s]*$/,
        Email: /^[a-zA-Z@.\s]*$/,
      };
  
      if (name in validations) {
        if (value === '' || validateInput(processedValue, validations[name])) {
          registrar(name, processedValue);
        } else {
          errorMessageBox();
        }
      } else {
        registrar(name, processedValue);
      }
    };

    const validateInput = (value, regex) => regex.test(value);

  const registrar = (name, processedValue) => {
    console.log("Registrar", name, processedValue);
    
    return setRegisterUser((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const errorMessageBox = () => {
    setErrorMessage('Caracteres inválidos en el campo.');
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Handle Submit");
    
    //Validar los campos
    const { Name, Email, DNI } = registerUser
    if(!Name || !Email || !DNI){
      setErrorMessage('Todos los campos son obligatorios')
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    console.log(registerUser);    

    dispatch(updateAuthUser(user.id, {...registerUser, tokenUser: user.token}))
    setEditUser(false)
   
  } 

  const handleLogout = () => {
    console.log("logout");
        
    dispatch(logoutUser())
    localStorage.clear();
    setTimeout(() => {
      window.location.href = '/login';
    }, 500);
  }

  let isAdminRoot = pathname === '/admin';
  let isAdminSubroute = pathname.startsWith('/admin/');
  let userRegisterUrl = pathname === '/admin/userRegistration';
  let customerRegisterUrl = pathname === '/admin/customerRegistration';
  let customerMenu = pathname === '/admin/customerMenu';
  let distribuitorMenu = pathname === '/admin/customerMenu/distribuitorMenu';
  let userMenu = pathname === '/admin/userMenu';
  let devicesMenu = pathname === '/admin/devicesMenu';

  const getBackUrl = () => {
    if (distribuitorMenu) return '/admin/customerMenu';
    if (customerRegisterUrl) return '/admin/customerMenu';
    return '/admin';
  };

  return (
    <div
      className={`z-40 text-white flex flex-col md:flex-row justify-between px-4 md:px-8 p-3 shadow-[#35334426] shadow-sm border-b-2 border-[#12141D]
      ${isAdminSubroute ? 'bg-[#12141D]' : 'bg-[#12141D]'}`}
    >
      <div className="flex flex-row gap-2 md:gap-4 justify-center items-center">
        {isAdminSubroute && (
          <Link href={getBackUrl()}>
            <IoIosArrowForward className="rotate-180 h-8 w-10 cursor-pointer transition-all duration-150 hover:scale-110" />
          </Link>
        )}

        {/* <Image
          width={40}
          height={40}
          src={"/DuMontLogo.jpeg"}
          alt="DuMont Logo"
          className="rounded-lg w-8 md:w-10 transition-all duration-150"
        /> */}

        {userRegisterUrl && (
          <h2 className="font-bold text-sm md:text-base transition-all duration-150">
            Registro de Usuarios
          </h2>
        )}
        {isAdminRoot && (
          <h2 className="font-bold text-sm md:text-base transition-all duration-150">
            Menú Administrador
          </h2>
        )}
        {customerMenu && (
          <h2 className="font-bold text-sm md:text-base transition-all duration-150">
            Menú Clientes
          </h2>
        )}
        {distribuitorMenu && (
          <h2 className="font-bold text-sm md:text-base transition-all duration-150">
            Lista Distribuidores
          </h2>
        )}
        {userMenu && (
          <h2 className="font-bold text-sm md:text-base transition-all duration-150">
            Menú de Usuarios
          </h2>
        )}
        {devicesMenu && (
          <h2 className="font-bold text-sm md:text-base transition-all duration-150">
            Menú de Dispositivos
          </h2>
        )}
      </div>
      <div className="flex flex-row gap-2 md:gap-3 mt-2 md:mt-0">
        <div className="text-right">
          <p className="text-xs md:text-base font-semibold">{user.Name}</p>
          <p className="text-xs text-white opacity-60">{user.Email}</p>
        </div>
        <div className="relative" ref={dropRef} tabIndex={0}
              //onBlur={handleBlur}
              onClick={handleDropProfile}>
        <Image
          width={40}
          height={40}
          src={'/UserIcon5.jpeg'}
          alt="Perfil Image"
          className="rounded-full"
        />
        </div>
        {dropProfile && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">

            <div className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              ref={dropRef}
              onClick={handleModalOpen}
              >
                Actualizar Perfil
            </div>
            <div className="block px-4 py-2 text-gray-800 hover:bg-gray-200"  
              onClick={handleLogout}              
              ref={dropRef}
              >
                Logout
            </div>           
          </div>
        )}
        </div>

      {editUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40 p-2 lg:p-10">
          <div className="relative flex flex-col bg-white p-8 rounded-lg shadow-lg xl:w-[600px] w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-4xl font-semibold mb-7">Editar Usuario</h2>

            <InputField
              label="Nombre Completo"
              id="Name"
              name="Name"
              value={registerUser.Name}
              onChange={handleChange}
              required
              className="gap-3 font-light p-0"
              labelClassName="font-light "
              inputClassName="rounded-2xl text-black"
            />
            <InputField
              label="Correo Electrónico"
              id="Email"
              name="Email"
              type="email"
              placeholder=""
              value={registerUser.Email}
              onChange={handleChange}
              required
              className="gap-3 font-light p-0"
              labelClassName="font-light"
              inputClassName="rounded-2xl text-black"
            />
            <InputField
              label="DNI"
              id="DNI"
              name="DNI"
              type="number"
              placeholder="40644249"
              value={registerUser.DNI}
              onChange={handleChange}
              required
              className="gap-3 font-light p-0"
              labelClassName="font-light"
              inputClassName="rounded-2xl text-black"
            />
            <div className="flex flex-col gap-3 w-full my-2">
              <label htmlFor="admin" className="text-sm font-light">
                Rol Administrador
              </label>
              <select
                id="isAdmin"
                name="isAdmin"
                value={registerUser.isAdmin === true ? "Si" : "No"}
                onChange={handleChange}
                className="bg-[#E2E5E5] h-14 rounded-2xl p-4 text-base text-black"
                required
              >
                <option value="true" className='text-black'>Sí</option>
                <option value="false" className='text-black'>No</option>
              </select>
            </div>

            <div className="flex gap-10 flex-col lg:flex-row my-4">
              <button
                onClick={() => setUserSave(!userSave)}
                className="xl:w-6/12 text-blue-500 py-4 px-6 rounded-2xl text-xl border-solid border-2 border-blue-500 font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 font-semibold xl:w-6/12 text-white py-4 px-6 rounded-2xl text-xl"
              >
                Guardar
              </button>
            </div>
            <button
              onClick={() => setUserDelete(!userDelete)}
              className="w-full font-semibold text-red-500 py-4 px-6 rounded-2xl text-xl border-solid border-2 border-red-500 flex justify-center gap-5 hover:bg-red-300"
            >
              <img src="/svg/trashIcon.svg" alt="Eliminar" />
              Eliminar Usuario
            </button>
          </div>
        </div>
      )}

{userDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-10">
          <div className="bg-white h-96 w-96 rounded-3xl flex flex-col place-items-center justify-center gap-10 ">
            <img src="/svg/alertIcon.svg" alt="" />
            <p className="">¿Estas seguro que deseas eliminar este usuario?</p>
            <div className="flex gap-5 flex-col lg:flex-row">
              <button
                onClick={() => setUserDelete(!userDelete)}
                className="xl:w-6/12 text-blue-500 py-4 px-6 rounded-2xl text-xl border-solid border-2 border-blue-500 font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={
                  handleDelete               
                //   () => {   
                //   setUserDelete(!userDelete);
                //   setEditUser(!editUser);
                // }
              }
                className="bg-red-500 font-semibold xl:w-6/12 text-white py-4 px-6 rounded-2xl text-xl"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

{userSave && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-10">
          <div className="bg-white h-96 w-96 rounded-3xl flex flex-col place-items-center justify-center gap-10 ">
            <img src="/svg/alertIcon.svg" alt="" />
            <p className="text-lg text-black">¿Deseas descartar la edición del usuario?</p>
            <div className="flex gap-5 flex-col lg:flex-row">
              <button
                onClick={() => {
                  setUserSave(!userSave)                 
                }}
                className="xl:w-6/12 text-blue-500 py-4 px-6 rounded-2xl text-xl border-solid border-2 border-blue-500 font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setUserSave(!userSave);
                  setEditUser(!editUser);
                }}
                className="bg-red-500 font-semibold xl:w-6/12 text-white py-4 px-6 rounded-2xl text-xl"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Navbar;
