"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __adsterraSocialBarLoaded?: boolean;
  }
}

export function SocialBarClient({ scriptUrl }: { scriptUrl: string }) {
  useEffect(() => {
    if (window.__adsterraSocialBarLoaded) return;
    window.__adsterraSocialBarLoaded = true;
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    document.body.appendChild(script);
  }, [scriptUrl]);

  return null;
}
