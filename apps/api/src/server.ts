import "dotenv/config";
import { fastifyCors } from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import { fastifySwagger } from "@fastify/swagger";
import { env } from "@metricare/env";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { fastify } from "fastify";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "MetriCare | API",
			description:
				"Full-stack application created with Node.js, Fastify and Prisma designed for hospitals and healthcare providers.",
			version: "1.0.0",
		},
		servers: [],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
	},
	transform: jsonSchemaTransform,
});

app.register(ScalarApiReference, {
	routePrefix: "/docs",
	configuration: {
		title: "MetriCare | API",
		layout: "classic",
	},
});

app.register(fastifyJwt, {
	secret: env.JWT_SECRET ?? "",
});

app.register(fastifyCors);

app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
	console.log(`🚀 | HTTP server running at http://localhost:${env.PORT}`);
	console.log(`📝 | Docs available at http://localhost:${env.PORT}/docs`);
});
