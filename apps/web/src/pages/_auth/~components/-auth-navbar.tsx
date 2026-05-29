import { Link, useLocation } from "@tanstack/react-router";
import { Logo } from "@/components/logo";

export function AuthNavbar() {
	const location = useLocation();

	const isSignIn = location.pathname === "/sign-in";

	return (
		<nav className="flex w-full flex-row items-center justify-between gap-4 lg:justify-end">
			<article className="flex items-center gap-2 lg:hidden">
				<Logo size="sm" />

				<span className="font-bold text-2xl text-blue-700 tracking-tight">
					Metri<span className="text-green-500">Care</span>
				</span>
			</article>

			{isSignIn ? (
				<p className="flex min-w-0 items-center gap-1 font-inter font-medium text-foreground-secondary text-sm">
					Novo na MetriCare?
					<Link
						className="cursor-pointer font-bold text-blue-600 hover:underline hover:underline-offset-4"
						to="/sign-up"
					>
						Criar conta
					</Link>
				</p>
			) : (
				<p className="flex min-w-0 items-center gap-1 font-inter font-medium text-foreground-secondary text-sm">
					Já possui conta
					<Link
						className="cursor-pointer font-bold text-blue-600 hover:underline hover:underline-offset-4"
						to="/sign-in"
					>
						Entrar
					</Link>
				</p>
			)}
		</nav>
	);
}
