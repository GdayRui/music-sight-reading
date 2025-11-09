# Piano Sight Reading Practice

A web application built with Next.js, TypeScript, React, and SCSS for practicing piano sight reading skills.

## Features

- **Interactive Music Staff**: Displays musical notes on a standard treble clef staff
- **Note Recognition Game**: Random note generation for practice
- **User Input Validation**: Text input and clickable note buttons (C, D, E, F, G, A, B)
- **Instant Feedback**: Shows success/failure results with correct answers
- **Clean, Responsive Design**: Modern UI with SCSS styling
- **Progressive Practice**: Generate new notes after each attempt

## Tech Stack

- **Next.js 14** - React framework for production
- **TypeScript** - Type-safe JavaScript
- **React 18** - Component-based UI library
- **SCSS** - Enhanced CSS with variables and nesting
- **SVG Graphics** - Scalable music notation rendering

## Getting Started

### Prerequisites

- Node.js (version 18.0.0 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sight-reading
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## How to Use

1. **View the Note**: A random musical note will appear on the staff
2. **Input Your Guess**: 
   - Type the note letter (C, D, E, F, G, A, B) in the text input
   - Or click one of the note buttons below the input
3. **Submit**: Click "Submit" to check your answer
4. **Review Results**: 
   - ✓ Correct answers show success message
   - ✗ Incorrect answers display the right answer
5. **Continue**: Click "Next Note" to practice with a new random note

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles
│   ├── page.tsx            # Main application page
│   ├── page.module.scss    # Page-specific styles
│   └── layout.tsx          # Root layout
├── components/
│   ├── Staff.tsx           # Musical staff component
│   ├── Staff.module.scss   # Staff styling
│   ├── NoteInput.tsx       # User input component
│   ├── NoteInput.module.scss # Input styling
│   ├── Result.tsx          # Result display component
│   └── Result.module.scss  # Result styling
```

## Features in Detail

### Musical Staff Component
- Renders treble clef with standard 5-line staff
- Positions notes accurately based on pitch
- Includes ledger lines for notes outside the staff
- SVG-based for crisp scaling

### Note Input System
- Accepts letter input (C through B)
- Real-time validation
- Visual note selection buttons
- Accessibility-friendly form controls

### Result Feedback
- Animated success/failure indicators
- Clear display of correct answers
- Smooth transitions between states

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Next.js and modern web technologies
- Musical notation rendered with SVG
- Responsive design principles
