import nodemailer from "nodemailer";

export const sendInactiveAccountEmail = async (recipientEmail) => {
  // Configuro el transporte de nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "correomcoc@gmail.com",
      pass: process.env.PASSWORD_EMAIL,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Configura el contenido del correo electrónico
  const mailOptions = {
    from: "correomcoc@gmail.com",
    to: recipientEmail,
    subject: "Eliminación de cuenta por inactividad",
    html: `<p>Hola,</p><p>Tu cuenta ha sido eliminada debido a inactividad.</p>`,
  };

  try {
    // Envía el correo electrónico
    await transporter.sendMail(mailOptions);
    console.log(`Correo electrónico enviado a ${recipientEmail}`);
  } catch (error) {
    console.error(`Error al enviar el correo electrónico: ${error.message}`);
    throw new Error(`Error al enviar el correo electrónico: ${error.message}`);
  }
};
