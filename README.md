# Color Mixer

An interactive web tool for mixing colors and finding optimal color combinations.

## Description

Color Mixer is a React-based web application that lets you mix background and foreground colors and find the best RGB/RGBA color codes that most closely match a target color. The tool calculates color blending with alpha transparency and displays results with minimal color deviation.

## Features

- **Interactive color input**: Enter background and target colors
- **Automatic color calculation**: Finds the 25 best color combinations
- **Copy to clipboard**: Click a color code to copy it to the clipboard
- **Difference display**: Shows RGB differences and total deviation
- **Optimized performance**: Uses Preact as a lightweight React alternative
- **Clear buttons**: Quickly reset input fields

## Technology Stack

- **React 18.2.0** - UI framework (aliased to Preact for optimized bundle size)
- **Preact 10.27.0** - Lightweight React alternative
- **color-string** - Color conversion and parsing
- **React Scripts 5.0.1** - Build tools and development server
- **react-app-rewired** - Webpack configuration without eject
- **customize-cra** - Custom Webpack configuration

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd color-mixer
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The application will then be available at `http://localhost:3000`.

## Available Scripts

```bash
# Start development server
npm start

# Create production build
npm run build

# Run tests
npm test

# Eject React Scripts (not recommended)
npm run eject
```

## How It Works

1. **Color input**: Users enter a background color and a target color
2. **Color calculation**: The application computes all possible 3-digit hex color codes (with optional alpha transparency)
3. **Blending**: For each color, blending with the background color is simulated
4. **Sorting**: Results are sorted by the smallest deviation from the target color
5. **Display**: The top 25 results are shown with RGB differences

## Browser Support

- Chrome/Edge (modern versions)
- Firefox (modern versions)
- Safari (modern versions)
- No support for IE11 and Opera Mini

## Author

**Beo**

## License

This project is open source.

---

*RGB icons created by Freepik - Flaticon*
