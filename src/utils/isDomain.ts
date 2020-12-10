export default function isDomain(input: string): boolean {
  // Regex obtained from https://stackoverflow.com/questions/10306690/what-is-a-regular-expression-which-will-match-a-valid-domain-name-without-a-subd
  // Modification to accept subdomains: (?:([a-zA-Z0-9]{1,}\.)).
  return new RegExp(/^(?:([a-zA-Z0-9]{1,}\.))[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/).test(input);
}