export default class CustomErrors {
  static getInvalidNetTarget = function(netTargetValue: string, netTargetType: string = 'network target'): object {
    return {
      success: false,
      status: 400,
      error: `An invalid ${netTargetType} was passed! ${netTargetValue} is not an accepted value.`
    }
  }
  static getInvalidNetTargetArray = function(netTargetValue: string, index: number, netTargetType: string = 'network target'): object {
    return {
      success: false,
      status: 400,
      error: `An invalid ${netTargetType} was passed in index ${index}! ${netTargetValue} is not an accepted value.`
    }
  }
}
