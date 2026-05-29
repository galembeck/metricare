import { defineConfig } from "@kubb/core";
import { pluginClient } from "@kubb/plugin-client";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginZod } from "@kubb/plugin-zod";

export default defineConfig({
	input: { path: "http://localhost:3333/docs/openapi.json" },
	output: {
		path: "./src/http/gen",
		clean: true,
		barrelType: "named",
	},
	plugins: [
		pluginOas({ validate: true }),
		pluginTs({
			output: { path: "./types" },
			enumType: "asConst",
		}),
		pluginClient({
			output: { path: "./clients" },
			client: "fetch",
			dataReturnType: "data",
			importPath: "@/lib/api-client",
			group: { type: "tag", name: ({ group }) => `${group}Service` },
		}),
		pluginReactQuery({
			output: { path: "./hooks" },
			client: { importPath: "@/lib/api-client" },
			query: { methods: ["get"], importPath: "@tanstack/react-query" },
			mutation: { methods: ["post", "put", "delete"] },
			group: { type: "tag", name: ({ group }) => `${group}Hooks` },
		}),
		pluginZod({
			output: { path: "./zod" },
			version: "4",
			typed: true,
		}),
	],
});
