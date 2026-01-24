import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {PhospheneBackground} from '../PhoneMockup';

interface GenerationCompleteScreenProps {
	message?: string;
	creditsUsed?: number;
	creditsRemaining?: number;
}

export const GenerationCompleteScreen: React.FC<
	GenerationCompleteScreenProps
> = ({
	message = 'We can begin.',
	creditsUsed = 0,
	creditsRemaining = 17,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Breathing circle animation
	const breathScale = interpolate(
		frame,
		[0, fps * 3, fps * 6],
		[1, 1.2, 1],
		{
			extrapolateRight: 'wrap',
		}
	);

	const breathOpacity = interpolate(
		frame,
		[0, fps * 3, fps * 6],
		[0.25, 0.5, 0.25],
		{
			extrapolateRight: 'wrap',
		}
	);

	// Entrance animations
	const circleOpacity = spring({
		frame: frame - 10,
		fps,
		config: {damping: 100},
	});

	const messageOpacity = spring({
		frame: frame - 20,
		fps,
		config: {damping: 100},
	});

	const creditsOpacity = spring({
		frame: frame - 30,
		fps,
		config: {damping: 100},
	});

	const buttonOpacity = spring({
		frame: frame - 40,
		fps,
		config: {damping: 100},
	});

	const creditsText =
		creditsUsed > 0
			? `${creditsUsed} ${creditsUsed === 1 ? 'credit' : 'credits'} used · ${creditsRemaining} remaining`
			: `Free preview · ${creditsRemaining} credits remaining`;

	return (
		<AbsoluteFill>
			{/* Background */}
			<PhospheneBackground intensity={0.8} brightness={0.9} />

			{/* Content */}
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
					padding: '0 32px',
					fontFamily: '"Crimson Pro", Georgia, serif',
				}}
			>
				{/* Breathing Circle */}
				<div
					style={{
						flex: 1,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						marginTop: '-10%',
					}}
				>
					<div
						style={{
							position: 'relative',
							width: 180,
							height: 180,
							opacity: circleOpacity,
						}}
					>
						{/* Outer glow */}
						<div
							style={{
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: `translate(-50%, -50%) scale(${breathScale})`,
								width: '100%',
								height: '100%',
								borderRadius: '50%',
								background:
									'radial-gradient(circle, rgba(100, 160, 220, 0.3) 0%, transparent 70%)',
								opacity: breathOpacity,
							}}
						/>

						{/* Circle ring */}
						<div
							style={{
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
								width: 170,
								height: 170,
								borderRadius: '50%',
								border: '2px solid rgba(255, 255, 255, 0.25)',
							}}
						/>
					</div>
				</div>

				{/* Message */}
				<div
					style={{
						textAlign: 'center',
						marginBottom: 20,
						opacity: messageOpacity,
					}}
				>
					<div
						style={{
							fontSize: 24,
							fontWeight: 400,
							color: '#FFFFFF',
							marginBottom: 16,
						}}
					>
						{message}
					</div>

					{/* Credits pill */}
					<div
						style={{
							display: 'inline-block',
							padding: '8px 20px',
							backgroundColor: 'rgba(255, 255, 255, 0.03)',
							borderRadius: 6,
							opacity: creditsOpacity,
						}}
					>
						<div
							style={{
								fontSize: 13,
								fontWeight: 400,
								color: 'rgba(255, 255, 255, 0.6)',
							}}
						>
							{creditsText}
						</div>
					</div>
				</div>

				{/* Buttons */}
				<div
					style={{
						textAlign: 'center',
						marginBottom: 120,
						opacity: buttonOpacity,
					}}
				>
					<div
						style={{
							fontSize: 18,
							fontWeight: 400,
							color: '#FFFFFF',
							marginBottom: 16,
						}}
					>
						Open your space →
					</div>

					<div
						style={{
							fontSize: 16,
							fontWeight: 400,
							color: 'rgba(255, 255, 255, 0.6)',
						}}
					>
						Refocus
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};
