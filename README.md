# Ultra Query API

An API for querying information about (public) network resources.

## Request Format

### Headers:

- Authorization: \<string; API key\>

### Body:

For every request you make to the API, you must include a valid **network target** (or netTarget, as you may find around in the code or other parts of the documentation).

In order to pass the network target, you send a JSON object as the body of your request with the following structure:

```json
{
	"netTarget": <string; domain or IP address>
}
```

This is the base object that needs to be sent for each request, but for other endpoints like  **/api** you may add optional properties to change behaviors. Refer to the specific section for each endpoint.

The API only accept a single IPv4, IPv6, or domain name as the input for "netTarget", being restricted by what each endpoint support. If you pass an invalid value, you will get a response like the following, with 400 Bad Request as the HTTP code:

```json
{
	"success": false,
	"status": 400,
	"data": {
		"error": "An invalid domain name was passed! googlecom is not an accepted value."
	},
	"isApiError": true
}
```

- The **"isApiError"** property SOMETIMES show, but is not part of the standard. You should not use this field for anything in your API implementation, as it's appearance may vary. This is an internal usage property for handling errors more effectively.

----

## Response Format

Depending on the endpoint you send the request to, you will get back a single object or an array of objects as a response with the following structure:

```json
{
	"success": <boolean>,
	"status": <number; an HTTP-like status code>,
	"data": <object or array>
}
```

_(Disclaimer: there is a modifier that applies for the **/api** endpoint for sacrificing this structure in favor of tagging each result with the name of their service. Refer to the specific section of that endpoint for more information.)_

In the "**data**" property you will get the result of the operation: either the requested information if the request succeeded, or a more verbose explanation of why the request failed. Depending whether the request was successful or not, you will get one of these structures (you can guide yourself with the value of the **success** property):

**On success:**

{
	...
	"data": <object or array; the structure is specific to each service>
}


**On failure:**

```json
{
	...
	"data": {
	"error": <string; description about the error>
	}
}
```

For more information of the response of each service, refer to the endpoints section.

----

## Endpoints

### GET: /api

This endpoint returns an array with the results of all the services obtainable through this API. It also has some extra capabilities that the other endpoints lack of (due to their nature): tagging and filtering queried services.

**Sample request body:**

```json
{
	"netTarget": <string; domain or IP address>,
	"tagging": <boolean; optional>,
	"services": <array; optional>
}
```

For the filtering property you may put any of the following values, in the order you prefer: **["abuse",  "ipv4",  "ipv6",  "mx",  "hostnames",  "geolocation",  "harmreport"]**.  

 - You can also include **"virustotal"** in the list of services. This is not included by default since it's pretty long and heavyweight compared to the rest of the response (~10kb compared to the ~1.6kb of the rest of the default response).
 - If you don't tag the result, the order in which they will be returned will match the order of the elements added in the **services** array.
 - If you don't list the requested services, the order in which they will appear will match the order of the available filters specified up.

**Sample request and successful response (unfiltered and untagged):**

Request body:

```json
{
	"netTarget": "google.com"
}
```

Response:

```json
[
	{
		"success": true,
		"status": 200,
		"data": {
			"ipAddress": "172.217.2.142",
			"isPublic": true,
			"ipVersion": 4,
			"isWhitelisted": null,
			"abuseConfidenceScore": 0,
			"countryCode": "US",
			"usageType": "Data Center/Web Hosting/Transit",
			"isp": "Google LLC",
			"domain": "google.com",
			"hostnames": [
				"mia09s18-in-f14.1e100.net",
				"yyz08s14-in-f142.1e100.net"
			],
			"totalReports": 0,
			"numDistinctUsers": 0,
			"lastReportedAt": null
		}
	},
	{
		"success": true,
		"status": 200,
		"data": [
			"142.250.64.238"
		]
	},
	{
		"success": true,
		"status": 200,
		"data": [
			"2607:f8b0:4008:803::200e"
		]
	},
	...
]
```

**Sample request and successful response (filtered and untagged):**

Request body:

```json
{
	"netTarget": "google.com",
	"services": ["ipv6", "ipv4"]
}
```

Response:

```json
[
	{
		"success": true,
		"status": 200,
		"data": [
			"2607:f8b0:4008:801::200e"
		]
	},
	{
		"success": true,
		"status": 200,
		"data": [
			"172.217.8.142"
		]
	}
]
```

**Sample request and successful response (filtered and tagged):**

Request body:

```json
{
	"netTarget": "google.com",
	"services": ["ipv6", "ipv4"],
	"tagged": true
}
```

Response:

```json
{
	"ipv6": {
		"success": true,
		"status": 200,
		"data": [
			"2607:f8b0:4008:801::200e"
		]
	},
	"ipv4": {
		"success": true,
		"status": 200,
		"data": [
			"172.217.8.142"
		]
	}
}
```

---

**Sample request and failed response (filtered and tagged; target not found):**

Request body:

```json
{
	"netTarget": "google.comasd",
	"services": ["ipv6", "ipv4"],
	"tagged": true
}
```

Response:

```json
{
	"ipv6": {
		"success": false,
		"status": 404,
		"data": {
		"error": "ENOTFOUND"
		}
	},
	"ipv4": {
		"success": false,
		"status": 404,
		"data": {
		"error": "ENOTFOUND"
		}
	}
}
```

---

### GET: /api/abuse

**Allows: domain names and IP addresses.**

This endpoint allows you to get a full abuses report of the network resource coming from AbuseIPDB.

**Sample request and successful response:**

Request body:

```json
{
	"netTarget": "google.com"
}
```

Response:

```json
{
	"success": true,
	"status": 200,
	"data": {
		"ipAddress": "74.125.135.102",
		"isPublic": true,
		"ipVersion": 4,
		"isWhitelisted": null,
		"abuseConfidenceScore": 0,
		"countryCode": "US",
		"usageType": "Data Center/Web Hosting/Transit",
		"isp": "Google LLC",
		"domain": "google.com",
		"hostnames": [
		"pl-in-f102.1e100.net"
		],
		"totalReports": 0,
		"numDistinctUsers": 0,
		"lastReportedAt": null
	}
}
```

**Sample request and failed response (filtered and tagged; not found):**

Request body:

```json
{
	"netTarget": "google.comasd"
}
```

Response:

```json
{
	"success": false,
	"status": 404,
	"data": {
		"error": "ENOTFOUND"
	}
}
```

---

### GET: /api/dns/ipv4

**Allows: domain names.**

This endpoint allows you to get all the IPv4 addresses registered as an A registry in the DNS records of a domain.

**Sample request and successful response:**

Request body:

```json
{
	"netTarget": "google.com"
}
```

Response:

```json
{
	"success": true,
	"status": 200,
	"data": [
		"74.125.135.102",
		"74.125.135.113",
		"74.125.135.139",
		"74.125.135.100",
		"74.125.135.101",
		"74.125.135.138"
	]
}
```

**Sample request and failed response (filtered and tagged; not found):**

Request body:

```json
{
	"netTarget": "google.comasd"
}
```

Response:

```json
{
	"success": false,
	"status": 404,
	"data": {
		"error": "ENOTFOUND"
	}
}
```

---

### GET: /api/dns/ipv6

**Allows: domain names.**

This endpoint allows you to get all the IPv6 addresses registered as an AAAA registry in the DNS records of a domain.

**Sample request and successful response:**

Request body:

```json
{
	"netTarget": "google.com"
}
```

Response:

```json
{
	"success": true,
	"status": 200,
	"data": [
		"2607:f8b0:400e:c01::71",
		"2607:f8b0:400e:c01::8a",
		"2607:f8b0:400e:c01::64",
		"2607:f8b0:400e:c01::65"
	]
}
```

**Sample request and failed response (filtered and tagged; not found):**

Request body:

```json
{
	"netTarget": "google.comasd"
}
```

Response:

```json
{
	"success": false,
	"status": 404,
	"data": {
		"error": "ENOTFOUND"
	}
}
```

---

### GET: /api/dns/ip

**Allows: domain names.**

This endpoint allows you to get all the IPv4 and IPv6 addresses registered as registries in the DNS records of a domain.

**Sample request and successful response (tagged):**

Request body:

```json
{
	"netTarget": "google.com",
	"tagged": true
}
```

Response:

```json
{
	"ipv4": {
		"success": true,
		"status": 200,
		"data": [
			"74.125.135.100",
			"74.125.135.101",
			"74.125.135.138",
			"74.125.135.102",
			"74.125.135.113",
			"74.125.135.139"
		]
	},
	"ipv6": {
		"success": true,
		"status": 200,
		"data": [
			"2607:f8b0:400e:c01::8a",
			"2607:f8b0:400e:c01::64",
			"2607:f8b0:400e:c01::65",
			"2607:f8b0:400e:c01::71"
		]
	}
}
```

**Sample request and failed response (filtered and tagged; not found):**

Request body:

```json
{
	"netTarget": "google.comasd"
}
```

Response:

```json
{
	"ipv4": {
		"success": false,
		"status": 404,
		"data": {
			"error": "ENOTFOUND"
		}
	}
	"ipv6": {
		"success": false,
		"status": 404,
		"data": {
			"error": "ENOTFOUND"
		}
	}
}
```

---

### GET: /api/dns/mx

**Allows: domain names.**

This endpoint allows you to get all the MX (mail exchange) entries registered as MX registries in the DNS records of a domain.

**Sample request and successful response:**

Request body:

```json
{
	"netTarget": "google.com"
}
```

Response:

```json
{
	"success": true,
	"status": 200,
	"data": [
		{
			"exchange": "aspmx.l.google.com",
			"priority": 10
		}
		{
			"exchange": "alt4.aspmx.l.google.com",
			"priority": 50
		},
		{
			"exchange": "alt1.aspmx.l.google.com",
			"priority": 20
		},
		{
			"exchange": "alt2.aspmx.l.google.com",
			"priority": 30
		},
		{
			"exchange": "alt3.aspmx.l.google.com",
			"priority": 40
		}
	]
}
```

**Sample request and failed response (filtered and tagged; not found):**

Request body:

```json
{
  "netTarget": "google.comasd"
}
```

Response:

```json
{
	"success": false,
	"status": 404,
	"data": {
		"error": "ENOTFOUND"
	}
}
```

---

### GET: /api/dns/hostnames

**Allows: IP addresses.**

This endpoint allows you to get the hostnames related to an IP address. Also known as reverse lookup.

**Sample request and successful response:**

Request body:

```json
{
	"netTarget": "google.com"
}
```

Response:

```json
{
	"success": true,
	"status": 200,
	"data": [
"pl-in-f138.1e100.net"
	]
}
```

**Sample request and failed response (filtered and tagged; not found):**

Request body:

```json
{
  "netTarget": "google.comasd"
}
```

Response:

```json
{
	"success": false,
	"status": 404,
	"data": {
"error": "ENOTFOUND"
	}
}
```

---

### GET: /api/dns/reverse

Same as **/api/dns/hostnames**.

---

### GET: /api/geolocation

**Allows: domain names and IP addresses.**

This endpoint allows you to get the geolocation information about a public network resource. Not completely accurate, since it's according to the IP partitioning.

**Sample request and successful response:**

Request body:

```json
{
	"netTarget": "google.com"
}
```

Response:

```json
{
	"success": true,
	"status": 200,
	"data": {
"range": [
	1249738752,
	1249746943
],
"country": "US",
"region": "",
"eu": "0",
"timezone": "America/Chicago",
"city": "",
"ll": [
	37.751,
	-97.822
]
"metro": 0,
"area": 1000
	}
}
```

**Sample request and failed response (filtered and tagged; not found):**

Request body:

```json
{
	"netTarget": "google.comasd"
}
```

Response:

```json
{
	"success": false,
	"status": 404,
	"data": {
"error": "ENOTFOUND"
	}
}
```

---

### GET: /api/virustotal/analysis

**Allows: domain names and IP addresses.**

This endpoint allows you to get a full harm report from VirusTotal for the designated network resource.

**Sample request and successful response:**

Request body:

```json
{
	"netTarget": "google.com"
}
```

Response:

```json
{
	"success": true,
	"status": 200,
	"data": {
"type": "url",
"id": "cf4b367e49bf0b22041c6f065f4aa19f3cfe39c8d5abc0617343d1a66c6a26f5",
"categories": {
	"Comodo Valkyrie Verdict": "mobile communications",
	"Forcepoint ThreatSeeker": "search engines and portals",
	"sophos": "search engines"
},
"first_submission_date": 1276511498,
"html_meta": {
	"description": [
"Search the world's information, including webpages, images, videos and more. Google has many special features to help you find exactly what you're looking for."
	],
	"robots": [
"noodp"
	]
}
"last_analysis_date": 1607981755,
...
	}
}
```

**Sample request and failed response (filtered and tagged; not found):**

Request body:

```json
{
	"netTarget": "google.comasd"
}
```

Response:

```json
{
	"success": false,
	"status": 404,
	"data": {
"error": "Not Found"
	}
}
```

---

### GET: /api/virustotal/analysis/:filter

**Allows: domain names and IP addresses.**

This endpoint allows you to get one of the elements returned in the full harm report from VirusTotal for the designated network resource. 

**Sample request and successful response:**

(using **"categories"** as the filter)

Request body:
```json
{
	"netTarget": "google.com"
}
```

Response:
```json
{
	"success": true,
	"status": 200,
	"data": {
"Comodo Valkyrie Verdict": "mobile communications",
"Forcepoint ThreatSeeker": "search engines and portals",
"sophos": "search engines"
	}
}
```

**Sample request and failed response (filtered and tagged; not found):**

Request body:

```json
{
	"netTarget": "google.comasd"
}
```

Response:

```json
{
	"success": false,
	"status": 404,
	"data": {
"error": "Not Found"
	}
}
```

----

## Other errors

When a request is made to a non-existant resource or to an existant resource with a unsupported HTTP method.

### Resource not found

**Response:**

```json
{
	"success": false,
	"status": 404,
	"data": {
"error": "Resource not found"
	}
}
```

### Request body malformed

When the request body contains something that breaks the functionting of the application.

**Response:**

```json
{
	"success": false,
	"status": 400,
	"data": {
"error": "Request information is malformed!"
	}
}
```

### Internal Error

Something happened... Not a lot of details known, other than it is (probably) not the end user's fault.

**Response:**

```json
{
	"success": false,
	"status": 500,
	"data": {
"error": "Internal Error!"
	}
}
```