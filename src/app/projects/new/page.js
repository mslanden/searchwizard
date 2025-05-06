"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, DocumentIcon, UserIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Header from '../../components/Header';

export default function NewProject() {
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle the project creation
    console.log({ projectName, clientName, description });
    // Redirect to the project page or back to the dashboard
  };
  
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
      
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Create New Project</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Project Details</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                placeholder="Enter project name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Client Name
              </label>
              <input
                type="text"
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                placeholder="Enter client name"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                placeholder="Enter project description"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-full mb-4">
              <DocumentIcon className="w-10 h-10 text-yellow-500 dark:text-yellow-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Company</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
              Add company details and documents
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full mb-4">
              <UserIcon className="w-10 h-10 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Role Info</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
              Define role requirements and details
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full mb-4">
              <UserGroupIcon className="w-10 h-10 text-green-500 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Candidates</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
              Manage candidates for this project
            </p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Link href="/" className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 mr-4">
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Create Project
          </button>
        </div>
      </form>
        </div>
      </main>
    </>
  );
}
