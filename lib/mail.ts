import nodemailer from 'nodemailer'
import { User } from '../types'

export async function sendMail(user: User, token: string)  {
  // console.log({user})
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.ETHEREAL_EMAIL,
      pass: process.env.ETHEREAL_PASSWORD,
    }
  })

   let info = await transporter.sendMail({
    from: 'TAKANOME DEV <takanome@gmail.com>',
    to: process.env.ETHEREAL_EMAIL,
    subject: 'Password Reset Link',
    html: `
    Hey <h2 class="display:inline;">${user.username}</h2>, hope you doing well.
    click the following link to reset your password:
    <a href="${process.env.FRONTEND_URL}?email=${user.email}&token=${token}">Reset Password</a>

    Have a nice day,

    Takanome Dev
    `,
    
  })

  console.log(`📫 email sent to ${user.email}`)
  console.log(`Preview link: ${nodemailer.getTestMessageUrl(info)}`)
}