import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService.js';
import { BrainCircuit, Mail, Lock, ArrowRight, User } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterPage = () => {
 
  const [username, SetUsername] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();

   
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(password.length < 6) {
      setError('Password must be atleast 6 characters long.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await authService.register(username, email, password);
      toast.success('Registration in successfully! Please Login.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
      toast.error(err.message || 'Failed to register.');
    } finally {
      setLoading(false);
    }
  };
return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
    <div className="w-full max-w-md">

      {/* Card */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30 mb-4">
            <BrainCircuit className="text-white" strokeWidth={2} />
          </div>

          <h1 className="text-2xl font-semibold text-slate-800">
            Create an account
          </h1>

          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Start your AI-powered learning experience
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              USERNAME
            </label>

            <div className="relative">
              <User
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                  focusedField === "username"
                    ? "text-emerald-500"
                    : "text-slate-400"
                }`}
                strokeWidth={2}
              />

              <input
                type="text"
                value={username}
                onChange={(e) => SetUsername(e.target.value)}
                onFocus={() => setFocusedField("username")}
                onBlur={() => setFocusedField(null)}
                placeholder="your user name"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              EMAIL
            </label>

            <div className="relative">
              <Mail
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
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
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              PASSWORD
            </label>

            <div className="relative">
              <Lock
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
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
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-red-500 text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30"
          >
            {loading ? (
              "Creating account..."
            ) : (
              <>
                Create account
                <ArrowRight size={18} strokeWidth={2.5} />
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-emerald-600 font-medium hover:underline"
          >
            Sign in
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

export default RegisterPage