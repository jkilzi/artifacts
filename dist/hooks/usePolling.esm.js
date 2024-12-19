import React from 'react';
import useSwr, { useSWRConfig } from 'swr';
import * as uuid from 'uuid';
import { LONG_REFRESH_INTERVAL } from '../constants.esm.js';

const usePolling = (fn, delayMs = LONG_REFRESH_INTERVAL, continueRefresh, maxErrorRetryCount = 3) => {
  const config = useSWRConfig();
  const prevFn = React.useRef(fn);
  const uniqueKey = React.useMemo(() => {
    return uuid.v4();
  }, []);
  const [error, setError] = React.useState();
  const isInitalLoad = React.useRef(true);
  const { data, isLoading } = useSwr(uniqueKey, fn, {
    refreshInterval: (value_) => {
      return !continueRefresh || continueRefresh(value_) ? delayMs : 0;
    },
    shouldRetryOnError: true,
    onErrorRetry: (curError, _key, _config, revalidate, { retryCount }) => {
      if (isInitalLoad.current || retryCount >= maxErrorRetryCount) {
        setError(curError);
      } else {
        setTimeout(() => revalidate({ retryCount }), delayMs);
      }
    },
    onSuccess: () => {
      isInitalLoad.current = false;
    }
  });
  const restart = React.useCallback(
    () => config.mutate(uniqueKey),
    [config, uniqueKey]
  );
  React.useEffect(() => {
    if (prevFn.current !== fn) {
      restart();
      prevFn.current = fn;
    }
  }, [fn, restart]);
  React.useEffect(() => {
    return () => config.cache.delete(uniqueKey);
  }, []);
  return {
    value: data,
    error,
    loading: isLoading,
    restart
  };
};

export { usePolling as default };
//# sourceMappingURL=usePolling.esm.js.map
