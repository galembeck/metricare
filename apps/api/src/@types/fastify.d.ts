import "fastify";
import "@fastify/jwt";

declare module "fastify" {
	export interface FastifyRequest {
		getCurrentUserId(): Promise<string>;
	}
}

declare module "@fastify/jwt" {
	interface FastifyJWT {
		payload: { sub: string };
		user: { sub: string };
	}
}
