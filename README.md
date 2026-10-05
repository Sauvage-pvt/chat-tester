# Chat Tester — Cloudflare Worker

Cloudflare Worker som scraper bedriftsdata og støtter AI-chat-demo.

## Setup

### 1. Cloudflare API-token

1. Gå til Cloudflare Dashboard → Account → API Tokens
2. Klikk **Create Token**
3. Velg template: **Edit Cloudflare Workers**
4. Klikk **Use template**
5. Klikk **Create Token**
6. Kopier tokenet

### 2. GitHub Secrets

1. Gå til din GitHub-repo → Settings → Secrets and variables → Actions
2. Klikk **New repository secret**
3. Lag to secrets:

   **Secret 1:**
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: (paste tokenet fra Cloudflare)

   **Secret 2:**
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: (fra Cloudflare Dashboard → Account → ID)

### 3. Deploy

**Manuelt (første gang):**
```bash
npm install -g wrangler
wrangler deploy
```

**Automatisk:**
- Push til `main` branch → GitHub Actions deployer automatisk

## Bruk

```
https://bedriftssok.lenkemotor.workers.dev/chat-tester?bedrift=Løwe+Mekaniske&url=https://lowemekaniske.no
```

## Respons

```json
{
  "success": true,
  "bedrift": "Løwe Mekaniske",
  "data": {
    "tjenester": ["Bilreparasjon", "Vedlikehold"],
    "telefon": "67521122",
    "email": "kontakt@lowemekaniske.no",
    "aapningstider": ""
  }
}
```
