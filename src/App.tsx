import React, { useState, useEffect } from 'react';
import { AnalysisMode, UserProfile } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { SpaceCursor } from './components/SpaceCursor';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './components/LandingPage';
import { WorkspaceView } from './components/WorkspaceView';
import { DashboardView } from './components/DashboardView';
import { HistoryView } from './components/HistoryView';
import { ReportsView } from './components/ReportsView';
import { ModelsView } from './components/ModelsView';
import { SettingsView } from './components/SettingsView';

export default function App() {
  const [activeView, setActiveView] = useState<string>('landing');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(2);

  // Parameters passed to WorkspaceView when jumping from Landing or Dashboard
  const [workspaceParams, setWorkspaceParams] = useState<{
    analysisId?: string;
    mode?: AnalysisMode;
    sample?: string;
    query?: string;
  }>({});

  // Fetch initial user session
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(err => console.error('Error fetching session:', err));

    // Fetch saved count
    fetch('/api/analyses')
      .then(res => res.json())
      .then(data => {
        if (data.analyses) {
          const sc = data.analyses.filter((a: any) => a.isSaved).length;
          setSavedCount(sc);
        }
      })
      .catch(() => {});
  }, []);

  const handleStartAnalysis = (mode?: string, sampleKey?: string, initialQuery?: string) => {
    setWorkspaceParams({
      mode: (mode as AnalysisMode) || 'single',
      sample: sampleKey,
      query: initialQuery
    });
    setActiveView('workspace');
  };

  const handleOpenAnalysis = (analysisId: string) => {
    setWorkspaceParams({ analysisId });
    setActiveView('workspace');
  };

  const handleLogout = () => {
    localStorage.removeItem('satquery_token');
    setUser(null);
  };

  const isFullWidthView = activeView === 'landing';

  return (
    <div className="min-h-screen bg-[#070D18] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Space-themed subtle cursor trail */}
      <SpaceCursor />

      {/* Primary Top Navigation */}
      <Navbar
        activeView={activeView}
        onNavigate={view => {
          if (view === 'workspace' && activeView !== 'workspace') {
            setWorkspaceParams({});
          }
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Layout */}
      {isFullWidthView ? (
        <main className="flex-1">
          <LandingPage
            onStartAnalysis={handleStartAnalysis}
            onNavigate={setActiveView}
          />
        </main>
      ) : (
        <div className="flex flex-1">
          {/* Scientific Sidebar Navigation */}
          <Sidebar
            activeView={activeView}
            onNavigate={view => {
              if (view === 'workspace' && activeView !== 'workspace') {
                setWorkspaceParams({});
              }
              setActiveView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            savedCount={savedCount}
          />

          {/* Sub-view Content Canvas */}
          <main className="flex-1 overflow-y-auto pb-12">
            {activeView === 'workspace' && (
              <WorkspaceView
                key={workspaceParams.analysisId || workspaceParams.sample || 'default-workspace'}
                initialAnalysisId={workspaceParams.analysisId}
                initialMode={workspaceParams.mode}
                initialSample={workspaceParams.sample}
                initialQuery={workspaceParams.query}
                onGenerateReport={() => setActiveView('reports')}
              />
            )}

            {activeView === 'dashboard' && (
              <DashboardView
                onOpenAnalysis={handleOpenAnalysis}
                onNewAnalysis={mode => handleStartAnalysis(mode)}
                onNavigate={setActiveView}
              />
            )}

            {activeView === 'history' && (
              <HistoryView
                onOpenAnalysis={handleOpenAnalysis}
                savedOnly={false}
              />
            )}

            {activeView === 'saved' && (
              <HistoryView
                onOpenAnalysis={handleOpenAnalysis}
                savedOnly={true}
              />
            )}

            {activeView === 'reports' && (
              <ReportsView onOpenAnalysis={handleOpenAnalysis} />
            )}

            {activeView === 'models' && <ModelsView />}

            {activeView === 'settings' && <SettingsView user={user} />}
          </main>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={newUser => setUser(newUser)}
      />
    </div>
  );
}
