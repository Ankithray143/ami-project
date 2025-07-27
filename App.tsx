import React, { useEffect, useState } from 'react';
import { Brain, FileText, LineChart, GraduationCap, BriefcaseIcon } from 'lucide-react';
import { Auth } from './components/Auth';
import { supabase } from './lib/supabase';

function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Dashboard({ user, onSignOut }: { user: any, onSignOut: () => void }) {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Get intelligent insights on your resume and job applications with advanced AI technology."
    },
    {
      icon: LineChart,
      title: "Job Market Predictions",
      description: "Stay ahead with real-time job market trends and opportunity forecasts."
    },
    {
      icon: GraduationCap,
      title: "Learning Paths",
      description: "Personalized learning recommendations to boost your career growth."
    },
    {
      icon: FileText,
      title: "Smart Autofill",
      description: "Automatically fill job applications with tailored responses using AI."
    },
    {
      icon: BriefcaseIcon,
      title: "Work Assistant",
      description: "Intelligent task prioritization and deadline management for your job search."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">AMI</span>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-gray-600">Welcome, {user.email}</span>
              <button
                onClick={onSignOut}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-indigo-600">AMI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your AI-powered career assistant is ready to help you succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-indigo-600 mb-2">95%</div>
              <div className="text-gray-600">Application Success Rate</div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-indigo-600 mb-2">50K+</div>
              <div className="text-gray-600">Users Helped</div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-indigo-600 mb-2">24/7</div>
              <div className="text-gray-600">AI Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(session);

        // Listen for auth changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });

        return () => subscription.unsubscribe();
      } catch (err) {
        setError(err.message);
        console.error('Error initializing app:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error: {error}</div>
          <p className="text-gray-600">Please check your environment variables and try again.</p>
        </div>
      </div>
    );
  }

  return session ? (
    <Dashboard user={session.user} onSignOut={handleSignOut} />
  ) : (
    <Auth />
  );
}

export default App;