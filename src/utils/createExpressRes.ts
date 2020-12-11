import devPrint from '../utils/devPrint';

interface MessageShape {
  data?: object | undefined;
  error?: string | undefined;
}

export interface ExpressResponse {
  success: boolean;
  status: number;
  data?: object;
  error?: object | string;
}

export function createExpressRes(success: boolean, status: number, message: MessageShape): ExpressResponse {
  
  devPrint(message);

  // This function allows to standarize the Express response
  // and make changes in the morphology easier.
  if(success) {
    return {
      success,
      status,
      data: message.data
    }
  } else {
    return {
      success,
      status,
      error: message.error
    }
  }
}