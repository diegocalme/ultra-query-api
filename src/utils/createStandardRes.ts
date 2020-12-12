export type StandardResPayload = object | any[] | undefined;
type DefaultErrorConfigs = [boolean, number, StandardResPayload];

export const PRESET_ERR_SRV_MISCONFIG: DefaultErrorConfigs = [false, 500, { error: 'Server misconfiguration!' }];

interface StandardRes {
  success: boolean,
  status: number,
  data: StandardResPayload
}

const defaultPayload: StandardResPayload = {
  error: 'An unknown error occured!'
}

export function createStandardRes(success: boolean = false, status: number = 400, payload: StandardResPayload = defaultPayload): StandardRes {

  return {
    success,
    status,
    data: payload
  };

}