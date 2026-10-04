import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../services/api";

const marketTrends = [
  {
    icon: "🤖",
    title: "AI & Machine Learning",
    level: "High Focus",
    description:
      "AI and big data continue to be among the fastest-growing skill areas.",
    skills: ["Python", "Machine Learning", "LLMs", "AI APIs"],
  },
  {
    icon: "📊",
    title: "Data & Analytics",
    level: "High Focus",
    description:
      "Data skills remain important for turning business information into decisions.",
    skills: ["SQL", "Python", "Pandas", "Power BI"],
  },
  {
    icon: "🔐",
    title: "Cybersecurity",
    level: "High Focus",
    description:
      "Security skills are becoming increasingly important as organizations adopt AI and cloud systems.",
    skills: ["Networking", "Linux", "Cloud Security", "SIEM"],
  },
  {
    icon: "☁️",
    title: "Cloud & DevOps",
    level: "Growing",
    description:
      "Modern applications increasingly depend on cloud infrastructure and automation.",
    skills: ["AWS/Azure", "Docker", "Kubernetes", "CI/CD"],
  },
];

const focusAreas = [
  {
    title: "Build projects",
    description:
      "Convert every major topic you learn into a working project.",
    icon: "🚀",
  },
  {
    title: "Practice problem solving",
    description:
      "Strengthen DSA, SQL and logical thinking through regular practice.",
    icon: "🧠",
  },
  {
    title: "Learn AI literacy",
    description:
      "Understand how AI tools can be used responsibly in your chosen domain.",
    icon: "🤖",
  },
  {
    title: "Create proof of work",
    description:
      "Use GitHub, portfolios and deployed projects to demonstrate your skills.",
    icon: "💼",
  },
];

function getLoggedInUser() {
  try {
    const savedUser = localStorage.getItem("loggedInUser");

    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error("Error reading logged-in user:", error);
    return null;
  }
}

/*
  Calculate roadmap progress for a specific career.

  Each career currently has 5 phases.
  The CareerRoadmap page stores completed phases like:

  {
    "Frontend Development-0": true,
    "Frontend Development-1": true
  }
*/
function calculateRoadmapProgressForCareer(career) {
  const savedProgress = localStorage.getItem(
    "careerRoadmapProgress"
  );

  if (!savedProgress) {
    return 0;
  }

  try {
    const completedSteps = JSON.parse(savedProgress);

    const totalPhases = 5;

    const completedPhases = Array.from(
      { length: totalPhases },
      (_, index) =>
        completedSteps[`${career}-${index}`]
    ).filter(Boolean).length;

    return Math.round(
      (completedPhases / totalPhases) * 100
    );
  } catch (error) {
    console.error(
      "Error reading career roadmap progress:",
      error
    );

    return 0;
  }
}

function Dashboard() {
  const user = getLoggedInUser();

  const favorites = useSelector((state) => state.favorites);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [careerGoal, setCareerGoal] = useState(
    () =>
      localStorage.getItem("careerGoal") ||
      "Frontend Development"
  );

  // Dynamic profile completion
  const [profileCompletion, setProfileCompletion] = useState(() => {
    const savedCompletion =
      localStorage.getItem("profileCompletion");

    return savedCompletion
      ? Number(savedCompletion)
      : 25;
  });

  // Dynamic career roadmap progress
  const [roadmapProgress, setRoadmapProgress] = useState(() =>
    calculateRoadmapProgressForCareer(
      localStorage.getItem("careerGoal") ||
        "Frontend Development"
    )
  );

  // Fetch jobs
  useEffect(() => {
    async function getJobs() {
      try {
        const response = await api.get("/jobs");
        setJobs(response.data);
      } catch (error) {
        console.error(
          "Error fetching dashboard jobs:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    getJobs();
  }, []);

  // Update profile completion whenever Profile.jsx saves changes
  useEffect(() => {
    function updateProfileCompletion() {
      const savedCompletion =
        localStorage.getItem("profileCompletion");

      setProfileCompletion(
        savedCompletion
          ? Number(savedCompletion)
          : 25
      );
    }

    window.addEventListener(
      "profileUpdated",
      updateProfileCompletion
    );

    updateProfileCompletion();

    return () => {
      window.removeEventListener(
        "profileUpdated",
        updateProfileCompletion
      );
    };
  }, []);

  // Update roadmap progress whenever roadmap changes
  useEffect(() => {
    function updateRoadmapProgress() {
      const currentCareer =
        localStorage.getItem("careerGoal") ||
        careerGoal;

      setRoadmapProgress(
        calculateRoadmapProgressForCareer(
          currentCareer
        )
      );
    }

    window.addEventListener(
      "careerRoadmapUpdated",
      updateRoadmapProgress
    );

    updateRoadmapProgress();

    return () => {
      window.removeEventListener(
        "careerRoadmapUpdated",
        updateRoadmapProgress
      );
    };
  }, [careerGoal]);

  // Update Dashboard when career goal changes from CareerRoadmap
  useEffect(() => {
    function updateCareerGoal() {
      const savedCareer =
        localStorage.getItem("careerGoal") ||
        "Frontend Development";

      setCareerGoal(savedCareer);

      setRoadmapProgress(
        calculateRoadmapProgressForCareer(
          savedCareer
        )
      );
    }

    window.addEventListener(
      "careerGoalUpdated",
      updateCareerGoal
    );

    updateCareerGoal();

    return () => {
      window.removeEventListener(
        "careerGoalUpdated",
        updateCareerGoal
      );
    };
  }, []);

  function handleCareerChange(event) {
    const value = event.target.value;

    setCareerGoal(value);

    localStorage.setItem(
      "careerGoal",
      value
    );

    // Recalculate roadmap progress for the selected career
    const progress =
      calculateRoadmapProgressForCareer(value);

    setRoadmapProgress(progress);

    // Tell other parts of the application
    // that the career direction changed.
    window.dispatchEvent(
      new Event("careerGoalUpdated")
    );
  }

  const firstName = useMemo(() => {
    if (!user) return "there";

    const name =
      user.name ||
      user.fullName ||
      user.username ||
      user.email ||
      "there";

    return name.split(" ")[0];
  }, [user]);

  const savedJobsCount = Array.isArray(favorites)
    ? favorites.length
    : 0;

  const recommendedJobs = jobs.slice(0, 3);

  const availableJobs = jobs.length;

  return (
    <div className="dashboard-page">

      {/* HERO */}
      <section className="dashboard-hero">
        <div className="dashboard-hero-content">

          <span className="dashboard-eyebrow">
            YOUR CAREER COMMAND CENTER
          </span>

          <h1>
            Welcome back, {firstName} <span>👋</span>
          </h1>

          <p>
            Track your job search, build your skills, follow your
            career roadmap and stay aware of the skills changing
            the job market.
          </p>

          <div className="dashboard-hero-actions">

            <Link
              to="/jobs"
              className="dashboard-primary-btn"
            >
              Explore Jobs
            </Link>

            <Link
              to="/saved-jobs"
              className="dashboard-secondary-btn"
            >
              ♡ View Saved Jobs
            </Link>

          </div>
        </div>

        <div className="dashboard-career-card">

          <div className="career-card-top">

            <span className="career-card-icon">
              🎯
            </span>

            <div>
              <span>Your current career focus</span>
              <strong>{careerGoal}</strong>
            </div>

          </div>

          <label htmlFor="career-select">
            Change your career direction
          </label>

          <select
            id="career-select"
            value={careerGoal}
            onChange={handleCareerChange}
          >
            <option>
              Frontend Development
            </option>

            <option>
              Backend Development
            </option>

            <option>
              Full Stack Development
            </option>

            <option>
              Data Science
            </option>

            <option>
              AI / Machine Learning
            </option>

            <option>
              Data Analytics
            </option>

            <option>
              Cybersecurity
            </option>
          </select>

          <Link
            to="/career-roadmap"
            className="career-card-link"
          >
            Open Personalized Roadmap →
          </Link>

        </div>
      </section>

      {/* STATS */}
      <section className="dashboard-stats">

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon">
            ♡
          </div>

          <div>
            <span>Saved Jobs</span>
            <strong>{savedJobsCount}</strong>
          </div>

          <Link to="/saved-jobs">
            View →
          </Link>

        </div>

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon">
            📄
          </div>

          <div>
            <span>Applications</span>
            <strong>0</strong>
          </div>

          <span className="stat-muted">
            Coming soon
          </span>

        </div>

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon">
            👤
          </div>

          <div>
            <span>Profile Progress</span>
            <strong>{profileCompletion}%</strong>
          </div>

          <Link to="/profile">
            Improve →
          </Link>

        </div>

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon">
            💼
          </div>

          <div>
            <span>Available Jobs</span>
            <strong>{availableJobs}</strong>
          </div>

          <Link to="/jobs">
            Explore →
          </Link>

        </div>

      </section>

      {/* MAIN GRID */}
      <main className="dashboard-main">

        <div className="dashboard-content-grid">

          {/* ROADMAP */}
          <section className="dashboard-roadmap-card">

            <div className="dashboard-section-heading">

              <div>

                <span className="section-label">
                  CAREER ROADMAP
                </span>

                <h2>
                  Your path to {careerGoal}
                </h2>

                <p>
                  Follow a structured learning path and turn
                  knowledge into projects.
                </p>

              </div>

              <Link
                to="/career-roadmap"
                className="section-link"
              >
                View Details →
              </Link>

            </div>

            {/* DYNAMIC ROADMAP PROGRESS */}
            <div className="dashboard-roadmap-progress">

              <div className="roadmap-progress-header">

                <span>
                  Current progress
                </span>

                <strong>
                  {roadmapProgress}%
                </strong>

              </div>

              <div className="roadmap-progress">

                <span
                  style={{
                    width: `${roadmapProgress}%`,
                  }}
                ></span>

              </div>

            </div>

            <div className="roadmap-preview-grid">

              <div className="roadmap-preview-item active">

                <span>01</span>

                <div>
                  <strong>
                    Build Foundations
                  </strong>

                  <small>
                    Start with the fundamentals
                  </small>
                </div>

              </div>

              <div className="roadmap-preview-item">

                <span>02</span>

                <div>
                  <strong>
                    Develop Core Skills
                  </strong>

                  <small>
                    Practice through projects
                  </small>
                </div>

              </div>

              <div className="roadmap-preview-item">

                <span>03</span>

                <div>
                  <strong>
                    Build Portfolio
                  </strong>

                  <small>
                    Create proof of work
                  </small>
                </div>

              </div>

            </div>

            <Link
              to="/career-roadmap"
              className="roadmap-button"
            >
              Start Personalized Roadmap
            </Link>

          </section>

          {/* QUICK ACTIONS */}
          <section className="dashboard-actions-card">

            <div className="dashboard-section-heading">

              <div>

                <span className="section-label">
                  QUICK ACTIONS
                </span>

                <h2>
                  What do you want to do?
                </h2>

              </div>

            </div>

            <div className="quick-actions">

              <Link
                to="/jobs"
                className="quick-action"
              >
                <span>🔎</span>

                <div>
                  <strong>Find Jobs</strong>

                  <small>
                    Discover new opportunities
                  </small>
                </div>

              </Link>

              <Link
                to="/saved-jobs"
                className="quick-action"
              >
                <span>♡</span>

                <div>
                  <strong>Saved Jobs</strong>

                  <small>
                    Review your shortlisted jobs
                  </small>
                </div>

              </Link>

              <Link
                to="/add-job"
                className="quick-action"
              >
                <span>＋</span>

                <div>
                  <strong>Post a Job</strong>

                  <small>
                    Add an opportunity
                  </small>
                </div>

              </Link>

              <Link
                to="/career-roadmap"
                className="quick-action"
              >
                <span>🗺️</span>

                <div>
                  <strong>Career Roadmap</strong>

                  <small>
                    Plan your learning journey
                  </small>
                </div>

              </Link>

            </div>

          </section>

        </div>

        {/* MARKET TRENDS */}
        <section className="market-section">

          <div className="dashboard-section-heading market-heading">

            <div>

              <span className="section-label">
                INDUSTRY PULSE • 2026
              </span>

              <h2>
                What skills should you focus on?
              </h2>

              <p>
                Use market signals as a guide, then build
                practical skills through projects and
                consistent practice.
              </p>

            </div>

            <span className="market-live-badge">
              ● Updated view
            </span>

          </div>

          <div className="market-grid">

            {marketTrends.map((trend) => (

              <article
                className="market-card"
                key={trend.title}
              >

                <div className="market-card-top">

                  <span className="market-icon">
                    {trend.icon}
                  </span>

                  <span className="market-level">
                    {trend.level}
                  </span>

                </div>

                <h3>
                  {trend.title}
                </h3>

                <p>
                  {trend.description}
                </p>

                <div className="market-skills">

                  {trend.skills.map((skill) => (

                    <span key={skill}>
                      {skill}
                    </span>

                  ))}

                </div>

              </article>

            ))}

          </div>

          <div className="market-source-note">
            Market view based on recent workforce and skills
            reports, including the World Economic Forum
            Future of Jobs research and NIIT India Skills Gap
            Report 2026.
          </div>

        </section>

        {/* FOCUS AREAS */}
        <section className="focus-section">

          <div className="dashboard-section-heading">

            <div>

              <span className="section-label">
                YOUR DEVELOPMENT PLAN
              </span>

              <h2>
                How to turn learning into a career
              </h2>

              <p>
                Technology knowledge becomes valuable when
                you can demonstrate how you use it.
              </p>

            </div>

          </div>

          <div className="focus-grid">

            {focusAreas.map((area) => (

              <article
                className="focus-card"
                key={area.title}
              >

                <span className="focus-icon">
                  {area.icon}
                </span>

                <h3>
                  {area.title}
                </h3>

                <p>
                  {area.description}
                </p>

              </article>

            ))}

          </div>

        </section>

        {/* RECOMMENDED JOBS */}
        <section className="dashboard-jobs-section">

          <div className="dashboard-section-heading">

            <div>

              <span className="section-label">
                OPPORTUNITIES
              </span>

              <h2>
                Recommended opportunities
              </h2>

              <p>
                Start applying your skills to real
                opportunities.
              </p>

            </div>

            <Link
              to="/jobs"
              className="section-link"
            >
              View All Jobs →
            </Link>

          </div>

          {loading ? (

            <div className="dashboard-loading">
              Loading opportunities...
            </div>

          ) : recommendedJobs.length === 0 ? (

            <div className="dashboard-empty">

              <span>💼</span>

              <h3>
                No jobs available yet
              </h3>

              <p>
                New opportunities will appear here.
              </p>

            </div>

          ) : (

            <div className="dashboard-job-grid">

              {recommendedJobs.map((job) => (

                <article
                  className="dashboard-job-card"
                  key={job.id}
                >

                  <div className="dashboard-job-company">
                    {job.company?.charAt(0)?.toUpperCase() ||
                      "J"}
                  </div>

                  <div className="dashboard-job-content">

                    <span className="dashboard-job-type">
                      {job.jobType || "Full Time"}
                    </span>

                    <h3>
                      {job.title}
                    </h3>

                    <p>
                      {job.company}
                    </p>

                    <div className="dashboard-job-meta">

                      <span>
                        📍 {job.location}
                      </span>

                      <span>
                        💼 {job.workMode || "On-site"}
                      </span>

                    </div>

                    <Link to={`/jobs/${job.id}`}>
                      View Opportunity →
                    </Link>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

        {/* CAREER TOOLS */}
        <section className="career-tools-section">

          <div className="dashboard-section-heading">

            <div>

              <span className="section-label">
                CAREER TOOLKIT
              </span>

              <h2>
                Everything you need to grow
              </h2>

              <p>
                JobConnect can gradually become your complete
                career development workspace.
              </p>

            </div>

          </div>

          <div className="career-tools-grid">

            <Link
              to="/career-roadmap"
              className="career-tool-card"
            >

              <span>🗺️</span>

              <h3>
                Career Roadmaps
              </h3>

              <p>
                Follow a personalized skill-building journey.
              </p>

            </Link>

            <div className="career-tool-card coming-soon">

              <span>📄</span>

              <h3>
                Resume Center
              </h3>

              <p>
                Build and improve your job-ready resume.
              </p>

              <small>
                Coming Soon
              </small>

            </div>

            <div className="career-tool-card coming-soon">

              <span>🎤</span>

              <h3>
                Interview Prep
              </h3>

              <p>
                Practice technical and behavioral interviews.
              </p>

              <small>
                Coming Soon
              </small>

            </div>

            <div className="career-tool-card coming-soon">

              <span>📈</span>

              <h3>
                Career Analytics
              </h3>

              <p>
                Track your applications, skills and progress.
              </p>

              <small>
                Coming Soon
              </small>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;