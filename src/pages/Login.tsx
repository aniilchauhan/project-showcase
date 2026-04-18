import React, { useState } from 'react';
import { Mail, Lock, CheckCircle2, AlertCircle, ArrowRight, Github, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in as admin, redirect to dashboard
  React.useEffect(() => {
    if (user?.isAdmin) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);
    setError('');

    try {
      // For this demo, we'll suggest Google login which is configured
      await login();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setLocalLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex flex-col justify-center items-center px-4 bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-200 border border-slate-100"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">Admin Portal</h1>
          <p className="text-slate-500">Access your dashboard to manage projects and leads.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm animate-in">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@devshowcase.app"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={localLoading}
            className="mt-4 w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-slate-800 shadow-xl shadow-slate-200 active:scale-[0.99] transition-all disabled:opacity-70"
          >
            {localLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>Sign In with Google <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </form>

        <div className="mt-10 flex flex-col gap-6 items-center">
          <div className="flex items-center gap-4 w-full text-slate-300">
            <div className="h-px bg-slate-100 flex-1" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Or continue with</span>
            <div className="h-px bg-slate-100 flex-1" />
          </div>

          <button className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-[0.99]">
            <Github className="w-5 h-5" /> GitHub SSO
          </button>
        </div>

        <p className="mt-10 text-center text-sm text-slate-400">
          Not an authorized admin? <Link to="/" className="text-primary-600 font-bold hover:underline">Return Home</Link>
        </p>
      </motion.div>
    </div>
  );
}
