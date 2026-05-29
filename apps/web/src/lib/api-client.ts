export type {
	Client,
	RequestConfig,
	ResponseConfig,
	ResponseErrorConfig,
} from "@kubb/plugin-client/clients/fetch";

import {
	client as kubClient,
	type RequestConfig,
} from "@kubb/plugin-client/clients/fetch";
import { getCookie } from "@/lib/cookie";

// Wraps kubb's fetch client to inject baseURL and the stored JWT on every request.
// Uses import.meta.env (Vite) — @metricare/env is server-side only (process.env).
const client = <TData, TError = unknown, TVariables = unknown>(
	config: RequestConfig<TVariables>
) => {
	const token = getCookie("accessToken");
	const authHeaders: Record<string, string> = token
		? { Authorization: `Bearer ${token}` }
		: {};
	return kubClient<TData, TError, TVariables>({
		baseURL: import.meta.env.VITE_PUBLIC_API_URL,
		...config,
		headers: {
			"Content-Type": "application/json",
			...authHeaders,
			...(config.headers as Record<string, string>),
		},
	});
};

client.getConfig = kubClient.getConfig;
client.setConfig = kubClient.setConfig;

export default client;
