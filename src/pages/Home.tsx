import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, Layers, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import ProjectCard from '../components/ProjectCard';
import { cn } from '../lib/utils';

export default function Home() {
  const { projects, loading } = useProjects();
  const featuredProjects = projects.filter(p => p.isFeatured);

  return (
    <div className="flex flex-col gap-20 pb-20 mt-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-6 pt-10 md:pt-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full font-medium text-sm border border-primary-100"
          >
            <Star className="w-4 h-4 fill-current" />
            <span>Full-Stack Developer & Designer</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl md:text-7xl font-display font-bold leading-[1.1] tracking-tight bg-gradient-to-br from-slate-900 via-slate-800 to-primary-600 bg-clip-text text-transparent"
          >
            Hi, I'm Anil Chauhan. <br /> I build for the future.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl leading-relaxed"
          >
            Explore my professional showcase of high-performance mobile apps, SaaS platforms, and AI-driven experiments built with precision and modern design.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link
              to="/projects"
              className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-700 transition-all hover:scale-[1.02] shadow-xl shadow-primary-200"
            >
              Explore Projects <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/10 to-indigo-500/10 blur-3xl rounded-[3rem] -z-10" />
          <div className="rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl bg-white aspect-video md:aspect-[21/9]">
            <img
              src="https://picsum.photos/seed/dashboard/1920/1080"
              alt="Platform Preview"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats/Features Section */}
      <section className="bg-slate-900 py-20 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 blur-[100px] rounded-full" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Zap,
                title: 'High Performance',
                desc: 'Optimized for speed and mobile responsiveness out of the box.'
              },
              {
                icon: Layers,
                title: 'Project Hub',
                desc: 'Centralize all your work from mobile apps to AI experiments.'
              },
              {
                icon: ShieldCheck,
                title: 'Lead Generation',
                desc: 'Integrated contact systems to convert visitors into clients.'
              },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-primary-600/20 text-primary-400 rounded-xl flex items-center justify-center">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl flex flex-col gap-4">
            <h2 className="text-4xl font-bold tracking-tight">Featured Highlights</h2>
            <p className="text-slate-500 text-lg">
              Explore our top-performing projects carefully curated for innovation and design excellence.
            </p>
          </div>
          <Link to="/projects" className="text-primary-600 font-bold flex items-center gap-2 hover:gap-3 transition-all underline underline-offset-8">
            View All Projects
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="bg-primary-600 rounded-[3rem] p-10 md:p-20 text-center flex flex-col items-center gap-8 relative overflow-hidden shadow-2xl shadow-primary-200">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_40%)]" />
          <h2 className="text-4xl md:text-6xl font-bold text-white max-w-2xl leading-tight">
            Ready to bring your vision to life?
          </h2>
          <p className="text-primary-100 text-lg max-w-xl">
            We're currently accepting new projects. Get in touch today for a free consultation and project estimate.
          </p>
          <Link
            to="/contact"
            className="px-10 py-5 bg-white text-primary-600 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
}
