import { compare } from "bcryptjs";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { BadRequestError } from "@/handlers/errors/bad-request-error";
import { AuthException } from "@/handlers/exceptions/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_SESSION_EXPIRATION = "7d";
const EXTENDED_SESSION_EXPIRATION = "30d";

// biome-ignore lint/suspicious/useAwait: required by @fastify
export async function authenticateWithPasswordRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/auth/sessions/password",
		{
			schema: {
				tags: ["Auth"],
				summary: "/auth/sessions/password",
				description: "Authenticate using an user's e-mail and password",
				body: z.object({
					identifier: z.string(),
					password: z.string(),
					keepAlive: z.boolean(),
				}),
				response: {
					200: z.object({
						accessToken: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { identifier, password, keepAlive } = request.body;

			const user = await prisma.user.findFirst({
				where: {
					OR: [{ email: identifier }, { document: identifier }],
				},
			});

			if (!user) {
				throw new BadRequestError(
					"Invalid credentials",
					AuthException.INVALID_CREDENTIALS,
					"The e-mail, document or password is incorrect."
				);
			}

			if (user.passwordHash === null) {
				throw new BadRequestError(
					"Invalid credentials",
					AuthException.USER_HAS_NO_PASSWORD,
					"The user does not have a password set, use social login."
				);
			}

			const isPasswordValid = await compare(password, user.passwordHash);

			if (!isPasswordValid) {
				throw new BadRequestError(
					"Invalid credentials",
					AuthException.INVALID_CREDENTIALS,
					"The e-mail, document or password is incorrect."
				);
			}

			const accessToken = await reply.jwtSign(
				{
					sub: user.id,
				},
				{
					sign: {
						expiresIn: keepAlive
							? EXTENDED_SESSION_EXPIRATION
							: DEFAULT_SESSION_EXPIRATION,
					},
				}
			);

			return reply.status(200).send({ accessToken });
		}
	);
}
