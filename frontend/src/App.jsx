import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import CommandCenter from './pages/CommandCenter';
import Library from './pages/Library';
import ProductDetail from './pages/ProductDetail';
import Bookshelves from './pages/Bookshelves';
import Reader from './pages/Reader';
import CreatorStudio from './pages/CreatorStudio';
import Membership from './pages/Membership';
import StoryTime from './pages/StoryTime';
import Gutenberg from './pages/Gutenberg';
import GutenbergReader from './pages/GutenbergReader';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="command-center" element={<CommandCenter />} />
            <Route path="library" element={<Library />} />
            <Route path="library/:productId" element={<ProductDetail />} />
            <Route path="bookshelves" element={<Bookshelves />} />
            <Route path="reader/:productId" element={<Reader />} />
            <Route path="creator" element={<CreatorStudio />} />
            <Route path="membership" element={<Membership />} />
            <Route path="story-time" element={<StoryTime />} />
            <Route path="gutenberg" element={<Gutenberg />} />
            <Route path="gutenberg/read/:id" element={<GutenbergReader />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
