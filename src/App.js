import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MoviesPage from './pages/MoviesPage';
import TVPage from './pages/TVPage';
import MovieDetail from './pages/MovieDetail';
import TVDetail from './pages/TVDetail';
import SearchResults from './pages/SearchResults';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 70px)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/tv" element={<TVPage />} />
            <Route path="/tv/:id" element={<TVDetail />} />
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
