import React, { useState } from 'react';
import { X, Upload, Rocket, Link as LinkIcon, Image as ImageIcon, Sparkles, Loader2, Save, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError } from '../../lib/firebase';
import { Category } from '../../types';
import { CATEGORIES } from '../../constants';
import { generateProjectDescription } from '../../services/aiService';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ isOpen, onClose }: ProjectModalProps) {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    content: '',
    thumbnail: '',
    liveUrl: '',
    demoUrl: '',
    githubRepo: '',
    category: 'Web App' as Category,
    techStackInput: '',
    isFeatured: false,
  });

  const handleAiGenerate = async () => {
    if (!formData.title) {
      alert("Please enter a project title first!");
      return;
    }
    setAiLoading(true);
    const techStack = formData.techStackInput.split(',').map(s => s.trim()).filter(Boolean);
    const result = await generateProjectDescription(formData.title, techStack);
    if (result) {
      setFormData(prev => ({
        ...prev,
        shortDescription: result.short || prev.shortDescription,
        fullDescription: result.full || prev.fullDescription,
        content: result.content || prev.content // If Gemini returns content too
      }));
    }
    setAiLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const techStack = formData.techStackInput.split(',').map(s => s.trim()).filter(Boolean);
      
      const projectData = {
        title: formData.title,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        content: formData.content,
        thumbnail: formData.thumbnail,
        liveUrl: formData.liveUrl,
        demoUrl: formData.demoUrl || '',
        githubRepo: formData.githubRepo || '',
        category: formData.category,
        techStack: techStack,
        tags: techStack,
        isFeatured: formData.isFeatured,
        views: 0,
        clicks: 0,
        createdAt: serverTimestamp(),
        gallery: [formData.thumbnail]
      };

      await addDoc(collection(db, 'projects'), projectData);
      onClose();
      // Reset form
      setFormData({
        title: '',
        shortDescription: '',
        fullDescription: '',
        content: '',
        thumbnail: '',
        liveUrl: '',
        demoUrl: '',
        githubRepo: '',
        category: 'Web App',
        techStackInput: '',
        isFeatured: false,
      });
    } catch (error) {
      handleFirestoreError(error, 'create', 'projects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Add New Project</h2>
                  <p className="text-sm text-slate-500 font-medium">Configure your latest masterpiece</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 hover:bg-slate-200/50 rounded-2xl transition-colors text-slate-400 hover:text-slate-900"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2 text-sm">
                    <label className="font-bold text-slate-700 ml-1">Project Title</label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Modern SaaS Platform"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-2 text-sm">
                    <label className="font-bold text-slate-700 ml-1 flex items-center justify-between">
                      Short Description
                      <button 
                        type="button"
                        onClick={handleAiGenerate}
                        disabled={aiLoading}
                        className="text-primary-600 flex items-center gap-1 hover:underline disabled:opacity-50"
                      >
                        {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        AI Write
                      </button>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={formData.shortDescription}
                      onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                      placeholder="Brief snippet for the grid view..."
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2 text-sm">
                    <label className="font-bold text-slate-700 ml-1">Full Description</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.fullDescription}
                      onChange={e => setFormData({ ...formData, fullDescription: e.target.value })}
                      placeholder="Detailed project breakdown..."
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2 text-sm">
                    <label className="font-bold text-slate-700 ml-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2 text-sm">
                    <label className="font-bold text-slate-700 ml-1">Tech Stack (comma separated)</label>
                    <input
                      required
                      type="text"
                      value={formData.techStackInput}
                      onChange={e => setFormData({ ...formData, techStackInput: e.target.value })}
                      placeholder="React, Tailwind, Firebase..."
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-2 text-sm">
                    <label className="font-bold text-slate-700 ml-1">Thumbnail URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        required
                        type="url"
                        value={formData.thumbnail}
                        onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
                        placeholder="https://..."
                        className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2 text-sm">
                      <label className="font-bold text-slate-700 ml-1">Live URL</label>
                      <div className="relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          required
                          type="url"
                          value={formData.liveUrl}
                          onChange={e => setFormData({ ...formData, liveUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                      <label className="font-bold text-slate-700 ml-1 underline decoration-primary-500/30">GitHub Repo (owner/repo)</label>
                      <div className="relative">
                        <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={formData.githubRepo}
                          onChange={e => setFormData({ ...formData, githubRepo: e.target.value })}
                          placeholder="anil/my-app"
                          className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                      <label className="font-bold text-slate-700 ml-1">Demo URL (Iframe)</label>
                      <input
                        type="url"
                        value={formData.demoUrl}
                        onChange={e => setFormData({ ...formData, demoUrl: e.target.value })}
                        placeholder="Internal demo..."
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="w-6 h-6 rounded-lg border-slate-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer"
                      />
                      <span className="text-sm font-bold text-slate-700 group-hover:text-primary-600 transition-colors">Feature on homepage</span>
                    </label>
                  </div>
                </div>

                {/* Case Study (Full Width) */}
                <div className="col-span-full flex flex-col gap-2 text-sm">
                  <label className="font-bold text-slate-700 ml-1 flex items-center gap-2">
                    Case Study Content (Markdown)
                    <span className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded text-[10px]">SUPPORTS GFM</span>
                  </label>
                  <textarea
                    rows={8}
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    placeholder="# The Challenge... \n\nDescribe the deep dive here using markdown."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all resize-none font-mono text-xs"
                  />
                </div>
              </div>

              {/* Submit Section */}
              <div className="mt-12 flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-4 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-4 bg-primary-600 text-white rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Publish Project
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
