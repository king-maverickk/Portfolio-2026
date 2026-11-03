// The resume shown in the (hiring manager) sheet. Keep the wording and headings
// identical to the PDF you send, so the two never disagree.
//
// Dates, titles and employers must also match LinkedIn.

const resume = {
  name: 'Motheo Moleko',
  headline: 'Jr. Developer | Azure · Python · AI applications',
  email: 'motheo.moleko03@gmail.com',
  location: 'Hamilton, Ontario',
  linkedin: {
    label: 'linkedin.com/in/motheo-m-moleko',
    href: 'https://www.linkedin.com/in/motheo-m-moleko/'
  },

  summary:
    'Developer with over a year of professional experience with Microsoft Azure services, building back-end services in NodeJS and tools in Python. 3rd place at a Microsoft hackathon with a generative AI app. Equivalent practical experience: six years of self-taught full-stack development, cloud and DevOps.',

  skills: [
    {
      label: 'Cloud',
      text: 'Microsoft Azure (Functions, Compute, Static Web Apps, Database/Cosmos DB, Storage); Azure Developer Associate (AZ-204)'
    },
    { label: 'Languages', text: 'Python, JavaScript, Node.js, NoSQL (Document Store Databases)' },
    { label: 'AI and APIs', text: 'Microsoft Foundry (LLM integration), Microservices Communication, RESTful APIs' },
    { label: 'Front end', text: 'React, CSS, Strong UI Design Capabilities' },
    { label: 'Software', text: 'Git, GitHub (CI/CD with GitHub Actions), Figma, Claude Code, VS Code' }
  ],

  experience: [
    {
      title: 'Backend & Cloud Engineer, Queers Code',
      dates: 'Feb 2025 - May 2025',
      bullets: [
        'Developed and maintained backend services using NodeJS/JavaScript. Created for handling data ingestion, processing, storage and delivery in the cloud, at a lower cost.',
        'Deployed Azure Document Intelligence, Storage, Functions, and App Service.'
      ]
    },
    {
      title: 'Freelance Web Developer, Self-employed',
      dates: 'Jul 2026 - Present',
      bullets: [
        'Designed and built websites for a photographer, a holistic healer, and an illustrator; designed Figma layouts, and deployed builds, focused on client acquisition, credibility and showcasing their work.',
        'Tools: React, Azure Cloud, Storage, Figma'
      ]
    },
    {
      title: 'Full Stack Developer, Milk & Honey TV',
      dates: 'Sep 2022 - Sep 2023',
      bullets: [
        'Designed the company website in Figma and built it in React.js, then deployed it on an Azure Static Web App with Blob Storage.'
      ]
    }
  ],

  projects: [
    {
      title: 'History Podcast Generator | 3rd place, Microsoft AI for Social Good 2025',
      dates: 'May 2025',
      bullets: [
        'Built a generative AI app that turns historical topics into geotagged podcast shorts with audio narration with one team mate.',
        'Integrated the OpenAI API for content, Google Maps for geotagging, and Microsoft Foundry’s Text-to-Speech for narration; deployed on Azure Static Web Apps and Azure Functions.',
        'Designed the UI in Figma and built the React front end.'
      ]
    },
    {
      title: 'Image to Game Map Builder | Python',
      dates: 'June 2024',
      bullets: [
        'Built a Python and OpenCV tool that converts photo images into pixel-art game maps to generate terrains and object placements.'
      ]
    }
  ],

  education: [
    {
      title: 'Diploma in Information Technology in Software Development',
      dates: 'Jan 2022 - Dec 2024',
      detail: 'Rosebank International (South Africa). Three years of coursework toward the diploma.'
    },
    {
      title: 'Microsoft Certified: Azure Developer Associate (AZ-204)',
      dates: 'Aug 2025'
    }
  ]
};

export default resume;
