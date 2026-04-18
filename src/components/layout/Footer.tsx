import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 md:py-20 transition-colors">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="p-2 bg-primary-600 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
                Anil Chauhan
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Software Engineer & Designer creating premium web experiences. From modern SaaS platforms to AI experimentations, explore the professional showcase of Anil Chauhan.
            </p>
            <div className="flex items-center gap-4">
              {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6">Discovery</h4>
            <ul className="flex flex-col gap-4">
              <li>
                <Link to="/projects" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 transition-colors">Browse Projects</Link>
              </li>
              <li>
                <Link to="/projects?category=AI" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 transition-colors">AI Experiments</Link>
              </li>
              <li>
                <Link to="/projects?category=SaaS" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 transition-colors">SaaS Products</Link>
              </li>
              <li>
                <Link to="/projects?category=Website" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 transition-colors">Marketing Sites</Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6">Platform</h4>
            <ul className="flex flex-col gap-4">
              <li>
                <Link to="/admin" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 transition-colors">Admin Access</Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 transition-colors">Contact Support</Link>
              </li>
              <li>
                <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm italic">
            © {currentYear} Personal Portfolio. Built for Anil Chauhan.
          </p>
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-2 text-sm text-slate-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Platform Status: Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
