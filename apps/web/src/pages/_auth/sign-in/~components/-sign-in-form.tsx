/** biome-ignore-all lint/correctness/noChildrenProp: required by field component from @shadcn-ui */

import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { z } from "zod";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { usePostAuthSessionsPassword } from "@/http/gen/hooks/AuthHooks";
import { setCookie } from "@/lib/cookie";

const signInSchema = z.object({
	email: z.email({ message: "O e-mail deve ter um formato válido" }),
	password: z
		.string()
		.min(1, { message: "A senha é obrigatória para acessar sua conta" }),
	keepAlive: z.boolean(),
});

export function SignInForm() {
	const navigate = useNavigate();
	const { mutateAsync, isPending } = usePostAuthSessionsPassword();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			keepAlive: false,
		},
		validators: {
			onSubmit: signInSchema,
		},
		onSubmit: async ({ value }) => {
			const { accessToken } = await mutateAsync({
				data: {
					identifier: value.email,
					password: value.password,
					keepAlive: value.keepAlive,
				},
			});

			setCookie("accessToken", accessToken, {
				maxAge: value.keepAlive ? 30 * 24 * 60 * 60 : undefined,
			});

			navigate({ to: "/" });
		},
	});

	return (
		<div className="space-y-6">
			<form
				id="sign-in-form"
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<FieldGroup>
					<form.Field
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;

							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel
										className="font-semibold text-ink-600 text-xs uppercase tracking-wider"
										htmlFor={field.name}
									>
										Email
									</FieldLabel>

									<Input
										aria-invalid={isInvalid}
										autoComplete="off"
										className="placeholder:font-medium placeholder:text-sm"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="email@exemplo.com"
										value={field.state.value}
									/>

									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
						name="email"
					/>

					<form.Field
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;

							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel
										className="font-semibold text-ink-600 text-xs uppercase tracking-wider"
										htmlFor={field.name}
									>
										Senha
									</FieldLabel>

									<PasswordInput
										aria-invalid={isInvalid}
										autoComplete="off"
										className="placeholder:font-bold placeholder:text-xl"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="········"
										value={field.state.value}
									/>

									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
						name="password"
					/>

					<form.Field
						children={(field) => (
							<Field orientation="horizontal">
								<Checkbox
									checked={field.state.value}
									id={field.name}
									name={field.name}
									onBlur={field.handleBlur}
									onCheckedChange={(checked) =>
										field.handleChange(checked === true)
									}
								/>

								<div className="flex w-full items-center justify-between">
									<FieldLabel className="text-ink-600" htmlFor={field.name}>
										Manter conectado por 30 dias
									</FieldLabel>

									<Link
										className="font-semibold text-blue-700 text-sm hover:underline hover:underline-offset-2"
										to="/"
									>
										Esqueci a senha
									</Link>
								</div>
							</Field>
						)}
						name="keepAlive"
					/>
				</FieldGroup>
			</form>

			<Button
				className="w-full rounded-xl py-6 font-semibold text-md"
				disabled={isPending}
				form="sign-in-form"
				type="submit"
				variant="gradient"
			>
				Entrar na plataforma
				<ArrowRight />
			</Button>
		</div>
	);
}
