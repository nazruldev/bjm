import { authMiddleware } from "@middleware/auth.middleware";
import { PostController } from "../controllers";
import { Hono } from "hono";

const api = new Hono().basePath('/api/v1')

// api.post('/posts',  authMiddleware({optional:true}),(c) => PostController.create(c));
api.post('/posts',(c) => PostController.create(c));
export { api }
