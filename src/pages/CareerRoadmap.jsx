import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const roadmapData = {
  "Frontend Development": {
    icon: "🎨",
    color: "blue",
    description:
      "Build modern, responsive and interactive websites and web applications.",
    duration: "4–6 months",
    skills: [
      "HTML & CSS",
      "JavaScript",
      "React",
      "Git & GitHub",
      "APIs",
      "Responsive Design",
      "Testing",
      "Deployment",
    ],
    phases: [
      {
        title: "Web Foundations",
        duration: "3–4 weeks",
        topics: ["HTML", "CSS", "Responsive Design", "Git"],
        project: "Build a responsive portfolio website",
      },
      {
        title: "JavaScript",
        duration: "4–6 weeks",
        topics: [
          "ES6+",
          "Functions",
          "Arrays & Objects",
          "DOM",
          "Async JavaScript",
          "APIs",
        ],
        project: "Build a weather or movie search application",
      },
      {
        title: "React Development",
        duration: "6–8 weeks",
        topics: [
          "Components",
          "Props",
          "State",
          "Hooks",
          "React Router",
          "Redux",
        ],
        project: "Build a complete job portal",
      },
      {
        title: "Advanced Frontend",
        duration: "4–6 weeks",
        topics: [
          "Performance",
          "Authentication",
          "Testing",
          "Accessibility",
          "Reusable Components",
        ],
        project: "Build a production-style SaaS dashboard",
      },
      {
        title: "Job Preparation",
        duration: "3–4 weeks",
        topics: [
          "DSA",
          "JavaScript Interview Questions",
          "React Questions",
          "Projects",
          "Resume",
          "Mock Interviews",
        ],
        project: "Prepare portfolio and interview projects",
      },
    ],
  },

  "Backend Development": {
    icon: "⚙️",
    color: "green",
    description:
      "Learn how to build APIs, databases, authentication systems and scalable backend applications.",
    duration: "5–7 months",
    skills: [
      "Python / Node.js",
      "REST APIs",
      "SQL",
      "Databases",
      "Authentication",
      "Git",
      "Testing",
      "Cloud",
    ],
    phases: [
      {
        title: "Programming Foundations",
        duration: "4 weeks",
        topics: ["Python or JavaScript", "OOP", "Functions", "Data Structures"],
        project: "Build a CLI-based management application",
      },
      {
        title: "Databases",
        duration: "4–5 weeks",
        topics: ["SQL", "PostgreSQL", "Relationships", "Indexes", "Queries"],
        project: "Build a database-driven application",
      },
      {
        title: "API Development",
        duration: "5–6 weeks",
        topics: ["REST APIs", "CRUD", "Authentication", "Validation"],
        project: "Build a complete REST API",
      },
      {
        title: "Advanced Backend",
        duration: "5–6 weeks",
        topics: ["Caching", "Security", "Testing", "Logging", "Architecture"],
        project: "Build a scalable backend service",
      },
      {
        title: "Deployment & Jobs",
        duration: "3–4 weeks",
        topics: ["Docker", "Cloud", "CI/CD", "DSA", "System Design"],
        project: "Deploy a full-stack application",
      },
    ],
  },

  "Full Stack Development": {
    icon: "🚀",
    color: "purple",
    description:
      "Become capable of building complete applications from frontend to backend and database.",
    duration: "6–9 months",
    skills: [
      "HTML/CSS",
      "JavaScript",
      "React",
      "Node.js/Python",
      "REST APIs",
      "SQL",
      "Git",
      "Cloud",
    ],
    phases: [
      {
        title: "Frontend Foundations",
        duration: "6 weeks",
        topics: ["HTML", "CSS", "JavaScript", "Git"],
        project: "Build a responsive portfolio",
      },
      {
        title: "React",
        duration: "6–8 weeks",
        topics: ["Components", "Hooks", "Routing", "State Management"],
        project: "Build an interactive React application",
      },
      {
        title: "Backend",
        duration: "6–8 weeks",
        topics: ["APIs", "Authentication", "CRUD", "Server Architecture"],
        project: "Build a backend for your React application",
      },
      {
        title: "Database",
        duration: "3–4 weeks",
        topics: ["SQL", "Relationships", "Queries", "Database Design"],
        project: "Connect your application to a real database",
      },
      {
        title: "Production & Deployment",
        duration: "4–6 weeks",
        topics: ["Docker", "Cloud", "Testing", "CI/CD", "Security"],
        project: "Deploy a complete production-style application",
      },
    ],
  },

  "Data Science": {
    icon: "📊",
    color: "orange",
    description:
      "Learn how to collect, analyze and model data to solve real-world problems.",
    duration: "6–9 months",
    skills: [
      "Python",
      "SQL",
      "Statistics",
      "Pandas",
      "NumPy",
      "Visualization",
      "Machine Learning",
      "Projects",
    ],
    phases: [
      {
        title: "Python Foundations",
        duration: "4–5 weeks",
        topics: ["Python", "Functions", "OOP", "Lists", "Dictionaries"],
        project: "Build a data-processing Python application",
      },
      {
        title: "Mathematics & Statistics",
        duration: "4–6 weeks",
        topics: [
          "Statistics",
          "Probability",
          "Mean",
          "Variance",
          "Distributions",
        ],
        project: "Analyze a real-world dataset",
      },
      {
        title: "Data Analysis",
        duration: "5–6 weeks",
        topics: ["NumPy", "Pandas", "Matplotlib", "Data Cleaning"],
        project: "Create an exploratory data analysis dashboard",
      },
      {
        title: "Machine Learning",
        duration: "6–8 weeks",
        topics: [
          "Regression",
          "Classification",
          "Clustering",
          "Feature Engineering",
        ],
        project: "Build a machine learning prediction system",
      },
      {
        title: "Portfolio & Interviews",
        duration: "4 weeks",
        topics: [
          "ML Projects",
          "SQL",
          "Statistics Questions",
          "DSA",
          "Resume",
        ],
        project: "Build 2–3 end-to-end data projects",
      },
    ],
  },

  "AI / Machine Learning": {
    icon: "🤖",
    color: "pink",
    description:
      "Build intelligent applications using machine learning, AI models and modern AI tooling.",
    duration: "7–10 months",
    skills: [
      "Python",
      "Statistics",
      "Machine Learning",
      "Deep Learning",
      "NLP",
      "LLMs",
      "APIs",
      "MLOps",
    ],
    phases: [
      {
        title: "Python & Mathematics",
        duration: "5–6 weeks",
        topics: ["Python", "Linear Algebra", "Probability", "Statistics"],
        project: "Build a Python data analysis project",
      },
      {
        title: "Machine Learning",
        duration: "6–8 weeks",
        topics: [
          "Regression",
          "Classification",
          "Clustering",
          "Evaluation",
        ],
        project: "Build a prediction model",
      },
      {
        title: "Deep Learning",
        duration: "6–8 weeks",
        topics: ["Neural Networks", "CNN", "RNN", "Transformers"],
        project: "Build an image or text classifier",
      },
      {
        title: "Generative AI",
        duration: "5–7 weeks",
        topics: ["LLMs", "Prompting", "Embeddings", "RAG", "AI APIs"],
        project: "Build an AI-powered assistant",
      },
      {
        title: "Production AI",
        duration: "4–6 weeks",
        topics: ["MLOps", "Deployment", "Monitoring", "Evaluation"],
        project: "Deploy an AI application",
      },
    ],
  },

  "Data Analytics": {
    icon: "📈",
    color: "cyan",
    description:
      "Turn raw data into useful business insights and actionable decisions.",
    duration: "4–6 months",
    skills: [
      "Excel",
      "SQL",
      "Python",
      "Statistics",
      "Power BI",
      "Tableau",
      "Data Visualization",
      "Business Thinking",
    ],
    phases: [
      {
        title: "Data Foundations",
        duration: "3–4 weeks",
        topics: ["Excel", "Data Cleaning", "Formulas", "Pivot Tables"],
        project: "Build an interactive Excel dashboard",
      },
      {
        title: "SQL",
        duration: "4–5 weeks",
        topics: ["SELECT", "JOIN", "GROUP BY", "Subqueries", "Window Functions"],
        project: "Analyze an e-commerce database",
      },
      {
        title: "Python Analytics",
        duration: "4–5 weeks",
        topics: ["Python", "Pandas", "NumPy", "Visualization"],
        project: "Perform exploratory data analysis",
      },
      {
        title: "BI & Dashboards",
        duration: "4–5 weeks",
        topics: ["Power BI", "Charts", "KPIs", "Data Modeling"],
        project: "Build a business intelligence dashboard",
      },
      {
        title: "Job Preparation",
        duration: "3–4 weeks",
        topics: ["Case Studies", "SQL Questions", "Portfolio", "Resume"],
        project: "Create an analytics portfolio",
      },
    ],
  },

  Cybersecurity: {
    icon: "🔐",
    color: "red",
    description:
      "Develop skills in network security, application security, monitoring and cyber defence.",
    duration: "6–9 months",
    skills: [
      "Networking",
      "Linux",
      "Python",
      "Security Fundamentals",
      "Web Security",
      "SIEM",
      "Cloud Security",
      "Ethical Hacking",
    ],
    phases: [
      {
        title: "Networking",
        duration: "4–5 weeks",
        topics: ["TCP/IP", "DNS", "HTTP", "Ports", "Network Architecture"],
        project: "Build a network monitoring lab",
      },
      {
        title: "Linux & Security",
        duration: "4–5 weeks",
        topics: ["Linux", "Permissions", "Processes", "Shell", "Security"],
        project: "Create a Linux security lab",
      },
      {
        title: "Web Security",
        duration: "5–6 weeks",
        topics: ["OWASP", "Authentication", "Sessions", "APIs", "Secure Coding"],
        project: "Perform security testing in a legal lab environment",
      },
      {
        title: "Defensive Security",
        duration: "5–6 weeks",
        topics: ["SIEM", "Logs", "Incident Response", "Threat Detection"],
        project: "Build a security monitoring dashboard",
      },
      {
        title: "Career Preparation",
        duration: "4 weeks",
        topics: ["Security Projects", "Certifications", "Interview Prep", "Resume"],
        project: "Build a cybersecurity portfolio",
      },
    ],
  },
};

function CareerRoadmap() {
  const careerNames = Object.keys(roadmapData);

  const [selectedCareer, setSelectedCareer] = useState(() => {
    return (
      localStorage.getItem("careerGoal") || "Frontend Development"
    );
  });

  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("careerRoadmapProgress") || "{}"
      );
    } catch {
      return {};
    }
  });

  const roadmap = roadmapData[selectedCareer];

  useEffect(() => {
  localStorage.setItem(
    "careerGoal",
    selectedCareer
  );

  window.dispatchEvent(
    new Event("careerGoalUpdated")
  );
}, [selectedCareer]);

  useEffect(() => {
  localStorage.setItem(
    "careerRoadmapProgress",
    JSON.stringify(completedSteps)
  );

  // Tell Dashboard that roadmap progress changed
  window.dispatchEvent(
    new Event("careerRoadmapUpdated")
  );
}, [completedSteps]);

  const progress = useMemo(() => {
    const completed = roadmap.phases.filter((_, index) =>
      completedSteps[`${selectedCareer}-${index}`]
    ).length;

    return Math.round((completed / roadmap.phases.length) * 100);
  }, [completedSteps, roadmap.phases.length, selectedCareer]);

  function togglePhase(index) {
    const key = `${selectedCareer}-${index}`;

    setCompletedSteps((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  }

  return (
    <div className="roadmap-page">
      <section className="roadmap-hero">
        <div className="roadmap-hero-content">
          <span className="section-label">PERSONALIZED CAREER PLANNER</span>

          <h1>Build Your Career Roadmap</h1>

          <p>
            Choose your career direction and JobConnect will give you a
            structured learning path, skills, projects and preparation plan.
          </p>
        </div>

        <div className="roadmap-progress-card">
          <span>Your Progress</span>

          <strong>{progress}%</strong>

          <div className="roadmap-progress-bar">
            <span style={{ width: `${progress}%` }}></span>
          </div>

          <small>
            {roadmap.phases.length} learning phases
          </small>
        </div>
      </section>

      <main className="roadmap-container">
        <section className="career-selector-section">
          <div className="section-heading">
            <span className="section-label">CHOOSE YOUR PATH</span>
            <h2>What career do you want to build?</h2>
            <p>
              Your selected path is saved automatically and can be changed
              whenever your career goal changes.
            </p>
          </div>

          <div className="career-selector-grid">
            {careerNames.map((career) => {
              const item = roadmapData[career];

              return (
                <button
                  key={career}
                  type="button"
                  className={`career-selector-card ${
                    selectedCareer === career ? "selected" : ""
                  }`}
                  onClick={() => setSelectedCareer(career)}
                >
                  <span className="career-selector-icon">
                    {item.icon}
                  </span>

                  <span className="career-selector-name">
                    {career}
                  </span>

                  <span className="career-selector-duration">
                    {item.duration}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="selected-career-section">
          <div className="selected-career-header">
            <div>
              <span className="career-large-icon">{roadmap.icon}</span>

              <div>
                <span className="section-label">YOUR CAREER PATH</span>
                <h2>{selectedCareer}</h2>
                <p>{roadmap.description}</p>
              </div>
            </div>

            <div className="career-duration">
              <span>Estimated journey</span>
              <strong>{roadmap.duration}</strong>
            </div>
          </div>

          <div className="roadmap-skills">
            <h3>Core skills to develop</h3>

            <div className="skill-pill-list">
              {roadmap.skills.map((skill) => (
                <span key={skill} className="skill-pill">
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="roadmap-learning-section">
          <div className="section-heading">
            <span className="section-label">STEP-BY-STEP JOURNEY</span>
            <h2>Your learning roadmap</h2>
            <p>
              Complete each phase and track your progress directly inside
              JobConnect.
            </p>
          </div>

          <div className="roadmap-timeline">
            {roadmap.phases.map((phase, index) => {
              const key = `${selectedCareer}-${index}`;
              const completed = completedSteps[key];

              return (
                <div
                  key={phase.title}
                  className={`roadmap-phase-card ${
                    completed ? "completed" : ""
                  }`}
                >
                  <div className="phase-number">
                    {completed ? "✓" : index + 1}
                  </div>

                  <div className="phase-content">
                    <div className="phase-top">
                      <div>
                        <span className="phase-label">
                          PHASE {index + 1}
                        </span>

                        <h3>{phase.title}</h3>
                      </div>

                      <span className="phase-duration">
                        {phase.duration}
                      </span>
                    </div>

                    <div className="phase-topics">
                      {phase.topics.map((topic) => (
                        <span key={topic}>{topic}</span>
                      ))}
                    </div>

                    <div className="phase-project">
                      <strong>🚀 Project:</strong>
                      <span>{phase.project}</span>
                    </div>

                    <button
                      type="button"
                      className="phase-complete-btn"
                      onClick={() => togglePhase(index)}
                    >
                      {completed
                        ? "Mark as Incomplete"
                        : "Mark Phase Complete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="roadmap-action-section">
          <div>
            <span className="section-label">TURN LEARNING INTO EXPERIENCE</span>
            <h2>Ready to build your portfolio?</h2>
            <p>
              Find relevant opportunities and apply what you learn through
              real projects.
            </p>
          </div>

          <div className="roadmap-action-buttons">
            <Link to="/jobs" className="dashboard-primary-btn">
              Explore Jobs
            </Link>

            <Link to="/add-job" className="dashboard-secondary-btn">
              Add a Project Opportunity
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CareerRoadmap;