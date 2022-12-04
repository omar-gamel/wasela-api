import {
  Injectable,
  ArgumentMetadata,
  PipeTransform,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {

    // CHECK VALUE ( OBJECT - NOT_EMPTY )
    if (value instanceof Object && this.isEmpty(value))
      throw new HttpException('Validation failed: No body submitted', HttpStatus.BAD_REQUEST);

    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) return value;

    // CLASS VALIDATION
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0)
      throw new HttpException(`${this.formatErrors(errors)}`, HttpStatus.BAD_REQUEST);

    return value;
  };

  // CHECK METATYPE FUNCTION
  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find(type => metatype === type);
  };

  // FORMAT ERROR FUNCTION
  private formatErrors(errors: any[]) {
    return errors
      .map(err => {
        for (let property in err.constraints) {
          return err.constraints[property];
        }
      })
      .join(' - ');
  };

  // CHECK EMPTY OBJECT FUNCTION
  private isEmpty(value: any) {
    if (Object.keys(value).length > 0)
      return false;

    return true;
  };
}
