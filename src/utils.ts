import { useEffect } from "react";

type ClickOutsideCallback = (event: MouseEvent) => void;

export function useOnClickOutside<T>(
  ref: React.RefObject<T>,
  handler: ClickOutsideCallback
) {
  useEffect(() => {
    const cb = (event: MouseEvent) => {
      // TODO(dcramer): fix any type here
      if (!ref.current || !(ref.current as any).contains(event.target)) {
        handler(event);
      }
    };
    document.addEventListener("click", cb);
    return () => {
      document.removeEventListener("click", cb);
    };
  }, [ref, handler]);
}

export const sortBy = (arr: any[], comp: (any) => any): any[] => {
  return arr.sort((a, b) => {
    const aComp = comp(a);
    const bComp = comp(b);
    if (aComp < bComp) {
      return -1;
    }
    if (aComp > bComp) {
      return 1;
    }
    return 0;
  });
};

type Page = {
  context: {
    title?: string;
    sidebar_title?: string;
    sidebar_order?: number;
  };
};

export const sortPages = (
  arr: any,
  extractor: (any) => Page = n => n
): any[] => {
  return arr.sort((a, b) => {
    a = extractor(a);
    b = extractor(b);
    const aso = a.context.sidebar_order >= 0 ? a.context.sidebar_order : 10;
    const bso = b.context.sidebar_order >= 0 ? b.context.sidebar_order : 10;
    if (aso > bso) return 1;
    else if (bso > aso) return -1;
    return (a.context.sidebar_title || a.context.title).localeCompare(
      b.context.sidebar_title || b.context.title
    );
  });
};

const formatTrackingValue = input => {
  if (input === 'true') return '1';
  if (input === 'false') return '0';
  return undefined;
};


export function startSandbox({ scenario, projectSlug, errorType }: {
  scenario?: string,
  projectSlug?: string,
  errorType?: string,
} = {}) {
  const url = new URL('https://try.sentry-demo.com/demo/start/');

  let trackingValue;

  try {
    const key = 'trackingConsent';
    const stored = localStorage.getItem(key);
    
    trackingValue = formatTrackingValue(stored);
  } catch (error) {
    // Noop, localStorage is either not supported or denied by privacy settings.
    trackingValue = '0';
  }

  if (trackingValue) url.searchParams.append('acceptedTracking', trackingValue);

  if (scenario) url.searchParams.append('scenario', scenario);

  if (projectSlug) url.searchParams.append('projectSlug', projectSlug);

  if (errorType) url.searchParams.append('errorType', errorType);
   url.searchParams.append('source', 'docs');


  const marketingParams = marketingUrlParams();
  const marketingParamStr = marketingParams.toString();
  if (marketingParamStr) url.searchParams.append('extraQueryString', marketingParamStr);

  window.open(url.toString(), '_blank');
};

const marketingUrlParams = (): URLSearchParams | null => {
  const params = new URLSearchParams(window.location.search);
  
  const marketingParams = new URLSearchParams();
  params.forEach((value, key) => {
    if ([/utm_/i, /promo_/i, /gclid/i].find(matcher => matcher.test(key))) {
      marketingParams.append(key, value);
    }
  });

  return marketingParams;
};

