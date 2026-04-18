import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';

export default function Contact() {
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interest: 'Mobile App Development',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const leadData = {
        ...formData,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'leads'), leadData);
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit lead:', error);
      handleFirestoreError(error, 'create', 'leads');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-40 pb-20 container mx-auto px-4 flex justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[3rem] p-10 text-center shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col items-center gap-6"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 leading-tight">Message Received</h2>
          <p className="text-slate-500 leading-relaxed">
            Thank you for reaching out! Our team will review your message and get back to you within 24-48 business hours.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold"
          >
            Send Another Message
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 container mx-auto px-4 md:px-6">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-20">
        {/* Info Column */}
        <div className="flex-1 flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <h1 className="text-5xl font-bold tracking-tight">Let's build something collective.</h1>
            <p className="text-slate-500 text-lg leading-relaxed max-w-md">
              Whether you have a specific project in mind or just want to explore possibilities, we're here to help you scale.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {[
              { icon: Mail, label: 'Email', value: 'hello@devshowcase.app' },
              { icon: Phone, label: 'Phone', value: '+1 (555) 000-0000' },
              { icon: MapPin, label: 'Office', value: 'Silicon Valley, CA' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 group">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                  <p className="text-slate-900 font-semibold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto bg-slate-900 p-8 rounded-[2rem] text-white flex flex-col gap-4 relative overflow-hidden">
            <MessageSquare className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5" />
            <h4 className="text-xl font-bold">Need a quick consultation?</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Book a 15-minute discovery call with our solutions architect.
            </p>
            <button className="flex items-center gap-2 text-primary-400 font-bold hover:gap-4 transition-all">
              Book Now <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Column */}
        <div className="flex-[1.2]">
          <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Project Interest</label>
              <select 
                value={formData.interest}
                onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none cursor-pointer"
              >
                <option>Mobile App Development</option>
                <option>Web Platform / SaaS</option>
                <option>AI / Machine Learning</option>
                <option>Technical Consulting</option>
                <option>Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Message</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about your project or inquiry..."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full py-5 bg-primary-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary-700 shadow-xl shadow-primary-200 active:scale-[0.99] transition-all disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Send Message <Send className="w-5 h-5" /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
