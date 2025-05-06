"use client";

import { useState } from 'react';
// import useEffect from 'react';
// import Image from 'next/image';
import Link from 'next/link';
// import { useRouter } from 'next/navigation';
import { PlusIcon, Squares2X2Icon, ListBulletIcon, UserIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Header from './components/Header';
import ProjectCard from './components/ProjectCard';
import ProjectList from './components/ProjectList';
// Backend imports removed



export default function Home() {
  // const router = useRouter();
  // Mock authentication and loading state for frontend-only demo
  const isAuthenticated = true;
  const authLoading = false;
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('Most Recent');
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'Project 2',
      client: 'Michael',
      date: '2025-04-11',
      artifactCount: 3,
      backgroundColor: 'light-cream',
    },
    {
      id: 2,
      title: 'Project 1',
      client: 'Client: John',
      date: '2025-04-10',
      artifactCount: 2,
      backgroundColor: 'light-cream',
    },
    {
      id: 3,
      title: 'Agentica',
      client: 'Client',
      date: '2025-04-07',
      artifactCount: 2,
      backgroundColor: 'light-cream',
    },
  ]);
  const [loading] = useState(false);
  const [error] = useState(null);
  // const setLoading and setError will be used when implementing API calls

  // Handle project deletion
  const handleDeleteProject = (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Handle title update
  const handleUpdateProjectTitle = (id, newTitle) => {
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, title: newTitle } : p));
  };

  // Handle client update
  const handleUpdateProjectClient = (id, newClient) => {
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, client: newClient } : p));
  };


  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {authLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : isAuthenticated ? (
          // Authenticated user view
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Projects</h2>
              
              <div className="flex items-center justify-between mb-4">
                <Link href="/projects/new">
                  <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    <span>Create new</span>
                  </button>
                </Link>
                
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300'}`}
                      aria-label="Grid view"
                    >
                      <Squares2X2Icon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300'}`}
                      aria-label="List view"
                    >
                      <ListBulletIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <div>
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-white"
                    >
                      <option>Most Recent</option>
                      <option>Oldest</option>
                      <option>Alphabetical</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-16 text-gray-400">Loading projects...</div>
            ) : error ? (
              <div className="text-center py-16 text-red-500">{error}</div>
            ) : projects.length === 0 ? (
              <div className="text-center py-16 text-gray-400">No projects found.</div>
            ) : (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {projects.map(project => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onDelete={handleDeleteProject}
                      onUpdateTitle={handleUpdateProjectTitle}
                      onUpdateClient={handleUpdateProjectClient}
                    />
                  ))}
                </div>
              ) : (
                <ProjectList
                  projects={projects}
                  onDelete={handleDeleteProject}
                  onUpdateTitle={handleUpdateProjectTitle}
                  onUpdateClient={handleUpdateProjectClient}
                />
              )
            )}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Search Wizard</h2>
                <p className="text-lg text-gray-600 mb-8">Your AI-powered job posting creation assistant</p>
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="w-full max-w-md p-6 bg-[#E6F0FF] rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Sign in to get started</h3>
                    <p className="text-gray-600 mb-6">Access your projects and create new job postings</p>
                    
                    <div className="flex flex-col space-y-4">
                      <Link href="/login">
                        <button className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md shadow-sm transition-colors">
                          <UserIcon className="w-5 h-5" />
                          <span>Sign in</span>
                        </button>
                      </Link>
                      
                      <div className="text-center">
                        <span className="text-gray-500">Don&apos;t have an account?</span>
                        <Link href="/register" className="ml-2 text-purple-600 hover:text-purple-700 font-medium">
                          Create account
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 text-center">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">What you can do with Search Wizard</h3>
                    <ul className="mt-4 space-y-3 text-left max-w-md mx-auto">
                      <li className="flex items-start">
                        <ArrowRightIcon className="w-5 h-5 text-purple-600 mr-2 mt-0.5" />
                        <span>Create professional job postings with AI assistance</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRightIcon className="w-5 h-5 text-purple-600 mr-2 mt-0.5" />
                        <span>Organize and manage all your recruitment projects</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRightIcon className="w-5 h-5 text-purple-600 mr-2 mt-0.5" />
                        <span>Export job postings in multiple formats</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
