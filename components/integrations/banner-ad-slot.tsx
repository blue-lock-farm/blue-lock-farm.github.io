import { integrations } from "@/config/integrations";
import { BannerAdClient, type BannerAdConfig } from "./banner-ad-client";

export function BannerAdSlot() {
  if (integrations.ads.provider !== "adsterra") return null;

  const desktop: BannerAdConfig = { key: integrations.ads.bannerDesktopKey, width: 728, height: 90 };
  const mobile: BannerAdConfig = { key: integrations.ads.bannerMobileKey, width: 320, height: 50 };

  return (
    <aside
      className="flex w-full flex-col items-center gap-1 py-4 min-h-[74px] md:min-h-[122px]"
      aria-label="Advertisement"
    >
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Advertisement</p>
      <div className="flex w-full justify-center">
        <BannerAdClient desktop={desktop} mobile={mobile} />
      </div>
    </aside>
  );
}
