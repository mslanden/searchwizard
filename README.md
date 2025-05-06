# SearchWizard - AI-Powered Job Posting & Candidate Management

![SearchWizard Logo](https://via.placeholder.com/1200x630/6D28D9/FFFFFF?text=SearchWizard)

SearchWizard is an AI-powered platform designed to streamline the job posting and candidate management process. It leverages advanced AI capabilities to generate comprehensive role documents and perform in-depth candidate research, helping recruiters and hiring managers make better decisions faster.

## Features

### Project Management
- Create and manage hiring projects with customizable details
- Track project progress with visual indicators
- Organize projects by client and status

### Role Document Generation
- AI-powered job description creation
- Multiple output style templates (Professional, Creative, Technical, Startup)
- Customizable prompts for tailored results
- Comprehensive role analysis including responsibilities, requirements, and more

### Candidate Management
- Track candidates through the hiring pipeline
- View detailed candidate profiles with skills, experience, and interview notes
- Match scoring to identify the best fits for your roles

### AI Research Assistant
- Perform in-depth candidate research with a single click
- Analyze candidates' online presence and professional history
- Validate skills with confidence ratings and evidence
- Generate interview recommendations based on findings

### Customizable Settings
- Dark/light mode toggle for comfortable viewing
- Adjustable AI agent options for personalized outputs
- Create and manage custom prompts for different use cases

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **UI Components**: Heroicons
- **Styling**: Tailwind CSS with custom animations
- **Fonts**: Geist Sans and Geist Mono

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/search-wizard-v2.git
cd search-wizard-v2
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── components/      # Shared UI components
│   ├── contexts/        # React context providers
│   ├── projects/        # Project-related pages
│   │   ├── [id]/        # Dynamic project routes
│   │   │   ├── candidates/  # Candidate management
│   │   │   ├── role/        # Role document generation
│   │   │   └── company/     # Company information
│   │   └── new/        # New project creation
│   ├── settings/       # User and AI settings
│   └── globals.css     # Global styles
├── public/             # Static assets
└── tailwind.config.js  # Tailwind CSS configuration
```

## Customization

### AI Agent Options

The settings page allows customization of AI outputs:

1. **Output Style Templates**: Choose from different templates for role documents and candidate research
2. **Custom Prompts**: Create and manage your own prompts for specialized outputs
3. **Advanced Settings**: Control explanation detail and creative freedom

### Theme

Toggle between light and dark mode using the sun/moon icon in the header.

## Future Development

- Integration with real AI APIs for production use
- Enhanced analytics and reporting features
- Email notifications and scheduling tools
- Mobile application

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Next.js and Tailwind CSS
- Icons provided by Heroicons
- Fonts by Vercel's Geist font family
