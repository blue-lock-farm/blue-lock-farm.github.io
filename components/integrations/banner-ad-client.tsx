"use client";

import { useEffect, useRef } from "react";

export interface BannerAdConfig {
  key: string;
  width: number;
  height: number;
}

export function BannerAdClient({ desktop, mobile }: { desktop: BannerAdConfig; mobile: BannerAdConfig }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || host.childElementCount > 0) return;

    const conf = window.matchMedia("(min-width: 768px)").matches ? desktop : mobile;
    const options = document.createElement("script");
    options.text = `atOptions = { 'key': '${conf.key}', 'format': 'iframe', 'height': ${conf.height}, 'width': ${conf.width}, 'params': {} };`;
    const invoke = document.createElement("script");
    invoke.type = "text/javascript";
    invoke.src = `https://www.highrevenueformat.com/${conf.key}/invoke.js`;
    host.appendChild(options);
    host.appendChild(invoke);

    return () => {
      host.replaceChildren();
    };
  }, [desktop, mobile]);

  return <div ref={hostRef} data-banner-ad-slot />;
}
