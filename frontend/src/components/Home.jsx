import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Optional, for easier HTTP requests
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const Home = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem('email');
  const [searchQuery, setSearchQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null); // Token state to store Spotify access token
  const [currentTrack, setCurrentTrack] = useState(null); // Track currently playing
  const [isPlaying, setIsPlaying] = useState(false); // State for checking if a track is playing
  const audioRef = useRef(new Audio()); // Audio element reference
  const [dropdownVisible, setDropdownVisible] = useState(false); // State to control dropdown visibility

  // Define your Spotify client_id and client_secret directly in the frontend (not recommended)
  const CLIENT_ID = '29351485ebd14acea6e2ec6002a1ca13';  // Replace with your actual client_id
  const CLIENT_SECRET = 'd88a4239e75441aaaf77d5e0de318c1c';  // Replace with your actual client_secret

  useEffect(() => {
    // Fetch the Spotify access token when the component mounts
    const fetchToken = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'grant_type=client_credentials&client_id=df9ee559c0944a18b6797006a754eaba&client_secret=81ff576eed824f3d9aeb4a7144d44f67',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch token: ${response.statusText}`);
        }

        const jsonData = await response.json();
        setToken(jsonData.access_token); // Store the access token
      } catch (err) {
        setError('Failed to fetch token');
        console.error('Error fetching token:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchToken(); // Fetch the token when component loads
  }, []);

  // Function to handle the logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/signin');
  };

  // Function to handle song search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null); // Reset error
    try {
      if (token) {
        const response = await axios.get(
          `https://api.spotify.com/v1/search?q=${searchQuery}&type=track`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Use the token for authorization
            },
          }
        );
        setSongs(response.data.tracks.items); // Set the search results
      }
    } catch (err) {
      console.error('Error fetching songs:', err);
      setError('Failed to fetch songs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const playSong = (track) => {
    if (currentTrack && currentTrack.id === track.id && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.src = track.preview_url || ''; // Use preview URL
      audioRef.current.play();
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  // Handle email click to toggle dropdown visibility

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img
              src='../assets/nav.jpeg'
              alt="Music App"
              width="30"
              height="24"
            />{' '}
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            {/* Search */}
            <form className="d-flex me-auto" onSubmit={handleSearch}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search songs or artists"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
            {/* User menu */}
            <ul className="navbar-nav">
                  <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {email}
                  </a>
                  <ul class="dropdown-menu">
                  <li><a className="dropdown-item" href='#'>LogOut</a></li>
                  </ul>
                </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Search Results */}
      <div className="container mt-4">
        {loading && (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {!loading && songs.length > 0 && (
          <div>
            <h4>Search Results:</h4>
            <ul className="list-group">
              {songs.map((song) => (
                <li
                  key={song.id}
                  className="list-group-item d-flex align-items-center"
                >
                  <img
                    src={song.album.images[2]?.url}
                    alt={song.name}
                    className="img-thumbnail me-3"
                    style={{ width: '50px', height: '50px' }}
                  />
                  <div>
                    <strong>{song.name}</strong>
                    <p className="mb-0 text-muted">
                      {song.artists.map((artist) => artist.name).join(', ')}
                    </p>
                  </div>
                  <button
                    className="btn btn-primary ms-auto"
                    onClick={() => playSong(song)}
                  >
                    {isPlaying && currentTrack.id === song.id ? 'Pause' : 'Play'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {!loading && searchQuery && songs.length === 0 && (
          <p className="text-center mt-3">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
