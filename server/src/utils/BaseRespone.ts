// utils/BaseResponse.ts

export default class BaseResponse<T> {
  errorCode: number;
  message: string;
  data?: T;

  constructor(errorCode: number, message: string, data?: T) {
    this.errorCode = errorCode;
    this.message = message;
    this.data = data;
  }

  static success<T>(data: T, message = 'Success'): BaseResponse<T> {
    return new BaseResponse(200, message, data);
  }

  static error<T>(data: T, message = 'Something went wrong'): BaseResponse<T> {
    return new BaseResponse(400, message, data);
  }
}
