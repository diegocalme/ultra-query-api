import { createStandardRes } from './createStandardRes';

export function verifyApiKeyExistance(apiKey: string) {

  const payload = {
    error: 'Host misconfiguration'
  };
  if(!apiKey) throw createStandardRes(false, 500, payload, true);

}