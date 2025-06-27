import jwt from 'jsonwebtoken';

export const generateToken = (client) => {
  return jwt.sign(
    {
      id: client.id,
      CodigoCliente: client.CodigoCliente,
      CodigoDistribuidor: client.CodigoDistribuidor,
      Segmentacion: client.Segmentacion,
      CondicionFiscal: client.CondicionFiscal,
      Localidad: client.Localidad,
      Calle: client.Calle,
      EntreCalles: client.EntreCalles,
      Telefono: client.Telefono,
      Email: client.Email,
      VentaAlcohol: client.VentaAlcohol,
      WebPage: client.WebPage,
      HorarioVenta: client.HorarioVenta,
      HorarioOnOffDispositivos: client.HorarioOnOffDispositivos,
      HorarioPublicitario: client.HorarioPublic,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};
