import React, {CSSProperties} from 'remotion';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

interface PhospheneBackgroundProps {
	intensity?: number;
	brightness?: number;
	baseColor?: string;
}

export const PhospheneBackground: React.FC<PhospheneBackgroundProps> = ({
	intensity = 1,
	brightness = 1,
	baseColor = '#0D0D0F',
}) => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	// Gentle pulsing animation
	const pulse = interpolate(frame, [0, fps * 2, fps * 4], [0.8, 1, 0.8], {
		extrapolateRight: 'wrap',
	});

	// Create phosphenes (glowing orbs)
	const phosphenes = Array.from({length: Math.floor(8 * intensity)}, (_, i) => {
		const seed = i * 137.508; // Golden angle for distribution
		return {
			x: (Math.sin(seed) * 0.5 + 0.5) * 100,
			y: (Math.cos(seed) * 0.5 + 0.5) * 100,
			size: 30 + (i % 3) * 15,
			hue: 215 + (i % 5) * 8,
			delay: i * 3,
		};
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: baseColor,
			}}
		>
			{phosphenes.map((p, i) => {
				const fadeIn = spring({
					frame: frame - p.delay,
					fps,
					config: {
						damping: 100,
					},
				});

				const glowOpacity = 0.035 * brightness * pulse * fadeIn;

				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: `${p.x}%`,
							top: `${p.y}%`,
							width: `${p.size}%`,
							height: `${p.size}%`,
							transform: 'translate(-50%, -50%)',
							background: `radial-gradient(circle,
								hsla(${p.hue}, 35%, ${45 * brightness}%, ${glowOpacity}) 0%,
								hsla(${p.hue}, 30%, ${40 * brightness}%, ${glowOpacity * 0.57}) 50%,
								transparent 100%)`,
							borderRadius: '50%',
							pointerEvents: 'none',
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

// iPhone mockup wrapper
interface IPhoneMockupProps {
	children: React.ReactNode;
	rotation?: number;
	scale?: number;
}

export const IPhoneMockup: React.FC<IPhoneMockupProps> = ({
	children,
	rotation = 0,
	scale = 1,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entranceScale = spring({
		frame,
		fps,
		config: {
			damping: 100,
			mass: 0.8,
		},
	});

	const entranceRotation = spring({
		frame,
		fps,
		from: rotation - 5,
		to: rotation,
		config: {
			damping: 100,
		},
	});

	// iPhone 15 Pro dimensions (approx)
	const phoneWidth = 393;
	const phoneHeight = 852;
	const borderRadius = 55;

	return (
		<AbsoluteFill
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<div
				style={{
					width: phoneWidth,
					height: phoneHeight,
					transform: `scale(${entranceScale * scale}) rotate(${entranceRotation}deg)`,
					position: 'relative',
				}}
			>
				{/* Phone body */}
				<div
					style={{
						width: '100%',
						height: '100%',
						borderRadius,
						overflow: 'hidden',
						boxShadow: '0 50px 100px rgba(0, 0, 0, 0.6)',
						border: '8px solid #1a1a1a',
						position: 'relative',
					}}
				>
					{/* Screen content */}
					{children}

					{/* Dynamic Island */}
					<div
						style={{
							position: 'absolute',
							top: 11,
							left: '50%',
							transform: 'translateX(-50%)',
							width: 126,
							height: 37,
							borderRadius: 19,
							backgroundColor: '#000',
							zIndex: 1000,
						}}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};
