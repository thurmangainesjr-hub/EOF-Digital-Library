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
import LibraryDashboard from './pages/LibraryDashboard';
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
import FilmStudioAppLayout from './layouts/FilmStudioAppLayout';
import MusicStudioAppLayout from './layouts/MusicStudioAppLayout';
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
import TheBListApp from './pages/TheBListApp';
import SkillsHub from './pages/SkillsHub';
import DevStudioAppLayout from './layouts/DevStudioAppLayout';
import DevStudioHub from './pages/DevStudioHub';
import DevStudioDept from './pages/DevStudioDept';
import GrowthStudioAppLayout from './layouts/GrowthStudioAppLayout';
import GrowthStudioHub from './pages/GrowthStudioHub';
import GrowthStudioDept from './pages/GrowthStudioDept';
import DevStudioWidgetPage from './pages/DevStudioWidgetPage';
import DevStudioTeamPage from './pages/DevStudioTeamPage';
import ProductionHubLayout from './layouts/ProductionHubLayout';
import ProductionHub from './pages/ProductionHub';
import GrowthStudioWidgetPage from './pages/GrowthStudioWidgetPage';
import GriotStudioAppLayout from './layouts/GriotStudioAppLayout';
import GriotStudioHub from './pages/GriotStudioHub';
import GriotStudioDept from './pages/GriotStudioDept';
import GriotStudioWidgetPage from './pages/GriotStudioWidgetPage';
import DevTeamLayout from './layouts/DevTeamLayout';
import DevTeamHub from './pages/DevTeamHub';
import DevTeamWidgetPage from './pages/DevTeamWidgetPage';
import DTEAgentRoster from './pages/DTEAgentRoster';
import DTEAgentProfile from './pages/DTEAgentProfile';
import DTEFactionsPage from './pages/DTEFactionsPage';
import DTEDevStudiosPage from './pages/DTEDevStudiosPage';
import DTEComingSoon from './pages/DTEComingSoon';
import GroitAgentRoster from './pages/GroitAgentRoster';
import GroitAgentProfile from './pages/GroitAgentProfile';
import FilmAgentRoster from './pages/FilmAgentRoster';
import FilmAgentProfile from './pages/FilmAgentProfile';
import MusicAgentRoster from './pages/MusicAgentRoster';
import MusicAgentProfile from './pages/MusicAgentProfile';
import GrowthAgentRoster from './pages/GrowthAgentRoster';
import GrowthAgentProfile from './pages/GrowthAgentProfile';
import UniversityAgentRoster from './pages/UniversityAgentRoster';
import UniversityAgentProfile from './pages/UniversityAgentProfile';
import LibraryAgentRoster from './pages/LibraryAgentRoster';
import LibraryAgentProfile from './pages/LibraryAgentProfile';
import GISAgentRoster from './pages/GISAgentRoster';
import GISAgentProfile from './pages/GISAgentProfile';
import CentralAgentRoster from './pages/CentralAgentRoster';
import CentralAgentProfile from './pages/CentralAgentProfile';
import BACAgentRoster from './pages/BACAgentRoster';
import BACAgentProfile from './pages/BACAgentProfile';
import FHHLAgentRoster from './pages/FHHLAgentRoster';
import FHHLAgentProfile from './pages/FHHLAgentProfile';
import VaultAgentRoster from './pages/VaultAgentRoster';
import VaultAgentProfile from './pages/VaultAgentProfile';
import ProductionAgentRoster from './pages/ProductionAgentRoster';
import ProductionAgentProfile from './pages/ProductionAgentProfile';
import StreamingAgentRoster from './pages/StreamingAgentRoster';
import StreamingAgentProfile from './pages/StreamingAgentProfile';
import RadioAgentRoster from './pages/RadioAgentRoster';
import RadioAgentProfile from './pages/RadioAgentProfile';
import AkashicAgentRoster from './pages/AkashicAgentRoster';
import AkashicAgentProfile from './pages/AkashicAgentProfile';
import BListAgentRoster from './pages/BListAgentRoster';
import BListAgentProfile from './pages/BListAgentProfile';
import AgentIntelligenceApp from './pages/AgentIntelligenceApp';

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
            {/* streaming + radio moved to standalone below */}
            <Route path="creator-academy" element={<CreatorAcademyHub />} />
            {/* akashic moved to standalone below */}
            <Route path="griot-central" element={<GriotCentralHub />} />
            <Route path="griot-architecture" element={<GriotArchitectureDoc />} />
            <Route path="projects" element={<UniversalProjectHub />} />
            <Route path="projects/widgets" element={<ProjectsWidgetPage />} />
            <Route path="griot-central/widgets" element={<GriotCentralWidgetPage />} />
            <Route path="widgets/all" element={<AllWidgetsHub />} />
            <Route path="library-dashboard" element={<LibraryDashboard />} />
            <Route path="library-team" element={<LibraryAgentRoster />} />
          </Route>
          {/* EOF Library — full-screen staff profile */}
          <Route path="/library-agent/:agentId" element={<LibraryAgentProfile />} />

          {/* Standalone full-screen apps (no sidebar/nav) */}
          <Route path="/streaming" element={<StreamingHub />} />
          <Route path="/streaming/widgets" element={<StreamingWidgetPage />} />
          <Route path="/streaming/roster" element={<StreamingAgentRoster />} />
          <Route path="/streaming/agent/:agentId" element={<StreamingAgentProfile />} />

          <Route path="/agent-intelligence" element={<AgentIntelligenceApp />} />

          <Route path="/the-b-list" element={<TheBListApp />} />
          <Route path="/the-b-list/roster" element={<BListAgentRoster />} />
          <Route path="/the-b-list/agent/:agentId" element={<BListAgentProfile />} />

          <Route path="/radio" element={<RadioHub />} />
          <Route path="/radio/widgets" element={<RadioWidgetPage />} />
          <Route path="/radio/roster" element={<RadioAgentRoster />} />
          <Route path="/radio/agent/:agentId" element={<RadioAgentProfile />} />

          <Route path="/akashic" element={<AkashicHub />} />
          <Route path="/akashic/widgets" element={<AkashicWidgetPage />} />
          <Route path="/akashic/roster" element={<AkashicAgentRoster />} />
          <Route path="/akashic/agent/:agentId" element={<AkashicAgentProfile />} />

          {/* Film Studio — CapCut-style NLE editor as the primary view */}
          <Route path="/film-studio" element={<FilmEditorApp />} />
          <Route path="/film-studio/hub" element={<FilmStudioAppLayout />}>
            <Route index element={<FilmStudioHub />} />
            <Route path="widgets" element={<FilmStudioWidgetPage />} />
            <Route path="roster" element={<FilmAgentRoster />} />
          </Route>
          {/* Film Studio — full-screen agent profile (outside layout) */}
          <Route path="/film-studio/agent/:agentId" element={<FilmAgentProfile />} />

          {/* Music Studio — Logic-style DAW as the primary view */}
          <Route path="/music-studio" element={<MusicRecorderApp />} />
          <Route path="/music-studio/hub" element={<MusicStudioAppLayout />}>
            <Route index element={<MusicStudioHub />} />
            <Route path="widgets" element={<MusicStudioWidgetPage />} />
            <Route path="roster" element={<MusicAgentRoster />} />
          </Route>
          {/* Music Studio — full-screen agent profile (outside layout) */}
          <Route path="/music-studio/agent/:agentId" element={<MusicAgentProfile />} />

          {/* BAC — standalone app shell */}
          <Route path="/bac" element={<BACAppLayout />}>
            <Route index element={<BACHub />} />
            <Route path="widgets" element={<BACWidgetPage />} />
            <Route path="roster"  element={<BACAgentRoster />} />
          </Route>
          {/* BAC — full-screen agent profile (outside layout) */}
          <Route path="/bac/agent/:agentId" element={<BACAgentProfile />} />

          {/* Legacy Vault — standalone app shell */}
          <Route path="/legacy-vault" element={<LegacyVaultAppLayout />}>
            <Route index element={<LegacyVaultHub />} />
            <Route path="widgets" element={<LegacyVaultWidgetPage />} />
            <Route path="roster"  element={<VaultAgentRoster />} />
          </Route>
          {/* Legacy Vault — full-screen agent profile (outside layout) */}
          <Route path="/legacy-vault/agent/:agentId" element={<VaultAgentProfile />} />

          {/* FHHL — standalone app shell */}
          <Route path="/fhhl" element={<FHHLAppLayout />}>
            <Route index element={<FHHLHub />} />
            <Route path="widgets" element={<FHHLWidgetPage />} />
            <Route path="league"  element={<FHHLLeagueHub />} />
            <Route path="draft"   element={<FHHLDraftHub />} />
            <Route path="roster"  element={<FHHLAgentRoster />} />
          </Route>
          {/* FHHL — full-screen agent profile (outside layout) */}
          <Route path="/fhhl/agent/:agentId" element={<FHHLAgentProfile />} />

          {/* Griot AI — standalone app shell */}
          <Route path="/griot" element={<GroitAppLayout />}>
            <Route index element={<GroitAIHub />} />
            <Route path="widgets" element={<GroitWidgetPage />} />
            <Route path="canon-keeper" element={<CanonKeeperHub />} />
            <Route path="story-architect" element={<StoryArchitectHub />} />
            <Route path="roster" element={<GroitAgentRoster />} />
          </Route>
          {/* Griot AI — full-screen agent profile (outside layout) */}
          <Route path="/griot/agent/:agentId" element={<GroitAgentProfile />} />

          {/* EOF Central AI Hub — standalone app shell */}
          <Route path="/central" element={<CentralAppLayout />}>
            <Route index element={<EOFCentralHub />} />
            <Route path="widgets" element={<CentralWidgetPage />} />
            <Route path="skills"  element={<SkillsHub />} />
            <Route path="roster"  element={<CentralAgentRoster />} />
          </Route>
          {/* Central AI Hub — full-screen agent profile (outside layout) */}
          <Route path="/central/agent/:agentId" element={<CentralAgentProfile />} />

          {/* DIY University — standalone app shell */}
          <Route path="/university" element={<UniversityAppLayout />}>
            <Route index element={<University />} />
            <Route path=":schoolId" element={<UniversitySchool />} />
            <Route path=":schoolId/:profId" element={<ProfessorAgent />} />
            <Route path="widgets" element={<UniversityWidgetPage />} />
            <Route path="roster" element={<UniversityAgentRoster />} />
          </Route>
          {/* DIY University — full-screen faculty profile */}
          <Route path="/university/agent/:agentId" element={<UniversityAgentProfile />} />

          {/* EOF Development Studios */}
          <Route path="/dev-studio" element={<DevStudioAppLayout />}>
            <Route index element={<DevStudioHub />} />
            <Route path="widgets"     element={<DevStudioWidgetPage />} />
            <Route path="team"        element={<DevStudioTeamPage />} />
            <Route path="executive/*" element={<DevStudioDept />} />
            <Route path="engineering"  element={<DevStudioDept />} />
            <Route path="ai-division"  element={<DevStudioDept />} />
            <Route path="qa"           element={<DevStudioDept />} />
            <Route path="security"     element={<DevStudioDept />} />
            <Route path="cloud"        element={<DevStudioDept />} />
            <Route path="clients"      element={<DevStudioDept />} />
            <Route path="factories"    element={<DevStudioDept />} />
            <Route path="knowledge"    element={<DevStudioDept />} />
            <Route path="rnd"          element={<DevStudioDept />} />
          </Route>

          {/* EOF Growth Intelligence Suite */}
          <Route path="/growth" element={<GrowthStudioAppLayout />}>
            <Route index element={<GrowthStudioHub />} />
            <Route path="widgets"     element={<GrowthStudioWidgetPage />} />
            <Route path="seo"         element={<GrowthStudioDept />} />
            <Route path="marketing"   element={<GrowthStudioDept />} />
            <Route path="content"     element={<GrowthStudioDept />} />
            <Route path="advertising" element={<GrowthStudioDept />} />
            <Route path="clients"     element={<GrowthStudioDept />} />
            <Route path="analytics"   element={<GrowthStudioDept />} />
            <Route path="portal"      element={<GrowthStudioDept />} />
            <Route path="roster"      element={<GrowthAgentRoster />} />
          </Route>
          {/* Growth Intelligence — full-screen agent profile */}
          <Route path="/growth/agent/:agentId" element={<GrowthAgentProfile />} />

          {/* EOF Production Hub — Master Control */}
          <Route path="/production" element={<ProductionHubLayout />}>
            <Route index element={<ProductionHub />} />
            <Route path="roster" element={<ProductionAgentRoster />} />
          </Route>
          {/* Production Hub — full-screen agent profile (outside layout) */}
          <Route path="/production/agent/:agentId" element={<ProductionAgentProfile />} />

          {/* Griot Interactive Studios — Unreal Engine Development Division */}
          <Route path="/griot-studio" element={<GriotStudioAppLayout />}>
            <Route index element={<GriotStudioHub />} />
            <Route path="widgets"        element={<GriotStudioWidgetPage />} />
            <Route path="roster"         element={<GISAgentRoster />} />
            <Route path="game-direction" element={<GriotStudioDept />} />
            <Route path="narrative"      element={<GriotStudioDept />} />
            <Route path="characters"     element={<GriotStudioDept />} />
            <Route path="world-building" element={<GriotStudioDept />} />
            <Route path="assets"         element={<GriotStudioDept />} />
            <Route path="unreal"         element={<GriotStudioDept />} />
            <Route path="combat"         element={<GriotStudioDept />} />
            <Route path="cinematics"     element={<GriotStudioDept />} />
            <Route path="audio"          element={<GriotStudioDept />} />
            <Route path="multiplayer"    element={<GriotStudioDept />} />
            <Route path="qa"             element={<GriotStudioDept />} />
            <Route path="publishing"     element={<GriotStudioDept />} />
          </Route>
          {/* GIS — full-screen agent profile (outside layout) */}
          <Route path="/griot-studio/agent/:agentId" element={<GISAgentProfile />} />

          {/* Agent profile — outside layout so it's full-screen */}
          <Route path="/dev-team/agent/:agentId" element={<DTEAgentProfile />} />

          {/* EOF Dev Team — Unified app: Dev Studios + Growth Intelligence + Production */}
          <Route path="/dev-team" element={<DevTeamLayout />}>
            <Route index element={<DevTeamHub />} />
            <Route path="widgets"  element={<DevTeamWidgetPage />} />
            <Route path="roster"   element={<DTEAgentRoster />} />
            <Route path="factions" element={<DTEFactionsPage />} />
            <Route path="studios"  element={<DTEDevStudiosPage />} />

            {/* Dev Studios section */}
            <Route path="dev" element={<DevStudioHub />} />
            <Route path="dev/team"        element={<DTEAgentRoster />} />
            <Route path="dev/executive/*" element={<DevStudioDept />} />
            <Route path="dev/engineering"  element={<DevStudioDept />} />
            <Route path="dev/ai-division"  element={<DevStudioDept />} />
            <Route path="dev/qa"           element={<DevStudioDept />} />
            <Route path="dev/security"     element={<DevStudioDept />} />
            <Route path="dev/cloud"        element={<DevStudioDept />} />
            <Route path="dev/clients"      element={<DevStudioDept />} />
            <Route path="dev/factories"    element={<DevStudioDept />} />
            <Route path="dev/knowledge"    element={<DevStudioDept />} />
            <Route path="dev/rnd"          element={<DevStudioDept />} />

            {/* Growth Intelligence section */}
            <Route path="growth" element={<GrowthStudioHub />} />
            <Route path="growth/seo"         element={<GrowthStudioDept />} />
            <Route path="growth/marketing"   element={<GrowthStudioDept />} />
            <Route path="growth/content"     element={<GrowthStudioDept />} />
            <Route path="growth/advertising" element={<GrowthStudioDept />} />
            <Route path="growth/clients"     element={<GrowthStudioDept />} />
            <Route path="growth/analytics"   element={<GrowthStudioDept />} />
            <Route path="growth/portal"      element={<GrowthStudioDept />} />

            {/* Production Hub page inside unified shell */}
            <Route path="production" element={<ProductionHub />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
