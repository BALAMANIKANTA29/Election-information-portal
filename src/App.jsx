import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Elections from './pages/Elections';
import ElectionDetails from './pages/ElectionDetails';
import Candidates from './pages/Candidates';
import CandidateDetails from './pages/CandidateDetails';
import Parties from './pages/Parties';
import PartyDetails from './pages/PartyDetails';
import Constituencies from './pages/Constituencies';
import Policies from './pages/Policies';
import Compare from './pages/Compare';
import Resources from './pages/Resources';

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/elections" element={<Elections />} />
              <Route path="/elections/:id" element={<ElectionDetails />} />
              <Route path="/candidates" element={<Candidates />} />
              <Route path="/candidates/:id" element={<CandidateDetails />} />
              <Route path="/parties" element={<Parties />} />
              <Route path="/parties/:id" element={<PartyDetails />} />
              <Route path="/constituencies" element={<Constituencies />} />
              <Route path="/policies" element={<Policies />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}
