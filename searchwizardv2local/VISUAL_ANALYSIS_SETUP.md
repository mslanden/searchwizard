# Visual Analysis Setup Guide

## What's New: Visual Theme Capture! 🎨

I've added **Claude Vision** integration to capture the visual styling and theme of your documents, not just the content structure.

## How It Works

### 1. PDF → Image Conversion
- Converts your PDF to high-quality images
- Uses `pdf2image` library for clean conversion
- Analyzes first 3 pages for comprehensive styling

### 2. Claude Vision Analysis
- Claude "sees" your document and analyzes:
  - **Color scheme** (background, text, accent colors)
  - **Typography** (font styles, sizes, headings)
  - **Layout** (margins, spacing, alignment)
  - **Visual elements** (borders, tables, emphasis)
  - **Professional aesthetic** (modern, traditional, corporate)

### 3. Template Enhancement
- Combines text structure + visual styling
- Creates comprehensive template prompts
- Stores visual data for document generation

### 4. Visual-Aware Generation
- Generated documents match both content AND visual style
- Applies exact color schemes and typography
- Recreates layout and spacing patterns

## Installation

```bash
# Install additional dependencies for visual analysis
cd searchwizardv2local/backend
pip install pdf2image pillow

# On macOS, you may also need poppler:
brew install poppler
```

## What You'll See

**Before** (text-only): 
- Generic HTML with basic styling
- Missing visual theme and branding

**After** (visual analysis):
- Exact color schemes preserved
- Typography and layout matched
- Professional aesthetic maintained
- Background colors and styling elements included

## Benefits

1. **True Visual Fidelity**: Documents look identical to originals
2. **Brand Consistency**: Preserves company colors and styling
3. **Professional Polish**: Maintains design quality
4. **One-Click Theming**: No manual CSS writing needed

This solves the exact problem you identified - now the AI understands and replicates the visual theme, not just the content structure!