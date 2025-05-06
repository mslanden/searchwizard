"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, SunIcon, MoonIcon, PlusIcon, TrashIcon, DocumentTextIcon, UserIcon, CheckIcon, AdjustmentsHorizontalIcon, PencilIcon } from '@heroicons/react/24/outline';
import Header from '../components/Header';
import { useTheme } from '../../contexts/ThemeContext';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  
  // State for AI agent settings
  const [activeTab, setActiveTab] = useState('role'); // 'role' or 'candidate'
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [customPrompt, setCustomPrompt] = useState('');
  // These state variables will be used in future updates
  // const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [showCustomPromptForm, setShowCustomPromptForm] = useState(false);
  const [customPromptName, setCustomPromptName] = useState('');
  const [customPrompts, setCustomPrompts] = useState([
    { id: 1, name: 'Technical Focus', content: 'Focus on technical requirements and skills needed for the role.', type: 'role' },
    { id: 2, name: 'Leadership Emphasis', content: 'Emphasize leadership qualities and team management aspects.', type: 'role' },
    { id: 3, name: 'Detailed Background', content: 'Provide in-depth analysis of candidate background and experience.', type: 'candidate' },
  ]);
  
  // Templates for role documents
  const roleTemplates = [
    { id: 'professional', name: 'Professional', description: 'Formal and detailed job description suitable for corporate environments' },
    { id: 'creative', name: 'Creative', description: 'Dynamic and engaging format for creative and design roles' },
    { id: 'technical', name: 'Technical', description: 'Structured format with emphasis on technical requirements and specifications' },
    { id: 'startup', name: 'Startup', description: 'Concise and impactful with focus on culture and growth potential' },
  ];
  
  // Templates for candidate research
  const candidateTemplates = [
    { id: 'comprehensive', name: 'Comprehensive', description: 'Detailed analysis of all candidate aspects including skills, experience, and potential' },
    { id: 'skills-focused', name: 'Skills Focused', description: 'Emphasis on technical skills and capabilities with specific examples' },
    { id: 'culture-fit', name: 'Culture Fit', description: 'Analysis focused on team integration and company culture alignment' },
    { id: 'executive', name: 'Executive', description: 'Tailored for leadership positions with focus on strategic thinking and vision' },
  ];
  
  // Get templates based on active tab
  const templates = activeTab === 'role' ? roleTemplates : candidateTemplates;
  
  // Handle saving a new custom prompt
  const handleSaveCustomPrompt = () => {
    if (customPromptName.trim() && customPrompt.trim()) {
      setCustomPrompts([...customPrompts, {
        id: Date.now(),
        name: customPromptName,
        content: customPrompt,
        type: activeTab
      }]);
      setCustomPromptName('');
      setCustomPrompt('');
      setShowCustomPromptForm(false);
    }
  };
  
  // Handle deleting a custom prompt
  const handleDeletePrompt = (id) => {
    setCustomPrompts(customPrompts.filter(prompt => prompt.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Link href="/" className="flex items-center text-gray-600 dark:text-gray-400 mb-6 hover:text-gray-900 dark:hover:text-white">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to projects
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
          
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Appearance</h2>
            <div className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
              <div className="flex items-center">
                {theme === 'light' ? (
                  <SunIcon className="w-6 h-6 text-yellow-500 mr-3" />
                ) : (
                  <MoonIcon className="w-6 h-6 text-blue-700 mr-3" />
                )}
                <div>
                  <p className="font-medium text-gray-600 dark:text-gray-300">{theme === 'light' ? 'Light' : 'Dark'} Mode</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {theme === 'light' 
                      ? 'Use light mode for a brighter display' 
                      : 'Use dark mode for reduced eye strain in low light'}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={theme === 'dark'}
                  onChange={toggleTheme}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
              </label>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">AI Agent Options</h2>
            
            {/* Agent Type Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
              <button
                onClick={() => setActiveTab('role')}
                className={`px-4 py-2 font-medium text-sm flex items-center ${activeTab === 'role' 
                  ? 'text-brand-purple dark:text-purple-400 border-b-2 border-brand-purple dark:border-purple-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                <DocumentTextIcon className="w-4 h-4 mr-2" />
                Role Document Generator
              </button>
              <button
                onClick={() => setActiveTab('candidate')}
                className={`px-4 py-2 font-medium text-sm flex items-center ${activeTab === 'candidate' 
                  ? 'text-brand-purple dark:text-purple-400 border-b-2 border-brand-purple dark:border-purple-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                <UserIcon className="w-4 h-4 mr-2" />
                Candidate Research
              </button>
            </div>
            
            {/* Output Style Templates */}
            <div className="mb-8">
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2" />
                Output Style
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map(template => (
                  <div 
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedTemplate === template.id 
                      ? 'border-brand-purple dark:border-purple-500 bg-purple-50 dark:bg-gray-700' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">{template.name}</h4>
                      {selectedTemplate === template.id && (
                        <CheckIcon className="w-5 h-5 text-brand-purple dark:text-purple-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{template.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Custom Prompts */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <PencilIcon className="w-5 h-5 mr-2" />
                  Custom Prompts
                </h3>
                <button 
                  onClick={() => setShowCustomPromptForm(!showCustomPromptForm)}
                  className="text-sm flex items-center text-brand-purple dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  {showCustomPromptForm ? 'Cancel' : 'Add New'}
                </button>
              </div>
              
              {/* Custom prompt form */}
              {showCustomPromptForm && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4 border border-gray-200 dark:border-gray-700">
                  <div className="mb-3">
                    <label htmlFor="promptName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prompt Name</label>
                    <input
                      type="text"
                      id="promptName"
                      value={customPromptName}
                      onChange={(e) => setCustomPromptName(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="E.g., Technical Focus"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="promptContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prompt Content</label>
                    <textarea
                      id="promptContent"
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      rows="4"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Enter your custom instructions for the AI..."
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveCustomPrompt}
                      disabled={!customPromptName.trim() || !customPrompt.trim()}
                      className="px-4 py-2 bg-brand-purple hover:bg-purple-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save Prompt
                    </button>
                  </div>
                </div>
              )}
              
              {/* List of custom prompts */}
              <div className="space-y-3">
                {customPrompts.filter(prompt => prompt.type === activeTab).length > 0 ? (
                  customPrompts
                    .filter(prompt => prompt.type === activeTab)
                    .map(prompt => (
                      <div key={prompt.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-800 dark:text-gray-200">{prompt.name}</h4>
                          <button 
                            onClick={() => handleDeletePrompt(prompt.id)}
                            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{prompt.content}</p>
                      </div>
                    ))
                ) : (
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">No custom prompts yet. Add one to personalize your AI outputs.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Advanced Settings */}
            <div>
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Advanced Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-600 dark:text-gray-300">Detailed Explanations</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Include reasoning and explanations in AI outputs</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-600 dark:text-gray-300">Creative Freedom</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Allow AI more creative flexibility in generating content</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
