#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// SVGR conversion script for Morning Buddy mascot assets
const ASSETS_DIR = '../assets'
const OUTPUT_DIR = 'src/icons'

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

// Create subdirectories
const subdirs = ['Eyes', 'Mouths', 'Rays']
subdirs.forEach(dir => {
  const fullPath = path.join(OUTPUT_DIR, dir)
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true })
  }
})

console.log('🎨 Converting SVG assets to React components...')

// SVGR command template with TypeScript and optimization
const svgrCommand = (inputPath, outputPath) => 
  `npx @svgr/cli --typescript --jsx-runtime automatic --out-dir ${outputPath} ${inputPath}`

try {
  // Convert Base.svg
  if (fs.existsSync(`${ASSETS_DIR}/Base.svg`)) {
    execSync(svgrCommand(`${ASSETS_DIR}/Base.svg`, OUTPUT_DIR), { stdio: 'inherit' })
    console.log('✅ Converted Base.svg')
  }

  // Convert Eyes
  const eyeFiles = ['Big.svg', 'Closed.svg', 'Confused.svg', 'Happy.svg', 'Love.svg', 'Motivated.svg', 'Normal.svg', 'Star.svg']
  eyeFiles.forEach(file => {
    if (fs.existsSync(`${ASSETS_DIR}/Eyes/${file}`)) {
      execSync(svgrCommand(`${ASSETS_DIR}/Eyes/${file}`, `${OUTPUT_DIR}/Eyes`), { stdio: 'inherit' })
      console.log(`✅ Converted Eyes/${file}`)
    }
  })

  // Convert Mouths
  const mouthFiles = ['Excited.svg', 'Frown.svg', 'Shock.svg', 'Sly.svg', 'Smile.svg']
  mouthFiles.forEach(file => {
    if (fs.existsSync(`${ASSETS_DIR}/Mouths/${file}`)) {
      execSync(svgrCommand(`${ASSETS_DIR}/Mouths/${file}`, `${OUTPUT_DIR}/Mouths`), { stdio: 'inherit' })
      console.log(`✅ Converted Mouths/${file}`)
    }
  })

  // Convert Rays
  const rayFiles = ['1.svg', '2.svg', '3.svg', '4.svg']
  rayFiles.forEach(file => {
    if (fs.existsSync(`${ASSETS_DIR}/Rays/${file}`)) {
      execSync(svgrCommand(`${ASSETS_DIR}/Rays/${file}`, `${OUTPUT_DIR}/Rays`), { stdio: 'inherit' })
      console.log(`✅ Converted Rays/${file}`)
    }
  })

  console.log('🎉 All SVG assets converted successfully!')
  console.log(`📁 React components available in: ${OUTPUT_DIR}/`)

} catch (error) {
  console.error('❌ Error converting SVGs:', error.message)
  process.exit(1)
}