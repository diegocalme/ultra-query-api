import devPrint from '../utils/devPrint';

interface Response {
  success: boolean;
  status: number;
  data?: object,
  error?: object
}

export function createExpressRes(success: boolean, status: number, data?: object): Response {
  
  devPrint(data);

  // This function allows to standarize the Express response
  // and make changes in the morphology easier.
  if(success) {
    return {
      success,
      status,
      data
    }
  } else {
    return {
      success,
      status,
      error: data
    }
  }
}