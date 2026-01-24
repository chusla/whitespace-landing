import React from 'react';
import {GradientSphere} from '../components/GradientSphere';

export const FlowIcon: React.FC = () => {
	return (
		<GradientSphere
			baseColor="#0a1628"
			gradientStops={[
				{offset: 0, color: '#1a3a5c'},
				{offset: 0.3, color: '#142d4a'},
				{offset: 0.6, color: '#0f2138'},
				{offset: 1, color: '#0a1628'},
			]}
			glowColor="rgba(100, 160, 200, 0.15)"
			glowIntensity={1}
			text="FLOW"
			textColor="rgba(255, 255, 255, 0.95)"
			isDark={true}
		/>
	);
};
