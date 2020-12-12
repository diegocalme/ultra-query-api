import { ABIPDB_API as API } from '../config/apiAccess';
import axios from 'axios';

export async function getFullReport(netTarget: string) {

  // Axios request config
  const requestConfig = {
    headers: {
      Accept: 'application/json',
      Key: API.key
    },
    params: {
      ipAddress: netTarget
    }
  };

  // Only a single IP was passed
  const { data, status } = await axios.get(API.endpoint, requestConfig);

  if(status === 422) {
    // Axios usually throws a 422 HTTP response when passed unvalid input,
    // at least for this API.
    throw new Error('An invalid network target was passed!');
  } else {
    return { 
      success: true,
      status,
      data: data.data 
    };
  }

}