import { PostController } from "../controllers";

import { Hono } from "hono";


const auth = new Hono().basePath('/api/v1')
// api.get('/posts', (c) => PostController.list(c));


export { auth }
