import { integrations } from "@/config/integrations";
import { NativeAdClient } from "./native-ad-client";

export function NativeAdSlot() {
  if (integrations.ads.provider !== "adsterra") return null;

  return (
    <aside className="flex w-full flex-col items-center gap-1 py-4" aria-label="Sponsored">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Sponsored</p>
      <div className="w-full">
        <NativeAdClient
          scriptUrl={integrations.ads.nativeScriptUrl}
          containerId={integrations.ads.nativeContainerId}
        />
      </div>
    </aside>
  );
}
