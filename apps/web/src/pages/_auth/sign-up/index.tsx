import { createFileRoute } from "@tanstack/react-router";
import { SidePanel } from "../~components/-side-panel";

export const Route = createFileRoute("/_auth/sign-up/")({
	component: SignUpPage,
	head: () => ({
		meta: [{ title: "Cadastrar | MetriCare" }],
	}),
});

function SignUpPage() {
	return (
		<main className="grid min-h-screen lg:grid-cols-[45fr_55fr]">
			<SidePanel />

			<div className="flex items-center justify-center bg-white">
				<p>Right side</p>
			</div>
		</main>
	);
}
