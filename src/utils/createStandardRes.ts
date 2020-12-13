export type StandardResPayload = object | any[] | undefined;
export type StandardResError = [false, number, StandardResPayload];

interface StandardRes {
  success: boolean,
  status: number,
  data: StandardResPayload,
  isApiError?: boolean
}

export const PRESET_ERR_SRV_MISCONFIG: StandardResError = [false, 500, { error: 'Server misconfiguration!' }];
export const PRESET_ERR_TARGET_UNREACHABLE: StandardResError = [false, 400, { error: 'Timeout! The target is either dead or unreachable by the host.' }];
export const PRESET_SRV_ERROR: StandardResError = [false, 500, { error: 'Internal Error!' }];
export const PRESET_RESRC_NOT_FOUND: StandardResError = [false, 404, { error: 'Resource not found' }];

const defaultPayload: StandardResPayload = {
  error: 'An unknown error occured!'
}

export function createStandardRes(success: boolean = false, status: number = 400, payload: StandardResPayload = defaultPayload, isApiError?: boolean): StandardRes {

  return {
    success,
    status,
    data: payload,
    isApiError
  };

}