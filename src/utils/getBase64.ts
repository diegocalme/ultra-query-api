export function getBase64(input: string) {
  return Buffer.from(input).toString('base64');
}

export function getBase64Trimmed(input: string) {
  // Regex obtained from:
  // https://stackoverflow.com/questions/6555182/remove-all-special-characters-except-space-from-a-string-using-javascript
  
  return Buffer.from(input).toString('base64').replace(RegExp(/[=]/, 'g'), '');
}