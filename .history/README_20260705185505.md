# Visitor Analytics Redirect

A production-ready visitor analytics landing page and redirect endpoint designed for Vercel. It collects browser and device metadata, performs IP-based geolocation, sends a Telegram report, and redirects visitors to a WhatsApp link.

## Features

- Responsive glassmorphism landing page
- Node.js + Express server
- Serverless-ready Vercel deployment
- Visitor IP, geolocation, browser, device, and timing metadata
- Telegram notification via fetch()
- Rate limiting, Helmet, compression, and dotenv-based configuration
- Graceful failure handling so redirects still happen even if Telegram or geolocation fails

## Project Structure

```text
/
├── api/
│   └── redirect.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── utils/
│   ├── device.js
│   ├── ip.js
│   ├── location.js
│   └── telegram.js
├── package.json
├── vercel.json
├── .env.example
└── README.md
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
cp .env.example .env
```

3. Fill in your Telegram credentials and WhatsApp destination.

4. Start locally:

```bash
npm run dev
```

5. Open http://localhost:3000

## Vercel Deployment

1. Push the project to GitHub.
2. Import it into Vercel.
3. Add the environment variables from .env.example in the Vercel project settings.
4. Deploy.

## Notes

- The API endpoint is available at /api/redirect.
- The landing page is served from /.
- The endpoint intentionally redirects quickly after capturing data.
