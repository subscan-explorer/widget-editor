export const evalUtils = {
  url:
    typeof location === 'undefined'
      ? new URL('https://subscan.io')
      : new URL(location.href),
};
