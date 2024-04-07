import { createClient, cacheExchange, fetchExchange } from '@urql/core';

export const client = createClient({
  url: `${import.meta.env.VITE_API_URL}`,
  exchanges: [cacheExchange, fetchExchange],
});
 