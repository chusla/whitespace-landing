import React from 'react';
import {GradientSphere} from '../components/GradientSphere';

export const ElevateIcon: React.FC = () => {
	return (
		<GradientSphere
			baseColor="#e8f4fc"
			gradientStops={[
				{offset: 0, color: '#ffffff'},
				{offset: 0.2, color: '#e0f0fa'},
				{offset: 0.5, color: '#c5e4f5'},
				{offset: 0.8, color: '#a8d4ef'},
				{offset: 1, color: '#8bc4e8'},
			]}
			glowColor="rgba(255, 255, 255, 0.6)"
			glowIntensity={0.8}
			text="ELEVATE"
			textColor="rgba(30, 60, 90, 0.9)"
			isDark={false}
		/>
	);
};
