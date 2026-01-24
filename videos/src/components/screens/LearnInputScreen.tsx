import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {PhospheneBackground} from '../PhoneMockup';

interface LearnInputScreenProps {
	placeholderText?: string;
	inputText?: string;
	showUploadButton?: boolean;
}

export const LearnInputScreen: React.FC<LearnInputScreenProps> = ({
	placeholderText = 'https://twitter.com/user/status/123...',
	inputText = '',
	showUploadButton = true,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Stagger animations
	const backButtonDelay = 5;
	const headingDelay = 10;
	const inputDelay = 20;
	const buttonDelay = 30;

	const backButtonOpacity = spring({
		frame: frame - backButtonDelay,
		fps,
		config: {damping: 100},
	});

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
					height: '100%',
					padding: '0 9%',
					fontFamily: '"Crimson Pro", Georgia, serif',
				}}
			>
				{/* Back button */}
				<div
					style={{
						marginTop: 60,
						opacity: backButtonOpacity,
					}}
				>
					<div
						style={{
							fontSize: 28,
							color: 'rgba(255, 255, 255, 0.4)',
						}}
					>
						‹
					</div>
				</div>

				{/* Heading */}
				<div
					style={{
						textAlign: 'center',
						marginTop: '25%',
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
						to learn?
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

				{/* Action button or upload/recent */}
				{inputText ? (
					<div
						style={{
							textAlign: 'center',
							opacity: buttonOpacity,
						}}
					>
						<div
							style={{
								fontSize: 18,
								fontWeight: 400,
								color: '#FFFFFF',
								marginBottom: 6,
							}}
						>
							Create Program
						</div>
						<div
							style={{
								fontSize: 13,
								fontWeight: 400,
								color: 'rgba(255, 255, 255, 0.4)',
								fontFamily: 'Inter, sans-serif',
							}}
						>
							Transform into learning sessions
						</div>
					</div>
				) : (
					<div
						style={{
							opacity: buttonOpacity,
						}}
					>
						{showUploadButton && (
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 12,
									fontSize: 14,
									fontWeight: 400,
									color: 'rgba(255, 255, 255, 0.5)',
									fontFamily: 'Inter, sans-serif',
									marginBottom: 20,
								}}
							>
								<span style={{fontSize: 18}}>📎</span>
								Upload PDF or Document
							</div>
						)}

						<div
							style={{
								textAlign: 'center',
								fontSize: 13,
								fontWeight: 400,
								color: 'rgba(255, 255, 255, 0.4)',
								fontFamily: 'Inter, sans-serif',
							}}
						>
							&gt; Recent
						</div>
					</div>
				)}
			</div>
		</AbsoluteFill>
	);
};
