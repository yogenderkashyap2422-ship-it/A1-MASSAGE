import { useEffect, useRef } from 'react';

const AD_CLIENT = "pub-6192734500981777";

interface AdProps {
  slot: string;
  className?: string;
  format?: string;
  responsive?: boolean;
}

function BaseAd({ slot, className = '', format = 'auto', responsive = true }: AdProps) {
  const adInit = useRef(false);
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (adInit.current) return;
    
    const pushAd = () => {
      try {
        if (insRef.current && insRef.current.getAttribute('data-adsbygoogle-status') !== 'done') {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          adInit.current = true;
        }
      } catch (err) {
        console.error('AdSense error:', err);
      }
    };

    const timeoutId = setTimeout(pushAd, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className={`w-full flex justify-center overflow-hidden min-w-[300px] ${className}`}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minWidth: '300px' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      ></ins>
    </div>
  );
}

export function TopBannerAd() {
  return (
    <div className="bg-gray-900 py-2 border-b border-gray-800">
      <BaseAd slot="top-banner-slot" className="min-h-[90px]" />
    </div>
  );
}

export function BottomBannerAd() {
  return (
    <div className="bg-gray-900 py-2 border-t border-gray-800 fixed bottom-16 left-0 right-0 z-30 max-w-md mx-auto">
      <BaseAd slot="bottom-banner-slot" className="min-h-[50px]" />
    </div>
  );
}

export function InContentAd() {
  return (
    <div className="bg-gray-900 py-4 my-6 rounded-xl border border-gray-800 shadow-lg">
      <p className="text-xs text-gray-500 text-center mb-2 uppercase tracking-widest">Advertisement</p>
      <BaseAd slot="in-content-slot" format="fluid" className="min-h-[250px]" />
    </div>
  );
}
