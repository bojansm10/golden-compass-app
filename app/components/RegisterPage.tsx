'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
  onLogin: (user: any) => void;
}

export default function RegisterPage({ onNavigate, onLogin }: RegisterPageProps) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          }
        }
      });

      if (error) {
        alert('Registration failed: ' + error.message);
      } else if (data.user) {
        // Create profile
        await supabase.from('profiles').insert([
          { 
            id: data.user.id, 
            email: formData.email, 
            name: formData.name,
            capital: 1000,
            risk_percent: 5,
            compounding_percent: 50
          }
        ]);
        
        alert('Registration successful! Please check your email to verify your account.');
        onNavigate('login');
      }
    } catch (error) {
      alert('Registration failed: ' + error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-black to-purple-900"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-4 md:p-6">
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-cyan-500/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
              Join Golden Compass
            </h1>
            <p className="text-gray-400">Start your professional trading journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Full Name</label>
              <div className="relative">
                <User size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  className="w-full bg-black/40 border border-cyan-500/30 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Email</label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  className="w-full bg-black/40 border border-cyan-500/30 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
                  placeholder="trader@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Password</label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full bg-black/40 border border-cyan-500/30 rounded-xl pl-12 pr-12 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  className="w-full bg-black/40 border border-cyan-500/30 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-500/25 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <button 
                onClick={() => onNavigate('login')}
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>

          <button
            onClick={() => onNavigate('landing')}
            className="mt-4 w-full text-gray-400 hover:text-white text-sm transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
