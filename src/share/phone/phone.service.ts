import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as config from 'config';

const TWILIO_SERVICE_ID = config.get('TWILIO.SERVICE_ID');
const TWILIO_ACCOUNT_SID = config.get('TWILIO.ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = config.get('TWILIO.AUTH_TOKEN');
const TWILIO_FROM = config.get('TWILIO.FROM');

const twilio = require('twilio');

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, { 
    lazyLoading: true 
}); 

@Injectable()
export class PhoneService {
    async sendAuthMsg(to: string, channel: string = 'sms'): Promise<void> {
        await client
            .verify
            .services(TWILIO_SERVICE_ID)
            .verifications
            .create({
                to: `+${to}`,
                channel: channel === 'call' ? 'call' : 'sms'
            });
    };

    async verifyPhoneNumber(phoneNumber: string, code: string): Promise<void> {
        const data = await client
            .verify
            .services(TWILIO_SERVICE_ID)
            .verificationChecks
            .create({
                to: `+${phoneNumber}`,
                code: code
            });
        if (data.status !== "approved")
            throw new HttpException('Wrong phone number or code :(', HttpStatus.BAD_REQUEST);

    };

    async sendMessage(to: string, body: string): Promise<void> {
        await client.messages
            .create({
                to: `+${to}`,
                body: body,
                from: TWILIO_FROM
            });
    };
}

 