import { createExpressRes, ExpressResponse } from '../utils/createExpressRes';

export default class CustomErrors {
  static getInvalidNetTarget = function(netTargetValue: string, netTargetType: string = 'network target'): ExpressResponse {
    const errorMessage = `An invalid ${netTargetType} was passed! ${netTargetValue} is not an accepted value.`;
    return createExpressRes(false, 400, { error: errorMessage });
  }
  static getInvalidNetTargetArray = function(netTargetValue: string, index: number, netTargetType: string = 'network target'): ExpressResponse {
    const errorMessage = `An invalid ${netTargetType} was passed in index ${index}! ${netTargetValue} is not an accepted value.`;
    return createExpressRes(false, 400, { error: errorMessage });
  }
}
