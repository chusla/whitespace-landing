# Whitespace Remotion Videos

Animated videos for the Whitespace meditation app, created with [Remotion](https://remotion.dev).

## What's Inside

This project converts the high-fidelity app screens from `screenshot-generator.html` and gradient designs into animated React videos using Remotion.

### Compositions

#### App Screen Demos (From screenshot-generator.html)

1. **FullAppShowcase** (1080x1920, 19 seconds) - Complete app demo featuring all 5 screens:
   - **Goal Input Screen**: "What would you like to focus on?" with typing animation
   - **Player Screen**: Meditation player with breathing circle animation
   - **Learn Input Screen**: "What would you like to learn?" with document upload option
   - **Generation Complete Screen**: Completion state with breathing circle
   - **Program Preview Screen**: Session curriculum with scrolling list
   - iPhone 15 Pro mockup with Dynamic Island
   - Phosphene background effects throughout
   - Smooth cross-fade transitions between scenes
   - Perfect for comprehensive product demos

2. **AppScreenShowcase** (1080x1920, 9 seconds) - Quick 2-screen demo:
   - Goal Input + Player screens only
   - Great for quick social media posts (Instagram Stories, TikTok, Reels)

#### Individual Screen Components

All screens available as reusable React components in `src/components/screens/`:
- `GoalInputScreen.tsx` - Focus input with typing animation
- `PlayerScreen.tsx` - Meditation player with progress bar
- `LearnInputScreen.tsx` - Learning input with upload button
- `GenerationCompleteScreen.tsx` - Completion state with credits display
- `ProgramPreviewScreen.tsx` - Session curriculum browser

#### Icon Gradients (From generate-images-subscriptions.html)

3. **Flow** (1024x1024) - Summer night lake blue gradient with breathing animation
4. **Elevate** (1024x1024) - Sky blue gradient with breathing animation
5. **Immerse** (1024x1024) - Deep ocean blue gradient with breathing animation
6. **AllThree** (1920x1080) - All three icons in sequence with fade transitions

## Getting Started

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm start
```

This opens the Remotion Studio where you can preview and edit all compositions.

### Render Videos

Render the full app showcase (all 5 screens, ~19 seconds):

```bash
npx remotion render FullAppShowcase out/full-app-showcase.mp4
```

Render the quick 2-screen demo (recommended for social media):

```bash
npx remotion render AppScreenShowcase out/app-showcase.mp4
```

Render icon gradients:

```bash
npx remotion render Flow out/flow.mp4
npx remotion render Elevate out/elevate.mp4
npx remotion render Immerse out/immerse.mp4
npx remotion render AllThree out/all-three.mp4
```

Render as PNG sequence (for transparency):

```bash
npx remotion render Flow out/flow-sequence
```

Render as single PNG image (still frame):

```bash
npx remotion still Flow out/flow.png --frame=75
```

## Customization

### Adding New Gradients

To add more gradient variations (like the credit packages from `generate-images-subscriptions.html`):

1. Create a new composition file in `src/compositions/`
2. Use the `GradientSphere` component with custom colors
3. Register it in `src/Root.tsx`

Example:

```tsx
import {GradientSphere} from '../components/GradientSphere';

export const ArriveCreditIcon: React.FC = () => {
  return (
    <GradientSphere
      baseColor="#150a0c"
      gradientStops={[
        {offset: 0, color: '#3d1820'},
        {offset: 0.3, color: '#2d1218'},
        {offset: 0.6, color: '#200c10'},
        {offset: 1, color: '#150a0c'},
      ]}
      glowColor="rgba(255, 120, 100, 0.20)"
      glowIntensity={1}
      text="ARRIVE"
      subtitle="3 Credits"
      textColor="rgba(255, 250, 248, 0.95)"
      isDark={true}
    />
  );
};
```

### Animation Settings

The `GradientSphere` component includes:
- **Entrance animation**: Spring-based scale and fade
- **Breathing effect**: Subtle glow pulsing
- Duration: 150 frames (5 seconds at 30fps)

Modify in `src/components/GradientSphere.tsx`

## Project Structure

```
videos/
├── src/
│   ├── components/
│   │   ├── PhoneMockup.tsx           # iPhone 15 Pro mockup & phosphene background
│   │   ├── GradientSphere.tsx        # Reusable gradient component
│   │   └── screens/
│   │       ├── GoalInputScreen.tsx   # "What would you like to focus on?"
│   │       ├── PlayerScreen.tsx      # Meditation player with breathing circle
│   │       ├── LearnInputScreen.tsx  # "What would you like to learn?"
│   │       ├── GenerationCompleteScreen.tsx  # Completion state with credits
│   │       └── ProgramPreviewScreen.tsx      # Session curriculum view
│   ├── compositions/
│   │   ├── FullAppShowcase.tsx       # Complete 5-screen app demo (19s)
│   │   ├── AppScreenShowcase.tsx     # Quick 2-screen demo (9s)
│   │   ├── FlowIcon.tsx              # Flow gradient
│   │   ├── ElevateIcon.tsx           # Elevate gradient
│   │   ├── ImmerseIcon.tsx           # Immerse gradient
│   │   └── AllThreeIcons.tsx         # Sequential icon composition
│   ├── Root.tsx                      # Composition registry
│   └── index.ts                      # Entry point
├── public/
│   └── index.html
├── package.json
├── tsconfig.json
└── remotion.config.ts
```

## Output Formats

Remotion supports various output formats:

- **MP4**: `npx remotion render <composition> out.mp4`
- **WebM**: `npx remotion render <composition> out.webm`
- **PNG sequence**: `npx remotion render <composition> out-dir/`
- **GIF**: `npx remotion render <composition> out.gif`
- **Still image**: `npx remotion still <composition> out.png`

## Tips

- Use the Remotion Studio (`npm start`) to preview animations in real-time
- Adjust `durationInFrames` in `Root.tsx` to change video length
- Modify the `fps` to change frame rate (30fps recommended)
- The `spring` animation in `GradientSphere` can be customized via the `config` object

## Learn More

- [Remotion Documentation](https://remotion.dev/docs)
- [Remotion API Reference](https://remotion.dev/docs/api)
- [Animation Techniques](https://remotion.dev/docs/animating-properties)
