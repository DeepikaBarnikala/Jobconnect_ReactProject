
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  function handleSearch(event) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    }

    if (location.trim()) {
      params.set("location", location.trim());
    }

    const queryString = params.toString();

    navigate(queryString ? `/jobs?${queryString}` : "/jobs");
  }

  const categories = [
    {
      name: "Software Development",
      icon: "💻",
      count: "1,250 Jobs",
    },
    {
      name: "Data Science",
      icon: "📊",
      count: "680 Jobs",
    },
    {
      name: "Electronics & EEE",
      icon: "⚡",
      count: "420 Jobs",
    },
    {
      name: "UI / UX Design",
      icon: "🎨",
      count: "310 Jobs",
    },
    {
      name: "Marketing",
      icon: "📢",
      count: "290 Jobs",
    },
    {
      name: "Finance",
      icon: "💰",
      count: "375 Jobs",
    },
  ];

  const popularSearches = [
    "Java",
    "Python",
    "React",
    "Data Science",
    "Software Developer",
  ];

  return (
    <div className="home">

      {/* ================= HERO SECTION ================= */}

      <section className="hero-section">
        <div className="hero-content">

          <div className="hero-badge">
            🚀 Build Your Future With JobConnect
          </div>

          <h1>
            Find a Job That
            <span>Matches Your Ambition.</span>
          </h1>

          <p className="hero-description">
            Discover thousands of opportunities from growing startups
            and leading companies. Your next career move starts here.
          </p>

          {/* FUNCTIONAL SEARCH BOX */}

          <form className="job-search" onSubmit={handleSearch}>

            <div className="search-field">
              <span>🔍</span>

              <div>
                <label htmlFor="home-job-search">
                  Job Title
                </label>

                <input
                  id="home-job-search"
                  type="text"
                  placeholder="Job title, skills or keywords"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="search-field">
              <span>📍</span>

              <div>
                <label htmlFor="home-location">
                  Location
                </label>

                <input
                  id="home-location"
                  type="text"
                  placeholder="City or location"
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                />
              </div>
            </div>

            <button type="submit" className="search-btn">
              Search Jobs →
            </button>

          </form>

          {/* POPULAR SEARCHES */}

          <div className="popular-searches">
            <span>Popular:</span>

            {popularSearches.map((keyword) => (
              <Link
                key={keyword}
                to={`/jobs?search=${encodeURIComponent(keyword)}`}
              >
                {keyword}
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ================= STATISTICS ================= */}

      <section className="stats-section">

        <div className="stat">
          <h2>10K+</h2>
          <p>Active Jobs</p>
        </div>

        <div className="stat">
          <h2>2K+</h2>
          <p>Companies</p>
        </div>

        <div className="stat">
          <h2>5K+</h2>
          <p>Job Seekers</p>
        </div>

        <div className="stat">
          <h2>500+</h2>
          <p>New Jobs Weekly</p>
        </div>

      </section>

      {/* ================= CATEGORIES ================= */}

      <section className="categories-section">

        <div className="section-heading">
          <div>
            <span className="section-label">
              EXPLORE
            </span>

            <h2>Popular Job Categories</h2>

            <p>
              Explore opportunities across different industries and
              find a role that matches your skills.
            </p>
          </div>

          <Link to="/jobs" className="view-all">
            View All Jobs →
          </Link>
        </div>

        <div className="category-grid">

          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/jobs?category=${encodeURIComponent(category.name)}`}
              className="category-card"
              aria-label={`Explore ${category.name} jobs`}
            >
              <div className="category-icon">
                {category.icon}
              </div>

              <h3>{category.name}</h3>

              <p>{category.count}</p>

              <span className="category-explore">
                Explore Jobs →
              </span>
            </Link>
          ))}

        </div>
      </section>

      {/* ================= FEATURED JOBS ================= */}

      <section className="featured-section">

        <div className="section-heading">
          <div>
            <span className="section-label">
              OPPORTUNITIES
            </span>

            <h2>Featured Jobs</h2>

            <p>
              Discover some of the latest opportunities available
              on JobConnect.
            </p>
          </div>

          <Link to="/jobs" className="view-all">
            Explore Jobs →
          </Link>
        </div>

        <div className="featured-jobs">

          {/* JOB 1 */}

          <div className="featured-job-card">

            <div className="featured-job-top">
              <div className="featured-company-logo">T</div>

              <button
                type="button"
                className="save-job"
                aria-label="Save Java Developer job"
              >
                ♡
              </button>
            </div>

            <h3>Java Developer</h3>

            <p className="featured-company">
              Tech Solutions Pvt. Ltd.
            </p>

            <div className="featured-job-info">
              <span>📍 Hyderabad</span>
              <span>💼 Full Time</span>
              <span>💰 ₹6 - 10 LPA</span>
            </div>

            <div className="featured-job-footer">
              <span>2 days ago</span>

              <Link to="/jobs?search=Java%20Developer">
                View Job
              </Link>
            </div>

          </div>

          {/* JOB 2 */}

          <div className="featured-job-card">

            <div className="featured-job-top">
              <div className="featured-company-logo">I</div>

              <button
                type="button"
                className="save-job"
                aria-label="Save Frontend Developer job"
              >
                ♡
              </button>
            </div>

            <h3>Frontend Developer</h3>

            <p className="featured-company">
              Innovate Technologies
            </p>

            <div className="featured-job-info">
              <span>📍 Bangalore</span>
              <span>💼 Full Time</span>
              <span>💰 ₹5 - 8 LPA</span>
            </div>

            <div className="featured-job-footer">
              <span>1 day ago</span>

              <Link to="/jobs?search=Frontend%20Developer">
                View Job
              </Link>
            </div>

          </div>

          {/* JOB 3 */}

          <div className="featured-job-card">

            <div className="featured-job-top">
              <div className="featured-company-logo">D</div>

              <button
                type="button"
                className="save-job"
                aria-label="Save Data Analyst job"
              >
                ♡
              </button>
            </div>

            <h3>Data Analyst</h3>

            <p className="featured-company">
              DataWorks India
            </p>

            <div className="featured-job-info">
              <span>📍 Pune</span>
              <span>💼 Hybrid</span>
              <span>💰 ₹4 - 7 LPA</span>
            </div>

            <div className="featured-job-footer">
              <span>3 days ago</span>

              <Link to="/jobs?search=Data%20Analyst">
                View Job
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ================= TOP COMPANIES ================= */}

      <section className="companies-section">

        <div className="section-heading centered-heading">
          <span className="section-label">
            WORK WITH THE BEST
          </span>

          <h2>Top Companies Hiring</h2>

          <p>
            Connect with companies that are building the future.
          </p>
        </div>

        <div className="company-grid">

          <div className="company-card">
            <div>G</div>
            <h3>Google</h3>
            <p>120+ Openings</p>
          </div>

          <div className="company-card">
            <div>A</div>
            <h3>Amazon</h3>
            <p>85+ Openings</p>
          </div>

          <div className="company-card">
            <div>M</div>
            <h3>Microsoft</h3>
            <p>70+ Openings</p>
          </div>

          <div className="company-card">
            <div>T</div>
            <h3>TCS</h3>
            <p>150+ Openings</p>
          </div>

        </div>
      </section>

      {/* ================= WHY JOBCONNECT ================= */}

      <section className="why-section">

        <div className="why-content">
          <h1>
            <span className="section-label">
              WHY JOBCONNECT?
            </span>
          </h1>

          <h2>
            Everything You Need to Build Your Career
          </h2>

          <p>
            We make job searching simpler by bringing opportunities,
            companies and career tools together in one place.
          </p>
        </div>

        <div className="benefits-grid">

          <div className="benefit-card">
            <div className="benefit-icon">🔎</div>

            <h3>Easy Job Search</h3>

            <p>
              Find relevant opportunities quickly using simple
              search and filters.
            </p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">🛡️</div>

            <h3>Verified Opportunities</h3>

            <p>
              Discover opportunities from companies looking
              for talented professionals.
            </p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">❤️</div>

            <h3>Save Your Favorites</h3>

            <p>
              Keep track of interesting jobs and come back
              to them whenever you want.
            </p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">🚀</div>

            <h3>Grow Your Career</h3>

            <p>
              Explore opportunities and take the next step
              toward your career goals.
            </p>
          </div>

        </div>
      </section>

      {/* ================= CTA ================= */}

      <section className="career-cta">

        <div>
          <span>YOUR NEXT OPPORTUNITY IS WAITING</span>

          <h2>Ready to Build Your Future?</h2>

          <p>
            Explore thousands of opportunities and find your
            next career move today.
          </p>
        </div>

        <Link to="/jobs" className="cta-btn">
          Explore Jobs →
        </Link>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <div className="footer-main">

          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span>J</span> JobConnect
            </Link>

            <p>
              Connecting talented people with opportunities
              that help them build meaningful careers.
            </p>
          </div>

          <div className="footer-column">
            <h3>For Job Seekers</h3>

            <Link to="/jobs">Browse Jobs</Link>
            <Link to="/saved-jobs">Saved Jobs</Link>
            <Link to="/login">Login</Link>
          </div>

          <div className="footer-column">
            <h3>For Employers</h3>

            <Link to="/add-job">Post a Job</Link>
            <Link to="/jobs">Browse Opportunities</Link>
            <Link to="/register">Create Account</Link>
          </div>

          <div className="footer-column">
            <h3>JobConnect</h3>

            <Link to="/">Home</Link>
            <Link to="/jobs">Explore Jobs</Link>
            <Link to="/register">Join JobConnect</Link>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© 2026 JobConnect. All rights reserved.</p>
          <p>Built with React ❤️</p>
        </div>

      </footer>

    </div>
  );
}

export default Home;