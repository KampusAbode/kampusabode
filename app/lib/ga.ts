
// lib/ga.ts
export const GA_MEASUREMENT_ID = 'G-LTGR69WRJB'; // Replace with yours

// Optional: track pageviews manually
export const pageview = (url: string) => {
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};
