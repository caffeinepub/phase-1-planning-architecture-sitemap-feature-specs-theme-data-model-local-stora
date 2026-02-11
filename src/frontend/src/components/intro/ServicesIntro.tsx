import MysticalBorder from '../MysticalBorder';

export default function ServicesIntro() {
  return (
    <MysticalBorder className="max-w-4xl mx-auto mb-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
          Our Services
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Expert services for collectors, from restoration and appraisal to protective enchantments and consultation.
        </p>
      </div>
    </MysticalBorder>
  );
}
