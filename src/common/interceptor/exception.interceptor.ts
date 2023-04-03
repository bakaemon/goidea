import { NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from "@nestjs/common";
import { Observable, catchError, throwError } from "rxjs";

export class ExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(err => {
        if (err instanceof HttpException) {
          console.log(err);
          return;
        }
        console.log(err);
        return throwError(err);
      })
    );
  }
}