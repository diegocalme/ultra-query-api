interface ApiEntry {
  endpoint: string;
  key: string
}

export let ABIPDB_API: ApiEntry = {
  endpoint: 'https://api.abuseipdb.com/api/v2/check',
  key: <string>(process.env.ABIPDB_KEY)
};

export let VTOTAL_API: ApiEntry = {
  endpoint: 'https://www.virustotal.com/api/v3/urls',
  key: <string>(process.env.VTOTAL_KEY)
};