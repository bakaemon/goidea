import * as nodemailer from 'nodemailer';
import * as smptTransport from 'nodemailer-smtp-transport'
import Mail from 'nodemailer/lib/mailer';
import { Injectable } from '@nestjs/common';

interface EmailConfig {
    service: string;
    auth: {
        user: string;
        pass: string;
    }
}
@Injectable()
export class EmailTransporter {
    private transporter: nodemailer.Transporter = nodemailer.createTransport(smptTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD,
        }
    }));
    sendMail(mailOptions: Mail.Options) {
        return this.transporter.sendMail(mailOptions);
    }




}