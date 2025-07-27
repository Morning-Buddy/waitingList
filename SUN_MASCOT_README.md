# Sun Mascot System

A modular, animated mascot system for the Morning Buddy landing page built with React, TypeScript, and Framer Motion.

## Architecture Overview

The mascot system consists of:
- **Individual SVG components** (generated from assets via SVGR)
- **Expression system** with predefined emotion mappings
- **Animated Ray components** with GPU-optimized variants
- **Main SunMascot component** with smooth transitions
- **Hero integration** with automatic cycling and event triggers

## Adding New Expressions

### 1. Add SVG Assets
Place new SVG files in the appropriate `assets/` subdirectory:
```
assets/
├─ eyes/NewEye.svg
├─ mouths/NewMouth.svg
└─ rays/NewRay.svg (optional)
```

### 2. Convert to React Components
Run the conversion script:
```bash
cd morning-buddy-landing
node scripts/convert-svgs.js
```

This generates TypeScript React components in `src/icons/`.

### 3. Update Expression Types
In `src/components/SunMascot/expressions.ts`:

```typescript
// Add to the Expression union type
export type Expression = 'idle' | 'blink' | 'cheer' | 'newExpression'

// Add to the expressionMap
export const expressionMap: Record<Expression, ExpressionConfig> = {
  // ... existing expressions
  newExpression: {
    eye: 'newEye',        // matches SVG filename (without extension)
    mouth: 'newMouth',    // matches SVG filename (without extension)
    rayVariant: 'fast',   // 'slow' | 'fast' | 'burst' | 'none'
    duration: 2000        // optional: how long to show this expression
  }
}
```

### 4. Import New Components
In `src/components/SunMascot/SunMascot.tsx`, import and add to the component mappings:

```typescript
// Import the new components
import NewEye from '../../icons/eyes/NewEye'
import NewMouth from '../../icons/mouths/NewMouth'

// Add to the component mappings
const EyeComponent = {
  // ... existing mappings
  newEye: NewEye
}[config.eye]

const MouthComponent = {
  // ... existing mappings
  newMouth: NewMouth
}[config.mouth]
```

### 5. Use the New Expression
```typescript
// In any component
<SunMascot expression="newExpression" />

// Or add to the default cycle
export const defaultExpressionCycle: Expression[] = [
  'idle', 'blink', 'newExpression', 'cheer'
]
```

## Ray Animation Variants

Four built-in ray animation variants are available:

- **`slow`**: Gentle rotation and pulsing (8s duration)
- **`fast`**: Energetic rotation and scaling (3s duration)
- **`burst`**: Explosive scaling and rotation (1.5s duration)
- **`none`**: Static, dimmed rays (for sad/sleepy expressions)

### Adding Custom Ray Variants

In `src/components/SunMascot/Ray.tsx`:

```typescript
export const rayVariants: Record<RayVariant, Variants> = {
  // ... existing variants
  customVariant: {
    initial: { opacity: 0.5, scale: 1, rotate: 0 },
    animate: {
      opacity: [0.5, 1, 0.5],
      scale: [1, 1.3, 1],
      rotate: [0, 90, 180],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }
}
```

Then update the `RayVariant` type in `expressions.ts`:
```typescript
export type RayVariant = 'slow' | 'fast' | 'burst' | 'none' | 'customVariant'
```

## Performance Considerations

### GPU Optimization
- All animations use GPU-friendly properties (`transform`, `opacity`)
- Avoid animating layout properties (`width`, `height`, `top`, `left`)
- Use `transform-gpu` class for hardware acceleration

### Reduced Motion Support
- Automatically detects `prefers-reduced-motion: reduce`
- Disables continuous animations when preferred
- Maintains static visual feedback

### Bundle Size
- Components are imported selectively (not the entire icons directory)
- Tree-shaking eliminates unused expressions
- SVG components are optimized by SVGR

## Usage Examples

### Basic Usage
```typescript
import { SunMascot } from './components/SunMascot/SunMascot'

<SunMascot expression="idle" size={200} />
```

### With Auto-Cycling
```typescript
const [expression, cycleExpression] = useCycle('idle', 'blink', 'cheer')

useEffect(() => {
  const interval = setInterval(cycleExpression, 6000)
  return () => clearInterval(interval)
}, [cycleExpression])

<SunMascot expression={expression} />
```

### Event-Triggered Expressions
```typescript
const [shouldCheer, setShouldCheer] = useState(false)

const handleSuccess = () => {
  setShouldCheer(true)
  setTimeout(() => setShouldCheer(false), 3000)
}

<SunMascot expression={shouldCheer ? 'cheer' : 'idle'} />
```

## File Structure

```
src/
├─ components/
│  └─ SunMascot/
│     ├─ expressions.ts      # Expression types and mappings
│     ├─ Ray.tsx            # Animated ray component
│     └─ SunMascot.tsx      # Main mascot component
├─ icons/                   # Generated SVG components
│  ├─ BubbleBase.tsx
│  ├─ eyes/
│  ├─ mouths/
│  ├─ rays/
│  └─ misc/
scripts/
└─ convert-svgs.js          # SVGR conversion script
```

## Troubleshooting

### SVG Conversion Issues
- Ensure SVG files are valid and optimized
- Check that SVGR CLI is installed: `npm install --save-dev @svgr/cli`
- Verify file paths in the conversion script

### Animation Performance
- Use browser dev tools to check for layout thrashing
- Ensure `will-change` is set appropriately
- Test on lower-end devices

### TypeScript Errors
- Ensure all new expressions are added to the union type
- Check that component imports match the generated filenames
- Verify SVG prop types are correctly defined