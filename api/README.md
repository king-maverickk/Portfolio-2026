# api

The Azure Function behind the "Start a project" form on the Freelance / contract sheet.

`POST /api/contact` checks what the visitor typed and emails it to you through Azure Communication Services (ACS) Email. Replying to that email goes straight to the visitor.

The site deploys as an Azure Static Web App, which runs this folder as its managed API. The workflow in `.github/workflows` points at it with `api_location: "api"`, and `public/staticwebapp.config.json` asks for the Node 20 runtime.

## What the form sends

```json
{
  "name": "Alex Rivera",
  "email": "alex@example.com",
  "kind": "portfolio | business | redesign | build-from-design | other",
  "currentSite": "optional",
  "message": "optional",
  "company": ""
}
```

`company` is a honeypot. People never see it, so when it is filled in the function answers `200` and sends nothing.

| Status | Meaning |
| --- | --- |
| `200` `{ "ok": true }` | Sent (or a bot was quietly dropped) |
| `400` | Missing or invalid fields; `fields` says which |
| `413` | Request larger than 20 KB |
| `500` | The email could not be sent; check the function logs |

## One-time setup in Azure

1. Create an **Azure Communication Services** resource, then an **Email Communication Service** with a domain. An Azure-managed domain (`...azurecomm.net`) works without DNS changes.
2. Connect that domain to the ACS resource (Email > Domains in the ACS portal).
3. In the Static Web App, open **Settings > Environment variables** and add:

| Name | Value |
| --- | --- |
| `ACS_CONNECTION_STRING` | The ACS resource's connection string (Keys) |
| `CONTACT_SENDER_ADDRESS` | A sender on the connected domain, e.g. `DoNotReply@<guid>.azurecomm.net` |
| `CONTACT_TO_ADDRESS` | The inbox that should receive enquiries |

Until these are set the form shows its error message, and the function log says which setting is missing.

## Run it locally

Needs [Azure Functions Core Tools](https://learn.microsoft.com/azure/azure-functions/functions-run-local) v4.

```bash
cd api
npm install
cp local.settings.json.example local.settings.json   # then fill in the three values
```

Run the site and the function together from the repo root, so `/api/contact` resolves like it does in production:

```bash
npx @azure/static-web-apps-cli start http://localhost:3000 --run "npm start" --api-location api
```

Then open http://localhost:4280.

## Tests

```bash
cd api
npm test
```

The tests cover validation, the honeypot, header-injection cleanup and every status code. They replace the email sender, so nothing is sent.

## Files

```
api/
├── host.json
├── package.json
├── local.settings.json.example   copy to local.settings.json (git-ignored)
├── src/
│   ├── functions/contact.js      registers POST /api/contact
│   └── lib/
│       ├── validate.js           checks and cleans the form, builds the email text
│       ├── contactHandler.js     the request handler (takes the sender as an argument)
│       └── sendMail.js           sends through ACS Email
└── test/contact.test.js
```
