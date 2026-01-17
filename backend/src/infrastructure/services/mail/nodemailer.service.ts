import nodemailer from 'nodemailer';
import { env } from '../../../config/env';
import { IMailService } from '../../../domain/service/mail.service';

export class NodemailerService implements IMailService {
    private _transporter = nodemailer.createTransport({
        host: env.Mail_HOST,
        port: Number(env.MAIL_PORT),
        secure: false,
        auth: {
            user: env.MAIL_USER,
            pass: env.MAIL_PASS
        }
    })

    async sendOtp(email: string, otp: string) {
        await this._transporter.sendMail({
            from: env.MAIL_FROM,
            to: email,
            subject: 'Password Reset OTP',
            html: `
            <h2>DevSync Password Reset</h2>
            <p>Your OTP is</p>
            <h1>${otp}</h1>
            <p>THis OTP is valid for 10 minutes </p>
            `

        })
    }

    async sendCompanyAdminInviteEmail(data: { to: string; inviteLink: string; }): Promise<void> {
        await this._transporter.sendMail({
            from: env.MAIL_FROM,
            to: data.to,
            subject: 'You have invited as Company Admin',
            html: `
               <p>Hello,</p>
               <p>You have been invited to join as a <b>Company Admin</b>.</p>
               <p>Click the link below to accept the invite:</p>
               <p><a href="${data.inviteLink}">Accept Invite</a></p>
               <p>This link will expire in 24 hours.</p>
                  `

        })
    }

   async sendDeveloperInviteEmail(data: { to: string; inviteLink: string; companyName: string; }): Promise<void> {
            await this._transporter.sendMail({
            from: env.MAIL_FROM,
            to: data.to,
            subject: `You have invited  to ${data.companyName} as Developer`,
            html: `
               <p>Hello,</p>
               <p>You have been invited to join as a <b>Developer</b>.</p>
               <p>Click the link below to accept the invite:</p>
               <p><a href="${data.inviteLink}">Accept Invite</a></p>
               <p>This link will expire in 24 hours.</p>
                  `

        })
   }
    
       async sendSignupOtp(email: string, otp: string) {
        await this._transporter.sendMail({
            from: env.MAIL_FROM,
            to: email,
            subject: 'SignUp Verification',
            html: `
            <h2>DevSync Verification</h2>
            <p>Your OTP is</p>
            <h1>${otp}</h1>
            <p>THis OTP is valid for 10 minutes </p>
            `

        })
    }
}