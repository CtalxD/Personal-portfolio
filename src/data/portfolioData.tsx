import { PortfolioData } from '../types';

export const portfolioData: PortfolioData = {
  personal: {
    name: "Sital Aryal",
    title: "Frontend Developer (React/React Native) | UI/UX Designer",
    location: "Balaju, Kathmandu",
    email: "ctalaryal22@gmail.com",
    phone: "+977 9862732725",
    bio: "Frontend Developer and UI/UX Designer passionate about crafting intuitive, user-friendly websites and mobile applications. Strong foundation in React, CSS, and Figma with a keen eye for clean, modern, and visually appealing design. Motivated to work on real-world projects, collaborate with teams, and continuously improve user experiences.",
    linkedin: "https://www.linkedin.com/in/ctalxd/",
    github: "https://github.com/CtalxD"
  },
  
  education: [
    {
      id: 1,
      degree: "BSc (Hons) Computing",
      institution: "Herald College Kathmandu",
      period: "2022 - 2025",
      grade: ""
    },
    {
      id: 2,
      degree: "+2 Management",
      institution: "Uniglobe SS/College, Kathmandu",
      period: "2019 - 2021",
      grade: ""
    }
  ],
  
  projects: [
    {
      id: 1,
      title: "Heart Rate Sensor",
      role: "Embedded Systems Developer",
      year: "2023",
      description: "Built a heart rate and pulse monitoring system using Arduino, Heart Rate Sensor and LED Display for an embedded systems project.",
      technologies: ["Arduino", "Heart Rate Sensor", "LED Display", "C++"],
      links: {
        youtube: "https://youtu.be/F5LE4vpsePI?si=mXALjsonL0mo83MI",
        github: ""
      }
    },
    {
      id: 2,
      title: "Real Estate Website",
      role: "UI/UX Designer & Frontend Developer",
      year: "2024",
      description: "Designed and prototyped real estate website UI/UX in Figma, optimized for desktop. Developed audio interface for visually impaired users with screen-reader compatible navigation. Implemented multilingual support including Spanish translation for broader user reach.",
      technologies: ["Figma", "UI/UX", "Accessibility", "i18n", "HTML/CSS"],
      links: {
        youtube: "https://youtube.com/watch?v=real-estate",
        github: "https://github.com/CtalxD/real-estate"
      }
    },
    {
      id: 3,
      title: "Car Rental System",
      role: "Business Analyst & Team Lead",
      year: "2024",
      description: "Acted as Business Analyst, supporting developers with wireframes and system diagrams. Managed project timelines and tasks using Jira for effective sprint and time planning. Led the team effectively, ensuring timely project completion.",
      technologies: ["Jira", "Wireframing", "Agile", "Leadership", "System Design"],
      links: {
        github: "https://github.com/CtalxD/car-rental"
      }
    },
    {
      id: 4,
      title: "Multi-Agent Truck Logistics Simulator",
      role: "Game Developer & AI Programmer",
      year: "2025",
      description: "A logistics simulation game featuring autonomous trucks using hybrid pathfinding algorithms. Three trucks navigate through 10 waypoints to collect 10 packages, dynamically switching from Ant Colony Optimization (ACO) for exploration to A* algorithm for optimal return paths.",
      technologies: ["Unity", "C#", "Ant Colony Optimization", "A* Algorithm", "AI Programming", "Pathfinding"],
      links: {
        github: "https://github.com/CtalxD/truck-simulator",
        youtube: "https://youtube.com/watch?v=truck-simulator"
      },
      details: {
        agents: [
          { name: "Truck1", startNode: "Waypoint 2", goalNode: "Self-determined" },
          { name: "Truck2", startNode: "Waypoint 1", goalNode: "Self-determined" },
          { name: "Truck3", startNode: "Waypoint 4", goalNode: "Self-determined" }
        ],
        totalNodes: 10,
        packageCount: 10,
        algorithms: {
          initial: "Ant Colony Optimization (ACO) - Used for package collection phase",
          return: "A* Algorithm - Activated after last package collection for optimal return"
        },
        features: [
          "Dynamic goal determination by each agent",
          "Seamless algorithm switching based on mission state",
          "Real-time path recalculation",
          "Multi-agent coordination",
          "Visual waypoint navigation system"
        ],
        gameplay: "At first, the Ant Colony Optimization (ACO) algorithm is enabled for exploration and package collection. After picking up the last parcel, ACO is disabled and A* Algorithm takes over to return to starting point using the shortest path."
      }
    },
    {
      id: 5,
      title: "RouteMate - Real-Time Bus Tracking App",
      role: "Lead Developer",
      year: "2025",
      description: "Developed a real-time bus route tracking mobile application using React Native, Node.js, and PostgreSQL. Includes multiple planned features and is currently under development.",
      technologies: ["React Native", "Node.js", "PostgreSQL", "Maps API", "WebSockets"],
      links: {
        github: "https://github.com/CtalxD/routemate"
      }
    }
  ],
  
  skills: {
    technical: [
      "React & React Native",
      "CSS & UI Design",
      "Figma (UI/UX Design)",
      "Microsoft Office",
      "Node.js",
      "PostgreSQL",
      "Git & GitHub",
      "Unity & C#",
      "AI Pathfinding Algorithms"
    ],
    soft: [
      "Analytical Thinking",
      "Problem Solving",
      "Fast Learner",
      "Team Collaboration",
      "Leadership",
      "Time Management"
    ]
  },

  workExperiences: [
    {
      id: 1,
      company: "Tech Company",
      role: "Frontend Developer",
      year: "2023 - Present",
      description: "Building responsive web and mobile applications using React and React Native. Focus on clean, maintainable code and optimal performance."
    },
    {
      id: 2,
      company: "Design Studio",
      role: "UI/UX Designer",
      year: "2022 - 2023",
      description: "Creating intuitive interfaces in Figma with a focus on user research, wireframing, prototyping, and accessibility standards."
    },
    {
      id: 3,
      company: "Agency",
      role: "Team Lead",
      year: "2021 - 2022",
      description: "Experience as Business Analyst and Team Lead. Managing projects using Agile methodology, Jira, and effective communication."
    }
  ]
};