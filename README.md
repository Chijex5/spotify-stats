# Spotify Stats

![Spotify Stats Logo](/public/logo/music.svg)

A modern web application that provides detailed insights into your Spotify listening habits and music preferences.

## Features

- **Music Insights Dashboard**: Visualize your listening patterns and preferences
- **Top Tracks Analysis**: See your most played songs with detailed audio features
- **Mood Profiling**: Understand the emotional and sonic profile of your music taste
- **Playlist History**: Track changes in your playlists over time
- **Recently Played**: View your latest listening activity
- **Trends Analysis**: Discover patterns in your listening habits

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React, React Icons
- **Build Tool**: Vite

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Spotify account

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/spotify-stats.git
   cd spotify-stats
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Spotify API credentials
   ```
   VITE_SPOTIFY_CLIENT_ID=your_client_id
   VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
   ```

## Usage

1. Start the development server
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

3. Log in with your Spotify account to view your personalized music insights

## Building for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

## Privacy & Terms

This application uses the Spotify Web API to access your listening data. We only access the data you explicitly authorize. For more information, please see our:

- [Privacy Policy](/privacy-policy)
- [Terms of Use](/terms-of-use)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)