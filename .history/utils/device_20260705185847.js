import { UAParser } from "ua-parser-js";

export function parseDevice(userAgent, extras = {}) {
  // Parse the browser, OS, and device information from the incoming user agent.
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  return {
    browser: {
      name: result.browser.name || "Unknown",
      version: result.browser.version || "Unknown",
    },
    engine: {
      name: result.engine.name || "Unknown",
    },
    os: {
      name: result.os.name || "Unknown",
      version: result.os.version || "Unknown",
    },
    device: {
      type: result.device.type || "Desktop",
      brand: result.device.vendor || "Unknown",
      model: result.device.model || "Unknown",
    },
    platform: result.os.name || "Unknown",
    language: extras.locale || "Unknown",
    cookiesEnabled: extras.cookiesEnabled || "unknown",
    doNotTrack: extras.doNotTrack || "unknown",
    screenResolution: extras.screenResolution || "unknown",
    colorDepth: extras.colorDepth || "unknown",
    viewport: extras.viewport || "unknown",
    deviceMemory: extras.deviceMemory || "unknown",
    hardwareConcurrency: extras.hardwareConcurrency || "unknown",
    touchSupport: extras.touchSupport || "unknown",
    mobile: /android|iphone|ipad|mobile/i.test(userAgent),
    tablet: /ipad|tablet/i.test(userAgent),
    connectionType: extras.connectionType || "unknown",
  };
}
