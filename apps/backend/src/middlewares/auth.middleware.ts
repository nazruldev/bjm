import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { MiddlewareHandler } from 'hono';

const jwks = createRemoteJWKSet(new URL('https://bw5awx.logto.app/oidc/jwks'));

type AuthOptions = {
  requiredScopes?: string[];
  requiredRoles?: string[];
  optional?: boolean; // Jika true, token boleh kosong (untuk public route)
};

export const authMiddleware = (options: AuthOptions = {}): MiddlewareHandler => {
  return async (c, next) => {
    const authHeader = c.req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      if (options.optional) return await next(); // Public route
      return c.text('Unauthorized', 401);
    }

    try {
      const { payload } = await jwtVerify(token, jwks, {
        issuer: 'https://bw5awx.logto.app/oidc',
        audience: 'http://localhost:8004/api/v1/posts',
      });

      const scopeList = (payload.scope as string || '').split(' ');
      const roles = Array.isArray(payload.role) ? payload.role : [payload.role || ''];

      if (options.requiredScopes?.length) {
        const hasScopes = options.requiredScopes.every(s => scopeList.includes(s));
        if (!hasScopes) return c.text('Forbidden (missing scopes)', 403);
      }

      if (options.requiredRoles?.length) {
        const hasRoles = options.requiredRoles.every(r => roles.includes(r));
        if (!hasRoles) return c.text('Forbidden (missing roles)', 403);
      }

      // Simpan user info
      c.set('user', {
        id: payload.sub,
        scope: scopeList,
        roles,
        raw: payload,
      });

      await next();
    } catch (err) {
      return c.text('Invalid token', 401);
    }
  };
};
