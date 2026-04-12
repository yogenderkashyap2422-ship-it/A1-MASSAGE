import { useEffect } from 'react';

export function AdBanner() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className="w-full flex justify-center bg-gray-50 py-2 border-t border-gray-100">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '50px' }}
        data-ad-client="ca-pub-6192734500981777"
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
