import MysticalBorder from '../MysticalBorder';

export default function LoreKnowledgeIntro() {
  return (
    <MysticalBorder className="max-w-4xl mx-auto mb-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
          Lore & Knowledge
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore the rich history, legends, and practical wisdom of the mystical world.
        </p>
      </div>
    </MysticalBorder>
  );
}
