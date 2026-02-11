import MysticalBorder from '../MysticalBorder';

export default function AboutIntro() {
  return (
    <MysticalBorder className="max-w-4xl mx-auto mb-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
          About The Creator of Side Quests
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Forged from curiosity, chaos, and quiet magic. Discover the story, mission, and vision behind The Creator of Side Quests.
        </p>
      </div>
    </MysticalBorder>
  );
}
