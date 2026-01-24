import {Composition} from 'remotion';
import {FlowIcon} from './compositions/FlowIcon';
import {ElevateIcon} from './compositions/ElevateIcon';
import {ImmerseIcon} from './compositions/ImmerseIcon';
import {AllThreeIcons} from './compositions/AllThreeIcons';

export const RemotionRoot: React.FC = () => {
	return (
		<>
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
