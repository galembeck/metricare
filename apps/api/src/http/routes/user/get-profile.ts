import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { NotFoundError } from "@/handlers/errors/not-found-error";
import { UserException } from "@/handlers/exceptions/user";
import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";

// biome-ignore lint/suspicious/useAwait: required by @fastify
export async function getProfileRoute(app: FastifyInstance) {
	app
		.register(auth)
		.withTypeProvider<ZodTypeProvider>()
		.get(
			"/users/me",
			{
				schema: {
					tags: ["User"],
					summary: "/users/me",
					description: "Get the authenticated user's profile",
					security: [{ bearerAuth: [] }],
					response: {
						200: z.object({
							user: z.object({
								id: z.string(),
								name: z.string(),
								email: z.email(),
								document: z.string(),
								createdAt: z.date(),
								updatedAt: z.date(),
							}),
						}),
					},
				},
			},
			async (request, reply) => {
				const userId = await request.getCurrentUserId();

				const user = await prisma.user.findUnique({
					where: { id: userId },
					select: {
						id: true,
						name: true,
						email: true,
						document: true,
						createdAt: true,
						updatedAt: true,
					},
				});

				if (!user) {
					throw new NotFoundError(
						"User not found",
						UserException.USER_NOT_FOUND,
						"The authenticated user no longer exists."
					);
				}

				return reply.status(200).send({ user });
			}
		);
}
