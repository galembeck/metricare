import { getCookie } from "@/lib/cookie";

export function isAuthenticated(): boolean {
	return !!getCookie("accessToken");
}
