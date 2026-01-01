# NS Supplement - Cashfree Payment Backend

Express server for Cashfree payment gateway integration.

## Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

## Environment Variables

No environment variables needed - credentials are in code for testing.

## Endpoints

- `GET /` - Health check
- `POST /api/create-order` - Create Cashfree order
- `POST /api/verify-payment` - Verify payment status

## Local Development

```bash
npm install
npm start
```

Server runs on port 3000 (or PORT env variable).
