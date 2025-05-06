"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  UserIcon, 
  /* AcademicCapIcon, */
  BriefcaseIcon, 
  CurrencyDollarIcon, 
  ClockIcon, 
  MapPinIcon, 
  CheckCircleIcon,
  DocumentTextIcon,
  /* SparklesIcon, */
  /* DocumentDuplicateIcon, */
  DocumentCheckIcon,
  DocumentMagnifyingGlassIcon,
  LightBulbIcon,
  PencilIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import Header from '../../../components/Header';

// Mock data fetching function
const getRolesData = (/* projectId */) => {
  return {
    roles: [
      {
        id: 1,
        title: 'Senior Software Engineer',
        department: 'Engineering',
        location: 'San Francisco, CA (Hybrid)',
        employmentType: 'Full-time',
        salary: '$140,000 - $180,000 per year',
        postedDate: 'April 1, 2025',
        closingDate: 'May 15, 2025',
        overview: 'Agentica is seeking a Senior Software Engineer to join our growing engineering team. This role will be responsible for designing, developing, and maintaining our AI-powered recruitment platform. The ideal candidate will have strong experience with modern web technologies and a passion for building scalable, user-friendly applications.',
        responsibilities: [
          'Design, develop, and maintain high-quality software for our AI-powered recruitment platform',
          'Collaborate with cross-functional teams to define, design, and ship new features',
          'Optimize applications for maximum speed and scalability',
          'Implement security and data protection measures',
          'Participate in code reviews and mentor junior developers',
          'Stay up-to-date with emerging trends and technologies'
        ],
        requirements: [
          '5+ years of professional software development experience',
          'Strong proficiency in JavaScript/TypeScript and React',
          'Experience with Node.js and RESTful APIs',
          'Familiarity with cloud services (AWS, GCP, or Azure)',
          'Understanding of CI/CD pipelines and DevOps practices',
          'Bachelor\'s degree in Computer Science or related field (or equivalent experience)'
        ],
        niceToHave: [
          'Experience with AI/ML technologies',
          'Knowledge of recruitment or HR tech',
          'Contributions to open source projects',
          'Experience with GraphQL',
          'Background in startups or fast-paced environments'
        ],
        benefits: [
          'Competitive salary and equity package',
          'Health, dental, and vision insurance',
          'Flexible work arrangements',
          '401(k) matching',
          'Professional development budget',
          'Unlimited PTO policy'
        ],
        hiringProcess: [
          { stage: 'Initial Screening', status: 'Completed', date: 'April 5, 2025' },
          { stage: 'Technical Assessment', status: 'In Progress', date: 'April 12, 2025' },
          { stage: 'Team Interview', status: 'Scheduled', date: 'April 20, 2025' },
          { stage: 'Final Interview', status: 'Pending', date: 'TBD' },
          { stage: 'Offer & Negotiation', status: 'Pending', date: 'TBD' }
        ]
      },
      {
        id: 2,
        title: 'Product Designer',
        department: 'Design',
        location: 'San Francisco, CA (Hybrid)',
        employmentType: 'Full-time',
        salary: '$110,000 - $140,000 per year',
        postedDate: 'April 3, 2025',
        closingDate: 'May 20, 2025',
        overview: 'Agentica is looking for a talented Product Designer to join our team. This role will be responsible for creating intuitive and visually appealing user interfaces for our AI-powered recruitment platform. The ideal candidate will have a strong portfolio demonstrating UX/UI design skills and a passion for creating user-centered designs.',
        responsibilities: [
          'Design intuitive and visually appealing user interfaces for our platform',
          'Create wireframes, prototypes, and high-fidelity mockups',
          'Collaborate with product managers and engineers to implement designs',
          'Conduct user research and usability testing',
          'Maintain and evolve our design system',
          'Stay current with design trends and best practices'
        ],
        requirements: [
          '3+ years of product design experience',
          'Proficiency with design tools like Figma or Sketch',
          'Strong portfolio demonstrating UX/UI design skills',
          'Experience with responsive design and accessibility standards',
          'Ability to translate user needs into design solutions',
          'Bachelor\'s degree in Design or related field (or equivalent experience)'
        ],
        niceToHave: [
          'Experience with design systems',
          'Knowledge of front-end development (HTML, CSS, JavaScript)',
          'Experience in the HR tech or recruitment industry',
          'Background in startups or fast-paced environments',
          'Understanding of data visualization techniques'
        ],
        benefits: [
          'Competitive salary and equity package',
          'Health, dental, and vision insurance',
          'Flexible work arrangements',
          '401(k) matching',
          'Professional development budget',
          'Unlimited PTO policy'
        ],
        hiringProcess: [
          { stage: 'Initial Screening', status: 'Completed', date: 'April 8, 2025' },
          { stage: 'Design Challenge', status: 'In Progress', date: 'April 15, 2025' },
          { stage: 'Team Interview', status: 'Pending', date: 'TBD' },
          { stage: 'Final Interview', status: 'Pending', date: 'TBD' },
          { stage: 'Offer & Negotiation', status: 'Pending', date: 'TBD' }
        ]
      },
      {
        id: 3,
        title: 'Data Scientist',
        department: 'Data',
        location: 'Remote',
        employmentType: 'Full-time',
        salary: '$130,000 - $160,000 per year',
        postedDate: 'April 5, 2025',
        closingDate: 'May 25, 2025',
        overview: 'Agentica is seeking a Data Scientist to help improve our AI-powered matching algorithms. This role will be responsible for developing and implementing machine learning models to better match candidates with job opportunities. The ideal candidate will have strong experience with ML/AI technologies and a passion for solving complex problems.',
        responsibilities: [
          'Develop and implement machine learning models for candidate matching',
          'Analyze large datasets to extract actionable insights',
          'Collaborate with engineering and product teams',
          'Improve existing algorithms and develop new features',
          'Create data visualizations and reports',
          'Stay current with advances in ML/AI research'
        ],
        requirements: [
          '4+ years of experience in data science or machine learning',
          'Strong programming skills in Python',
          'Experience with ML frameworks like TensorFlow or PyTorch',
          'Knowledge of NLP and recommendation systems',
          'Strong analytical and problem-solving skills',
          'Master\'s or PhD in Computer Science, Statistics, or related field'
        ],
        niceToHave: [
          'Experience in the HR tech or recruitment industry',
          'Knowledge of cloud-based ML services (AWS SageMaker, GCP AI, etc.)',
          'Experience with distributed computing frameworks',
          'Publications in ML/AI conferences or journals',
          'Experience with data engineering and ETL processes'
        ],
        benefits: [
          'Competitive salary and equity package',
          'Health, dental, and vision insurance',
          'Flexible work arrangements',
          '401(k) matching',
          'Professional development budget',
          'Unlimited PTO policy'
        ],
        hiringProcess: [
          { stage: 'Initial Screening', status: 'Scheduled', date: 'April 12, 2025' },
          { stage: 'Technical Assessment', status: 'Pending', date: 'TBD' },
          { stage: 'Team Interview', status: 'Pending', date: 'TBD' },
          { stage: 'Final Interview', status: 'Pending', date: 'TBD' },
          { stage: 'Offer & Negotiation', status: 'Pending', date: 'TBD' }
        ]
      }
    ]
  };
};

export default function RolePage({ params }) {
  const resolvedParams = React.use(params);
  const [selectedRoleId, setSelectedRoleId] = React.useState(1);
  const { roles } = getRolesData(resolvedParams.id);
  const roleData = roles.find(role => role.id === selectedRoleId);
  
  // Document generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStage, setGenerationStage] = useState('');
  const [generatedDocument, setGeneratedDocument] = useState(null);
  const [showDocument, setShowDocument] = useState(false);
  
  // Mock document data
  const mockDocumentData = {
    title: roleData.title,
    company: 'Agentica',
    date: new Date().toLocaleDateString(),
    sections: [
      {
        title: 'Role Overview',
        content: `${roleData.title} at Agentica will be responsible for ${roleData.title.toLowerCase().includes('engineer') ? 'designing, developing, and maintaining software systems' : roleData.title.toLowerCase().includes('design') ? 'creating intuitive and visually appealing user interfaces' : 'analyzing data and developing machine learning models'} that power our AI-driven recruitment platform. This is a key position that will directly impact our product's success and user experience.`
      },
      {
        title: 'Detailed Responsibilities',
        content: roleData.responsibilities.map(r => `- ${r}`).join('\n')
      },
      {
        title: 'Required Qualifications',
        content: roleData.requirements.map(r => `- ${r}`).join('\n')
      },
      {
        title: 'Preferred Qualifications',
        content: roleData.niceToHave.map(r => `- ${r}`).join('\n')
      },
      {
        title: 'Compensation & Benefits',
        content: `- Salary Range: ${roleData.salary}\n- ${roleData.benefits.join('\n- ')}`
      },
      {
        title: 'Hiring Process',
        content: `Our hiring process typically consists of the following stages:\n\n1. Initial Application Review\n2. Phone Screening\n3. Technical Assessment\n4. Team Interview\n5. Final Interview\n6. Offer & Negotiation\n\nWe aim to provide feedback at each stage and complete the process within 3-4 weeks.`
      },
      {
        title: 'About Agentica',
        content: `Agentica is an AI-powered recruitment platform that helps companies find the right talent for their open positions. We're on a mission to make the hiring process more efficient, fair, and effective for both employers and candidates.\n\nFounded in 2018, we've grown to a team of 50+ passionate individuals working to transform how companies hire. Our platform uses advanced matching algorithms to connect candidates with opportunities where they'll thrive.`
      },
      {
        title: 'Our Values',
        content: `- Innovation: We embrace new ideas and technologies\n- Diversity & Inclusion: We believe diverse teams build better products\n- Transparency: We communicate openly and honestly\n- Impact: We focus on making a meaningful difference\n- Growth: We support personal and professional development`
      },
      {
        title: 'Equal Opportunity Statement',
        content: `Agentica is an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all employees. We do not discriminate based on race, religion, color, national origin, gender, sexual orientation, age, marital status, veteran status, or disability status.`
      }
    ],
    formattingNotes: [
      "Use company branding throughout the document",
      "Include Agentica logo at the top",
      "Use professional, approachable language",
      "Format as a PDF for distribution",
      "Include contact information for the hiring manager"
    ]
  };
  
  // Function to simulate AI document generation
  const startDocumentGeneration = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationStage('Initializing document generation...');
    setGeneratedDocument(null);
    setShowDocument(false);
    
    // Simulate generation progress
    const stages = [
      { stage: 'Analyzing role requirements...', progress: 15 },
      { stage: 'Drafting role overview...', progress: 30 },
      { stage: 'Structuring responsibilities and qualifications...', progress: 45 },
      { stage: 'Adding company information...', progress: 60 },
      { stage: 'Formatting document sections...', progress: 75 },
      { stage: 'Applying company branding...', progress: 85 },
      { stage: 'Finalizing document...', progress: 95 },
      { stage: 'Document ready!', progress: 100 }
    ];
    
    // Animate through the stages
    let currentStage = 0;
    const stageInterval = setInterval(() => {
      if (currentStage < stages.length) {
        setGenerationStage(stages[currentStage].stage);
        setGenerationProgress(stages[currentStage].progress);
        currentStage++;
      } else {
        clearInterval(stageInterval);
        setTimeout(() => {
          setIsGenerating(false);
          setGeneratedDocument(mockDocumentData);
          setShowDocument(true);
        }, 500);
      }
    }, 1000); // Update every second
  };
  
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
          
          {/* Role Switcher */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Available Roles</h2>
            </div>
            <div className="p-4 flex flex-wrap gap-2">
              {roles.map(role => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    role.id === selectedRoleId
                      ? 'bg-purple-600 text-white dark:bg-purple-500'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {role.title}
                </button>
              ))}
            </div>
          </div>
          
          {/* Role Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full mr-6">
                  <UserIcon className="w-12 h-12 text-blue-500 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{roleData.title}</h1>
                  <p className="text-gray-600 dark:text-gray-400">{roleData.department} | {roleData.location}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => !isGenerating && !showDocument && startDocumentGeneration()}
                  disabled={isGenerating}
                >
                  <DocumentTextIcon className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate Role Doc'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Role Details */}
            <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Role Overview</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">{roleData.overview}</p>
              
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Key Responsibilities</h3>
              <ul className="list-disc pl-5 mb-6 space-y-2">
                {roleData.responsibilities.map((item, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300">{item}</li>
                ))}
              </ul>
              
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Requirements</h3>
              <ul className="list-disc pl-5 mb-6 space-y-2">
                {roleData.requirements.map((item, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300">{item}</li>
                ))}
              </ul>
              
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Nice to Have</h3>
              <ul className="list-disc pl-5 mb-6 space-y-2">
                {roleData.niceToHave.map((item, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300">{item}</li>
                ))}
              </ul>
              
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Benefits</h3>
              <ul className="list-disc pl-5 space-y-2">
                {roleData.benefits.map((item, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300">{item}</li>
                ))}
              </ul>
            </div>
            
            {/* Role Info Sidebar */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Role Details</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <BriefcaseIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Employment Type</h3>
                      <p className="text-gray-600 dark:text-gray-400">{roleData.employmentType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPinIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Location</h3>
                      <p className="text-gray-600 dark:text-gray-400">{roleData.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CurrencyDollarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Salary Range</h3>
                      <p className="text-gray-600 dark:text-gray-400">{roleData.salary}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <ClockIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Posted Date</h3>
                      <p className="text-gray-600 dark:text-gray-400">{roleData.postedDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <ClockIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Closing Date</h3>
                      <p className="text-gray-600 dark:text-gray-400">{roleData.closingDate}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Hiring Process</h2>
                <div className="space-y-4">
                  {roleData.hiringProcess.map((stage, index) => (
                    <div key={index} className="flex items-start">
                      <div className="mr-3 mt-1">
                        {stage.status === 'Completed' ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        ) : stage.status === 'In Progress' ? (
                          <div className="w-5 h-5 rounded-full bg-blue-500"></div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{stage.stage}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {stage.status} {stage.date && `• ${stage.date}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Document Generation Progress */}
          {isGenerating && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <DocumentTextIcon className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2 animate-pulse" />
                  Generating Role Document
                </h2>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{generationProgress}%</span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-700 ease-in-out" 
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                  <DocumentMagnifyingGlassIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-bounce" />
                </div>
                <p className="text-gray-700 dark:text-gray-300">{generationStage}</p>
              </div>
            </div>
          )}
          
          {/* Generated Document */}
          {showDocument && generatedDocument && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8 animate-fadeIn">
              <div className="bg-blue-600 dark:bg-blue-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DocumentCheckIcon className="w-6 h-6 text-white mr-2" />
                    <h2 className="text-xl font-semibold text-white">Generated Role Document</h2>
                  </div>
                  <div className="flex space-x-2">
                    <button className="inline-flex items-center px-3 py-1 bg-white bg-opacity-20 rounded-md text-sm text-white hover:bg-opacity-30 transition-colors">
                      <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                      Download
                    </button>
                    <button 
                      onClick={() => setShowDocument(false)}
                      className="inline-flex items-center px-3 py-1 bg-white bg-opacity-20 rounded-md text-sm text-white hover:bg-opacity-30 transition-colors"
                    >
                      <PencilIcon className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{generatedDocument.title}</h1>
                  <p className="text-gray-600 dark:text-gray-400">{generatedDocument.company} • {generatedDocument.date}</p>
                </div>
                
                <div className="space-y-6">
                  {generatedDocument.sections.map((section, index) => (
                    <div key={index} className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">{section.title}</h3>
                      <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{section.content}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <LightBulbIcon className="w-4 h-4 text-yellow-500 mr-2" />
                  Formatting Recommendations
                </h3>
                <ul className="space-y-1">
                  {generatedDocument.formattingNotes.map((note, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit Role
            </button>
            <Link href={`/projects/${resolvedParams.id}/candidates`} className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600">
              <UserIcon className="w-4 h-4 mr-2" />
              View Candidates
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
