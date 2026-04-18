import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Project } from '../types';
import { trackProjectClick } from '../lib/tracking';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <Link 
        to={`/projects/${project.id}`}
        onClick={() => trackProjectClick(project.id)}
        className="block bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl hover:shadow-primary-100 transition-all duration-500"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img 
            src={project.thumbnail} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
            <span className="text-white font-bold flex items-center gap-2">
              View Project Details <ArrowRight className="w-5 h-5" />
            </span>
          </div>
          <div className="absolute top-6 right-6">
            <span className="px-4 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200 shadow-lg">
              {project.category}
            </span>
          </div>
        </div>
        
        <div className="p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.slice(0, 3).map(tech => (
              <span key={tech} className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                {tech}
              </span>
            ))}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
            {project.title}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">
            {project.shortDescription}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
