import { MiddlewareHandler } from "hono";
import { v2 as cloudinary } from "cloudinary";

interface Env {
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
}

export const cloudinaryMiddleware: MiddlewareHandler<{
  Bindings: Env;
}> = async (c, next) => {
  cloudinary.config({
    cloud_name: c.env.CLOUDINARY_CLOUD_NAME,
    api_key: c.env.CLOUDINARY_API_KEY,
    api_secret: c.env.CLOUDINARY_API_SECRET,
  });

  await next();
};
