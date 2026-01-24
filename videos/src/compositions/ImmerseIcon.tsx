import React from 'react';
import {GradientSphere} from '../components/GradientSphere';

export const ImmerseIcon: React.FC = () => {
	return (
		<GradientSphere
			baseColor="#040d18"
			gradientStops={[
				{offset: 0, color: '#0d2a42'},
				{offset: 0.3, color: '#0a2035'},
				{offset: 0.6, color: '#071828'},
				{offset: 1, color: '#040d18'},
			]}
			glowColor="rgba(60, 140, 180, 0.2)"
			glowIntensity={1}
			text="IMMERSE"
			textColor="rgba(255, 255, 255, 0.95)"
			isDark={true}
		/>
	);
};
