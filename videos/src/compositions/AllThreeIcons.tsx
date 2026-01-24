import React from 'react';
import {
	AbsoluteFill,
	Sequence,
	interpolate,
	useCurrentFrame,
} from 'remotion';
import {FlowIcon} from './FlowIcon';
import {ElevateIcon} from './ElevateIcon';
import {ImmerseIcon} from './ImmerseIcon';

export const AllThreeIcons: React.FC = () => {
	const frame = useCurrentFrame();

	// Each icon displays for 100 frames (3.33 seconds at 30fps)
	const iconDuration = 100;

	// Fade transitions
	const fadeFrames = 15;

	const getOpacity = (startFrame: number) => {
		// Fade in
		if (frame >= startFrame && frame < startFrame + fadeFrames) {
			return interpolate(frame, [startFrame, startFrame + fadeFrames], [0, 1]);
		}
		// Show
		if (
			frame >= startFrame + fadeFrames &&
			frame < startFrame + iconDuration - fadeFrames
		) {
			return 1;
		}
		// Fade out
		if (
			frame >= startFrame + iconDuration - fadeFrames &&
			frame < startFrame + iconDuration
		) {
			return interpolate(
				frame,
				[startFrame + iconDuration - fadeFrames, startFrame + iconDuration],
				[1, 0]
			);
		}
		return 0;
	};

	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#0a0a0a',
			}}
		>
			{/* Flow */}
			<Sequence from={0} durationInFrames={iconDuration}>
				<div
					style={{
						opacity: getOpacity(0),
						width: '100%',
						height: '100%',
					}}
				>
					<FlowIcon />
				</div>
			</Sequence>

			{/* Elevate */}
			<Sequence from={iconDuration} durationInFrames={iconDuration}>
				<div
					style={{
						opacity: getOpacity(iconDuration),
						width: '100%',
						height: '100%',
					}}
				>
					<ElevateIcon />
				</div>
			</Sequence>

			{/* Immerse */}
			<Sequence from={iconDuration * 2} durationInFrames={iconDuration}>
				<div
					style={{
						opacity: getOpacity(iconDuration * 2),
						width: '100%',
						height: '100%',
					}}
				>
					<ImmerseIcon />
				</div>
			</Sequence>

			{/* Whitespace branding at bottom */}
			<div
				style={{
					position: 'absolute',
					bottom: '80px',
					left: '50%',
					transform: 'translateX(-50%)',
					fontSize: '36px',
					fontWeight: 200,
					color: 'rgba(255, 255, 255, 0.6)',
					letterSpacing: '12px',
					fontFamily: "'Inter', sans-serif",
				}}
			>
				WHITESPACE
			</div>
		</AbsoluteFill>
	);
};
