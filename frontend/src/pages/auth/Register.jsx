import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Eye, EyeOff, Lock, Mail, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  // Validate form inputs
  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address';
    }
    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    return errs;
  };

  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 6) score += 25;
    if (pwd.length >= 10) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9!@#$%^&*]/.test(pwd)) score += 25;
    return score;
  };

  const strength = calculateStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      success('Welcome to WorkNest! Your account was created successfully.');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Registration failed. Please check your details.';
      toastError(msg);
      setErrors({ form: msg });
    } finally {
      setLoading(false);
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
          Create your account
        </h2>
        <p className="mt-2 text-sm text-brand-muted">
          Join your organization's project workspace
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-card rounded-3xl sm:px-10 border border-brand-border">
          {errors.form && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              {errors.form}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sahrish Khan"
                  className={`block w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${
                    errors.name ? 'border-red-400 bg-red-50/20' : 'border-brand-border bg-brand-ivory/30 focus:border-brand-primary'
                  }`}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

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
                  placeholder="sahrish@example.com"
                  className={`block w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${
                    errors.email ? 'border-red-400 bg-red-50/20' : 'border-brand-border bg-brand-ivory/30 focus:border-brand-primary'
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className={`block w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${
                    errors.password ? 'border-red-400 bg-red-50/20' : 'border-brand-border bg-brand-ivory/30 focus:border-brand-primary'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-muted hover:text-brand-forest"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Strength Meter */}
              {formData.password && (
                <div className="mt-2">
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength < 50 ? 'bg-red-500 w-1/4' : strength < 75 ? 'bg-amber-500 w-2/4' : 'bg-green-500 w-full'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] text-brand-muted mt-1 block">
                    Password strength: {strength < 50 ? 'Weak' : strength < 75 ? 'Medium' : 'Strong'}
                  </span>
                </div>
              )}
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Re-enter password"
                  className={`block w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${
                    errors.confirmPassword ? 'border-red-400 bg-red-50/20' : 'border-brand-border bg-brand-ivory/30 focus:border-brand-primary'
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-brand-primary hover:bg-brand-hoverGreen focus:outline-none shadow-md transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4 text-brand-peach" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-brand-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
