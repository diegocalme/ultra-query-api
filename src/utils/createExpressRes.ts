import devPrint from '../utils/devPrint';

interface ExpressResponse {
  success: boolean;
  status: number;
  data?: object,
  error?: object
}

export function createExpressRes(success: boolean, status: number, data?: object): ExpressResponse {
  
  devPrint(data, process.env.ABIPDB_KEY);

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