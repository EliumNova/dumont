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


// Mail de verificación de cuenta: botón con el enlace de confirmación.
export const verificacionEmailHtml = ({ nombre, enlace, horas = 24 }) => `<!DOCTYPE html>
<html lang="es">
  <body style="margin:0;padding:24px;background:#F2F5F6;font-family:Arial,Helvetica,sans-serif;color:#191920;">
    <table role="presentation" width="100%" style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;">
      <tr>
        <td style="background:#060f3a;padding:28px;text-align:center;color:#ffffff;font-size:24px;font-weight:bold;letter-spacing:2px;">
          DuMont
        </td>
      </tr>
      <tr>
        <td style="padding:32px 28px;">
          <h1 style="margin:0 0 12px;font-size:20px;">Hola ${String(nombre || "").replace(/[<>&"]/g, "")} 👋</h1>
          <p style="margin:0 0 24px;line-height:1.5;color:#444;">
            Se creó una cuenta para vos en DuMont. Para activarla y poder ingresar,
            confirmá tu correo con el siguiente botón:
          </p>
          <p style="text-align:center;margin:0 0 24px;">
            <a href="${enlace}" style="display:inline-block;background:#427EF3;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:bold;">
              Verificar mi correo
            </a>
          </p>
          <p style="margin:0 0 8px;font-size:12px;color:#777;">
            El enlace vence en ${horas} horas. Si el botón no funciona, copiá y pegá esta dirección en tu navegador:
          </p>
          <p style="margin:0;font-size:12px;word-break:break-all;color:#427EF3;">${enlace}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px;background:#F2F5F6;font-size:11px;color:#888;text-align:center;">
          Si no esperabas este mensaje, ignoralo: la cuenta no se activará.
        </td>
      </tr>
    </table>
  </body>
</html>`;
