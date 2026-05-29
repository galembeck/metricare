import fastifyJwt from "@fastify/jwt";
import { fastify } from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { errorHandler } from "@/handlers/error-handler";
import { UserException } from "@/handlers/exceptions/user";
import { prisma } from "@/lib/prisma";
import { createAccountRoute } from "./create-account";

vi.mock("@/lib/prisma", () => ({
	prisma: {
		user: {
			findUnique: vi.fn(),
			create: vi.fn(),
		},
	},
}));

const mockFindUnique = vi.mocked(prisma.user.findUnique);
const mockCreate = vi.mocked(prisma.user.create);

async function buildApp() {
	const app = fastify();
	app.setValidatorCompiler(validatorCompiler);
	app.setSerializerCompiler(serializerCompiler);
	app.setErrorHandler(errorHandler);
	await app.register(fastifyJwt, { secret: "test-secret" });
	await app.register(createAccountRoute);
	await app.ready();
	return app;
}

const validBody = {
	name: "John Doe",
	email: "john@example.com",
	document: "12345678901",
	password: "correct-password",
};

describe("POST /users", () => {
	let app: Awaited<ReturnType<typeof buildApp>>;

	beforeEach(async () => {
		vi.clearAllMocks();
		app = await buildApp();
	});

	it("returns 201 and creates the user when the payload is valid", async () => {
		mockFindUnique.mockResolvedValue(null);
		mockCreate.mockResolvedValueOnce({
			id: "user-id-1",
			name: validBody.name,
			email: validBody.email,
			document: validBody.document,
			passwordHash: "hashed",
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		const response = await app.inject({
			method: "POST",
			url: "/users",
			body: validBody,
		});

		expect(response.statusCode).toBe(201);
		expect(mockCreate).toHaveBeenCalledTimes(1);
	});

	it("returns 400 with EMAIL_ALREADY_REGISTERED when the email is taken", async () => {
		mockFindUnique.mockResolvedValueOnce({
			id: "user-id-1",
			name: validBody.name,
			email: validBody.email,
			document: validBody.document,
			passwordHash: "hashed",
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		const response = await app.inject({
			method: "POST",
			url: "/users",
			body: validBody,
		});

		expect(response.statusCode).toBe(400);
		expect(response.json().message).toBe(
			UserException.EMAIL_ALREADY_REGISTERED
		);
		expect(mockCreate).not.toHaveBeenCalled();
	});

	it("returns 400 with DOCUMENT_ALREADY_REGISTERED when the document is taken", async () => {
		mockFindUnique.mockResolvedValueOnce(null).mockResolvedValueOnce({
			id: "user-id-2",
			name: "Jane Doe",
			email: "jane@example.com",
			document: validBody.document,
			passwordHash: "hashed",
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		const response = await app.inject({
			method: "POST",
			url: "/users",
			body: validBody,
		});

		expect(response.statusCode).toBe(400);
		expect(response.json().message).toBe(
			UserException.DOCUMENT_ALREADY_REGISTERED
		);
		expect(mockCreate).not.toHaveBeenCalled();
	});

	it("returns 400 validation error when required body fields are missing", async () => {
		const response = await app.inject({
			method: "POST",
			url: "/users",
			body: {},
		});

		expect(response.statusCode).toBe(400);
		expect(mockCreate).not.toHaveBeenCalled();
	});

	it("returns 400 validation error when the password is too short", async () => {
		const response = await app.inject({
			method: "POST",
			url: "/users",
			body: { ...validBody, password: "123" },
		});

		expect(response.statusCode).toBe(400);
		expect(mockCreate).not.toHaveBeenCalled();
	});
});
