# Design Direction: Dark Fantasy Theme

## Overview
A dark fantasy aesthetic inspired by ancient grimoires, arcane artifacts, and mystical parchments. The design balances medieval authenticity with modern usability.

## Color Palette

### Primary Colors (OKLCH)
- **Background Dark**: `oklch(0.145 0 0)` - Deep charcoal, almost black
- **Background Light**: `oklch(0.97 0 0)` - Warm off-white (light mode)
- **Parchment**: `oklch(0.85 0.02 60)` - Aged paper tone
- **Ink**: `oklch(0.25 0.01 30)` - Dark brown-black for text

### Accent Colors
- **Arcane Gold**: `oklch(0.75 0.12 85)` - Mystical golden glow
- **Ember Orange**: `oklch(0.65 0.18 45)` - Warm ember accent
- **Shadow Purple**: `oklch(0.45 0.15 300)` - Deep mystical purple
- **Blood Red**: `oklch(0.55 0.22 25)` - Destructive/warning color

### Semantic Colors
- **Success**: `oklch(0.65 0.15 145)` - Muted forest green
- **Warning**: `oklch(0.70 0.18 75)` - Amber warning
- **Destructive**: Blood Red (above)
- **Muted**: `oklch(0.55 0.02 30)` - Desaturated brown-gray

## Typography

### Font Families
- **Headings**: 'Cinzel', serif - Classical, elegant capitals
- **Body**: 'Crimson Text', serif - Readable old-style serif
- **Accent/UI**: 'Philosopher', sans-serif - Clean but characterful
- **Fallback**: Georgia, 'Times New Roman', serif

### Type Scale
- **Display**: 3.5rem (56px) - Hero titles
- **H1**: 2.5rem (40px)
- **H2**: 2rem (32px)
- **H3**: 1.5rem (24px)
- **H4**: 1.25rem (20px)
- **Body**: 1rem (16px)
- **Small**: 0.875rem (14px)
- **Tiny**: 0.75rem (12px)

### Font Weights
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## Spacing & Layout

### Spacing Scale (rem)
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)
- 3xl: 4rem (64px)

### Container Widths
- Max content width: 1400px
- Narrow content: 800px
- Wide content: 1200px

## Border Radius

### Varied Radii for Visual Interest
- **None**: 0 - Sharp edges for cards, panels
- **Subtle**: 4px - Slight softening
- **Medium**: 12px - Buttons, inputs
- **Large**: 24px - Feature cards
- **Full**: 9999px - Pills, badges, avatars

## Shadows & Depth

### Box Shadows
- **Subtle**: `0 1px 3px rgba(0, 0, 0, 0.3)`
- **Medium**: `0 4px 12px rgba(0, 0, 0, 0.4)`
- **Strong**: `0 8px 24px rgba(0, 0, 0, 0.5)`
- **Glow**: `0 0 20px rgba(255, 200, 100, 0.3)` - Golden glow effect

### Text Shadows
- **Subtle**: `0 1px 2px rgba(0, 0, 0, 0.5)`
- **Glow**: `0 0 10px rgba(255, 200, 100, 0.6)` - For glowing text

## Interactive States

### Hover Effects
- **Buttons**: Slight scale (1.02), brightness increase, glow shadow
- **Cards**: Lift effect (translateY -4px), stronger shadow, border glow
- **Links**: Color shift to accent, underline animation
- **Images**: Subtle zoom (scale 1.05), overlay fade

### Focus States
- **Ring**: 2px solid arcane gold with 2px offset
- **Glow**: Soft golden glow around focused element

### Active States
- **Scale**: 0.98 - Slight press effect
- **Brightness**: Reduced by 10%

## Card Styling

### Product Cards
- Background: Parchment tone with subtle texture
- Border: 1px solid with low opacity
- Radius: 0 (sharp) or 4px (subtle)
- Shadow: Medium, increases on hover
- Padding: 1.5rem
- Hover: Lift + glow border

### Content Cards
- Background: Semi-transparent dark overlay
- Border: Subtle golden accent
- Radius: 12px
- Shadow: Subtle to medium
- Padding: 2rem

## Backgrounds & Textures

### Primary Background
- Parchment texture image (generated asset)
- Dark overlay for depth
- Subtle vignette effect

### Overlays
- Semi-transparent dark: `rgba(0, 0, 0, 0.7)`
- Parchment overlay: `rgba(240, 230, 210, 0.05)`

## Icons & Imagery

### Icon Style
- Lucide React for UI icons
- Line-based, consistent stroke width
- Color: Foreground or accent colors
- Size: 16px, 20px, 24px, 32px

### Image Treatment
- Sepia or desaturated filters for authenticity
- Vignette overlays
- Border frames for featured images

## Animation & Motion

### Timing Functions
- **Ease-out**: Default for most animations
- **Ease-in-out**: For reversible states
- **Spring**: For playful interactions

### Durations
- **Fast**: 150ms - Micro-interactions
- **Medium**: 300ms - Standard transitions
- **Slow**: 500ms - Page transitions, reveals

### Animation Types
- Fade in/out
- Slide up/down
- Scale
- Rotate (for loading spinners)
- Glow pulse (for accents)

## Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: 1024px - 1440px
- **Wide**: > 1440px

## Accessibility

### Contrast Ratios
- Body text: Minimum 4.5:1 (AA)
- Large text: Minimum 3:1 (AA)
- UI components: Minimum 3:1

### Focus Indicators
- Always visible
- High contrast
- Minimum 2px width

### Motion
- Respect `prefers-reduced-motion`
- Provide static alternatives

## Design Principles

1. **Authenticity**: Embrace medieval/fantasy aesthetics without sacrificing usability
2. **Hierarchy**: Clear visual hierarchy through size, weight, and color
3. **Consistency**: Reuse patterns and components
4. **Restraint**: Avoid over-decoration; let content breathe
5. **Atmosphere**: Create mood through subtle effects, not overwhelming visuals
