import { useEffect, useState } from 'react';

type Banner = {
  title?: string;
  subtitle?: string;
};

export function useHomeBanner() {
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch(
          'https://www.lajustaunlp.com.ar/api/banner'
        );
        const json = await res.json();

        setBanner(json?.[0] ?? null);
      } catch (e) {
        console.error(e);
      }
    };

    fetchBanner();
  }, []);

  return banner;
}