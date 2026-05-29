import { hash } from "bcryptjs";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { BadRequestError } from "@/handlers/errors/bad-request-error";
import { UserException } from "@/handlers/exceptions/user";
import { prisma } from "@/lib/prisma";

const PASSWORD_SALT_ROUNDS = 6;

// biome-ignore lint/suspicious/useAwait: required by @fastify
export async function createAccountRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/users",
		{
			schema: {
				tags: ["User"],
				summary: "/users",
				description: "Register a new user by creating its account",
				body: z.object({
					name: z.string(),
					email: z.email(),
					document: z.string(),
					password: z.string().min(6),
				}),
			},
		},
		async (request, reply) => {
			const { name, email, document, password } = request.body;

			const userWithSameEmail = await prisma.user.findUnique({
				where: { email },
			});

			if (userWithSameEmail) {
				throw new BadRequestError(
					"Invalid registration",
					UserException.EMAIL_ALREADY_REGISTERED,
					"The e-mail is already registered."
				);
			}

			const userWithSameDocument = await prisma.user.findUnique({
				where: { document },
			});

			if (userWithSameDocument) {
				throw new BadRequestError(
					"Invalid registration",
					UserException.DOCUMENT_ALREADY_REGISTERED,
					"The document is already registered."
				);
			}

			const passwordHash = await hash(password, PASSWORD_SALT_ROUNDS);

			await prisma.user.create({
				data: {
					name,
					email,
					document,
					passwordHash,
				},
			});

			return reply.status(201).send();
		}
	);
}
