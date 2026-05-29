import type { AuthException } from "./auth";
import type { UserException } from "./user";

export type AppException = AuthException | UserException;
