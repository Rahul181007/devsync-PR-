import nodemailer from 'nodemailer';
import { env } from '../../../config/env';
import { IMailService } from '../../../domain/service/mail.service';

export class NodemailerService implements IMailService{
    private transporter=nodemailer.createTransport({
        host:env.Mail_HOST,
        port:Number(env.MAIL_PORT),
        secure:false,
        auth:{
            user:env.MAIL_USER,
            pass:env.MAIL_PASS
        }
    })

    async sendOtp(email:string,otp:string){
        await this.transporter.sendMail({
            from:env.MAIL_FROM,
            to:email,
            subject:'Password Reset OTP',
            html:`
            <h2>DevSync Password Reset</h2>
            <p>Your OTP is</p>
            <h1>${otp}</h1>
            <p>THis OTP is valid for 10 minutes </p>
            `
            
        })
    }
}