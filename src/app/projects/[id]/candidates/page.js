"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, UserGroupIcon, FunnelIcon, MagnifyingGlassIcon, ChevronDownIcon, /* CheckCircleIcon, */ ClockIcon } from '@heroicons/react/24/outline';
import Header from '../../../components/Header';

// Mock data fetching function
const getCandidatesData = (/* projectId */) => {
  return {
    totalCandidates: 48,
    shortlisted: 12,
    interviewed: 8,
    offered: 3,
    rejected: 15,
    candidates: [
      {
        id: 1,
        name: 'Alex Johnson',
        title: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        experience: '8 years',
        skills: ['JavaScript', 'React', 'Node.js', 'AWS', 'GraphQL'],
        education: 'M.S. Computer Science, Stanford University',
        status: 'Shortlisted',
        lastActivity: 'Technical Interview Completed',
        lastActivityDate: 'April 3, 2025',
        matchScore: 95
      },
      {
        id: 2,
        name: 'Jamie Smith',
        title: 'Full Stack Developer',
        location: 'Seattle, WA (Remote)',
        experience: '6 years',
        skills: ['JavaScript', 'React', 'Python', 'Django', 'Docker'],
        education: 'B.S. Computer Science, University of Washington',
        rating: 4.5,
        status: 'Interviewed',
        lastActivity: 'Team Interview Scheduled',
        lastActivityDate: 'April 10, 2025',
        matchScore: 92
      },
      {
        id: 3,
        name: 'Taylor Williams',
        title: 'Frontend Engineer',
        location: 'Austin, TX',
        experience: '5 years',
        skills: ['JavaScript', 'React', 'TypeScript', 'CSS', 'Webpack'],
        education: 'B.S. Software Engineering, UT Austin',
        rating: 4.2,
        status: 'Shortlisted',
        lastActivity: 'Technical Assessment Sent',
        lastActivityDate: 'April 5, 2025',
        matchScore: 88
      },
      {
        id: 4,
        name: 'Jordan Lee',
        title: 'Backend Developer',
        location: 'New York, NY',
        experience: '7 years',
        skills: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Microservices'],
        education: 'M.S. Software Engineering, NYU',
        rating: 4.6,
        status: 'Offered',
        lastActivity: 'Offer Sent',
        lastActivityDate: 'April 2, 2025',
        matchScore: 94
      },
      {
        id: 5,
        name: 'Casey Martinez',
        title: 'DevOps Engineer',
        location: 'Chicago, IL (Remote)',
        experience: '6 years',
        skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD'],
        education: 'B.S. Computer Engineering, University of Illinois',
        rating: 4.4,
        status: 'Interviewed',
        lastActivity: 'Final Interview Completed',
        lastActivityDate: 'April 7, 2025',
        matchScore: 90
      },
      {
        id: 6,
        name: 'Morgan Davis',
        title: 'Software Engineer',
        location: 'Denver, CO',
        experience: '4 years',
        skills: ['JavaScript', 'Vue.js', 'Ruby on Rails', 'PostgreSQL'],
        education: 'B.S. Computer Science, Colorado State University',
        rating: 4.0,
        status: 'Rejected',
        lastActivity: 'Technical Assessment Failed',
        lastActivityDate: 'March 28, 2025',
        matchScore: 75
      }
    ]
  };
};

export default function CandidatesPage({ params }) {
  const resolvedParams = React.use(params);
  const candidatesData = getCandidatesData(resolvedParams.id);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Filter candidates based on search term and status filter
  const filteredCandidates = candidatesData.candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || candidate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  

  
  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Shortlisted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Interviewed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Offered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <Link href={`/projects/${resolvedParams.id}`} className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Project
            </Link>
          </div>
          
          {/* Candidates Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6 flex items-center">
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full mr-6">
                <UserGroupIcon className="w-12 h-12 text-green-500 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Candidates</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage and track candidates for this project</p>
              </div>
            </div>
          </div>
          
          {/* Candidates Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{candidatesData.totalCandidates}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Shortlisted</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{candidatesData.shortlisted}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Interviewed</h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{candidatesData.interviewed}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Offered</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{candidatesData.offered}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Rejected</h3>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{candidatesData.rejected}</p>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 p-2.5"
                placeholder="Search candidates or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-4">
              <div className="relative">
                <button className="flex items-center justify-between w-48 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center">
                    <FunnelIcon className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <span>Status: {statusFilter}</span>
                  </div>
                  <ChevronDownIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
                <div className="absolute z-10 mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden hidden">
                  <ul className="py-1">
                    {['All', 'Shortlisted', 'Interviewed', 'Offered', 'Rejected'].map((status) => (
                      <li key={status}>
                        <button
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                          onClick={() => setStatusFilter(status)}
                        >
                          {status}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <button className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-sm font-medium">
                Add Candidate
              </button>
            </div>
          </div>
          
          {/* Candidates List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Skills
                    </th>

                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Match
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Last Activity
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCandidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 dark:text-purple-400 font-medium">
                              {candidate.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {candidate.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {candidate.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {candidate.location} • {candidate.experience}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                              {skill}
                            </span>
                          ))}
                          {candidate.skills.length > 3 && (
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                              +{candidate.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(candidate.status)}`}>
                          {candidate.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                            <div 
                              className="bg-purple-600 dark:bg-purple-500 h-2 rounded-full" 
                              style={{ width: `${candidate.matchScore}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{candidate.matchScore}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-start">
                          <ClockIcon className="w-4 h-4 text-gray-400 mt-0.5 mr-1 flex-shrink-0" />
                          <div>
                            <div className="text-sm text-gray-900 dark:text-white">{candidate.lastActivity}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{candidate.lastActivityDate}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          href={`/projects/${resolvedParams.id}/candidates/${candidate.id}`}
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredCandidates.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">No candidates found matching your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
