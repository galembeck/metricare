/** biome-ignore-all lint/suspicious/useAwait: required by @fastify */

import type { FastifyInstance } from "fastify";
import { fastifyPlugin } from "fastify-plugin";
import { UnauthorizedError } from "@/handlers/errors/unauthorized-error";
import { AuthException } from "@/handlers/exceptions/auth";

/**
 * Decorates every request with `getCurrentUserId`, which verifies the JWT and
 * returns the authenticated user's id. Throws `UnauthorizedError` when the
 * token is missing or invalid. Register it on any route that needs auth.
 */
export const auth = fastifyPlugin(async (app: FastifyInstance) => {
	app.addHook("preHandler", async (request) => {
		request.getCurrentUserId = async () => {
			try {
				const { sub } = await request.jwtVerify<{ sub: string }>();

				return sub;
			} catch {
				throw new UnauthorizedError(
					"Unauthorized",
					AuthException.INVALID_TOKEN,
					"The authentication token is missing or invalid."
				);
			}
		};
	});
});
