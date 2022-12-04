import { Injectable, ArgumentMetadata, PipeTransform, HttpException, HttpStatus } from '@nestjs/common';
import PhoneNumber from 'awesome-phonenumber';

@Injectable()
export class PhoneNumberValidationPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        if (!value.phone)
            throw new HttpException('Invalid phone number', HttpStatus.BAD_REQUEST);

        const pn = new PhoneNumber(`+${value.phone}`);
        if (!pn.isValid())
            throw new HttpException('Invalid phone number', HttpStatus.BAD_REQUEST);

        value.phone = pn.getNumber();
        return value
    }
}  