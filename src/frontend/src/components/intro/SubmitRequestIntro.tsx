import MysticalBorder from '../MysticalBorder';

export default function SubmitRequestIntro() {
  return (
    <MysticalBorder className="max-w-4xl mx-auto mb-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
          Submit Custom Request
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Tell us about your custom project needs.
        </p>
      </div>
    </MysticalBorder>
  );
}
