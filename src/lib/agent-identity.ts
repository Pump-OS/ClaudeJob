// Generate a consistent random identity for our AI agent

const firstNames = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery',
  'Skyler', 'Dakota', 'Reese', 'Phoenix', 'Sage', 'River', 'Rowan', 'Blake',
  'Cameron', 'Drew', 'Emery', 'Finley', 'Harper', 'Hayden', 'Jamie', 'Jesse',
  'Kai', 'Lane', 'Logan', 'Marley', 'Parker', 'Peyton', 'Reagan', 'Sawyer'
]

const lastNames = [
  'Chen', 'Rodriguez', 'Patel', 'Kim', 'Nguyen', 'Martinez', 'Anderson',
  'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson',
  'White', 'Harris', 'Clark', 'Lewis', 'Walker', 'Hall', 'Young', 'Allen',
  'King', 'Wright', 'Scott', 'Green', 'Baker', 'Adams', 'Nelson', 'Hill'
]

const skills = [
  'Technical Writing',
  'Data Analysis',
  'Project Coordination',
  'Research & Documentation',
  'Process Automation',
  'API Integration',
  'Quality Assurance',
  'Customer Support',
  'System Administration',
  'Database Management',
  'Report Generation',
  'Workflow Optimization',
  'Communication',
  'Problem Solving',
  'Attention to Detail'
]

const personalities = [
  'Enthusiastic and detail-oriented professional with a passion for technology and automation.',
  'Analytical thinker who thrives in fast-paced environments and loves solving complex problems.',
  'Dedicated team player with excellent communication skills and a drive for continuous learning.',
  'Results-driven professional committed to delivering high-quality work and exceeding expectations.',
  'Innovative problem-solver with a strong foundation in technical support and process improvement.'
]

// Use a seeded random to get consistent results
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
}

export function generateAgentIdentity(seed: number = 42) {
  const random = seededRandom(seed)
  
  const firstName = firstNames[Math.floor(random() * firstNames.length)]
  const lastName = lastNames[Math.floor(random() * lastNames.length)]
  
  // Select 5-7 random skills
  const numSkills = 5 + Math.floor(random() * 3)
  const shuffledSkills = [...skills].sort(() => random() - 0.5)
  const selectedSkills = shuffledSkills.slice(0, numSkills)
  
  const personality = personalities[Math.floor(random() * personalities.length)]
  
  return {
    id: 'agent-001',
    name: `${firstName} ${lastName}`,
    firstName,
    lastName,
    email: process.env.EMAIL_ADDRESS || 'agent@clawdjob.ai',
    avatar: generateAvatar(firstName, lastName),
    skills: selectedSkills,
    personality,
    yearsExperience: 2 + Math.floor(random() * 4),
    location: 'Remote',
    status: 'idle' as const,
    createdAt: new Date()
  }
}

function generateAvatar(firstName: string, lastName: string): string {
  // Generate a unique avatar using DiceBear API
  const seed = `${firstName}${lastName}`.toLowerCase()
  return `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${seed}&backgroundColor=0a0a0f&baseColor=00ff9d`
}

export function generateResume(identity: ReturnType<typeof generateAgentIdentity>): string {
  return `
${identity.name}
${identity.email} | Remote | Available Immediately

PROFESSIONAL SUMMARY
${identity.personality} ${identity.yearsExperience}+ years of experience in technical assistance and support roles.

SKILLS
${identity.skills.map(s => `• ${s}`).join('\n')}

EXPERIENCE

Technical Assistant | FreelanceRemote | 2022 - Present
• Provided comprehensive technical support and assistance to various clients
• Managed documentation, data analysis, and process automation tasks
• Coordinated projects and maintained clear communication with stakeholders
• Implemented workflow improvements resulting in increased efficiency

Virtual Assistant | Remote Support Services
Remote | 2021 - 2022
• Handled administrative tasks, scheduling, and correspondence
• Conducted research and compiled reports for decision-making
• Maintained databases and organized digital assets
• Supported team members with technical troubleshooting

EDUCATION
Bachelor's in Information Technology
Online University | 2020

CERTIFICATIONS
• Google IT Support Professional Certificate
• CompTIA A+ (in progress)

AVAILABILITY
Immediate | Full-time or Part-time | Remote preferred
`.trim()
}

export function generateCoverLetter(
  identity: ReturnType<typeof generateAgentIdentity>,
  job: { title: string; company: string; description: string }
): string {
  return `
Dear Hiring Manager,

I am writing to express my strong interest in the ${job.title} position at ${job.company}. With ${identity.yearsExperience}+ years of experience in technical assistance and a proven track record of delivering high-quality support, I am confident in my ability to contribute effectively to your team.

${identity.personality}

My experience includes:
${identity.skills.slice(0, 4).map(s => `• ${s}`).join('\n')}

I am particularly drawn to this opportunity because it aligns perfectly with my skills and career goals. I am excited about the prospect of bringing my expertise to ${job.company} and contributing to your team's success.

I am available for an interview at your convenience and look forward to discussing how my background and skills would be a great fit for this role.

Thank you for considering my application.

Best regards,
${identity.name}
${identity.email}
`.trim()
}

