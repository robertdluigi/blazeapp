'use client';
import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdSense = () => {
  useEffect(() => {
    const loadAdSenseScript = () => {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6623976898591052`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);

      script.onload = () => {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
          console.error(err);
        }
      };
    };

    if (!window.adsbygoogle) {
      loadAdSenseScript();
    } else {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', width: '300px', height: '600px' }}
      data-ad-client="ca-pub-6623976898591052"
      data-ad-slot="9013089895"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

export default AdSense;