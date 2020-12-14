import { createStandardRes } from './createStandardRes';
import { convertDomainToIp, convertIpToHostname } from './convertNetTarget';
import isDomain from './isDomain';
import { isIP } from 'net';

function getInvalidNetTarget(netTargetValue: string, netTargetType: string = 'network target') {
  const payload = {
    error: `An invalid ${netTargetType} was passed! ${netTargetValue} is not an accepted value.`
  };
  return createStandardRes(false, 400, payload, true);
}

// function getInvalidNetTargetArray(netTargetValue: string, index: number, netTargetType: string = 'network target') {
//   const payload = {
//     error: `An invalid ${netTargetType} was passed in index ${index}! ${netTargetValue} is not an accepted value.`
//   }
//   return createStandardRes(false, 400, payload);
// }

export async function getSingleNetTarget(netTarget: string) {

  if(isDomain(netTarget) || isIP(netTarget)) {
    return netTarget;
  } else {
    throw getInvalidNetTarget(netTarget);
  }

}

export async function getSingleIP(netTarget: string, attemptToTransform: boolean = false) {

  if(isIP(netTarget)) {
    return netTarget;
  } else if(attemptToTransform && isDomain(netTarget)) {
    return await convertDomainToIp(netTarget);
  } else {
    throw getInvalidNetTarget(netTarget, 'IP address');
  }

}

export async function getSingleDomain(netTarget: string, attemptToTransform: boolean = false) {

  if(isDomain(netTarget)) {
    return netTarget;
  } else if(attemptToTransform && isIP(netTarget)) {
    return await convertIpToHostname(netTarget);
  } else {
    throw getInvalidNetTarget(netTarget, 'domain name');
  }

}