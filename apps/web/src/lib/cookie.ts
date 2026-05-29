export interface CookieOptions {
	maxAge?: number;
	path?: string;
	sameSite?: "Strict" | "Lax" | "None";
	secure?: boolean;
}

export function getCookie(name: string): string | null {
	if (typeof document === "undefined") {
		return null;
	}
	const match = document.cookie.match(
		new RegExp(`(?:^|;\\s*)${encodeURIComponent(name)}=([^;]*)`)
	);
	return match ? decodeURIComponent(match[1]) : null;
}

export function setCookie(
	name: string,
	value: string,
	options: CookieOptions = {}
): void {
	const { maxAge, path = "/", sameSite = "Strict", secure = false } = options;
	const parts = [
		`${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
		`path=${path}`,
		`SameSite=${sameSite}`,
	];
	if (maxAge !== undefined) {
		parts.push(`max-age=${maxAge}`);
	}
	if (secure) {
		parts.push("Secure");
	}
	// biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API is async and has limited browser support
	document.cookie = parts.join("; ");
}

export function deleteCookie(
	name: string,
	options: Pick<CookieOptions, "path"> = {}
): void {
	setCookie(name, "", { ...options, maxAge: 0 });
}
