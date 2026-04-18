import React, { useState } from 'react';
import { Search, Filter, Rocket, ExternalLink, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { useProjects } from '../hooks/useProjects';
import ProjectCard from '../components/ProjectCard';
import { cn } from '../lib/utils';
import { Category } from '../types';

export default function Projects() {
  const { projects, loading } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeCategory === 'All' || project.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-28 pb-20 container mx-auto px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Project Library</h1>
        <p className="text-slate-500 text-lg max-w-2xl">
          Discover a diverse range of applications and experiments, from AI-powered tools to enterprise-level SaaS.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-6 mb-12">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
          <input
            type="text"
            placeholder="Search by name or technology..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
          />
        </div>

        <div className="flex bg-white p-1.5 border border-slate-200 rounded-2xl overflow-x-auto no-scrollbar shadow-sm">
          <button
            onClick={() => setActiveCategory('All')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all",
              activeCategory === 'All' ? "bg-primary-600 text-white shadow-lg shadow-primary-200" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            )}
          >
            All Projects
          </button>
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all",
                activeCategory === category ? "bg-primary-600 text-white shadow-lg shadow-primary-200" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center gap-6">
          <div className="p-6 bg-slate-100 rounded-full">
            <Search className="w-10 h-10 text-slate-300" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">No projects found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your filters or search query.</p>
          </div>
          <button
            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
            className="text-primary-600 font-bold underline underline-offset-4"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
