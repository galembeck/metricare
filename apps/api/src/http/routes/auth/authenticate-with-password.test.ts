import fastifyJwt from "@fastify/jwt";
import { hash } from "bcryptjs";
import { fastify } from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { errorHandler } from "@/handlers/error-handler";
import { AuthException } from "@/handlers/exceptions/auth";
import { prisma } from "@/lib/prisma";
import { authenticateWithPasswordRoute } from "./authenticate-with-password";

vi.mock("@/lib/prisma", () => ({
	prisma: {
		user: {
			findFirst: vi.fn(),
		},
	},
}));

const mockFindFirst = vi.mocked(prisma.user.findFirst);

const SECONDS_IN_DAY = 24 * 60 * 60;
const SEVEN_DAYS_IN_SECONDS = 7 * SECONDS_IN_DAY;
const THIRTY_DAYS_IN_SECONDS = 30 * SECONDS_IN_DAY;

async function buildApp() {
	const app = fastify();
	app.setValidatorCompiler(validatorCompiler);
	app.setSerializerCompiler(serializerCompiler);
	app.setErrorHandler(errorHandler);
	await app.register(fastifyJwt, { secret: "test-secret" });
	await app.register(authenticateWithPasswordRoute);
	await app.ready();
	return app;
}

describe("POST /auth/sessions/password", () => {
	let app: Awaited<ReturnType<typeof buildApp>>;

	beforeEach(async () => {
		vi.clearAllMocks();
		app = await buildApp();
	});

	it("returns 200 with an accessToken when signing in with email and correct password", async () => {
		const passwordHash = await hash("correct-password", 6);
		mockFindFirst.mockResolvedValueOnce({
			id: "user-id-1",
			name: "John Doe",
			email: "john@example.com",
			document: "12345678901",
			passwordHash,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		const response = await app.inject({
			method: "POST",
			url: "/auth/sessions/password",
			body: {
				identifier: "john@example.com",
				password: "correct-password",
				keepAlive: false,
			},
		});

		expect(response.statusCode).toBe(200);
		expect(response.json()).toHaveProperty("accessToken");
	});

	it("returns 200 with an accessToken when signing in with document and correct password", async () => {
		const passwordHash = await hash("correct-password", 6);
		mockFindFirst.mockResolvedValueOnce({
			id: "user-id-1",
			name: "John Doe",
			email: "john@example.com",
			document: "12345678901",
			passwordHash,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		const response = await app.inject({
			method: "POST",
			url: "/auth/sessions/password",
			body: {
				identifier: "12345678901",
				password: "correct-password",
				keepAlive: false,
			},
		});

		expect(response.statusCode).toBe(200);
		expect(response.json()).toHaveProperty("accessToken");
	});

	it("returns 400 with INVALID_CREDENTIALS when no user matches the identifier", async () => {
		mockFindFirst.mockResolvedValueOnce(null);

		const response = await app.inject({
			method: "POST",
			url: "/auth/sessions/password",
			body: {
				identifier: "unknown@example.com",
				password: "any-password",
				keepAlive: false,
			},
		});

		expect(response.statusCode).toBe(400);
		expect(response.json().message).toBe(AuthException.INVALID_CREDENTIALS);
	});

	it("returns 400 with USER_HAS_NO_PASSWORD when user has no password set", async () => {
		mockFindFirst.mockResolvedValueOnce({
			id: "user-id-2",
			name: "Jane Doe",
			email: "jane@example.com",
			document: "98765432100",
			passwordHash: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		const response = await app.inject({
			method: "POST",
			url: "/auth/sessions/password",
			body: {
				identifier: "jane@example.com",
				password: "any-password",
				keepAlive: false,
			},
		});

		expect(response.statusCode).toBe(400);
		expect(response.json().message).toBe(AuthException.USER_HAS_NO_PASSWORD);
	});

	it("returns 400 with INVALID_CREDENTIALS when password is wrong", async () => {
		const passwordHash = await hash("correct-password", 6);
		mockFindFirst.mockResolvedValueOnce({
			id: "user-id-1",
			name: "John Doe",
			email: "john@example.com",
			document: "12345678901",
			passwordHash,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		const response = await app.inject({
			method: "POST",
			url: "/auth/sessions/password",
			body: {
				identifier: "john@example.com",
				password: "wrong-password",
				keepAlive: false,
			},
		});

		expect(response.statusCode).toBe(400);
		expect(response.json().message).toBe(AuthException.INVALID_CREDENTIALS);
	});

	it("returns 400 validation error when body fields are missing", async () => {
		const response = await app.inject({
			method: "POST",
			url: "/auth/sessions/password",
			body: {},
		});

		expect(response.statusCode).toBe(400);
	});

	it("issues a token expiring in ~7 days when keepAlive is false", async () => {
		const passwordHash = await hash("correct-password", 6);
		mockFindFirst.mockResolvedValueOnce({
			id: "user-id-1",
			name: "John Doe",
			email: "john@example.com",
			document: "12345678901",
			passwordHash,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		const response = await app.inject({
			method: "POST",
			url: "/auth/sessions/password",
			body: {
				identifier: "john@example.com",
				password: "correct-password",
				keepAlive: false,
			},
		});

		const { accessToken } = response.json();
		const { exp, iat } = app.jwt.decode<{ exp: number; iat: number }>(
			accessToken
		);

		expect(exp - iat).toBe(SEVEN_DAYS_IN_SECONDS);
	});

	it("issues a token expiring in ~30 days when keepAlive is true", async () => {
		const passwordHash = await hash("correct-password", 6);
		mockFindFirst.mockResolvedValueOnce({
			id: "user-id-1",
			name: "John Doe",
			email: "john@example.com",
			document: "12345678901",
			passwordHash,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		const response = await app.inject({
			method: "POST",
			url: "/auth/sessions/password",
			body: {
				identifier: "john@example.com",
				password: "correct-password",
				keepAlive: true,
			},
		});

		const { accessToken } = response.json();
		const { exp, iat } = app.jwt.decode<{ exp: number; iat: number }>(
			accessToken
		);

		expect(exp - iat).toBe(THIRTY_DAYS_IN_SECONDS);
	});
});
