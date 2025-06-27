export const verifyEmailTemplate = (req, user, token) => {
  return `<!DOCTYPE html>
	<table
      style="
        max-width: 600px;
        padding: 10px;
        margin: 0 auto;
        border-collapse: collapse;
      "
    >
      <tr>
        <td
          style="
            padding: 0;
            background: rgb(183, 193, 255);
            background: linear-gradient(
              180deg,
              rgba(183, 193, 255, 1) 0%,
              rgba(255, 255, 255, 1) 85%
            );
            display: flex;
            justify-content: center;
          "
        >
        </td>
      </tr>

      <tr>
        <td style="background-color: #fff">
          <div
            style="
              color: #000000;
              margin: 4% 10% 2%;
              text-align: justify;
              font-family: sans-serif;
            "
          >
            <h2 style="color: #222d65; margin: 0 0 7px">Hola ${user.Name}!</h2>
            <h4 style="color: #00000065;">Tu cuenta ha sido registrada con éxito!</h4>
            <p style="margin: 2px; font-size: 15px">
              Tu cuenta ha sido registrada con éxito y para poder proseguir con el registro es necesario
              realizar una verificación para comprobar que no eres un robot.<br />
              <br />
              Gracias por confiar en nosotros<br />
            </p>
            <div
              style="
                width: 100%;
                margin: 20px 0;
                display: inline-block;
                text-align: center;
              "
            >
            </div>
            <div style="width: 100%; text-align: center">
							<h1>Codigo de verificacion: ${token}</h1>
            </div>
            <p
              style="
                color: #b3b3b3;
                font-size: 12px;
                text-align: center;
                margin: 30px 0 0;
              "
            >
              Dumont - 2024
            </p>
          </div>
        </td>
      </tr>
    </table>`;
};
