import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";

export class ErrorHandler {
  static error(c: Context, status: number = 401, err?: any) {
    return c.json({
      success: false,
      message: err?.message || 'Unknown error',          // Ambil dari err
      ...(err?.errors ? { errors: err.errors } : {}),     // Sertakan detail errors jika ada
      stack: process.env.NODE_ENV === 'production' ? null : err?.stack,  // Stack trace hanya di dev
    }, status as StatusCode | any);
  }

  static notFound(c: Context) {
    return c.json({
      success: false,
      message: `Not Found - [${c.req.method}] ${c.req.url}`,
    }, 404);
  }
}
