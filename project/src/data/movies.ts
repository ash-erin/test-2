export interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string[];
  year: number;
  rating: string;
  duration: string;
  thumbnail: string;
  backdrop: string;
  videoUrl: string;
  trailerUrl: string;
  isFeatured?: boolean;
  isInMyList?: boolean;
  likes?: number;
}

export interface ContentRow {
  id: string;
  title: string;
  movies: Movie[];
}

// Sample movies data
export const movies: Movie[] = [
  {
    id: '1',
    title: 'The Future of AI in Healthcare',
    description: 'Exploring how artificial intelligence is revolutionizing medical diagnosis and treatment.',
    genre: ['Technology', 'Healthcare'],
    year: 2024,
    rating: 'PG',
    duration: '45 min',
    thumbnail: '/src/assets/1.jpg',
    backdrop: '/src/assets/1.jpg',
    videoUrl: '/src/assets/sample-video.mp4',
    trailerUrl: '/src/assets/sample-trailer.mp4',
    likes: 1250
  },
  {
    id: '2',
    title: 'Sustainable Energy Solutions',
    description: 'Innovative approaches to renewable energy and environmental sustainability.',
    genre: ['Environment', 'Technology'],
    year: 2024,
    rating: 'PG',
    duration: '38 min',
    thumbnail: '/src/assets/2.jpg',
    backdrop: '/src/assets/2.jpg',
    videoUrl: '/src/assets/sample-video.mp4',
    trailerUrl: '/src/assets/sample-trailer.mp4',
    likes: 980
  },
  {
    id: '3',
    title: 'Blockchain Revolution',
    description: 'Understanding the impact of blockchain technology on various industries.',
    genre: ['Technology', 'Finance'],
    year: 2024,
    rating: 'PG',
    duration: '52 min',
    thumbnail: '/src/assets/3.jpg',
    backdrop: '/src/assets/3.jpg',
    videoUrl: '/src/assets/sample-video.mp4',
    trailerUrl: '/src/assets/sample-trailer.mp4',
    likes: 1450
  },
  {
    id: '4',
    title: 'Space Exploration 2024',
    description: 'Latest developments in space technology and exploration missions.',
    genre: ['Science', 'Space'],
    year: 2024,
    rating: 'PG',
    duration: '41 min',
    thumbnail: '/src/assets/4.jpg',
    backdrop: '/src/assets/4.jpg',
    videoUrl: '/src/assets/sample-video.mp4',
    trailerUrl: '/src/assets/sample-trailer.mp4',
    likes: 2100
  },
  {
    id: '5',
    title: 'Quantum Computing Breakthrough',
    description: 'Recent advances in quantum computing and their potential applications.',
    genre: ['Technology', 'Science'],
    year: 2024,
    rating: 'PG',
    duration: '47 min',
    thumbnail: '/src/assets/5.jpg',
    backdrop: '/src/assets/5.jpg',
    videoUrl: '/src/assets/sample-video.mp4',
    trailerUrl: '/src/assets/sample-trailer.mp4',
    likes: 1680
  },
  {
    id: '11',
    title: 'Machine Learning Applications',
    description: 'Real-world applications of machine learning in business and society.',
    genre: ['Technology', 'Business'],
    year: 2024,
    rating: 'PG',
    duration: '43 min',
    thumbnail: '/src/assets/11.jpg',
    backdrop: '/src/assets/11.jpg',
    videoUrl: '/src/assets/sample-video.mp4',
    trailerUrl: '/src/assets/sample-trailer.mp4',
    likes: 1320
  },
  {
    id: '12',
    title: 'Cybersecurity Trends',
    description: 'Latest trends and challenges in cybersecurity and data protection.',
    genre: ['Technology', 'Security'],
    year: 2024,
    rating: 'PG',
    duration: '39 min',
    thumbnail: '/src/assets/12.jpg',
    backdrop: '/src/assets/12.jpg',
    videoUrl: '/src/assets/sample-video.mp4',
    trailerUrl: '/src/assets/sample-trailer.mp4',
    likes: 890
  },
  {
    id: '13',
    title: 'Digital Transformation',
    description: 'How businesses are adapting to the digital age and new technologies.',
    genre: ['Business', 'Technology'],
    year: 2024,
    rating: 'PG',
    duration: '44 min',
    thumbnail: '/src/assets/13.jpg',
    backdrop: '/src/assets/13.jpg',
    videoUrl: '/src/assets/sample-video.mp4',
    trailerUrl: '/src/assets/sample-trailer.mp4',
    likes: 1150
  },
  {
    id: '14',
    title: 'IoT and Smart Cities',
    description: 'The role of Internet of Things in creating smarter urban environments.',
    genre: ['Technology', 'Urban Planning'],
    year: 2024,
    rating: 'PG',
    duration: '46 min',
    thumbnail: '/src/assets/14.jpg',
    backdrop: '/src/assets/14.jpg',
    videoUrl: '/src/assets/sample-video.mp4',
    trailerUrl: '/src/assets/sample-trailer.mp4',
    likes: 1380
  },
  {
    id: '15',
    title: 'Virtual Reality Innovation',
    description: 'Exploring the latest innovations in virtual and augmented reality.',
    genre: ['Technology', 'Entertainment'],
    year: 2024,
    rating: 'PG',
    duration: '40 min',
    thumbnail: '/src/assets/15.jpg',
    backdrop: '/src/assets/15.jpg',
    videoUrl: '/src/assets/sample-video.mp4',
    trailerUrl: '/src/assets/sample-trailer.mp4',
    likes: 1720
  }
];

export const featuredMovie: Movie = {
  id: 'featured',
  title: 'AI Hackathon 2024',
  description: 'Join the most innovative AI hackathon of the year, where brilliant minds come together to solve real-world challenges.',
  genre: ['Technology', 'Competition'],
  year: 2024,
  rating: 'PG',
  duration: '120 min',
  thumbnail: '/src/assets/Title.png',
  backdrop: '/src/assets/Title.png',
  videoUrl: '/src/assets/sample-video.mp4',
  trailerUrl: '/src/assets/sample-trailer.mp4',
  isFeatured: true,
  likes: 3500
};

export const contentRows: ContentRow[] = [
  {
    id: 'most-liked',
    title: 'Most Liked',
    movies: [] // This will be populated dynamically based on likes
  },
  {
    id: 'trending',
    title: 'Trending Now',
    movies: movies.slice(0, 6)
  },
  {
    id: 'popular',
    title: 'Popular This Week',
    movies: movies.slice(2, 8)
  },
  {
    id: 'china',
    title: 'China',
    movies: movies.slice(1, 7)
  },
  {
    id: 'germany',
    title: 'Germany',
    movies: movies.slice(3, 9)
  },
  {
    id: 'italy',
    title: 'Italy',
    movies: [
      {
        id: 'italy-1',
        title: 'Pasta e Fagioli',
        description: 'Discover the art of traditional Italian pasta making with authentic recipes from Nonna\'s kitchen.',
        genre: ['Food', 'Culture', 'Cooking'],
        year: 2024,
        rating: 'PG',
        duration: '42 min',
        thumbnail: '/src/assets/imgI2.jpg',
        backdrop: '/src/assets/imgI2.jpg',
        videoUrl: '/src/assets/sample-video.mp4',
        trailerUrl: '/src/assets/sample-trailer.mp4',
        likes: 2250
      },
      {
        id: 'italy-2',
        title: 'Tortellini in Bordo',
        description: 'Journey through Emilia-Romagna to uncover the secrets of perfect tortellini in rich broth.',
        genre: ['Food', 'Travel', 'Culture'],
        year: 2024,
        rating: 'PG',
        duration: '38 min',
        thumbnail: '/src/assets/imgI3.jpg',
        backdrop: '/src/assets/imgI3.jpg',
        videoUrl: '/src/assets/sample-video.mp4',
        trailerUrl: '/src/assets/sample-trailer.mp4',
        likes: 1890
      },
      {
        id: 'italy-3',
        title: 'Lasagna',
        description: 'Explore the rich history and regional variations of Italy\'s most beloved layered pasta dish.',
        genre: ['Food', 'History', 'Culture'],
        year: 2024,
        rating: 'PG',
        duration: '45 min',
        thumbnail: '/src/assets/imgI4.jpg',
        backdrop: '/src/assets/imgI4.jpg',
        videoUrl: '/src/assets/sample-video.mp4',
        trailerUrl: '/src/assets/sample-trailer.mp4',
        likes: 2100
      },
      {
        id: 'italy-4',
        title: 'Osso Buco',
        description: 'Master the art of Italian-style bundt cakes with traditional flavors and modern techniques.',
        genre: ['Food', 'Baking', 'Culture'],
        year: 2024,
        rating: 'PG',
        duration: '35 min',
        thumbnail: '/src/assets/imgI1.jpg',
        backdrop: '/src/assets/imgI1.jpg',
        videoUrl: '/src/assets/sample-video.mp4',
        trailerUrl: '/src/assets/sample-trailer.mp4',
        likes: 1750
      },
      {
        id: 'italy-5',
        title: 'Sicilian Specialties',
        description: 'Dive into the unique flavors of Sicily with traditional recipes passed down through generations.',
        genre: ['Food', 'Regional', 'Culture'],
        year: 2024,
        rating: 'PG',
        duration: '40 min',
        thumbnail: '/src/assets/imgI2.jpg',
        backdrop: '/src/assets/imgI2.jpg',
        videoUrl: '/src/assets/sample-video.mp4',
        trailerUrl: '/src/assets/sample-trailer.mp4',
        likes: 1980
      },
      {
        id: 'italy-6',
        title: 'Roman Cuisine Classics',
        description: 'Experience the timeless flavors of Rome with authentic dishes from the Eternal City.',
        genre: ['Food', 'History', 'Culture'],
        year: 2024,
        rating: 'PG',
        duration: '43 min',
        thumbnail: '/src/assets/imgI3.jpg',
        backdrop: '/src/assets/imgI3.jpg',
        videoUrl: '/src/assets/sample-video.mp4',
        trailerUrl: '/src/assets/sample-trailer.mp4',
        likes: 2180
      }
    ]
  },
  {
    id: 'japan',
    title: 'Japan',
    movies: [
      {
        id: 'japan-1',
        title: 'Kawaii Ramen Adventures',
        description: 'Discover the heartwarming world of Japanese ramen culture through adorable animated stories.',
        genre: ['Food', 'Culture', 'Animation'],
        year: 2024,
        rating: 'PG',
        duration: '35 min',
        thumbnail: '/src/assets/s2.png',
        backdrop: '/src/assets/s2.png',
        videoUrl: '/src/assets/sample-video.mp4',
        trailerUrl: '/src/assets/sample-trailer.mp4',
        likes: 1890
      },
      {
        id: 'japan-2',
        title: 'Cute Bento Box Stories',
        description: 'Explore the art of Japanese bento making with charming characters and delightful recipes.',
        genre: ['Food', 'Culture', 'Educational'],
        year: 2024,
        rating: 'PG',
        duration: '42 min',
        thumbnail: '/src/assets/s3.png',
        backdrop: '/src/assets/s3.png',
        videoUrl: '/src/assets/sample-video.mp4',
        trailerUrl: '/src/assets/sample-trailer.mp4',
        likes: 2150
      },
      {
        id: 'japan-3',
        title: 'Tonkotsu Tales',
        description: 'Journey through Japan\'s rich ramen heritage with lovable food characters.',
        genre: ['Food', 'Adventure', 'Culture'],
        year: 2024,
        rating: 'PG',
        duration: '38 min',
        thumbnail: '/src/assets/s4.png',
        backdrop: '/src/assets/s4.png',
        videoUrl: '/src/assets/sample-video.mp4',
        trailerUrl: '/src/assets/sample-trailer.mp4',
        likes: 1750
      },
      {
        id: 'japan-4',
        title: 'Seafood Udon Chronicles',
        description: 'Dive into the ocean of flavors with cute sea creatures in traditional Japanese noodle soups.',
        genre: ['Food', 'Ocean', 'Culture'],
        year: 2024,
        rating: 'PG',
        duration: '40 min',
        thumbnail: '/src/assets/s5.png',
        backdrop: '/src/assets/s5.png',
        videoUrl: '/src/assets/sample-video.mp4',
        trailerUrl: '/src/assets/sample-trailer.mp4',
        likes: 1620
      },
      {
        id: 'japan-5',
        title: 'Teriyaki Dreams',
        description: 'Follow adorable grilled characters as they share the secrets of perfect Japanese glazes.',
        genre: ['Food', 'Cooking', 'Culture'],
        year: 2024,
        rating: 'PG',
        duration: '33 min',
        thumbnail: '/src/assets/s6.png',
        backdrop: '/src/assets/s6.png',
        videoUrl: '/src/assets/sample-video.mp4',
        trailerUrl: '/src/assets/sample-trailer.mp4',
        likes: 1980
      },
      {
        id: 'japan-6',
        title: 'Sushi Master Class',
        description: 'Learn the ancient art of sushi making with friendly fish characters guiding your journey.',
        genre: ['Food', 'Educational', 'Culture'],
        year: 2024,
        rating: 'PG',
        duration: '45 min',
        thumbnail: '/src/assets/q9.png',
        backdrop: '/src/assets/q9.png',
        videoUrl: '/src/assets/sample-video.mp4',
        trailerUrl: '/src/assets/sample-trailer.mp4',
        likes: 2300
      }
    ]
  },
  {
    id: 'mexico',
    title: 'Mexico',
    movies: movies.slice(2, 8)
  },
  {
    id: 'spain',
    title: 'Spain',
    movies: movies.slice(1, 7)
  }
];

export const getMostLikedMovies = (allMovies: Movie[], count: number = 12): Movie[] => {
  return allMovies
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, count);
};