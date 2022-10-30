import nodemailer from 'nodemailer';
import path from 'path';
import hbs from 'nodemailer-express-handlebars';
import { User } from '../types';

export default async function sendMail(user: User, token: string) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.ETHEREAL_EMAIL,
      pass: process.env.ETHEREAL_PASSWORD,
    },
    logger: true,
    // TODO: remove debugger on prod
    // debug: true
  });

  transporter.use(
    'compile',
    hbs({
      viewEngine: {
        extname: '.hbs',
        partialsDir: path.resolve('emails'),
        defaultLayout: path.resolve('emails/layouts/main'),
      },
      extName: '.hbs',
      viewPath: path.resolve('emails'),
    })
  );

  await transporter.sendMail({
    from: 'TAKANOME DEV <takanome@gmail.com>',
    to: process.env.ETHEREAL_EMAIL,
    subject: 'Reset Your Password',
    // @ts-ignore
    template: 'reset',
    context: {
      token,
      name: user.username,
      url: `${process.env.FRONTEND_URL}/reset-password?email=${user.email}&token=${token}`,
    },
  });

  console.log(`📫 email sent to ${user.email}`);
  //  console.log(`Preview link: ${nodemailer.getTestMessageUrl(info)}`)
}
