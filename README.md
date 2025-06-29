# Project Clone - Streaming Platform

A modern streaming platform built with React, TypeScript, and Tailwind CSS. Features a Netflix-like interface with video streaming capabilities, user management, and content organization.

## Features

- **Video Streaming**: Full-featured video player with controls
- **Content Management**: Organized content rows with categories
- **User Features**: My List, likes, search functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **State Management**: React Hooks + Local Storage

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the local development URL

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Hero section
│   ├── ContentRow.tsx  # Movie content rows
│   ├── VideoPlayer.tsx # Video player component
│   ├── MovieModal.tsx  # Movie details modal
│   └── ...            # Other components
├── data/               # Data and mock content
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── assets/            # Static assets
```

## Key Components

- **Header**: Navigation with search, notifications, and user profile
- **Hero**: Featured content showcase
- **ContentRow**: Horizontal scrolling movie lists
- **VideoPlayer**: Full-screen video player with controls
- **MovieModal**: Detailed movie information and actions

## Features

### Video Player
- Play/pause controls
- Volume control
- Fullscreen support
- Progress bar with seeking
- Skip forward/backward

### Content Management
- Multiple content categories
- Like/unlike functionality
- Add to My List
- Search with suggestions
- Responsive grid layouts

### User Interface
- Dark theme optimized for viewing
- Smooth animations and transitions
- Mobile-responsive design
- Accessibility considerations

## Development

The project uses modern React patterns with TypeScript for type safety. All components are functional components using hooks for state management.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational and demonstration purposes.