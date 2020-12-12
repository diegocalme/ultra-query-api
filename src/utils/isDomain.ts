export default function isDomain(input: string): boolean {
  // Regex obtained from https://stackoverflow.com/questions/8959765/need-regex-to-get-domain-subdomain/8959842
  // Modified for it to support TLDs with two or more characters
  return new RegExp(/([a-z0-9]+\.)*[a-z0-9]+\.[a-z]{2,}/).test(input);
}