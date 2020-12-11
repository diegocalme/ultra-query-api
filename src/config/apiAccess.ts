interface ApiEntry {
  endpoint: string;
  key: string
}

export let ABIPDB: ApiEntry = {
  endpoint: 'https://api.abuseipdb.com/api/v2/check',
  key: <string>(process.env.ABIPDB_KEY)
};

export let VTOTAL: ApiEntry = {
  endpoint: 'https://api.abuseipdb.com/api/v2/check',
  key: <string>(process.env.VTOTAL_KEY)
};