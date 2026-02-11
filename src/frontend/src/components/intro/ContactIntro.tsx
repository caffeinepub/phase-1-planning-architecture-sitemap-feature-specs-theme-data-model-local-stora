import MysticalBorder from '../MysticalBorder';

export default function ContactIntro() {
  return (
    <MysticalBorder className="max-w-4xl mx-auto mb-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
          Contact Us
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Get in touch with our team for inquiries, support, or collaboration opportunities.
        </p>
      </div>
    </MysticalBorder>
  );
}
