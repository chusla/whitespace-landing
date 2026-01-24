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
import {LearnInputScreen} from '../components/screens/LearnInputScreen';
import {GenerationCompleteScreen} from '../components/screens/GenerationCompleteScreen';
import {ProgramPreviewScreen} from '../components/screens/ProgramPreviewScreen';

export const FullAppShowcase: React.FC = () => {
	const frame = useCurrentFrame();

	// Scene durations (at 30fps)
	const scene1Duration = 100; // Goal Input
	const scene2Duration = 120; // Player
	const scene3Duration = 100; // Learn Input
	const scene4Duration = 100; // Generation Complete
	const scene5Duration = 150; // Program Preview
	const transitionDuration = 15;

	const scenes = [
		{start: 0, duration: scene1Duration},
		{
			start: scene1Duration,
			duration: scene2Duration,
		},
		{
			start: scene1Duration + scene2Duration,
			duration: scene3Duration,
		},
		{
			start: scene1Duration + scene2Duration + scene3Duration,
			duration: scene4Duration,
		},
		{
			start:
				scene1Duration + scene2Duration + scene3Duration + scene4Duration,
			duration: scene5Duration,
		},
	];

	// Calculate opacity for transitions
	const getSceneOpacity = (
		sceneStart: number,
		sceneDuration: number
	): number => {
		// Fade in
		if (frame >= sceneStart && frame < sceneStart + transitionDuration) {
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

	// Subtle phone rotation between scenes
	const getRotation = (sceneIndex: number): number => {
		const rotations = [-3, 2, -2, 3, -1];
		return rotations[sceneIndex] || 0;
	};

	return (
		<AbsoluteFill
			style={{
				background:
					'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)',
			}}
		>
			{/* Scene 1: Goal Input */}
			<Sequence from={scenes[0].start} durationInFrames={scenes[0].duration}>
				<div
					style={{
						opacity: getSceneOpacity(scenes[0].start, scenes[0].duration),
					}}
				>
					<IPhoneMockup rotation={getRotation(0)} scale={0.92}>
						<GoalInputScreen
							placeholderText="calm my racing thoughts"
							inputText="focus on deep work"
							showButtons={frame > scenes[0].start + 50}
						/>
					</IPhoneMockup>
				</div>
			</Sequence>

			{/* Scene 2: Player */}
			<Sequence from={scenes[1].start} durationInFrames={scenes[1].duration}>
				<div
					style={{
						opacity: getSceneOpacity(scenes[1].start, scenes[1].duration),
					}}
				>
					<IPhoneMockup rotation={getRotation(1)} scale={0.92}>
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

			{/* Scene 3: Learn Input */}
			<Sequence from={scenes[2].start} durationInFrames={scenes[2].duration}>
				<div
					style={{
						opacity: getSceneOpacity(scenes[2].start, scenes[2].duration),
					}}
				>
					<IPhoneMockup rotation={getRotation(2)} scale={0.92}>
						<LearnInputScreen
							placeholderText="https://twitter.com/user/status/123..."
							inputText="deep work principles"
							showUploadButton={frame < scenes[2].start + 50}
						/>
					</IPhoneMockup>
				</div>
			</Sequence>

			{/* Scene 4: Generation Complete */}
			<Sequence from={scenes[3].start} durationInFrames={scenes[3].duration}>
				<div
					style={{
						opacity: getSceneOpacity(scenes[3].start, scenes[3].duration),
					}}
				>
					<IPhoneMockup rotation={getRotation(3)} scale={0.92}>
						<GenerationCompleteScreen
							message="Your program is ready."
							creditsUsed={1}
							creditsRemaining={16}
						/>
					</IPhoneMockup>
				</div>
			</Sequence>

			{/* Scene 5: Program Preview */}
			<Sequence from={scenes[4].start} durationInFrames={scenes[4].duration}>
				<div
					style={{
						opacity: getSceneOpacity(scenes[4].start, scenes[4].duration),
					}}
				>
					<IPhoneMockup rotation={getRotation(4)} scale={0.92}>
						<ProgramPreviewScreen
							programTitle="The One Hour Focus Method"
							sessionCount={5}
							sessionDuration="~50 min"
							credits={10}
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
