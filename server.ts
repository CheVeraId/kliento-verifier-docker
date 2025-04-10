import { serve } from '@hono/node-server';
import klientoVerifier from '@veraid/kliento-verifier';

serve(
  {
    fetch: klientoVerifier.fetch,
    port: 3000,
  },
  (info) => {
    // eslint-disable-next-line no-console, putout/putout
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
