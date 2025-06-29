# Assets Directory

This directory contains all static assets for the streaming platform project.

## Image Assets

The following image files are used throughout the application:

### Main Content Images
- `1.jpg` through `15.jpg` - Technology and innovation themed content thumbnails
- `Title.png` - Main hero/featured content image

### Italian Content Images
- `imgI1.jpg` through `imgI4.jpg` - Italian cuisine and culture content

### Japanese Content Images
- `s2.png` through `s6.png` - Japanese food and culture content (kawaii style)
- `q9.png` - Additional Japanese content

### Logo and Branding
- `image copy.png` - SKÀ logo used in the header

### Video Assets
- `sample-video.mp4` - Sample video file for content playback
- `sample-trailer.mp4` - Sample trailer file for previews

## Usage

All images are referenced using relative paths from the src directory:
```typescript
thumbnail: '/src/assets/1.jpg'
```

## Image Guidelines

- **Thumbnails**: 16:9 aspect ratio recommended
- **Backdrops**: High resolution for hero sections
- **Logos**: SVG or PNG with transparency
- **Videos**: MP4 format for web compatibility

## Adding New Assets

1. Place new image files in this directory
2. Update the movies data in `src/data/movies.ts`
3. Ensure proper file naming conventions
4. Optimize images for web use

## File Organization

Assets are organized by content type and region:
- General tech content: numbered files (1.jpg, 2.jpg, etc.)
- Regional content: prefixed by region (imgI for Italy, s/q for Japan)
- Branding: descriptive names (Title.png, image copy.png)