import { DataSquaresIcon } from "@/components/icons/data-squares-icon";
import { DecorativeRectsIcon } from "@/components/icons/decorative-rects-icon";
import { Logo } from "@/components/logo";

export function SidePanel() {
	return (
		<div
			className="relative flex min-h-screen flex-col overflow-hidden px-10 py-8"
			style={{
				background:
					"linear-gradient(160deg, #0D3B64 0%, #12497A 30%, #186163 70%, #1E7644 100%)",
			}}
		>
			<DecorativeRectsIcon />

			<header className="relative z-10 flex items-center gap-3">
				<Logo />

				<span className="font-bold text-3xl text-blue-200 tracking-tight">
					Metri<span className="text-green-500">Care</span>
				</span>
			</header>

			<div className="relative z-10 mt-auto flex flex-col gap-8 pt-16 pb-4">
				<div className="w-fit">
					<span className="rounded-full border border-white/25 px-3.5 py-1 font-semibold text-green-200 text-xs uppercase tracking-[0.18em]">
						Plataforma Clínica
					</span>
				</div>

				<div>
					<h1 className="font-extrabold text-4xl text-white leading-[1.15] tracking-tight">
						Precisão que nutre,
						<br />
						<span
							style={{
								background:
									"linear-gradient(90deg, #60B860 0%, #89C7A1 45%, #B7D9E1 85%, #D4E7EF 100%)",
								backgroundClip: "text",

								WebkitBackgroundClip: "text",

								color: "transparent",
							}}
						>
							inteligência que cuida.
						</span>
					</h1>
					<p className="mt-4 max-w-120 text-balance text-md text-white/60 leading-relaxed">
						Entre com sua conta institucional para acessar prescrições, alertas
						inteligentes e análises nutricionais em tempo real.
					</p>
				</div>

				<div className="flex gap-8">
					<div className="flex flex-col gap-1">
						<span className="font-extrabold text-2xl text-white leading-none tracking-tight">
							4.466
						</span>
						<span className="font-semibold text-[10px] text-white/45 uppercase tracking-widest">
							Hospitais no Brasil
						</span>
					</div>

					<div className="flex flex-col gap-1">
						<span className="font-extrabold text-2xl text-white leading-none tracking-tight">
							-40%
						</span>
						<span className="font-semibold text-[10px] text-white/45 uppercase tracking-widest">
							Tempo em prescrição
						</span>
					</div>

					<div className="flex flex-col gap-1">
						<span className="font-extrabold text-2xl text-white leading-none tracking-tight">
							ESPEN
						</span>
						<span className="font-semibold text-[10px] text-white/45 uppercase tracking-widest">
							Diretrizes 2024
						</span>
					</div>
				</div>
			</div>

			<footer className="relative z-10 mt-auto flex items-center gap-3">
				<DataSquaresIcon />

				<div className="flex items-center gap-2 text-[11px] text-white/50">
					<span className="size-1.5 rounded-full bg-[#6BC960]" />

					<span>LGPD compliant</span>

					<span className="text-white/25">·</span>

					<span>ISO 27001</span>

					<span className="text-white/25">·</span>

					<span>CFM aprovado</span>
				</div>
			</footer>
		</div>
	);
}
