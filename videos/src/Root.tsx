import {Composition} from 'remotion';
import {FlowIcon} from './compositions/FlowIcon';
import {ElevateIcon} from './compositions/ElevateIcon';
import {ImmerseIcon} from './compositions/ImmerseIcon';
import {AllThreeIcons} from './compositions/AllThreeIcons';
import {AppScreenShowcase} from './compositions/AppScreenShowcase';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			{/* App Screen Showcase - Main Demo */}
			<Composition
				id="AppScreenShowcase"
				component={AppScreenShowcase}
				durationInFrames={270}
				fps={30}
				width={1080}
				height={1920}
			/>

			{/* Original Icon Compositions */}
			<Composition
				id="Flow"
				component={FlowIcon}
				durationInFrames={150}
				fps={30}
				width={1024}
				height={1024}
			/>
			<Composition
				id="Elevate"
				component={ElevateIcon}
				durationInFrames={150}
				fps={30}
				width={1024}
				height={1024}
			/>
			<Composition
				id="Immerse"
				component={ImmerseIcon}
				durationInFrames={150}
				fps={30}
				width={1024}
				height={1024}
			/>
			<Composition
				id="AllThree"
				component={AllThreeIcons}
				durationInFrames={300}
				fps={30}
				width={1920}
				height={1080}
			/>
		</>
	);
};
