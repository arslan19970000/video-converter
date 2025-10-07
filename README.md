# VidConvert - Video Converter

A modern, free, and fast video converter built with Next.js 15 and FFmpeg.js. Convert videos directly in your browser without uploading to any server.

## Features

- **Client-Side Conversion**: All processing happens in your browser using FFmpeg.js
- **Multiple Formats**: Support for MP4, MOV, AVI, MKV, MP3, WAV, AAC
- **Drag & Drop**: Easy file upload with drag-and-drop interface
- **Real-Time Progress**: Live progress tracking during conversion
- **No Sign-Up Required**: Use instantly without creating an account
- **Secure & Private**: Files never leave your device
- **Modern UI**: Clean, responsive design with dark mode support

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **FFmpeg.js** - Browser-based video/audio processing
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components
- **Sonner** - Toast notifications

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/arslan19970000/video-converter.git
cd video-converter
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How It Works

1. **Upload**: Drag and drop or select a video/audio file
2. **Select Format**: Choose your desired output format
3. **Convert**: Click "Convert Now" and wait for the process to complete
4. **Download**: Download your converted file

The conversion happens entirely in your browser using WebAssembly-powered FFmpeg.

## Implementation Details

- **Client-Side Processing**: Uses `@ffmpeg/ffmpeg` for browser-based conversion
- **Progress Tracking**: Real-time progress updates during conversion
- **SharedArrayBuffer**: Special CORS headers configured for FFmpeg.js
- **File Management**: Automatic cleanup of blob URLs after download

## Project Structure

```
video-converter/
├── app/                    # Next.js app router pages
├── components/
│   ├── site/              # Site-specific components
│   │   ├── upload-panel.tsx   # Main conversion interface
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   └── ...
│   └── ui/                # Reusable UI components
├── hooks/
│   └── use-ffmpeg.ts      # FFmpeg conversion logic
├── lib/
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

## Configuration

The `next.config.mjs` includes required headers for FFmpeg.js:

```javascript
headers: [
  {
    key: "Cross-Origin-Embedder-Policy",
    value: "require-corp",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
]
```

## Supported Formats

**Video**: MP4, MOV, AVI, MKV, WebM
**Audio**: MP3, WAV, AAC

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

Can be deployed to any platform supporting Next.js:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Docker containers

## License

MIT

## Credits

Built by arslan19970000
Generated with assistance from Claude Code
