"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, BuildingOfficeIcon, DocumentTextIcon, GlobeAltIcon, PhoneIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Header from '../../../components/Header';

// Mock data fetching function
const getCompanyData = (/* projectId */) => {
  return {
    name: 'Agentica',
    industry: 'Technology',
    size: '500-1000 employees',
    founded: '2018',
    location: 'San Francisco, CA',
    website: 'https://agentica.example.com',
    phone: '+1 (555) 123-4567',
    email: 'contact@agentica.example.com',
    description: 'Agentica is a leading AI-powered recruitment platform that helps companies find the right talent for their open positions. With advanced matching algorithms and a user-friendly interface, Agentica streamlines the recruitment process and improves hiring outcomes.',
    keyContacts: [
      { name: 'Sarah Johnson', title: 'CEO', email: 'sarah@agentica.example.com', phone: '+1 (555) 123-4568' },
      { name: 'Michael Chen', title: 'CTO', email: 'michael@agentica.example.com', phone: '+1 (555) 123-4569' },
      { name: 'Elena Rodriguez', title: 'HR Director', email: 'elena@agentica.example.com', phone: '+1 (555) 123-4570' }
    ],
    documents: [
      { name: 'Company Profile', type: 'PDF', size: '2.4 MB', lastUpdated: 'April 2, 2025' },
      { name: 'Annual Report 2024', type: 'PDF', size: '5.1 MB', lastUpdated: 'March 15, 2025' },
      { name: 'Brand Guidelines', type: 'ZIP', size: '8.7 MB', lastUpdated: 'January 20, 2025' },
      { name: 'Product Roadmap', type: 'DOCX', size: '1.2 MB', lastUpdated: 'April 5, 2025' }
    ]
  };
};

export default function CompanyPage({ params }) {
  const resolvedParams = React.use(params);
  const companyData = getCompanyData(resolvedParams.id);
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-8">
            <Link href={`/projects/${resolvedParams.id}`} className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Project
            </Link>
          </div>
          
          {/* Company Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6 flex items-center">
              <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-full mr-6">
                <BuildingOfficeIcon className="w-12 h-12 text-yellow-500 dark:text-yellow-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{companyData.name}</h1>
                <p className="text-gray-600 dark:text-gray-400">{companyData.industry} | Founded {companyData.founded}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Company Information */}
            <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Company Information</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">{companyData.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <MapPinIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Location</h3>
                    <p className="text-gray-600 dark:text-gray-400">{companyData.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <UserGroupIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Company Size</h3>
                    <p className="text-gray-600 dark:text-gray-400">{companyData.size}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <GlobeAltIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Website</h3>
                    <p className="text-gray-600 dark:text-gray-400">{companyData.website}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <PhoneIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Contact</h3>
                    <p className="text-gray-600 dark:text-gray-400">{companyData.phone}</p>
                    <p className="text-gray-600 dark:text-gray-400">{companyData.email}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Key Contacts */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Contacts</h2>
              <div className="space-y-4">
                {companyData.keyContacts.map((contact, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                    <h3 className="font-medium text-gray-900 dark:text-white">{contact.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{contact.title}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{contact.email}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{contact.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Company Documents */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Company Documents</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Updated</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {companyData.documents.map((doc, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DocumentTextIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                          <span className="text-gray-900 dark:text-white">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">{doc.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">{doc.size}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">{doc.lastUpdated}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium">
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
