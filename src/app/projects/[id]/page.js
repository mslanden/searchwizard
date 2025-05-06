"use client";

import React from 'react';
import Link from 'next/link';
import { PencilIcon, BuildingOfficeIcon, UserIcon, UserGroupIcon, ArrowLeftIcon, ChartBarIcon, DocumentTextIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Header from '../../components/Header';

// This would be replaced with actual data fetching in a real app
const getProjectById = (id) => {
  // Mock data for demonstration
  return {
    id,
    title: 'Agentica',
    client: 'TechCorp Solutions',
    date: 'April 7, 2025',
    description: 'AI-powered recruitment platform focusing on matching candidates with the right opportunities.',
    artifactCount: 2,
    progress: 65,
    projectStats: {
      totalCandidates: 48,
      interviewsScheduled: 12,
      positionsFilled: 3,
      openRoles: 5
    }
  };
};

export default function ProjectPage({ params }) {
  // Fix the params issue by using React.use()
  const resolvedParams = React.use(params);
  const project = getProjectById(resolvedParams.id);
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-teal-100 dark:bg-teal-900 p-4 rounded-full mr-6">
              <BuildingOfficeIcon className="w-12 h-12 text-teal-500 dark:text-teal-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
              <p className="text-gray-600 dark:text-gray-400">Client: {project.client} | Since: {project.date}</p>
            </div>
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <PencilIcon className="w-4 h-4 mr-2" />
            Edit
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="px-6 pb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Project Progress</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-purple-600 dark:bg-purple-500 h-2.5 rounded-full" 
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Project Description */}
        <div className="px-6 pb-6">
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">Project Description</h3>
          <p className="text-gray-700 dark:text-gray-300">{project.description}</p>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Project Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href={`/projects/${resolvedParams.id}/company`} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-full mb-4">
            <BuildingOfficeIcon className="w-10 h-10 text-yellow-500 dark:text-yellow-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Company</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
            View company details and documents
          </p>
        </Link>
        
        <Link href={`/projects/${resolvedParams.id}/role`} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full mb-4">
            <UserIcon className="w-10 h-10 text-blue-500 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Role Info</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
            View role requirements and details
          </p>
        </Link>
        
        <Link href={`/projects/${resolvedParams.id}/candidates`} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full mb-4">
            <UserGroupIcon className="w-10 h-10 text-green-500 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Candidates</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
            View and manage candidates
          </p>
        </Link>
      </div>
      
      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center mb-3">
            <UserGroupIcon className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
            <h4 className="text-md font-medium text-gray-900 dark:text-white">Total Candidates</h4>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{project.projectStats.totalCandidates}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center mb-3">
            <CalendarIcon className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
            <h4 className="text-md font-medium text-gray-900 dark:text-white">Interviews Scheduled</h4>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{project.projectStats.interviewsScheduled}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center mb-3">
            <ChartBarIcon className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
            <h4 className="text-md font-medium text-gray-900 dark:text-white">Positions Filled</h4>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{project.projectStats.positionsFilled}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center mb-3">
            <DocumentTextIcon className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
            <h4 className="text-md font-medium text-gray-900 dark:text-white">Open Roles</h4>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{project.projectStats.openRoles}</p>
        </div>
      </div>
      

        </div>
      </main>
    </>
  );
}
