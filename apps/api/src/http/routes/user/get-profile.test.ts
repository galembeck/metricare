import fastifyJwt from "@fastify/jwt";
import { fastify } from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { errorHandler } from "@/handlers/error-handler";
import { AuthException } from "@/handlers/exceptions/auth";
import { UserException } from "@/handlers/exceptions/user";
import { prisma } from "@/lib/prisma";
import { getProfileRoute } from "./get-profile";

vi.mock("@/lib/prisma", () => ({
	prisma: {
		user: {
			findUnique: vi.fn(),
		},
	},
}));

const mockFindUnique = vi.mocked(prisma.user.findUnique);

async function buildApp() {
	const app = fastify();
	app.setValidatorCompiler(validatorCompiler);
	app.setSerializerCompiler(serializerCompiler);
	app.setErrorHandler(errorHandler);
	await app.register(fastifyJwt, { secret: "test-secret" });
	await app.register(getProfileRoute);
	await app.ready();
	return app;
}

async function signToken(
	app: Awaited<ReturnType<typeof buildApp>>,
	sub: string
) {
	return await app.jwt.sign({ sub });
}

describe("GET /users/me", () => {
	let app: Awaited<ReturnType<typeof buildApp>>;

	beforeEach(async () => {
		vi.clearAllMocks();
		app = await buildApp();
	});

	it("returns 200 with the authenticated user's profile", async () => {
		const createdAt = new Date();
		const updatedAt = new Date();
		mockFindUnique.mockResolvedValueOnce({
			id: "user-id-1",
			name: "John Doe",
			email: "john@example.com",
			document: "12345678901",
			createdAt,
			updatedAt,
		});

		const token = await signToken(app, "user-id-1");

		const response = await app.inject({
			method: "GET",
			url: "/users/me",
			headers: { authorization: `Bearer ${token}` },
		});

		expect(response.statusCode).toBe(200);
		expect(response.json().user).toMatchObject({
			id: "user-id-1",
			name: "John Doe",
			email: "john@example.com",
			document: "12345678901",
		});
		expect(response.json().user).not.toHaveProperty("passwordHash");
	});

	it("returns 401 with INVALID_TOKEN when no token is provided", async () => {
		const response = await app.inject({
			method: "GET",
			url: "/users/me",
		});

		expect(response.statusCode).toBe(401);
		expect(response.json().message).toBe(AuthException.INVALID_TOKEN);
		expect(mockFindUnique).not.toHaveBeenCalled();
	});

	it("returns 401 with INVALID_TOKEN when the token is malformed", async () => {
		const response = await app.inject({
			method: "GET",
			url: "/users/me",
			headers: { authorization: "Bearer not-a-real-token" },
		});

		expect(response.statusCode).toBe(401);
		expect(response.json().message).toBe(AuthException.INVALID_TOKEN);
		expect(mockFindUnique).not.toHaveBeenCalled();
	});

	it("returns 404 with USER_NOT_FOUND when the user no longer exists", async () => {
		mockFindUnique.mockResolvedValueOnce(null);

		const token = await signToken(app, "missing-user");

		const response = await app.inject({
			method: "GET",
			url: "/users/me",
			headers: { authorization: `Bearer ${token}` },
		});

		expect(response.statusCode).toBe(404);
		expect(response.json().message).toBe(UserException.USER_NOT_FOUND);
	});
});
