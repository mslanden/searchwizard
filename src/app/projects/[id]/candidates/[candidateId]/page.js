"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  /* UserIcon, */
  BuildingOfficeIcon, 
  AcademicCapIcon, 
  MapPinIcon, 
  ClockIcon, 
  DocumentTextIcon,
  EnvelopeIcon,
  PhoneIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  LightBulbIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import Header from '../../../../components/Header';

// Mock data fetching function
const getCandidateData = (projectId, candidateId) => {
  const candidates = {
    1: {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      phone: '(555) 123-4567',
      title: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      experience: '8 years',
      skills: ['JavaScript', 'React', 'Node.js', 'AWS', 'GraphQL', 'TypeScript', 'MongoDB', 'Docker'],
      education: 'M.S. Computer Science, Stanford University',
      status: 'Shortlisted',
      lastActivity: 'Technical Interview Completed',
      lastActivityDate: 'April 3, 2025',
      matchScore: 95,
      about: 'Experienced software engineer with a strong background in full-stack development. Passionate about building scalable web applications and solving complex problems. Previously worked at tech companies including Google and Stripe.',
      workHistory: [
        { 
          company: 'Stripe', 
          position: 'Senior Software Engineer', 
          duration: 'Jan 2022 - Present',
          description: 'Leading development of payment processing systems and APIs. Improved system performance by 30% through architectural optimizations.'
        },
        { 
          company: 'Google', 
          position: 'Software Engineer', 
          duration: 'Aug 2019 - Dec 2021',
          description: 'Worked on Google Cloud Platform services, focusing on backend infrastructure and developer tools.'
        },
        { 
          company: 'Airbnb', 
          position: 'Software Engineer', 
          duration: 'Jun 2017 - Jul 2019',
          description: 'Developed and maintained features for the Airbnb web platform using React and Node.js.'
        }
      ],
      interviewNotes: [
        {
          stage: 'Initial Screening',
          date: 'March 25, 2025',
          interviewer: 'Sarah Chen',
          notes: 'Strong communication skills and technical background. Demonstrated clear understanding of system design principles.',
          rating: 'Excellent'
        },
        {
          stage: 'Technical Assessment',
          date: 'March 30, 2025',
          interviewer: 'David Kim',
          notes: 'Completed coding challenge with optimal solutions. Showed proficiency in React and state management.',
          rating: 'Excellent'
        },
        {
          stage: 'Technical Interview',
          date: 'April 3, 2025',
          interviewer: 'Michael Rodriguez',
          notes: 'Deep knowledge of JavaScript and React ecosystem. Excellent problem-solving skills and system design approach.',
          rating: 'Excellent'
        }
      ]
    },
    2: {
      id: 2,
      name: 'Jamie Smith',
      email: 'jamie.smith@example.com',
      phone: '(555) 234-5678',
      title: 'Full Stack Developer',
      location: 'Seattle, WA (Remote)',
      experience: '6 years',
      skills: ['JavaScript', 'React', 'Python', 'Django', 'Docker', 'PostgreSQL', 'Redis', 'AWS'],
      education: 'B.S. Computer Science, University of Washington',
      status: 'Interviewed',
      lastActivity: 'Team Interview Scheduled',
      lastActivityDate: 'April 10, 2025',
      matchScore: 92,
      about: 'Full stack developer with experience building web applications using modern JavaScript frameworks and Python backends. Passionate about clean code and user experience.',
      workHistory: [
        { 
          company: 'Microsoft', 
          position: 'Software Engineer', 
          duration: 'Mar 2023 - Present',
          description: 'Working on Microsoft Teams features and infrastructure improvements.'
        },
        { 
          company: 'Amazon', 
          position: 'Web Developer', 
          duration: 'Jun 2020 - Feb 2023',
          description: 'Developed internal tools and customer-facing features for Amazon retail website.'
        },
        { 
          company: 'Startup Hub', 
          position: 'Junior Developer', 
          duration: 'Aug 2019 - May 2020',
          description: 'Built web applications for various startup clients using React and Django.'
        }
      ],
      interviewNotes: [
        {
          stage: 'Initial Screening',
          date: 'March 28, 2025',
          interviewer: 'Sarah Chen',
          notes: 'Good communication skills and technical background. Strong experience with both frontend and backend technologies.',
          rating: 'Good'
        },
        {
          stage: 'Technical Assessment',
          date: 'April 2, 2025',
          interviewer: 'David Kim',
          notes: 'Completed coding challenge with solid solutions. Good understanding of React and state management.',
          rating: 'Good'
        },
        {
          stage: 'Technical Interview',
          date: 'April 5, 2025',
          interviewer: 'Michael Rodriguez',
          notes: 'Strong knowledge of JavaScript and Python. Good problem-solving skills and system design approach.',
          rating: 'Good'
        }
      ]
    }
  };
  
  // Add more candidates as needed
  return candidates[candidateId] || candidates[1]; // Default to first candidate if not found
};

export default function CandidateDetailPage({ params }) {
  const resolvedParams = React.use(params);
  const candidate = getCandidateData(resolvedParams.id, resolvedParams.candidateId);
  
  // Research states
  const [isResearching, setIsResearching] = useState(false);
  const [researchProgress, setResearchProgress] = useState(0);
  const [researchStage, setResearchStage] = useState('');
  const [researchResults, setResearchResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  
  // Mock research data
  const mockResearchData = {
    summary: "Based on comprehensive analysis of Alex Johnson's online presence and professional history spanning the last 5 years, the candidate demonstrates exceptional technical expertise, leadership qualities, and community engagement. Their significant contributions to 5 major open source projects in the React ecosystem reveal advanced JavaScript architecture skills and deep framework knowledge. Technical blog posts (averaging 15K+ reads each) showcase clear communication abilities and thought leadership in frontend development. Professional endorsements from senior engineers at Google and Stripe highlight their collaborative approach and mentorship capabilities. Conference presentations at React Conf 2024 and NodeCon 2023 demonstrate public speaking skills and industry recognition. Their GitHub repositories show consistent code quality with 92% test coverage and well-documented APIs. Analysis of their technical discussions on Stack Overflow (15,420 reputation) indicates strong problem-solving abilities and a helpful approach to knowledge sharing. Overall, Alex represents a rare combination of technical excellence, communication skills, and community leadership that would be valuable for senior engineering positions.",
    keyFindings: [
      "Active contributor to 5 major open source projects including React ecosystem tools",
      "Author of 12 technical articles on Medium with high engagement metrics",
      "Speaker at React Conf 2024 and NodeCon 2023",
      "Maintains a personal GitHub with 15+ repositories and 500+ stars",
      "Positive mentions on LinkedIn from previous colleagues and managers"
    ],
    onlinePresence: [
      { platform: "GitHub", handle: "@alexjohnson", activity: "Very Active", followers: 650 },
      { platform: "Twitter", handle: "@alexj_dev", activity: "Moderately Active", followers: 2300 },
      { platform: "LinkedIn", handle: "Alex Johnson", activity: "Active", connections: 1200 },
      { platform: "Medium", handle: "@alexjohnson", activity: "Active", followers: 850 },
      { platform: "Stack Overflow", handle: "alex-j", activity: "Moderately Active", reputation: 15420 }
    ],
    skillValidation: [
      { skill: "JavaScript", confidence: "Very High", evidence: "Multiple open source contributions and technical articles" },
      { skill: "React", confidence: "Very High", evidence: "Conference talks and specialized projects" },
      { skill: "Node.js", confidence: "High", evidence: "Backend projects and API development articles" },
      { skill: "AWS", confidence: "Medium", evidence: "Some deployment and infrastructure articles" },
      { skill: "GraphQL", confidence: "High", evidence: "Contributed to GraphQL tools and wrote tutorials" }
    ],
    recommendations: [
      "Focus technical interview on system design and architecture to challenge the candidate",
      "Explore their experience with team leadership and mentoring",
      "Discuss their open source contribution approach to understand collaboration style",
      "Ask about their conference speaking experience to gauge communication skills",
      "Explore their interest in our specific product domain"
    ]
  };
  
  // Function to simulate AI research
  const startResearch = () => {
    setIsResearching(true);
    setResearchProgress(0);
    setResearchStage('Initializing AI research...');
    setResearchResults(null);
    setShowResults(false);
    
    // Simulate research progress
    const stages = [
      { stage: 'Scanning professional networks...', progress: 15 },
      { stage: 'Analyzing GitHub contributions...', progress: 30 },
      { stage: 'Reviewing technical articles and publications...', progress: 45 },
      { stage: 'Evaluating community engagement...', progress: 60 },
      { stage: 'Validating skill claims...', progress: 75 },
      { stage: 'Synthesizing findings...', progress: 90 },
      { stage: 'Generating research report...', progress: 95 },
      { stage: 'Research complete!', progress: 100 }
    ];
    
    // Animate through the stages
    let currentStage = 0;
    const stageInterval = setInterval(() => {
      if (currentStage < stages.length) {
        setResearchStage(stages[currentStage].stage);
        setResearchProgress(stages[currentStage].progress);
        currentStage++;
      } else {
        clearInterval(stageInterval);
        setTimeout(() => {
          setIsResearching(false);
          setResearchResults(mockResearchData);
          setShowResults(true);
        }, 500);
      }
    }, 1200); // Update every 1.2 seconds
  };
  
  // Function to get status badge color
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
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-8">
            <Link href={`/projects/${resolvedParams.id}/candidates`} className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Candidates
            </Link>
          </div>
          
          {/* Candidate Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="flex-shrink-0 h-16 w-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl text-purple-600 dark:text-purple-400 font-medium">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{candidate.name}</h1>
                  <p className="text-gray-600 dark:text-gray-400">{candidate.title}</p>
                  <div className="mt-2 flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(candidate.status)}`}>
                      {candidate.status}
                    </span>
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      Match Score: <span className="font-medium text-purple-600 dark:text-purple-400">{candidate.matchScore}%</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  onClick={() => !isResearching && !showResults && startResearch()}
                  disabled={isResearching}
                >
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  {isResearching ? 'Researching...' : 'Research Candidate'}
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  Schedule Interview
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                  <EnvelopeIcon className="w-4 h-4 mr-2" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <EnvelopeIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Email</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{candidate.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <PhoneIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Phone</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{candidate.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPinIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Location</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{candidate.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <BriefcaseIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Experience</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{candidate.experience}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <AcademicCapIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Education</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{candidate.education}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* About */}
            <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">About</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">{candidate.about}</p>
              
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {candidate.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 text-sm rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300">
                    {skill}
                  </span>
                ))}
              </div>
              
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Last Activity</h3>
              <div className="flex items-start mb-6">
                <ClockIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">{candidate.lastActivity}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{candidate.lastActivityDate}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Work History */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Work History</h2>
            <div className="space-y-6">
              {candidate.workHistory.map((job, index) => (
                <div key={index} className="border-l-2 border-purple-500 dark:border-purple-400 pl-4 ml-2">
                  <h3 className="text-md font-medium text-gray-900 dark:text-white">{job.position}</h3>
                  <div className="flex items-center mb-1">
                    <BuildingOfficeIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-1" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{job.company}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <ClockIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">{job.duration}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{job.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Interview Notes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Interview Notes</h2>
            <div className="space-y-6">
              {candidate.interviewNotes.map((note, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-md font-medium text-gray-900 dark:text-white">{note.stage}</h3>
                      <div className="flex items-center">
                        <ClockIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">{note.date}</span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      note.rating === 'Excellent' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : note.rating === 'Good'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {note.rating}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{note.notes}</p>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Interviewer: {note.interviewer}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Research Progress */}
          {isResearching && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <SparklesIcon className="w-5 h-5 text-purple-500 dark:text-purple-400 mr-2 animate-pulse" />
                  AI Research in Progress
                </h2>
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">{researchProgress}%</span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-purple-600 dark:bg-purple-500 h-2.5 rounded-full transition-all duration-700 ease-in-out" 
                  style={{ width: `${researchProgress}%` }}
                ></div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
                  <MagnifyingGlassIcon className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-bounce" />
                </div>
                <p className="text-gray-700 dark:text-gray-300">{researchStage}</p>
              </div>
            </div>
          )}
          
          {/* Research Results */}
          {showResults && researchResults && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8 animate-fadeIn">
              <div className="bg-purple-600 dark:bg-purple-700 px-6 py-4">
                <div className="flex items-center">
                  <SparklesIcon className="w-6 h-6 text-white mr-2" />
                  <h2 className="text-xl font-semibold text-white">AI Research Results</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Summary</h3>
                  <p className="text-gray-700 dark:text-gray-300">{researchResults.summary}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                      <LightBulbIcon className="w-5 h-5 text-yellow-500 mr-2" />
                      Key Findings
                    </h3>
                    <ul className="space-y-2">
                      {researchResults.keyFindings.map((finding, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                      <GlobeAltIcon className="w-5 h-5 text-blue-500 mr-2" />
                      Online Presence
                    </h3>
                    <div className="space-y-3">
                      {researchResults.onlinePresence.map((platform, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-700 dark:text-gray-300">{platform.platform}:</span>
                            <span className="ml-2 text-gray-600 dark:text-gray-400">{platform.handle}</span>
                          </div>
                          <div>
                            <span className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300">
                              {platform.activity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Skill Validation</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Skill</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Confidence</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Evidence</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {researchResults.skillValidation.map((skill, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{skill.skill}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              <span className={`px-2 py-1 text-xs rounded-full ${skill.confidence === 'Very High' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                                skill.confidence === 'High' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                                {skill.confidence}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{skill.evidence}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Interview Recommendations</h3>
                  <ul className="space-y-2">
                    {researchResults.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start">
                        <LightBulbIcon className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex justify-between items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
                <button 
                  onClick={() => setShowResults(false)}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                >
                  Hide Results
                </button>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              <DocumentTextIcon className="w-4 h-4 mr-2" />
              Download Resume
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600">
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Move to Next Stage
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
