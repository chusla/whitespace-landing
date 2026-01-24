import React from 'react';
import {
	AbsoluteFill,
	Sequence,
	interpolate,
	useCurrentFrame,
} from 'remotion';
import {IPhoneMockup} from '../components/PhoneMockup';
import {GoalInputScreen} from '../components/screens/GoalInputScreen';
import {PlayerScreen} from '../components/screens/PlayerScreen';

export const AppScreenShowcase: React.FC = () => {
	const frame = useCurrentFrame();

	// Scene durations
	const scene1Duration = 120; // Goal input
	const scene2Duration = 150; // Player
	const transitionDuration = 20;

	// Calculate opacity for transitions
	const getSceneOpacity = (
		sceneStart: number,
		sceneDuration: number
	): number => {
		// Fade in
		if (
			frame >= sceneStart &&
			frame < sceneStart + transitionDuration
		) {
			return interpolate(
				frame,
				[sceneStart, sceneStart + transitionDuration],
				[0, 1]
			);
		}

		// Visible
		if (
			frame >= sceneStart + transitionDuration &&
			frame < sceneStart + sceneDuration - transitionDuration
		) {
			return 1;
		}

		// Fade out
		if (
			frame >= sceneStart + sceneDuration - transitionDuration &&
			frame < sceneStart + sceneDuration
		) {
			return interpolate(
				frame,
				[
					sceneStart + sceneDuration - transitionDuration,
					sceneStart + sceneDuration,
				],
				[1, 0]
			);
		}

		return 0;
	};

	return (
		<AbsoluteFill
			style={{
				background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)',
			}}
		>
			{/* Scene 1: Goal Input with typing animation */}
			<Sequence from={0} durationInFrames={scene1Duration}>
				<div
					style={{
						opacity: getSceneOpacity(0, scene1Duration),
					}}
				>
					<IPhoneMockup rotation={-3} scale={0.95}>
						<GoalInputScreen
							placeholderText="calm my racing thoughts"
							inputText="focus on deep work"
							showButtons={frame > 60}
						/>
					</IPhoneMockup>
				</div>
			</Sequence>

			{/* Scene 2: Player Screen */}
			<Sequence from={scene1Duration} durationInFrames={scene2Duration}>
				<div
					style={{
						opacity: getSceneOpacity(scene1Duration, scene2Duration),
					}}
				>
					<IPhoneMockup rotation={2} scale={0.95}>
						<PlayerScreen
							title="Deep Work Focus"
							durationMinutes={15}
							currentTime={240}
							totalTime={900}
							isPlaying={true}
						/>
					</IPhoneMockup>
				</div>
			</Sequence>

			{/* Branding */}
			<div
				style={{
					position: 'absolute',
					bottom: 60,
					left: '50%',
					transform: 'translateX(-50%)',
					fontSize: 28,
					fontWeight: 200,
					color: 'rgba(255, 255, 255, 0.5)',
					letterSpacing: 8,
					fontFamily: '"Inter", sans-serif',
				}}
			>
				WHITESPACE
			</div>
		</AbsoluteFill>
	);
};
