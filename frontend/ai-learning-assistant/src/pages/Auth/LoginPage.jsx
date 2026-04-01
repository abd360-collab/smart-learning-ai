import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { BrainCircuit, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { token, user } = await authService.login(email, password);
      login(user, token);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
      toast.error(err.message || 'Failed to login.');
    }  finally {
      setLoading(false);
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 sm:px-6 lg:px-8">
    <div className="w-full max-w-md">

      {/* Card */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 md:p-10">

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25 mb-4">
            <BrainCircuit className="text-white" strokeWidth={2} />
          </div>

          <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">
            Welcome back
          </h1>

          <p className="text-sm sm:text-base text-slate-500 mt-2">
            Sign in to continue your journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

          {/* Email */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-2">
              EMAIL
            </label>

            <div className="relative">
              <Mail
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                  focusedField === "email"
                    ? "text-emerald-500"
                    : "text-slate-400"
                }`}
                strokeWidth={2}
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-2">
              PASSWORD
            </label>

            <div className="relative">
              <Lock
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                  focusedField === "password"
                    ? "text-emerald-500"
                    : "text-slate-400"
                }`}
                strokeWidth={2}
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                required
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm sm:text-base font-medium flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-70"
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>
                Sign in
                <ArrowRight size={18} strokeWidth={2.5} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-emerald-600 font-medium hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>

      {/* Bottom text */}
      <p className="text-center text-xs text-slate-400 mt-6">
        By continuing, you agree to our Terms & Privacy Policy
      </p>
    </div>
  </div>
);

 
}

export default LoginPage