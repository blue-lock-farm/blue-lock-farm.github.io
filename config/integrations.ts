import type { IntegrationConfig } from "./types";
import generatedIntegrationsRaw from "../content/generated/integrations.json";

type GeneratedIntegrations = {
  gaMeasurementId?: string | null;
  googleSiteVerification?: string | null;
  bingSiteVerification?: string | null;
};

const generatedIntegrations = generatedIntegrationsRaw as GeneratedIntegrations;

const bannerDesktopKey = process.env.NEXT_PUBLIC_ADSTERRA_BANNER_DESKTOP_KEY?.trim()
  || "9d7bb328090c5df6b4ce2cce7f302681";
const bannerMobileKey = process.env.NEXT_PUBLIC_ADSTERRA_BANNER_MOBILE_KEY?.trim()
  || "43bd0cf850f4171d1d3a9099b5383042";
const adScriptUrl = process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_SCRIPT_URL?.trim()
  || "https://pl31604686.profitableratecpmnetwork.com/847c925d7bea17f7349fe18b2e9c79ed/invoke.js";
const adContainerId = process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_CONTAINER_ID?.trim()
  || "container-847c925d7bea17f7349fe18b2e9c79ed";
const socialBarScriptUrl = process.env.NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_URL?.trim()
  || "https://pl31604687.profitableratecpmnetwork.com/a8/73/30/a873302e56cca8ab30d80ab2234fed5b.js";

const hasAds = Boolean(bannerDesktopKey && bannerMobileKey && adScriptUrl && adContainerId && socialBarScriptUrl);

const gaFromEnv = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "";
const gaFromGenerated = typeof generatedIntegrations.gaMeasurementId === "string"
  ? generatedIntegrations.gaMeasurementId.trim()
  : "";
const gaMeasurementId = gaFromEnv || gaFromGenerated || "";

const googleFromEnv = process.env.GOOGLE_SITE_VERIFICATION?.trim() || "";
const googleFromGenerated = typeof generatedIntegrations.googleSiteVerification === "string"
  ? generatedIntegrations.googleSiteVerification.trim()
  : "";
const googleVerification = googleFromEnv || googleFromGenerated || null;

const bingFromEnv = process.env.BING_SITE_VERIFICATION?.trim() || "";
const bingFromGenerated = typeof generatedIntegrations.bingSiteVerification === "string"
  ? generatedIntegrations.bingSiteVerification.trim()
  : "";
const bingVerification = bingFromEnv || bingFromGenerated || null;

export const integrations: IntegrationConfig = {
  analytics: /^G-[A-Z0-9]+$/i.test(gaMeasurementId)
    ? { provider: "google-analytics", measurementId: gaMeasurementId.toUpperCase() }
    : { provider: "none" },
  ads: hasAds
    ? {
        provider: "adsterra",
        bannerDesktopKey,
        bannerMobileKey,
        nativeScriptUrl: adScriptUrl,
        nativeContainerId: adContainerId,
        socialBarScriptUrl,
      }
    : { provider: "none" },
  verification: {
    google: googleVerification,
    bing: bingVerification,
  },
};
