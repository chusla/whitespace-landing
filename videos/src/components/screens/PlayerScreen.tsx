import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {PhospheneBackground} from '../PhoneMockup';

interface PlayerScreenProps {
	title?: string;
	durationMinutes?: number;
	currentTime?: number;
	totalTime?: number;
	isPlaying?: boolean;
}

export const PlayerScreen: React.FC<PlayerScreenProps> = ({
	title = 'Clearing Mental Space',
	durationMinutes = 11,
	currentTime = 380,
	totalTime = 660,
	isPlaying = true,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Animated progress
	const animatedProgress = interpolate(
		frame,
		[0, fps * 5],
		[currentTime / totalTime, Math.min(1, (currentTime + 60) / totalTime)],
		{
			extrapolateRight: 'clamp',
		}
	);

	// Breathing circle animation
	const breathScale = interpolate(
		frame,
		[0, fps * 3, fps * 6],
		[1, 1.15, 1],
		{
			extrapolateRight: 'wrap',
		}
	);

	const breathOpacity = interpolate(
		frame,
		[0, fps * 3, fps * 6],
		[0.3, 0.6, 0.3],
		{
			extrapolateRight: 'wrap',
		}
	);

	// Entrance animations
	const titleOpacity = spring({
		frame: frame - 10,
		fps,
		config: {damping: 100},
	});

	const circleOpacity = spring({
		frame: frame - 20,
		fps,
		config: {damping: 100},
	});

	const controlsOpacity = spring({
		frame: frame - 30,
		fps,
		config: {damping: 100},
	});

	// Format time
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	const displayedCurrentTime = Math.floor(
		animatedProgress * totalTime
	);

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
					padding: '60px 32px 40px 32px',
					fontFamily: '"Crimson Pro", Georgia, serif',
				}}
			>
				{/* Title */}
				<div
					style={{
						textAlign: 'center',
						marginBottom: '80px',
						opacity: titleOpacity,
					}}
				>
					<div
						style={{
							fontSize: 28,
							fontWeight: 400,
							color: '#FFFFFF',
							marginBottom: 8,
						}}
					>
						{title}
					</div>
					<div
						style={{
							fontSize: 16,
							fontWeight: 400,
							color: 'rgba(255, 255, 255, 0.5)',
						}}
					>
						{durationMinutes} minutes
					</div>
				</div>

				{/* Breathing Circle */}
				<div
					style={{
						flex: 1,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						opacity: circleOpacity,
					}}
				>
					<div
						style={{
							position: 'relative',
							width: 220,
							height: 220,
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
								background: 'radial-gradient(circle, rgba(100, 160, 220, 0.4) 0%, transparent 70%)',
								opacity: breathOpacity,
							}}
						/>

						{/* Main circle */}
						<div
							style={{
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
								width: 180,
								height: 180,
								borderRadius: '50%',
								border: '2px solid rgba(100, 160, 220, 0.4)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							{/* Center dot */}
							<div
								style={{
									width: 12,
									height: 12,
									borderRadius: '50%',
									backgroundColor: 'rgba(255, 255, 255, 0.8)',
									transform: `scale(${breathScale * 0.8})`,
								}}
							/>
						</div>
					</div>
				</div>

				{/* Controls */}
				<div
					style={{
						opacity: controlsOpacity,
					}}
				>
					{/* Progress bar */}
					<div
						style={{
							marginBottom: 12,
						}}
					>
						<div
							style={{
								height: 3,
								backgroundColor: 'rgba(255, 255, 255, 0.15)',
								borderRadius: 2,
								overflow: 'hidden',
							}}
						>
							<div
								style={{
									height: '100%',
									width: `${animatedProgress * 100}%`,
									backgroundColor: 'rgba(255, 255, 255, 0.6)',
									borderRadius: 2,
								}}
							/>
						</div>
					</div>

					{/* Time */}
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							fontSize: 14,
							color: 'rgba(255, 255, 255, 0.5)',
							marginBottom: 32,
							fontFamily: 'Inter, sans-serif',
						}}
					>
						<span>{formatTime(displayedCurrentTime)}</span>
						<span>{formatTime(totalTime)}</span>
					</div>

					{/* Play/Pause button */}
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						<div
							style={{
								width: 64,
								height: 64,
								borderRadius: '50%',
								backgroundColor: 'rgba(255, 255, 255, 0.1)',
								border: '1px solid rgba(255, 255, 255, 0.2)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 24,
								color: '#FFFFFF',
							}}
						>
							{isPlaying ? '❚❚' : '▶'}
						</div>
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};
