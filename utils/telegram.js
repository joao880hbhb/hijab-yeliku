import dotenv from "dotenv";

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export function formatTelegramReport(report) {
  // Build the Telegram notification using the collected visitor payload.
  return [
    "🚨 New Visitor",
    "",
    `Time: ${report.time}`,
    `Local Time: ${report.localTime}`,
    `IP: ${report.ip}`,
    `Forwarded For: ${report.forwardedFor || "Unknown"}`,
    `Country: ${report.country}`,
    `Region: ${report.region}`,
    `City: ${report.city}`,
    `ISP: ${report.isp}`,
    `ASN: ${report.asn}`,
    `VPN/Proxy: ${report.vpn}`,
    `Browser: ${report.browser} ${report.browserVersion}`,
    `OS: ${report.os} ${report.osVersion}`,
    `Device: ${report.deviceType} ${report.brand} ${report.model}`,
    `Language: ${report.language}`,
    `Screen: ${report.screen}`,
    `Timezone: ${report.timezone}`,
  ].join("\n");
}

export async function sendTelegramReport(message) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return null;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Telegram send failed with status ${response.status}`);
  }

  return response.json();
}
