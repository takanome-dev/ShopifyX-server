import nodemailer from 'nodemailer'
import path from 'path'
import hbs from 'nodemailer-express-handlebars'
import { User } from '../types'



export default async function sendMail(user: User, token: string)  {
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
  })
  
  transporter.use('compile', hbs({
    viewEngine: {
      extname: '.hbs',
      partialsDir: path.resolve('emails'),
      defaultLayout: false
    },
    extName: '.hbs',
    viewPath: path.resolve('emails'),
  }))

try {
  await transporter.sendMail({
   from: 'TAKANOME DEV <takanome@gmail.com>',
   to: process.env.ETHEREAL_EMAIL,
   subject: 'Password Reset Link',
   // @ts-ignore
   template: 'reset',
   context: {
    token,
    name: user.username,
    url:`${process.env.FRONTEND_URL}?email=${user.email}&token=${token}`
   } 
 })

 console.log(`📫 email sent to ${user.email}`)
//  console.log(`Preview link: ${nodemailer.getTestMessageUrl(info)}`)
} catch (error) {
  console.error(`Catch Error: ${error}`)
}
}