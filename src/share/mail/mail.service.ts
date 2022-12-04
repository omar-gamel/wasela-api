import { Injectable } from '@nestjs/common';
import * as config from 'config';
import * as nodeMailer from 'nodemailer';
import * as sendgridTransport from 'nodemailer-sendgrid-transport';

const transporterObj = {
    host: config.get('MAIL.HOST'),
    port: config.get('MAIL.PORT'),
    auth: {
        user: config.get('MAIL.USER'),
        pass: config.get('MAIL.PASS')
    }
};

const transporterObj2 = sendgridTransport({
    auth: {
        api_key: config.get('MAIL.API_KEY')
    }
});
const transporter = nodeMailer.createTransport(transporterObj);

@Injectable()
export class MailService {
    async sendEmail(input: { from: string, to: string, subject: string, html?: string }): Promise<void> {
        await transporter.sendMail({
            from: input.to,
            to: input.to,
            subject: input.subject,
            html: input.html
        });
    };
}

