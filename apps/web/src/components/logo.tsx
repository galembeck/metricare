import { type ComponentProps, useId } from "react";

type LogoSize = "sm" | "md" | "lg";

interface LogoProps extends ComponentProps<"svg"> {
	size?: LogoSize;
}

const SIZE_MAP: Record<LogoSize, number> = {
	sm: 32,
	md: 48,
	lg: 60,
};

const VIEWBOX = { width: 100, height: 135 };

export function Logo({ size = "md", ...props }: LogoProps) {
	const uid = useId().replace(/:/g, "");
	const ids = {
		bag: `${uid}mcBag`,
		liquid: `${uid}mcLiquid`,
		tube: `${uid}mcTube`,
		bagClip: `${uid}mcBagClip`,
	};

	const baseSize = SIZE_MAP[size];

	const particles = [
		{ x: 62, y: 14, size: 6 },
		{ x: 70, y: 20, size: 5, opacity: 0.8 },
		{ x: 64, y: 24, size: 4, opacity: 0.6 },
		{ x: 74, y: 10, size: 4, opacity: 0.7 },
	];

	const nodes = [
		{ cx: 74, cy: 34 },
		{ cx: 72, cy: 60 },
		{ cx: 78, cy: 86 },
	];

	return (
		<svg
			aria-label="MetriCare"
			fill="none"
			height={baseSize * 1.35}
			viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
			width={baseSize}
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<defs>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id={ids.bag}
					x1="20"
					x2="80"
					y1="20"
					y2="90"
				>
					<stop offset="0" stopColor="#1a5f9e" />
					<stop offset=".55" stopColor="#2e88a3" />
					<stop offset="1" stopColor="#3fa535" />
				</linearGradient>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id={ids.liquid}
					x1="20"
					x2="80"
					y1="40"
					y2="80"
				>
					<stop offset="0" stopColor="#3fa535" />
					<stop offset="1" stopColor="#1a8da3" />
				</linearGradient>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id={ids.tube}
					x1="40"
					x2="60"
					y1="100"
					y2="135"
				>
					<stop offset="0" stopColor="#1a5f9e" />
					<stop offset="1" stopColor="#3fa535" />
				</linearGradient>
				<clipPath id={ids.bagClip}>
					<path d="M22 22 H58 V90 Q58 96 52 96 H28 Q22 96 22 90 Z" />
				</clipPath>
			</defs>

			<path
				d="M36 12 V18 M44 12 V18 M34 14 H46"
				stroke={`url(#${ids.bag})`}
				strokeLinecap="round"
				strokeWidth="2.4"
			/>

			<path
				d="M22 22 H58 V90 Q58 96 52 96 H28 Q22 96 22 90 Z"
				fill="none"
				stroke={`url(#${ids.bag})`}
				strokeLinejoin="round"
				strokeWidth="3"
			/>

			<g clipPath={`url(#${ids.bagClip})`}>
				<path
					d="M22 58 Q30 50 40 56 T58 58 V96 H22 Z"
					fill={`url(#${ids.liquid})`}
					opacity="0.85"
				/>
				<path
					d="M22 64 Q32 58 42 62 T58 64 V96 H22 Z"
					fill={`url(#${ids.liquid})`}
				/>
			</g>

			<g fill="#3fa535">
				{particles.map(({ x, y, size: s, opacity = 1 }) => (
					<rect
						height={s}
						key={`${x}-${y}`}
						opacity={opacity}
						rx="0.6"
						width={s}
						x={x}
						y={y}
					/>
				))}
			</g>

			<path
				d="M70 26 C 80 38, 82 50, 72 60 C 64 68, 66 78, 78 86 C 84 92, 86 100, 82 108"
				fill="none"
				stroke={`url(#${ids.bag})`}
				strokeLinecap="round"
				strokeWidth="2.4"
			/>
			<g fill="white" stroke={`url(#${ids.bag})`} strokeWidth="2">
				{nodes.map(({ cx, cy }) => (
					<circle cx={cx} cy={cy} key={`${cx}-${cy}`} r="2.8" />
				))}
			</g>

			<path
				d="M40 96 V108 Q40 118 48 122 Q56 126 52 132"
				fill="none"
				stroke={`url(#${ids.tube})`}
				strokeLinecap="round"
				strokeWidth="2.4"
			/>
		</svg>
	);
}
