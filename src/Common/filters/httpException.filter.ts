import { Catch, HttpException, ArgumentsHost, Logger, HttpStatus } from "@nestjs/common";
import { GqlExceptionFilter } from "@nestjs/graphql";

interface ErrorResponse {
  code: number,
  message: string,
  success: boolean
};

@Catch()
export class HttpExceptionFilter implements GqlExceptionFilter {

  catch(exception: unknown, host: ArgumentsHost): ErrorResponse {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const code =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message.message
        : 'Internal server error';

    if (!request) { // If GraphQL API
      if (exception instanceof HttpException) {
        // Exception Error
        const message = typeof (exception.message) === 'object' ? exception.message.message : exception.message;
        Logger.error(message);
        return { code, message, success: false };
      }
      // Unnown Exception
      Logger.error('Internal server error');
      return { code, message: 'Internal server error', success: false };
    } else { // If REST API 
      response.status(code).json({
        code,
        message,
        success: false,
        path: request.url,
        timestamp: new Date().toISOString()
      });
    }
  }
}
