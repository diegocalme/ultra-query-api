import { createStandardRes, StandardResPayload, PRESET_SRV_ERROR, PRESET_ERR_TARGET_UNREACHABLE } from '../utils/createStandardRes';
import { exec } from '../utils/promiseChildProcess';
import os from 'os';

export async function getPing(netTarget: string) {
  try {

    let payload: StandardResPayload = {
      error: 'Host platform not supported'
    };

    switch(os.platform()) {
      case 'darwin':
      case 'linux':
        payload = {
          average: (await exec(`ping -c 4 ${netTarget}`)).stdout
        };
        break;
      default:
        // UNSUPHOST = unsuported host
        throw createStandardRes(false, 500, payload, true);
    }

    return createStandardRes(true, 200, payload);

  } catch(error) {

    // gotta make this big mess prettier...
    if(error.isApiError) {
      // API generated error
      throw error;
    } else if(error.code && error.code === 2) {
      // Specific error code for unreachable target
      throw createStandardRes(...PRESET_ERR_TARGET_UNREACHABLE);
    } else if(error.stderr) {
      // Generic error that output something
      const payload: StandardResPayload = {
        error: error.stderr
      };
      throw createStandardRes(false, 400, payload);
    } else {
      // Something went wrong!
      throw createStandardRes(...PRESET_SRV_ERROR);
    }
  }

}