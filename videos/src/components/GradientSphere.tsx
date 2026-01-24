import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

interface GradientSphereProps {
	baseColor: string;
	gradientStops: Array<{offset: number; color: string}>;
	glowColor: string;
	glowIntensity: number;
	text: string;
	subtitle?: string;
	textColor: string;
	isDark?: boolean;
}

export const GradientSphere: React.FC<GradientSphereProps> = ({
	baseColor,
	gradientStops,
	glowColor,
	glowIntensity,
	text,
	subtitle,
	textColor,
	isDark = true,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Animated entrance
	const scale = spring({
		frame,
		fps,
		config: {
			damping: 100,
			mass: 0.5,
		},
	});

	const opacity = interpolate(frame, [0, 20], [0, 1], {
		extrapolateRight: 'clamp',
	});

	// Subtle breathing animation for the glow
	const glowScale = interpolate(
		frame,
		[0, 60, 120, 180],
		[1, 1.1, 1, 1.1],
		{
			extrapolateRight: 'extend',
		}
	);

	return (
		<AbsoluteFill
			style={{
				backgroundColor: baseColor,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontFamily: "'Inter', sans-serif",
			}}
		>
			{/* Spherical gradient background */}
			<div
				style={{
					position: 'absolute',
					width: '100%',
					height: '100%',
					background: `radial-gradient(ellipse at center, ${gradientStops.map((stop) => `${stop.color} ${stop.offset * 100}%`).join(', ')})`,
					opacity: opacity,
				}}
			/>

			{/* Animated glow */}
			<div
				style={{
					position: 'absolute',
					width: '600px',
					height: '600px',
					borderRadius: '50%',
					background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
					opacity: glowIntensity * opacity,
					transform: `scale(${glowScale})`,
					filter: 'blur(40px)',
				}}
			/>

			{/* Text container */}
			<div
				style={{
					position: 'relative',
					textAlign: 'center',
					opacity: opacity,
					transform: `scale(${scale})`,
				}}
			>
				{/* Main text */}
				<div
					style={{
						fontSize: text.length <= 5 ? '200px' : '170px',
						fontWeight: 400,
						color: textColor,
						letterSpacing: text.length <= 5 ? '45px' : '35px',
						marginBottom: subtitle ? '80px' : '0',
						textShadow: isDark
							? '0 10px 40px rgba(0,0,0,0.5)'
							: '0 10px 40px rgba(255,255,255,0.3)',
					}}
				>
					{text}
				</div>

				{/* Subtitle */}
				{subtitle && (
					<div
						style={{
							fontSize: '100px',
							fontWeight: 400,
							color: textColor,
							opacity: 0.85,
							letterSpacing: '18px',
							textShadow: isDark
								? '0 5px 20px rgba(0,0,0,0.5)'
								: '0 5px 20px rgba(255,255,255,0.3)',
						}}
					>
						{subtitle}
					</div>
				)}
			</div>
		</AbsoluteFill>
	);
};
