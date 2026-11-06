'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { DASHBOARD_HTML } from '../lib/dashboardHtml';

export default function HomePage() {
  const [scaleReady, setScaleReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.initAegisOS) {
      window.initAegisOS();
    }
  }, []);

  return (
    <>
      <div
        id="aegis-nextjs-root"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: DASHBOARD_HTML }}
      />
      <Script
        src="/scale.js"
        strategy="afterInteractive"
        onReady={() => setScaleReady(true)}
      />
      {scaleReady && (
        <Script
          src="/app.js"
          strategy="afterInteractive"
          onReady={() => {
            if (typeof window !== 'undefined' && window.initAegisOS) {
              window.initAegisOS();
            }
          }}
        />
      )}
    </>
  );
}
