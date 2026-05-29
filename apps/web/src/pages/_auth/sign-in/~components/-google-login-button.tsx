import { GoogleIcon } from "@/components/icons/google-icon";
import { Button } from "@/components/ui/button";

export function GoogleLoginButton() {
	return (
		<Button
			className="flex items-center gap-4 py-6 font-semibold text-base text-black"
			size="lg"
			variant="outline"
		>
			<GoogleIcon />
			Entrar com Google
		</Button>
	);
}
