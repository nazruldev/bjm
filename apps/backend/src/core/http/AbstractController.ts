import { Context } from 'hono';
import type { StatusCode } from 'hono/utils/http-status';

export class AbstractController {
    /**
     * Mengirim response JSON sukses dengan tambahan data.
     * @param context Hono Context
     * @param data Data yang ingin dikirim di response
     * @param status HTTP status code, default 200 OK
     * @example
     * return this.json(c, { user: { id: 1, name: 'John' } });
     */
    protected json(context: Context, data: any, status: StatusCode = 200) {
        return context.json({ success: true, ...data }, status as any);
    }

    /**
     * Mengirim response JSON error dengan pesan dan optional errors detail.
     * @param context Hono Context
     * @param message Pesan error
     * @param status HTTP status code, default 400 Bad Request
     * @param errors Detail error opsional
     * @example
     * return this.error(c, 'Invalid input', 422, { field: 'email', message: 'Email required' });
     */
    protected error(context: Context, message: string, status: StatusCode = 400, errors?: any) {
        return context.json({
            success: false,
            message,
            errors,
        }, status as any);
    }

    /**
     * Shortcut untuk response 404 Not Found.
     * @param context Hono Context
     * @example
     * return this.notFound(c);
     */
    protected notFound(context: Context) {
        return this.error(context, 'Not Found', 404);
    }

    /**
     * Mengambil path parameter dari URL.
     * @param context Hono Context
     * @param name Nama parameter path yang ingin diambil, jika tidak diberikan akan mengambil semua param sebagai object
     * @example
     * // URL: /posts/123
     * const id = this.param(c, 'id');
     *
     * // URL: /posts/123/comments/456
     * const params = this.param(c); // { id: '123', commentId: '456' }
     */
    protected param(context: Context, name?: string) {
        return name ? context.req.param(name) : context.req.param();
    }

    /**
     * Mengambil query parameter dari URL.
     * @param context Hono Context
     * @param name Nama query parameter yang ingin diambil, jika tidak diberikan akan mengambil semua query sebagai object
     * @example
     * // URL: /search?q=hono
     * const q = this.query(c, 'q');
     *
     * // URL: /search?q=hono&limit=10
     * const queries = this.query(c);
     */
    protected query(context: Context, name?: string) {
        return name ? context.req.query(name) : context.req.query();
    }

    /**
     * Mengambil query parameter yang memiliki multiple values (array).
     * @param context Hono Context
     * @param name Nama query parameter
     * @example
     * // URL: /search?tags=js&tags=node
     * const tags = this.queries(c, 'tags'); // ['js', 'node']
     */
    protected queries(context: Context, name: string) {
        return context.req.queries(name);
    }

    /**
     * Mengambil header HTTP.
     * @param context Hono Context
     * @param name Nama header yang ingin diambil, jika tidak diberikan akan mengembalikan semua header dalam bentuk object lowercase
     * @example
     * const userAgent = this.header(c, 'User-Agent');
     * const allHeaders = this.header(c);
     */
    protected header(context: Context, name?: string) {
        return name ? context.req.header(name) : context.req.header();
    }

    /**
     * Mengambil dan parsing JSON body request.
     * @param context Hono Context
     * @throws Error jika body bukan JSON valid
     * @example
     * const body = await this.jsonBody(c);
     */
    protected async jsonBody(context: Context) {
        try {
            return await context.req.json();
        } catch {
            throw new Error('Invalid JSON body');
        }
    }

    /**
     * Mengambil dan parsing plain text body request.
     * @param context Hono Context
     * @throws Error jika body bukan text valid
     * @example
     * const body = await this.textBody(c);
     */
    protected async textBody(context: Context) {
        try {
            return await context.req.text();
        } catch {
            throw new Error('Invalid text body');
        }
    }

    /**
     * Mengambil dan parsing FormData dari body request.
     * @param context Hono Context
     * @throws Error jika body bukan FormData valid
     * @example
     * const formData = await this.formDataBody(c);
     */
    protected async formDataBody(context: Context) {
        try {
            return await context.req.formData();
        } catch {
            throw new Error('Invalid FormData body');
        }
    }

    /**
     * Parsing body dengan opsi khusus (misal parse multi file atau dot notation).
     * @param context Hono Context
     * @param options Opsi parsing, seperti { all: true, dot: true }
     * @throws Error jika body invalid
     * @example
     * const body = await this.parseBody(c, { all: true, dot: true });
     */
    protected async parseBody(context: Context, options?: any) {
        try {
            return await context.req.parseBody(options);
        } catch {
            throw new Error('Invalid body');
        }
    }


    /**
     * Mengambil path route yang terdaftar (registered path).
     * @param context Hono Context
     * @example
     * const route = this.routePath(c);
     * // e.g. "/posts/:id"
     */
    protected routePath(context: Context) {
        return context.req.routePath;
    }

    /**
     * Mengambil array routes yang cocok dengan request (debugging purpose).
     * @param context Hono Context
     * @example
     * const routes = this.matchedRoutes(c);
     */
    protected matchedRoutes(context: Context) {
        return context.req.matchedRoutes;
    }

    /**
     * Mengambil pathname dari request URL.
     * @param context Hono Context
     * @example
     * const pathname = this.path(c);
     * // e.g. "/about/me"
     */
    protected path(context: Context) {
        return context.req.path;
    }

    /**
     * Mengambil full URL dari request.
     * @param context Hono Context
     * @example
     * const fullUrl = this.url(c);
     * // e.g. "http://localhost:8787/about/me"
     */
    protected url(context: Context) {
        return context.req.url;
    }

    /**
     * Mengambil HTTP method dari request.
     * @param context Hono Context
     * @example
     * const method = this.method(c);
     * // e.g. "GET"
     */
    protected method(context: Context) {
        return context.req.method;
    }

    /**
     * Mengambil objek Request asli (raw) untuk platform tertentu (misal Cloudflare Workers).
     * @param context Hono Context
     * @example
     * const rawReq = this.rawRequest(c);
     */
    protected rawRequest(context: Context) {
        return context.req.raw;
    }
}
