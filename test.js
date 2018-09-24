var data = "{\"ip\":\"77.136.84.98\",\"port\":\"2121\",\"time\":\"1537816243\",\"data\":\"R0VUIC8gSFRUUC8xLjENClVwZ3JhZGUtSW5zZWN1cmUtUmVxdWVzdHM6IDENClVzZXItQWdlbnQ6IE1vemlsbGEvNS4wIChMaW51eDsgQW5kcm9pZCA4LjAuMDsgU00tRzk1NTAgQnVpbGQvUjE2TlcpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS82OS4wLjM0OTcuMTAwIE1vYmlsZSBTYWZhcmkvNTM3LjM2DQpBY2NlcHQ6IHRleHQvaHRtbCxhcHBsaWNhdGlvbi94aHRtbCt4bWwsYXBwbGljYXRpb24veG1sO3E9MC45LGltYWdlL3dlYnAsaW1hZ2UvYXBuZywqLyo7cT0wLjgNCkFjY2VwdC1FbmNvZGluZzogZ3ppcCwgZGVmbGF0ZQ0KQWNjZXB0LUxhbmd1YWdlOiBmci1GUixmcjtxPTAuOSxlbi1VUztxPTAuOCxlbjtxPTAuNw0KUmFuZ2U6IGJ5dGVzPTEzMC0xMzANCklmLVJhbmdlOiAiM2Y4MGYtMWI2LTNlMWNiMDNiIg0KSG9zdDogMi43LjIuNzMNCkNvbm5lY3Rpb246IGtlZXAtYWxpdmUNCg0K\"}";

var json = JSON.parse(data);
var location = {
    "country": 12,
    "city": "osleifjsoeifj",
    "region": "response.region"
  };
json.location = location;
console.log(json);