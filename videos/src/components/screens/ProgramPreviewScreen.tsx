import React from 'react';
import {
	AbsoluteFill,
	spring,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
} from 'remotion';
import {PhospheneBackground} from '../PhoneMockup';

interface Session {
	title: string;
	desc: string;
	completed?: boolean;
}

interface ProgramPreviewScreenProps {
	programTitle?: string;
	programDescription?: string;
	sessionCount?: number;
	sessionDuration?: string;
	credits?: number;
	sessions?: Session[];
}

export const ProgramPreviewScreen: React.FC<ProgramPreviewScreenProps> = ({
	programTitle = 'The One Hour Focus Method',
	programDescription = 'Learn to transform your life with just one hour of focused daily work. Master the psychology of attention, eliminate distractions, and build meaningful projects that create lasting change.',
	sessionCount = 5,
	sessionDuration = '~50 min',
	credits = 10,
	sessions = [
		{
			title: 'Clearing Mental Space',
			desc: 'Your mind processes only 50 bits of conscious information per second - distractions steal this precious...',
			completed: false,
		},
		{
			title: 'The Flow Formula',
			desc: 'Optimal focus requires three elements: clarity, importance, and urgency, with challenge slightly above...',
			completed: false,
		},
		{
			title: 'The Three-Phase Rhythm',
			desc: 'Productive days follow a natural rhythm: fill your mind, empty your mind, use your mind',
			completed: false,
		},
	],
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Stagger animations
	const titleOpacity = spring({
		frame: frame - 5,
		fps,
		config: {damping: 100},
	});

	const descOpacity = spring({
		frame: frame - 15,
		fps,
		config: {damping: 100},
	});

	const statsOpacity = spring({
		frame: frame - 25,
		fps,
		config: {damping: 100},
	});

	const sessionsOpacity = spring({
		frame: frame - 35,
		fps,
		config: {damping: 100},
	});

	// Session list scroll animation
	const sessionReveal = (index: number) => {
		return spring({
			frame: frame - (40 + index * 5),
			fps,
			config: {damping: 100},
		});
	};

	return (
		<AbsoluteFill>
			{/* Background */}
			<PhospheneBackground intensity={0.7} brightness={0.85} />

			{/* Content */}
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
					padding: '60px 24px 120px 24px',
					fontFamily: '"Crimson Pro", Georgia, serif',
					overflowY: 'auto',
				}}
			>
				{/* Program Title */}
				<div
					style={{
						fontSize: 26,
						fontWeight: 400,
						color: '#FFFFFF',
						marginBottom: 16,
						opacity: titleOpacity,
					}}
				>
					{programTitle}
				</div>

				{/* Program Description */}
				<div
					style={{
						fontSize: 15,
						fontWeight: 400,
						color: 'rgba(255, 255, 255, 0.6)',
						lineHeight: 1.5,
						marginBottom: 24,
						opacity: descOpacity,
					}}
				>
					{programDescription}
				</div>

				{/* Stats Row */}
				<div
					style={{
						display: 'flex',
						gap: 32,
						fontSize: 13,
						fontWeight: 400,
						color: 'rgba(255, 255, 255, 0.6)',
						fontFamily: 'Inter, sans-serif',
						marginBottom: 20,
						opacity: statsOpacity,
					}}
				>
					<div style={{display: 'flex', alignItems: 'center', gap: 8}}>
						<span>📚</span> {sessionCount} sessions
					</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 8}}>
						<span>⏱</span> {sessionDuration}
					</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 8}}>
						<span>⚡️</span> {credits} credits
					</div>
				</div>

				{/* Customize button */}
				<div
					style={{
						fontSize: 13,
						fontWeight: 400,
						color: 'rgba(255, 255, 255, 0.35)',
						fontFamily: 'Inter, sans-serif',
						marginBottom: 24,
						opacity: statsOpacity,
					}}
				>
					⚙️ Customize creation
				</div>

				{/* Session Outline Header */}
				<div
					style={{
						opacity: sessionsOpacity,
					}}
				>
					<div
						style={{
							fontSize: 11,
							fontWeight: 500,
							color: 'rgba(255, 255, 255, 0.6)',
							letterSpacing: 2,
							fontFamily: 'Inter, sans-serif',
							marginBottom: 4,
						}}
					>
						SESSION OUTLINE
					</div>
					<div
						style={{
							fontSize: 12,
							fontWeight: 400,
							color: 'rgba(255, 255, 255, 0.35)',
							marginBottom: 16,
						}}
					>
						Tap a session to start there
					</div>
				</div>

				{/* Session List */}
				<div>
					{sessions.map((session, index) => {
						const opacity = sessionReveal(index);

						return (
							<div
								key={index}
								style={{
									borderTop: '1px solid rgba(255, 255, 255, 0.08)',
									padding: '16px 0',
									opacity,
									transform: `translateY(${(1 - opacity) * 10}px)`,
								}}
							>
								<div
									style={{
										display: 'flex',
										gap: 12,
									}}
								>
									{/* Number or Checkmark */}
									<div
										style={{
											width: 24,
											flexShrink: 0,
											fontSize: 15,
											color:
												session.completed || index === 0
													? 'rgba(255, 255, 255, 0.6)'
													: 'rgba(255, 255, 255, 0.35)',
										}}
									>
										{session.completed || index === 0 ? '✓' : index + 1}
									</div>

									{/* Session Content */}
									<div style={{flex: 1}}>
										<div
											style={{
												fontSize: 16,
												fontWeight: 400,
												color: '#FFFFFF',
												marginBottom: 6,
											}}
										>
											{session.title}
										</div>
										<div
											style={{
												fontSize: 13,
												fontWeight: 400,
												color: 'rgba(255, 255, 255, 0.4)',
												lineHeight: 1.4,
											}}
										>
											{session.desc}
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</AbsoluteFill>
	);
};
