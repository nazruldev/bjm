import { ZodSchema, ZodError } from 'zod'
import { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'

export class ValidationException extends HTTPException {
    public errors: { path: string; message: string }[]

    constructor(errors: { path: string; message: string }[]) {
        super(422, { message: 'Validation Error' })
        this.errors = errors
    }
}

export async function validate<T>(ctx: Context, schema: ZodSchema<T>): Promise<T> {
    try {
        const body = await ctx.req.json()
        return schema.parse(body)
    } catch (err) {
        if (err instanceof ZodError) {
            const errors = err.issues.map(issue => ({
                path: issue.path.join('.'),
                message: issue.message,
            }))
            throw new ValidationException(errors)
        }
        throw new HTTPException(500, { message: 'Unexpected Error' })
    }
}
