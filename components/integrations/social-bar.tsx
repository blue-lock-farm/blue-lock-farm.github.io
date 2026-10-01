import { integrations } from "@/config/integrations";
import { SocialBarClient } from "./social-bar-client";

export function SocialBar() {
  if (integrations.ads.provider !== "adsterra") return null;
  return <SocialBarClient scriptUrl={integrations.ads.socialBarScriptUrl} />;
}
