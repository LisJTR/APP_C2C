// utils/emailService.js
import nodemailer from "nodemailer";

/*
  Este módulo define la función `sendVerificationEmail` que permite enviar correos electrónicos con un código de verificación
  a nuevos usuarios tras su registro. Utiliza la librería `nodemailer` para conectarse a un servidor SMTP, cuya configuración
  (host, puerto y credenciales) se obtiene desde variables de entorno.

  El correo incluye tanto texto plano como una plantilla HTML visualmente atractiva y adaptada a la identidad de KCL Trading.
  El código de verificación se inserta dinámicamente en el cuerpo del mensaje. La función es asincrónica y puede integrarse
  fácilmente en cualquier flujo de registro de usuario.
*/

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (to, code) => {
    // Plantilla HTML del correo con diseño moderno y branding visual
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background-color:rgb(103, 176, 255); padding: 20px; text-align: center;">
          <img src="https://i.imgur.com/6k1EXFk.png" alt="Logo" style="width: 120px; height: auto; margin-bottom: 10px;" />
          <h1 style="color: white; font-size: 22px;">Verifica tu cuenta</h1>
        </div>
        <div style="padding: 30px; text-align: center;">
          <p style="font-size: 16px; color: #333;">
            ¡Gracias por registrarte en <strong>KCL Trading</strong>! Para completar tu registro, introduce el siguiente código de verificación:
          </p>
          <p style="font-size: 28px; font-weight: bold; color: #007AFF; margin: 20px 0;">${code}</p>
          <p style="font-size: 14px; color: #777;">
            Si tú no creaste esta cuenta, puedes ignorar este mensaje.
          </p>
        </div>
        <div style="background-color: #f2f2f2; padding: 15px; text-align: center; font-size: 12px; color: #999;">
          © ${new Date().getFullYear()} KCL_Trading. Todos los derechos reservados.
        </div>
      </div>
    </div>
  `;
// Envío del correo usando el transportador configurado
  const info = await transporter.sendMail({
    from: `"KCL_Trading" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Código de verificación - KCL_Trading",
    text: `Tu código de verificación es: ${code}`,
    html: htmlTemplate,
  });

  console.log("📧 Email enviado:", info.messageId);
};
