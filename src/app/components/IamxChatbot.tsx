"use client";

import Script from "next/script";

const IAMX_CHARACTER_ID = "9362a584-3003-4e9b-9388-836b720f1962";

export function IamxChatbot() {
  return <Script
    id="iamx-website-assistant"
    src="https://iamxlive.com/iamx-widget.js"
    data-character={IAMX_CHARACTER_ID}
    data-template="floating"
    data-size="compact"
    data-open="minimized"
    data-accent="#197fb5"
    strategy="afterInteractive"
  />;
}
