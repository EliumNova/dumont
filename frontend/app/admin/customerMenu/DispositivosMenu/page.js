import DevicesTable from './components/DevicesTable';

function DispositivosMenu() {
  const devices = [
    {
      numSerie: 'F4JM3NOOLPP3',
      marca: 'Apple',
      modelo: '11 PRO Max',
      pulgadas: '6,6',
      estado: 'true',
      ubicacion: 'Si',
    },
    {
      numSerie: '8MKJ6UIPL5VC',
      marca: 'Samsung',
      modelo: '11 PRO Max',
      pulgadas: 'Galaxy A23',
      estado: 'false',
      ubicacion: 'No',
    },
    {
      numSerie: '3519J2MSK2KO',
      marca: 'Samsung',
      modelo: 'Galaxy A05',
      pulgadas: '6,6H',
      estado: 'false',
      ubicacion: 'Si',
    },
    {
      numSerie: '823ANDK2NKDL',
      marca: 'Samsung',
      modelo: 'Galaxt A05',
      pulgadas: '6,7',
      estado: 'true',
      ubicacion: 'Si',
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <DevicesTable devices={devices}></DevicesTable>
    </div>
  );
}

export default DispositivosMenu;
