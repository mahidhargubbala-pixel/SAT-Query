import React, { useState } from 'react';
import { X, Lock, Mail, User, ArrowRight, ShieldCheck, Building2 } from 'lucide-react';
import { UserProfile } from '../types';
import { Logo } from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (tab === 'forgot') {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        setMessage(data.message || 'Password reset link sent to your email.');
        setLoading(false);
        return;
      }

      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body =
        tab === 'login'
          ? { email: email.trim(), name: name.trim(), password }
          : { email: email.trim(), name: name.trim(), organization: organization.trim(), password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('satquery_token', data.token);
      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setMessage(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickGuest = () => {
    const guestUser: UserProfile = {
      id: `usr-evaluator-${Date.now()}`,
      name: 'Guest Analyst',
      email: 'analyst@satquery.local',
      role: 'Remote Sensing Evaluator',
      organization: 'Earth Observation Lab',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('satquery_token', `tok-${guestUser.id}`);
    onSuccess(guestUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Crisp White Light UI Container */}
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 p-7 shadow-2xl space-y-5 text-slate-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Logo & Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="flex justify-center mb-1">
            <Logo size="md" darkText={true} />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            {tab === 'login'
              ? 'Sign in to SatQuery AI'
              : tab === 'register'
              ? 'Create New Analyst Account'
              : 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-500">
            Enter your credentials to manage real-time analyses, saved investigations, and reports.
          </p>
        </div>

        {/* Tabs */}
        {tab !== 'forgot' && (
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setMessage('');
              }}
              className={`flex-1 py-2 font-bold rounded-lg transition-all ${
                tab === 'login'
                  ? 'bg-white text-sky-700 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setMessage('');
              }}
              className={`flex-1 py-2 font-bold rounded-lg transition-all ${
                tab === 'register'
                  ? 'bg-white text-sky-700 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* Notification Message */}
        {message && (
          <div
            className={`p-3 rounded-xl text-xs font-medium ${
              message.includes('sent')
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Navya Kanakala"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@organization.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>
          </div>

          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Organization / Institution (Optional)
              </label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. NRSC / ISRO / Research Lab"
                  value={organization}
                  onChange={e => setOrganization(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          {tab !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                {tab === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setTab('forgot');
                      setMessage('');
                    }}
                    className="text-[11px] text-sky-600 hover:text-sky-800 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {tab === 'login'
                    ? 'Sign In to Account'
                    : tab === 'register'
                    ? 'Complete Registration'
                    : 'Send Reset Instructions'}
                </span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Quick guest button */}
        <div className="pt-2 border-t border-slate-100 flex flex-col gap-2 text-center">
          <button
            type="button"
            onClick={handleQuickGuest}
            className="text-xs font-medium text-slate-600 hover:text-sky-700 hover:underline"
          >
            Or continue as Guest Analyst (No password required)
          </button>
          {tab === 'forgot' && (
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setMessage('');
              }}
              className="text-xs font-medium text-sky-600 hover:underline"
            >
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
