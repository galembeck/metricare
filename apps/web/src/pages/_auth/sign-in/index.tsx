import { createFileRoute, Link } from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator";
import { AuthNavbar } from "../~components/-auth-navbar";
import { SidePanel } from "../~components/-side-panel";
import { GoogleLoginButton } from "./~components/-google-login-button";
import { SignInForm } from "./~components/-sign-in-form";

export const Route = createFileRoute("/_auth/sign-in/")({
	component: SignInPage,
	head: () => ({
		meta: [{ title: "Entrar | Metricare" }],
	}),
});

function SignInPage() {
	return (
		<main className="grid min-h-screen lg:grid-cols-[45fr_55fr]">
			<div className="hidden lg:block">
				<SidePanel />
			</div>

			<div className="flex flex-1 flex-col px-5 py-5 xl:px-10 xl:pt-8">
				<AuthNavbar />

				<div className="mt-4 flex flex-1 items-center justify-center">
					<div className="flex w-full max-w-110 flex-col gap-4">
						<h1 className="font-extrabold text-4xl text-black">
							Bem-vindo de volta
						</h1>

						<p className="text-ink-500 text-lg">
							Acesse sua conta para continuar acompanhando seus pacientes.
						</p>

						<div className="mt-6 flex flex-col gap-2.5">
							<GoogleLoginButton />
						</div>

						<div className="mt-6 flex items-center gap-3.5">
							<div className="h-0.5 flex-1 bg-border" />

							<span className="shrink-0 font-bold text-ink-400 text-xs uppercase tracking-[1.2px]">
								Ou com e-mail/CPF
							</span>

							<div className="h-0.5 flex-1 bg-border" />
						</div>

						<SignInForm />
					</div>
				</div>

				<footer className="hidden items-center justify-between border-border border-t pt-4 lg:flex">
					<p className="text-ink-500 text-xs">
						&copy; {new Date().getFullYear()} MetriCare · CNPJ
						00.000.000/0001-00
					</p>

					<div className="flex items-center gap-4">
						<Link
							className="text-ink-500 text-xs transition-colors hover:text-ink-700"
							to="/"
						>
							Termos
						</Link>

						<Separator orientation="vertical" />

						<Link
							className="text-ink-500 text-xs transition-colors hover:text-ink-700"
							to="/"
						>
							Privacidade · LGPD
						</Link>

						<Separator orientation="vertical" />

						<Link
							className="text-ink-500 text-xs transition-colors hover:text-ink-700"
							to="/"
						>
							Suporte
						</Link>
					</div>
				</footer>
			</div>
		</main>
	);
}
