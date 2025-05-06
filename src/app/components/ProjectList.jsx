import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { DocumentIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ProjectList({ projects, onDelete, onUpdateTitle, onUpdateClient }) {
  const [editingProject, setEditingProject] = useState(null);
  const [editField, setEditField] = useState(null); // 'title' or 'client'
  const [editValue, setEditValue] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  return (
    <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Project</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Artifacts</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-10">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
          {projects.map((project) => {
            // Example completeness calculation: artifacts out of 5 required
            const completeness = Math.min(100, Math.round(((project.artifactCount || 0) / 5) * 100));
            let statusColor = 'bg-red-400';
            if (completeness >= 80) statusColor = 'bg-green-500';
            else if (completeness >= 50) statusColor = 'bg-yellow-400';
            return (
              <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingProject === project.id && editField === 'title' ? (
                    <div className="flex items-center">
                      <DocumentIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                      <input
                        type="text"
                        className="w-full p-1 text-sm border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex ml-2">
                        <button
                          onClick={() => setEditingProject(null)}
                          className="p-1 text-xs bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 mr-1"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            onUpdateTitle(project.id, editValue);
                            setEditingProject(null);
                          }}
                          className="p-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link href={`/projects/${project.id}`} className="flex items-center text-gray-900 dark:text-white">
                      <DocumentIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{project.title}</span>
                    </Link>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {editingProject === project.id && editField === 'client' ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        className="w-full p-1 text-sm border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex ml-2">
                        <button
                          onClick={() => setEditingProject(null)}
                          className="p-1 text-xs bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 mr-1"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            onUpdateClient(project.id, editValue);
                            setEditingProject(null);
                          }}
                          className="p-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    project.client
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{project.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{project.artifactCount} artifacts</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${statusColor}`} style={{ width: `${completeness}%` }}></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right">
                  <div className="relative">
                    {/* Dropdown trigger button */}
                    <button
                      type="button"
                      onClick={() => setOpenMenuId(openMenuId === project.id ? null : project.id)}
                      className="inline-flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                      id={`dropdown-button-${project.id}`}
                      aria-expanded={openMenuId === project.id}
                      aria-haspopup="true"
                    >
                      <span className="sr-only">Open options</span>
                      <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                    </button>

                    {/* Dropdown menu */}
                    {openMenuId === project.id && (
                      <div 
                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" 
                        role="menu" 
                        aria-orientation="vertical" 
                        aria-labelledby={`dropdown-button-${project.id}`}
                        style={{
                          transform: 'none',  /* Safari fix */
                          WebkitTransform: 'none',  /* Safari fix */
                          display: 'block',  /* Safari fix */
                          visibility: 'visible'  /* Safari fix */
                        }}
                      >
                        <div className="py-1">
                          <button
                            type="button"
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                            tabIndex="-1"
                            onClick={() => {
                              setEditingProject(project.id);
                              setEditField('title');
                              setEditValue(project.title);
                              setOpenMenuId(null);
                            }}
                          >
                            <PencilIcon className="mr-3 h-4 w-4 text-gray-500" aria-hidden="true" />
                            Edit Title
                          </button>
                          
                          <button
                            type="button"
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                            tabIndex="-1"
                            onClick={() => {
                              setEditingProject(project.id);
                              setEditField('client');
                              setEditValue(project.client);
                              setOpenMenuId(null);
                            }}
                          >
                            <PencilIcon className="mr-3 h-4 w-4 text-gray-500" aria-hidden="true" />
                            Edit Client
                          </button>
                        </div>
                        
                        <div className="border-t border-gray-100">
                          <button
                            type="button"
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            role="menuitem"
                            tabIndex="-1"
                            onClick={() => {
                              onDelete(project.id);
                              setOpenMenuId(null);
                            }}
                          >
                            <TrashIcon className="mr-3 h-4 w-4 text-red-500" aria-hidden="true" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
