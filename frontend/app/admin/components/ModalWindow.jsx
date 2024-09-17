function ModalWindow() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
      <div className="h-96 w-96 bg-white flex flex-col place-items-center justify-evenly rounded-Modal">
        <img src="/svg/smallCheck.svg" alt="" className="w-8 h-8" />
        <h1>¡Usuario creado con éxito!</h1>
      </div>
    </div>
  );
}

export default ModalWindow;
