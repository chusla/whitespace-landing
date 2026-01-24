import {Composition} from 'remotion';
import {FlowIcon} from './compositions/FlowIcon';
import {ElevateIcon} from './compositions/ElevateIcon';
import {ImmerseIcon} from './compositions/ImmerseIcon';
import {AllThreeIcons} from './compositions/AllThreeIcons';
import {AppScreenShowcase} from './compositions/AppScreenShowcase';
import {FullAppShowcase} from './compositions/FullAppShowcase';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			{/* Full App Showcase - All 5 Screens */}
			<Composition
				id="FullAppShowcase"
				component={FullAppShowcase}
				durationInFrames={570}
				fps={30}
				width={1080}
				height={1920}
			/>

			{/* App Screen Showcase - Quick Demo (2 screens) */}
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
