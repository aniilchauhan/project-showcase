import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Rocket, 
  Users, 
  Settings, 
  Plus, 
  Search, 
  MoreVertical, 
  Eye, 
  TrendingUp,
  MessageSquare,
  ArrowUpRight,
  LogOut,
  Loader2,
  Trash2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import { cn } from '../lib/utils';
import { Lead } from '../types';
import ProjectModal from '../components/admin/ProjectModal';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('projects');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, loading: authLoading, logout } = useAuth();
  const { projects, loading: projectsLoading } = useProjects();
  const navigate = useNavigate();

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteDoc(doc(db, 'projects', projectId));
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (window.confirm("Delete this inquiry?")) {
      try {
        await deleteDoc(doc(db, 'leads', leadId));
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  useEffect(() => {
    if (!authLoading && !user?.isAdmin) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user?.isAdmin) {
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const leadsData = snapshot.docs.map(doc => {
          const data = doc.data();
          // Convert Firestore Timestamp to JS Date/ISO if it exists
          const createdAt = data.createdAt?.toDate?.()?.toISOString() || 
                           (data.createdAt instanceof Date ? data.createdAt.toISOString() : new Date().toISOString());
          
          return {
            id: doc.id,
            ...data,
            createdAt
          } as Lead;
        });
        setLeads(leadsData);
      });
      return () => unsubscribe();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  const stats = [
    { label: 'Total Projects', value: projects.length.toString(), icon: Rocket, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Leads', value: leads.length.toString(), icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Avg. Inquiries', value: (leads.length / (projects.length || 1)).toFixed(1), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'New This Week', value: leads.filter(l => l.createdAt && new Date(l.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length.toString(), icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="min-h-screen pt-20 bg-slate-50/50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 h-[calc(100vh-80px)] sticky top-20 flex-col p-6 border-r border-slate-200">
        <nav className="flex flex-col gap-2">
          {[
            { id: 'projects', label: 'Projects', icon: Rocket },
            { id: 'leads', label: 'Leads & Inquiries', icon: Users },
            { id: 'stats', label: 'Analytics', icon: TrendingUp },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all",
                activeTab === item.id 
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 mt-4 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>

        <div className="mt-auto p-6 bg-primary-600 rounded-[2rem] text-white flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2" />
          <h4 className="text-sm font-bold flex items-center gap-2">
            Pro Membership <ArrowUpRight className="w-4 h-4" />
          </h4>
          <p className="text-[11px] text-primary-100 leading-relaxed font-medium">
            Unlock white-label reports and advanced analytics dashboards.
          </p>
          <button className="w-full py-2.5 bg-white text-primary-600 rounded-xl text-xs font-bold shadow-lg">
            Upgrade Now
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-x-hidden">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Workspace</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Welcome back, Admin. Manage your platform projects here.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-xl shadow-primary-100 flex items-center gap-3 hover:bg-primary-700 transition-all active:scale-[0.98]"
          >
            <Plus className="w-5 h-5" /> Add Project
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:shadow-slate-200/40 transition-all">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{stat.label}</span>
                <span className="text-2xl font-display font-bold text-slate-900">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Project Directory</h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Find project..."
                  className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-all"
                />
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-900 border border-slate-100 rounded-xl">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">Project Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">Category</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {activeTab === 'projects' ? projects.map(project => (
                  <tr key={project.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <img src={project.thumbnail} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-sm">{project.title}</span>
                          <span className="text-[10px] font-medium text-slate-400">{project.techStack.slice(0, 2).join(' • ')}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {project.category}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <span className={cn(
                        "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider",
                        project.isFeatured ? "text-amber-600" : "text-slate-400"
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", project.isFeatured ? "bg-amber-600" : "bg-slate-300")} />
                        {project.isFeatured ? 'Featured' : 'Standard'}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/projects/${project.id}`} className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
                          <Eye className="w-5 h-5" />
                        </Link>
                        <button 
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : activeTab === 'analytics' ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12">
                      <div className="flex flex-col gap-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
                          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                             <h4 className="flex items-center gap-2 font-bold text-sm mb-6">
                               <Eye className="w-4 h-4 text-primary-600" /> Traffic Distribution
                             </h4>
                             <div className="h-[250px] w-full">
                               <ResponsiveContainer width="100%" height="100%">
                                 <BarChart data={projects.slice(0, 5).map(p => ({ 
                                   name: p.title.slice(0, 10), 
                                   views: p.views || 0,
                                   clicks: p.clicks || 0
                                 }))}>
                                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                   <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                   <Tooltip 
                                     cursor={{ fill: 'transparent' }}
                                     contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                   />
                                   <Bar dataKey="views" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                   <Bar dataKey="clicks" fill="#10b981" radius={[4, 4, 0, 0]} />
                                 </BarChart>
                               </ResponsiveContainer>
                             </div>
                          </div>

                          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                             <h4 className="flex items-center gap-2 font-bold text-sm mb-6">
                               <TrendingUp className="w-4 h-4 text-emerald-600" /> Category Performance
                             </h4>
                             <div className="flex flex-col gap-4">
                                {['Web App', 'Mobile App', 'AI'].map(cat => {
                                  const count = projects.filter(p => p.category === cat).length;
                                  const percentage = (count / (projects.length || 1)) * 100;
                                  return (
                                    <div key={cat} className="flex flex-col gap-2">
                                      <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                                        <span className="text-slate-500">{cat}</span>
                                        <span className="text-slate-900 dark:text-white">{count} Projects</span>
                                      </div>
                                      <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div 
                                          initial={{ width: 0 }}
                                          animate={{ width: `${percentage}%` }}
                                          className="h-full bg-primary-600"
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                             </div>
                          </div>
                        </div>

                        <div className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-3xl mx-2 border border-primary-100 dark:border-primary-800/50 flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                              <h5 className="font-bold text-primary-900 dark:text-primary-100">Live Traffic Integration</h5>
                              <p className="text-xs text-primary-700 dark:text-primary-300">Detailed source tracking and heatmaps coming in the next update.</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-primary-200" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : leads.map(lead => (
                  <tr key={lead.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-sm">{lead.name}</span>
                        <span className="text-[10px] font-medium text-slate-400">{lead.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {lead.interest}
                      </span>
                    </td>
                    <td className="px-6 py-6 max-w-xs">
                      <p className="text-slate-500 text-[10px] line-clamp-2">{lead.message}</p>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase mr-4">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </span>
                        <button 
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 border-t border-slate-50 bg-slate-50/20 text-center">
            <button className="text-xs font-bold text-slate-400 hover:text-primary-600 transition-colors uppercase tracking-widest">
              See All Records
            </button>
          </div>
        </div>
      </main>

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
