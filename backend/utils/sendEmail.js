import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const sendEmail = async (to, subject, html) => {
  const info = await transporter.sendMail({
    from: `"Donna Daniel Rentals" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("EMAIL SENT:", info.response);
};
export default sendEmail;
