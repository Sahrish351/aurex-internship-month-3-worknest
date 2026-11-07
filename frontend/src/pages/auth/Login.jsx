import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      success('Logged in successfully. Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Invalid email or password.';
      setErrorMsg(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Helper for quick mentor / evaluation testing
  const setDemoCredentials = (role) => {
    if (role === 'admin') {
      setFormData({ email: 'admin@worknest.test', password: 'AdminPassword123!' });
    } else if (role === 'manager') {
      setFormData({ email: 'manager@worknest.test', password: 'ManagerPassword123!' });
    } else {
      setFormData({ email: 'member@worknest.test', password: 'MemberPassword123!' });
    }
  };

  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-brand-sage">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-forest flex items-center justify-center text-brand-ivory shadow-md">
            <Compass className="w-6 h-6 text-brand-peach" />
          </div>
          <span className="font-serif text-3xl font-bold tracking-tight text-brand-forest">
            WorkNest
          </span>
        </Link>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-forest">
          Sign in to your workspace
        </h2>
        <p className="mt-2 text-sm text-brand-muted">
          Access your projects, team boards, and assigned tasks
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-card rounded-3xl sm:px-10 border border-brand-border">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@organization.com"
                  className="block w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-ivory/30 text-sm text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="block w-full pl-10 pr-10 py-2.5 rounded-xl border border-brand-border bg-brand-ivory/30 text-sm text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-muted hover:text-brand-forest"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-brand-forest hover:bg-brand-darkGreen focus:outline-none shadow-md transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 text-brand-peach" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Helper */}
          <div className="mt-6 pt-5 border-t border-brand-border/80 text-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-muted flex items-center justify-center gap-1.5 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-peach" /> Quick Test Evaluation Logins
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDemoCredentials('admin')}
                className="px-2.5 py-1.5 rounded-lg border border-brand-border bg-brand-ivory/60 hover:bg-brand-sage text-[11px] font-medium text-brand-forest transition-colors"
              >
                Admin Role
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('manager')}
                className="px-2.5 py-1.5 rounded-lg border border-brand-border bg-brand-ivory/60 hover:bg-brand-sage text-[11px] font-medium text-brand-forest transition-colors"
              >
                Manager Role
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('member')}
                className="px-2.5 py-1.5 rounded-lg border border-brand-border bg-brand-ivory/60 hover:bg-brand-sage text-[11px] font-medium text-brand-forest transition-colors"
              >
                Member Role
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-brand-muted">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-brand-primary hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
