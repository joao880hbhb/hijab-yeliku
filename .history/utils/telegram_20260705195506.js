import dotenv from "dotenv";

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export function formatTelegramReport(report) {
  // Format comprehensive visitor report with security and device details.
  const vpnStatus = report.vpn ? "Yes" : "No";
  const proxyStatus = report.proxy ? "Yes" : "No";
  const torStatus = report.tor ? "Yes" : "No";
  const hostingStatus = report.hosting ? "Yes" : "No";
  const mobileStatus = report.mobile ? "Yes" : "No";

  return [
    "━━━━━━━━━━━━━━━━━━━━━━🚨 New Visitor━━━━━━━━━━━━━━━━━━━━━━",
    "",
    "🕒 Time",
    `${new Date(report.time).toLocaleString("id-ID", { timeZone: report.timezone })} (${report.timezone})",
    "",
    "🌍 IP & Location",
    `IP        : ${report.ip}`,
    `Location  : ${report.country}, ${report.region}, ${report.city}`,
    `Postal    : ${report.postal}`,
    `Coords    : ${report.latitude}, ${report.longitude}`,
    "",
    "🌐 Network",
    `ISP       : ${report.isp}`,
    `ASN       : ${report.asn}`,
    `Org       : ${report.org}`,
    "",
    "🛡 Security",
    `VPN       : ${vpnStatus}`,
    `Proxy     : ${proxyStatus}`,
    `Tor       : ${torStatus}`,
    `Hosting   : ${hostingStatus}`,
    `Abuse Reports : ${report.abuseReports}`,
    "",
    "💻 Device & Browser",
    `Device    : ${report.deviceType} (${report.brand} ${report.model})`,
    `OS        : ${report.os} ${report.osVersion}`,
    `Browser   : ${report.browser} ${report.browserVersion}`,
    `Mobile    : ${mobileStatus}`,
    "",
    "🖥 Display & Network",
    `Resolution: ${report.screen}`,
    `Color     : ${report.colorDepth}-bit`,
    `Viewport  : ${report.viewport}`,
    `Language  : ${report.language}`,
    `Connection: ${report.connectionType}`,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
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
