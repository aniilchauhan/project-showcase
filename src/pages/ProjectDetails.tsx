import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  Rocket, 
  Code2, 
  Tag, 
  Calendar, 
  Share2, 
  Copy, 
  Check, 
  Loader2,
  Star,
  GitFork,
  Clock,
  Github
} from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'motion/react';
import { useProjects } from '../hooks/useProjects';
import { fetchGitHubStats } from '../services/githubService';
import { trackProjectView } from '../lib/tracking';
import { cn } from '../lib/utils';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, loading } = useProjects();
  const [gitStats, setGitStats] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  
  const project = projects.find(p => p.id === id);

  useEffect(() => {
    if (id) {
      trackProjectView(id);
    }
    if (project?.githubRepo) {
      fetchGitHubStats(project.githubRepo).then(setGitStats);
    }
  }, [id, project?.githubRepo]);

  if (!project) {
    return (
      <div className="min-h-screen pt-40 flex flex-col items-center gap-6">
        <h2 className="text-3xl font-bold">Project not found</h2>
        <Link to="/projects" className="text-primary-600 font-bold hover:underline">Back to projects</Link>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-medium transition-colors mb-12"
        >
          <ArrowLeft className="w-5 h-5" /> Back to projects
        </button>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Content */}
          <div className="flex-[1.5] flex flex-col gap-10">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-xs font-bold uppercase tracking-wider">
                  {project.category}
                </span>
                {project.isFeatured && (
                  <span className="px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-xs font-bold uppercase tracking-wider">
                    Staff Pick
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
                {project.title}
              </h1>
              <p className="text-xl text-slate-500 leading-relaxed max-w-2xl">
                {project.shortDescription}
              </p>
            </div>

            {/* Main Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl"
            >
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full aspect-video object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Full Description */}
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl font-bold">About the Project</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
                  {project.fullDescription}
                </p>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              {project.gallery.map((img, i) => (
                <div key={i} className="rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-lg">
                  <img src={img} alt={`Gallery ${i}`} className="w-full aspect-[4/3] object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>

            {/* Case Study Content (Markdown) */}
            {project.content && (
              <div className="flex flex-col gap-8 mt-12 pt-12 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-bold">Deep Dive</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed">
                  <Markdown remarkPlugins={[remarkGfm]}>{project.content}</Markdown>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Actions Card */}
            <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/40 flex flex-col gap-6 sticky top-32">
              <div className="flex flex-col gap-4">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98]"
                >
                  Open Live Project <ExternalLink className="w-5 h-5" />
                </a>
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-5 bg-primary-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 active:scale-[0.98]"
                  >
                    View Live Demo <Rocket className="w-5 h-5" />
                  </a>
                )}
                <Link
                  to="/contact"
                  className="w-full py-5 bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-100 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                >
                  Contact About This
                </Link>
              </div>

              {/* GitHub Stats */}
              {project.githubRepo && gitStats && (
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                  <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Github className="w-4 h-4" /> Repo Insights
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex items-center gap-3">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span className="font-bold dark:text-white">{gitStats.stars}</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex items-center gap-3">
                      <GitFork className="w-4 h-4 text-blue-500" />
                      <span className="font-bold dark:text-white">{gitStats.forks}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />

              {/* Project Stats */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Released</p>
                    <p className="text-slate-900 font-semibold">{new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-slate-400" />
                    <span className="text-sm font-bold text-slate-900">Tech Stack</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map(tech => (
                      <span key={tech} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-600">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-slate-400" />
                    <span className="text-sm font-bold text-slate-900">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-xs text-slate-500 font-medium">#{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-100 w-full" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Share Project</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="p-3 bg-slate-50 text-slate-400 hover:text-primary-600 rounded-xl transition-all relative"
                    >
                      {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-primary-600 rounded-xl transition-all">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
