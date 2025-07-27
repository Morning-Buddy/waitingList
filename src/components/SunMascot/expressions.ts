// --- src/components/SunMascot/expressions.ts

export type Expression = 'idle' | 'happy' | 'excited' | 'love' | 'confused' | 'motivated' | 'star' | 'shocked'

export type EyeType = 'Normal' | 'Big' | 'Closed' | 'Confused' | 'Happy' | 'Love' | 'Motivated' | 'Star'
export type MouthType = 'Smile' | 'Excited' | 'Frown' | 'Shock' | 'Sly'

export interface ExpressionConfig {
  eye: EyeType
  mouth: MouthType
  duration?: number // Optional custom duration for this expression
}

export const expressionMap: Record<Expression, ExpressionConfig> = {
  idle: {
    eye: 'Normal',
    mouth: 'Smile',
    duration: 4000
  },
  happy: {
    eye: 'Happy',
    mouth: 'Smile',
    duration: 3000
  },
  excited: {
    eye: 'Big',
    mouth: 'Excited',
    duration: 2500
  },
  love: {
    eye: 'Love',
    mouth: 'Smile',
    duration: 3000
  },
  confused: {
    eye: 'Confused',
    mouth: 'Frown',
    duration: 2000
  },
  motivated: {
    eye: 'Motivated',
    mouth: 'Excited',
    duration: 2500
  },
  star: {
    eye: 'Star',
    mouth: 'Smile',
    duration: 2000
  },
  shocked: {
    eye: 'Big',
    mouth: 'Shock',
    duration: 1500
  }
}

// Helper function to get expression config
export const getExpressionConfig = (expression: Expression): ExpressionConfig => {
  return expressionMap[expression]
}

// Helper function to get random expression
export const getRandomExpression = (): Expression => {
  const expressions = Object.keys(expressionMap) as Expression[]
  return expressions[Math.floor(Math.random() * expressions.length)]
}

// Default expression cycle for automatic animation
export const defaultExpressionCycle: Expression[] = ['idle', 'happy', 'excited', 'love']