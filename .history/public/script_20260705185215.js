const button = document.getElementById("startBtn");
const status = document.getElementById("status");
const loader = document.getElementById("loader");

button.addEventListener("click", () => {
  button.disabled = true;
  loader.hidden = false;
  status.textContent = "Preparing your visit report...";

  const params = new URLSearchParams();
  params.set(
    "screenResolution",
    `${window.screen.width}x${window.screen.height}`,
  );
  params.set("colorDepth", String(window.screen.colorDepth || "unknown"));
  params.set("viewport", `${window.innerWidth}x${window.innerHeight}`);
  params.set(
    "deviceMemory",
    navigator.deviceMemory ? String(navigator.deviceMemory) : "unknown",
  );
  params.set(
    "hardwareConcurrency",
    navigator.hardwareConcurrency
      ? String(navigator.hardwareConcurrency)
      : "unknown",
  );
  params.set("touchSupport", navigator.maxTouchPoints > 0 ? "true" : "false");
  params.set("cookiesEnabled", navigator.cookieEnabled ? "true" : "false");
  params.set("doNotTrack", navigator.doNotTrack || "unknown");
  params.set("locale", navigator.language || "unknown");
  params.set(
    "connectionType",
    navigator.connection?.effectiveType || "unknown",
  );

  window.location.assign(`/api/redirect?${params.toString()}`);
});
