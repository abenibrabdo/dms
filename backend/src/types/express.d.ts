import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    locale?: string;
  }
}

import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request {
    requestId?: string;
  }
}

