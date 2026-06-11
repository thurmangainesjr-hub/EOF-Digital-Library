import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import LibraryAppLayout from './layouts/LibraryAppLayout';
import GroitAppLayout from './layouts/GroitAppLayout';
import FHHLAppLayout from './layouts/FHHLAppLayout';
import BACAppLayout from './layouts/BACAppLayout';
import LegacyVaultAppLayout from './layouts/LegacyVaultAppLayout';
import Dashboard from './pages/Dashboard';
import CommandCenter from './pages/CommandCenter';
import Library from './pages/Library';
import ProductDetail from './pages/ProductDetail';
import Bookshelves from './pages/Bookshelves';
import Reader from './pages/Reader';
import CreatorStudio from './pages/CreatorStudio';
import CreatorCommunity from './pages/CreatorCommunity';
import Membership from './pages/Membership';
import StoryTime from './pages/StoryTime';
import Gutenberg from './pages/Gutenberg';
import GutenbergReader from './pages/GutenbergReader';
import Setup from './pages/Setup';
import Adapt from './pages/Adapt';
import Login from './pages/Login';
import Register from './pages/Register';
import ThermalMonitor from './components/ThermalMonitor/ThermalMonitor';
import AppPreview from './pages/AppPreview';
import UniversityAppLayout from './layouts/UniversityAppLayout';
import University from './pages/University';
import UniversitySchool from './pages/UniversitySchool';
import ProfessorAgent from './pages/ProfessorAgent';
import UniversityWidgetPage from './pages/UniversityWidgetPage';
import EcosystemHub from './pages/EcosystemHub';
import GroitAIHub from './pages/GroitAIHub';
import StreamingHub from './pages/StreamingHub';
import RadioHub from './pages/RadioHub';
import CreatorAcademyHub from './pages/CreatorAcademyHub';
import LibraryWidgetPage from './pages/LibraryWidgetPage';
import GroitWidgetPage from './pages/GroitWidgetPage';
import EOFCentralHub from './pages/EOFCentralHub';
import CentralAppLayout from './layouts/CentralAppLayout';
import CentralWidgetPage from './pages/CentralWidgetPage';
import FHHLHub from './pages/FHHLHub';
import FHHLWidgetPage from './pages/FHHLWidgetPage';
import BACHub from './pages/BACHub';
import BACWidgetPage from './pages/BACWidgetPage';
import LegacyVaultHub from './pages/LegacyVaultHub';
import LegacyVaultWidgetPage from './pages/LegacyVaultWidgetPage';
import AkashicHub from './pages/AkashicHub';
import AkashicWidgetPage from './pages/AkashicWidgetPage';
import RadioWidgetPage from './pages/RadioWidgetPage';
import StreamingWidgetPage from './pages/StreamingWidgetPage';
import GriotCentralHub from './pages/GriotCentralHub';
import FilmStudioHub from './pages/FilmStudioHub';
import GriotArchitectureDoc from './pages/GriotArchitectureDoc';
import CanonKeeperHub from './pages/CanonKeeperHub';
import StoryArchitectHub from './pages/StoryArchitectHub';
import UniversalProjectHub from './pages/UniversalProjectHub';
import FHHLLeagueHub from './pages/FHHLLeagueHub';
import FHHLDraftHub from './pages/FHHLDraftHub';
import MusicStudioHub from './pages/MusicStudioHub';
import FilmEditorApp from './pages/FilmEditorApp';
import MusicRecorderApp from './pages/MusicRecorderApp';
import FilmStudioWidgetPage from './pages/FilmStudioWidgetPage';
import MusicStudioWidgetPage from './pages/MusicStudioWidgetPage';
import ProjectsWidgetPage from './pages/ProjectsWidgetPage';
import GriotCentralWidgetPage from './pages/GriotCentralWidgetPage';
import AllWidgetsHub from './pages/AllWidgetsHub';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* EOF Library — standalone app shell */}
          <Route path="/" element={<LibraryAppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="command-center" element={<CommandCenter />} />
            <Route path="library" element={<Library />} />
            <Route path="library/:productId" element={<ProductDetail />} />
            <Route path="bookshelves" element={<Bookshelves />} />
            <Route path="reader/:productId" element={<Reader />} />
            <Route path="creator" element={<CreatorStudio />} />
            <Route path="creator-community" element={<CreatorCommunity />} />
            <Route path="membership" element={<Membership />} />
            <Route path="story-time" element={<StoryTime />} />
            <Route path="gutenberg" element={<Gutenberg />} />
            <Route path="gutenberg/read/:id" element={<GutenbergReader />} />
            <Route path="setup" element={<Setup />} />
            <Route path="adapt/:source/:bookId" element={<Adapt />} />
            <Route path="thermal" element={<ThermalMonitor />} />
            <Route path="preview" element={<AppPreview />} />
            <Route path="widgets" element={<LibraryWidgetPage />} />
            <Route path="ecosystem" element={<EcosystemHub />} />
            <Route path="streaming" element={<StreamingHub />} />
            <Route path="streaming/widgets" element={<StreamingWidgetPage />} />
            <Route path="radio" element={<RadioHub />} />
            <Route path="radio/widgets" element={<RadioWidgetPage />} />
            <Route path="creator-academy" element={<CreatorAcademyHub />} />
            <Route path="akashic" element={<AkashicHub />} />
            <Route path="akashic/widgets" element={<AkashicWidgetPage />} />
            <Route path="griot-central" element={<GriotCentralHub />} />
            <Route path="griot-architecture" element={<GriotArchitectureDoc />} />
            <Route path="projects" element={<UniversalProjectHub />} />
            <Route path="projects/widgets" element={<ProjectsWidgetPage />} />
            <Route path="griot-central/widgets" element={<GriotCentralWidgetPage />} />
            <Route path="widgets/all" element={<AllWidgetsHub />} />
          </Route>

          {/* Standalone full-screen creator apps (no sidebar/nav) */}
          <Route path="/film-editor" element={<FilmEditorApp />} />
          <Route path="/music-recorder" element={<MusicRecorderApp />} />

          {/* Film Studio — part of Griot AI (same layout, same purple) */}
          <Route path="/film-studio" element={<GroitAppLayout />}>
            <Route index element={<FilmStudioHub />} />
            <Route path="widgets" element={<FilmStudioWidgetPage />} />
          </Route>

          {/* Music Studio — part of Griot AI (same layout, same purple) */}
          <Route path="/music-studio" element={<GroitAppLayout />}>
            <Route index element={<MusicStudioHub />} />
            <Route path="widgets" element={<MusicStudioWidgetPage />} />
          </Route>

          {/* BAC — standalone app shell */}
          <Route path="/bac" element={<BACAppLayout />}>
            <Route index element={<BACHub />} />
            <Route path="widgets" element={<BACWidgetPage />} />
          </Route>

          {/* Legacy Vault — standalone app shell */}
          <Route path="/legacy-vault" element={<LegacyVaultAppLayout />}>
            <Route index element={<LegacyVaultHub />} />
            <Route path="widgets" element={<LegacyVaultWidgetPage />} />
          </Route>

          {/* FHHL — standalone app shell */}
          <Route path="/fhhl" element={<FHHLAppLayout />}>
            <Route index element={<FHHLHub />} />
            <Route path="widgets" element={<FHHLWidgetPage />} />
            <Route path="league" element={<FHHLLeagueHub />} />
            <Route path="draft" element={<FHHLDraftHub />} />
          </Route>

          {/* Griot AI — standalone app shell */}
          <Route path="/griot" element={<GroitAppLayout />}>
            <Route index element={<GroitAIHub />} />
            <Route path="widgets" element={<GroitWidgetPage />} />
            <Route path="canon-keeper" element={<CanonKeeperHub />} />
            <Route path="story-architect" element={<StoryArchitectHub />} />
          </Route>

          {/* EOF Central AI Hub — standalone app shell */}
          <Route path="/central" element={<CentralAppLayout />}>
            <Route index element={<EOFCentralHub />} />
            <Route path="widgets" element={<CentralWidgetPage />} />
          </Route>

          {/* DIY University — standalone app shell */}
          <Route path="/university" element={<UniversityAppLayout />}>
            <Route index element={<University />} />
            <Route path=":schoolId" element={<UniversitySchool />} />
            <Route path=":schoolId/:profId" element={<ProfessorAgent />} />
            <Route path="widgets" element={<UniversityWidgetPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
