import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {PhospheneBackground} from '../PhoneMockup';

interface GoalInputScreenProps {
	placeholderText?: string;
	inputText?: string;
	showButtons?: boolean;
}

export const GoalInputScreen: React.FC<GoalInputScreenProps> = ({
	placeholderText = 'calm my racing thoughts',
	inputText = '',
	showButtons = false,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Stagger animations
	const headingDelay = 10;
	const inputDelay = 20;
	const buttonDelay = 30;

	const headingOpacity = spring({
		frame: frame - headingDelay,
		fps,
		config: {damping: 100},
	});

	const inputOpacity = spring({
		frame: frame - inputDelay,
		fps,
		config: {damping: 100},
	});

	const buttonOpacity = spring({
		frame: frame - buttonDelay,
		fps,
		config: {damping: 100},
	});

	// Text typing animation
	const typingProgress = interpolate(
		frame - inputDelay,
		[0, inputText.length * 3],
		[0, 1],
		{
			extrapolateRight: 'clamp',
		}
	);

	const displayedText = inputText.slice(
		0,
		Math.floor(inputText.length * typingProgress)
	);

	// Cursor blink
	const cursorBlink = Math.floor(frame / 15) % 2 === 0 && typingProgress < 1;

	return (
		<AbsoluteFill>
			{/* Background with phosphenes */}
			<PhospheneBackground intensity={1} brightness={1} />

			{/* Content */}
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100%',
					padding: '0 9%',
					fontFamily: '"Crimson Pro", Georgia, serif',
				}}
			>
				{/* Heading */}
				<div
					style={{
						textAlign: 'center',
						marginBottom: '68px',
						opacity: headingOpacity,
					}}
				>
					<div
						style={{
							fontSize: 30,
							fontWeight: 400,
							color: '#FFFFFF',
							lineHeight: 1.45,
							marginBottom: 8,
						}}
					>
						What would you like
					</div>
					<div
						style={{
							fontSize: 30,
							fontWeight: 400,
							color: '#FFFFFF',
							lineHeight: 1.45,
						}}
					>
						to focus on?
					</div>
				</div>

				{/* Input area */}
				<div
					style={{
						width: '100%',
						marginBottom: '60px',
						opacity: inputOpacity,
					}}
				>
					<div
						style={{
							textAlign: 'center',
							fontSize: 20,
							fontWeight: inputText ? 300 : 400,
							color: inputText ? '#FFFFFF' : 'rgba(255, 255, 255, 0.35)',
							marginBottom: 16,
							minHeight: 28,
						}}
					>
						{displayedText || placeholderText}
						{cursorBlink && inputText && (
							<span
								style={{
									borderRight: '2px solid rgba(255, 255, 255, 0.6)',
									marginLeft: 2,
								}}
							/>
						)}
					</div>

					{/* Underline */}
					<div
						style={{
							height: 1,
							backgroundColor: 'rgba(255, 255, 255, 0.2)',
							width: '100%',
						}}
					/>
				</div>

				{/* Buttons */}
				{(showButtons || inputText) && (
					<div
						style={{
							width: '100%',
							opacity: buttonOpacity,
						}}
					>
						{/* Create a Space button */}
						<div
							style={{
								border: '1px solid rgba(255, 255, 255, 0.08)',
								borderRadius: 12,
								padding: '16px 20px',
								marginBottom: 20,
								textAlign: 'center',
							}}
						>
							<div
								style={{
									fontSize: 16,
									fontWeight: 400,
									color: '#FFFFFF',
									marginBottom: 4,
								}}
							>
								Create a Space
							</div>
							<div
								style={{
									fontSize: 13,
									fontWeight: 400,
									color: 'rgba(255, 255, 255, 0.4)',
								}}
							>
								Custom guided audio of 2-20 minutes
							</div>
						</div>

						{/* Generate a Mantra button */}
						<div
							style={{
								border: '1px solid rgba(255, 255, 255, 0.08)',
								borderRadius: 12,
								padding: '16px 20px',
								textAlign: 'center',
							}}
						>
							<div
								style={{
									fontSize: 16,
									fontWeight: 400,
									color: '#FFFFFF',
									marginBottom: 4,
								}}
							>
								Generate a Mantra
							</div>
							<div
								style={{
									fontSize: 13,
									fontWeight: 400,
									color: 'rgba(255, 255, 255, 0.4)',
								}}
							>
								A short phrase to ground you
							</div>
						</div>
					</div>
				)}
			</div>
		</AbsoluteFill>
	);
};
