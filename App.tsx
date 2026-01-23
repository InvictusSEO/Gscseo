import React, { useState, useEffect, useMemo } from 'react';
import { 
  IconSparkles, 
  IconShield, 
  IconChevronRight, 
  IconGlobe, 
  IconSearch, 
  IconRefresh, 
  IconAlert, 
  IconChart 
} from './components/Icons';

import { ApiService, MOCK_PROPERTIES, mockAuth } from './services/api';
import { generateInsight } from './lib/insights';
import { User, Property, AnalyzedPage } from './lib/types';

import { Layout } from './components/Layout';
import { Button } from './components/Button';
import { DetailDrawer } from './components/DetailDrawer';

type DashViewState = 'properties' | 'sitemap' | 'analyzing' | 'results';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [dashView, setDashView] = useState<DashViewState>('properties');
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [results, setResults] = useState<AnalyzedPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [selectedPage, setSelectedPage] = useState<AnalyzedPage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const api = useMemo(() => new ApiService(), []);

  useEffect(() => {
    const init = async () => {
      const currentUser = await api.getMe();
      if (currentUser) {
        setUser(currentUser);
        const userProps = await api.getProperties();
        setProperties(userProps.length > 0 ? userProps : MOCK_PROPERTIES);
      }
      setIsLoading(false);
    };
    init();
  }, [api]);

  const handleLogin = () => {
    setIsLoading(true);
    setLoadingMessage("Connecting to Google...");
    window.location.href = `${window.location.origin}/auth/login`;
  };

  const handleDemo = async () => {
    setIsLoading(true);
    setLoadingMessage("Initializing Demo Workspace...");
    const data = await mockAuth();
    setUser(data.user);
    setProperties(data.properties);
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    setProperties([]);
    setResults([]);
    setDashView('properties');
  };

  const onPropertySelect = (prop: Property) => {
    setSelectedProperty(prop);
    setSitemapUrl(`${prop.siteUrl.replace(/\/$/, '')}/sitemap.xml`);
    setDashView('sitemap');
  };

  const runAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return;

    setDashView('analyzing');
    setIsLoading(true);
    setError(null);
    
    try {
      setLoadingMessage('Fetching Search Data...');
      const data = await api.analyzeSite(selectedProperty.siteUrl, sitemapUrl);
      
      setLoadingMessage('Generating Insights...');
      const analyzed = data.map((page: any, idx: number) => ({
        id: `pg-${idx}-${Date.now()}`,
        ...generateInsight(page)
      }));

      setResults(analyzed);
      setDashView('results');
    } catch (err: any) {
      setError(err.message || "Failed to connect to Google Search Console.");
      setDashView('sitemap');
    } finally {
      setIsLoading(false);
    }
  };

  // 1. GLOBAL INITIAL LOADING
  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] animate-pulse-soft">Visibility.ai Secure Boot</p>
        </div>
      </div>
    );
  }

  // 2. LANDING PAGE (Unauthenticated)
  if (!user) {
    return (
      <Layout user={null} onLogout={() => {}}>
        <div className="max-w-4xl mx-auto py-20 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-12 shadow-sm">
            <IconSparkles size={14} />
            Enterprise SEO Visibility Engine
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9] mb-10 animate-slide-up">
            Translate search <br />
            <span className="text-indigo-600 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">into strategy.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-xl mx-auto mb-16 font-medium leading-relaxed animate-slide-up delay-100">
            Visibility.ai decodes Google Search Console signals into actionable, human insights. Audit your indexing health in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up delay-200">
            <Button size="lg" onClick={handleLogin} className="w-full sm:w-auto rounded-2xl px-12 py-5 h-auto btn-indigo text-lg">
              <IconShield size={20} className="mr-3" /> Connect GSC Account
            </Button>
            <Button size="lg" variant="secondary" onClick={handleDemo} className="w-full sm:w-auto rounded-2xl px-12 py-5 h-auto border-slate-200 text-lg hover:bg-slate-50">
              Explore Demo Workspace
            </Button>
          </div>
          
          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 text-left opacity-60 hover:opacity-100 transition-opacity">
            <Feature icon={<IconChart size={24}/>} title="Data Correlation" desc="Maps sitemap intent against actual search performance." />
            <Feature icon={<IconSearch size={24}/>} title="Direct Diagnostics" desc="Simple explanations for why pages aren't ranking." />
            <Feature icon={<IconRefresh size={24}/>} title="Action Plans" desc="Step-by-step growth tactics for every indexed URL." />
          </div>
        </div>
      </Layout>
    );
  }

  // 3. DASHBOARD (Authenticated)
  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="animate-fade-in">
        {dashView === 'properties' && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-14 text-center">
              <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Select Property</h2>
              <p className="text-slate-500 font-medium">Which verified domain would you like to analyze?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.map((prop) => (
                <button 
                  key={prop.siteUrl} 
                  onClick={() => onPropertySelect(prop)}
                  className="group relative p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-500 text-left overflow-hidden"
                >
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 group-hover:bg-indigo-600 transition-colors duration-500 text-slate-400 group-hover:text-white">
                    <IconGlobe size={28} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-xl mb-2 pr-10 truncate leading-tight">{prop.siteUrl.replace(/^https?:\/\//, '')}</h3>
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verified GSC Asset</span>
                  </div>
                  <div className="absolute top-8 right-8 p-1 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 translate-x-4 duration-500">
                    <IconChevronRight size={24} className="text-indigo-600" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {dashView === 'sitemap' && (
          <div className="max-w-lg mx-auto">
            <button onClick={() => setDashView('properties')} className="mb-10 text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest flex items-center gap-2 transition-colors">
              <IconChevronRight size={14} className="rotate-180" /> Back to Properties
            </button>
            <div className="glass-card rounded-[3rem] p-12">
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <IconSearch size={32} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Sitemap Config</h2>
                <p className="text-slate-500 font-medium leading-relaxed">Enter your sitemap URL to audit indexing health.</p>
              </div>
              
              {error && (
                <div className="mb-8 p-5 bg-rose-50 border border-rose-100 rounded-2xl flex gap-4 text-rose-700 text-sm animate-pulse-soft">
                  <IconAlert size={20} className="shrink-0" />
                  <p className="font-bold leading-relaxed">{error}</p>
                </div>
              )}

              <form onSubmit={runAnalysis} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Sitemap Path</label>
                  <input 
                    type="url" 
                    required 
                    value={sitemapUrl} 
                    onChange={(e) => setSitemapUrl(e.target.value)}
                    className="w-full px-7 py-5 rounded-[1.5rem] border border-slate-200 focus:border-indigo-600 focus:ring-8 focus:ring-indigo-600/5 transition-all outline-none font-medium text-lg placeholder:text-slate-300"
                    placeholder="https://example.com/sitemap.xml"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full rounded-[1.5rem] py-5 h-auto btn-indigo text-lg">
                  Run Visibility Audit
                </Button>
              </form>
            </div>
          </div>
        )}

        {dashView === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="relative mb-16">
              <div className="w-28 h-28 border-[10px] border-slate-100 rounded-full"></div>
              <div className="absolute inset-0 w-28 h-28 border-[10px] border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <IconChart size={40} className="text-indigo-600 animate-pulse-soft" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">{loadingMessage}</h3>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em]">Querying Google Search Analytics API...</p>
          </div>
        )}

        {dashView === 'results' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div>
                <div className="flex items-center gap-5 mb-4">
                  <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Site Performance</h2>
                  <div className="px-5 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                    {results.length} Pages
                  </div>
                </div>
                <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em]">Domain: <span className="text-slate-900 ml-2">{selectedProperty?.siteUrl}</span></p>
              </div>
              <Button variant="outline" size="md" onClick={() => setDashView('sitemap')} className="rounded-2xl px-10 py-4 h-auto border-slate-200 hover:border-indigo-600 font-black text-xs uppercase tracking-widest">
                <IconRefresh size={18} className="mr-3" /> Re-Sync Data
              </Button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden mb-20">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Resource URL</th>
                      <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Diagnostics</th>
                      <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Impr.</th>
                      <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Pos.</th>
                      <th className="px-10 py-7 w-20"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {results.map((page) => (
                      <tr 
                        key={page.id} 
                        onClick={() => setSelectedPage(page)}
                        className="group hover:bg-indigo-50/30 transition-all cursor-pointer"
                      >
                        <td className="px-10 py-8">
                          <div className="font-bold text-slate-900 truncate max-w-sm text-base" title={page.url}>
                            {page.url.replace(selectedProperty?.siteUrl || '', '') || '/'}
                          </div>
                        </td>
                        <td className="px-10 py-8 text-center">
                          <span className={`
                            inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm
                            ${page.classification === 'Indexed & Visible' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                              page.classification === 'Not Indexed' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                              'bg-amber-50 text-amber-700 border-amber-100'}
                          `}>
                            {page.classification}
                          </span>
                        </td>
                        <td className="px-10 py-8 text-right font-mono font-black text-slate-600 text-sm">
                          {page.impressions.toLocaleString()}
                        </td>
                        <td className="px-10 py-8 text-right font-mono font-black text-slate-600 text-sm">
                          {page.position > 0 ? page.position.toFixed(1) : '—'}
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex justify-end">
                             <IconChevronRight size={22} className="text-slate-200 group-hover:text-indigo-600 transition-all group-hover:translate-x-1" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <DetailDrawer 
        isOpen={!!selectedPage} 
        page={selectedPage} 
        onClose={() => setSelectedPage(null)} 
      />
    </Layout>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="space-y-4">
      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600">
        {icon}
      </div>
      <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">{title}</h3>
      <p className="text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
  );
}