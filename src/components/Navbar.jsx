
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [jobsOpen, setJobsOpen] = useState(false);
  const [careerOpen, setCareerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    function loadUser() {
      try {
        const storedUser = localStorage.getItem("loggedInUser");
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch {
        setUser(null);
      }
    }

    loadUser();

    window.addEventListener("storage", loadUser);
    window.addEventListener("authChanged", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("authChanged", loadUser);
    };
  }, []);

  const userName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "User";

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function closeMenus() {
    setMobileOpen(false);
    setJobsOpen(false);
    setCareerOpen(false);
    setAccountOpen(false);
  }

  function handleLogout() {
    localStorage.removeItem("loggedInUser");

    window.dispatchEvent(new Event("authChanged"));

    setUser(null);
    closeMenus();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">

        {/* LOGO */}
        <Link to="/" className="logo" onClick={closeMenus}>
          <span className="logo-icon">J</span>

          <span className="logo-text">
            Job<span>Connect</span>
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className={`nav-links ${mobileOpen ? "mobile-open" : ""}`}>

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeMenus}
          >
            Home
          </NavLink>

          {/* JOBS DROPDOWN */}
          <div className="nav-dropdown">
            <button
              type="button"
              className={`nav-dropdown-trigger ${
                jobsOpen ? "dropdown-active" : ""
              }`}
              onClick={() => {
                setJobsOpen(!jobsOpen);
                setCareerOpen(false);
                setAccountOpen(false);
              }}
            >
              Jobs <span className="dropdown-arrow">⌄</span>
            </button>

            <div className={`nav-dropdown-menu ${jobsOpen ? "show" : ""}`}>
              <NavLink to="/jobs" onClick={closeMenus}>
                <span className="dropdown-icon">⌕</span>
                <span>
                  <strong>Find Jobs</strong>
                  <small>Explore opportunities</small>
                </span>
              </NavLink>

              <NavLink to="/saved-jobs" onClick={closeMenus}>
                <span className="dropdown-icon">♡</span>
                <span>
                  <strong>Saved Jobs</strong>
                  <small>Your bookmarked jobs</small>
                </span>
              </NavLink>
            </div>
          </div>

          {/* CAREER DROPDOWN */}
          <div className="nav-dropdown">
            <button
              type="button"
              className={`nav-dropdown-trigger ${
                careerOpen ? "dropdown-active" : ""
              }`}
              onClick={() => {
                setCareerOpen(!careerOpen);
                setJobsOpen(false);
                setAccountOpen(false);
              }}
            >
              My Career <span className="dropdown-arrow">⌄</span>
            </button>

            <div className={`nav-dropdown-menu career-menu ${careerOpen ? "show" : ""}`}>
              <NavLink to="/dashboard" onClick={closeMenus}>
                <span className="dropdown-icon">▦</span>
                <span>
                  <strong>Dashboard</strong>
                  <small>Your career overview</small>
                </span>
              </NavLink>

              <NavLink to="/applications" onClick={closeMenus}>
                <span className="dropdown-icon">▤</span>
                <span>
                  <strong>Applications</strong>
                  <small>Track job applications</small>
                </span>
              </NavLink>

              <NavLink to="/interviews" onClick={closeMenus}>
                <span className="dropdown-icon">◷</span>
                <span>
                  <strong>Interviews</strong>
                  <small>Manage interview schedules</small>
                </span>
              </NavLink>

              <NavLink to="/application-timeline" onClick={closeMenus}>
                <span className="dropdown-icon">↗</span>
                <span>
                  <strong>Application Timeline</strong>
                  <small>Follow your progress</small>
                </span>
              </NavLink>

              <NavLink to="/career-analytics" onClick={closeMenus}>
                <span className="dropdown-icon">▥</span>
                <span>
                  <strong>Career Analytics</strong>
                  <small>View your job search insights</small>
                </span>
              </NavLink>

              <NavLink to="/career-roadmap" onClick={closeMenus}>
                <span className="dropdown-icon">⌁</span>
                <span>
                  <strong>Career Roadmap</strong>
                  <small>Plan your learning journey</small>
                </span>
              </NavLink>
            </div>
          </div>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeMenus}
          >
            Profile
          </NavLink>
        </nav>

        {/* ACCOUNT AREA */}
        <div className="nav-actions">
          {user ? (
            <div className="account-dropdown">
              <button
                type="button"
                className="account-trigger"
                onClick={() => {
                  setAccountOpen(!accountOpen);
                  setJobsOpen(false);
                  setCareerOpen(false);
                }}
              >
                <span className="nav-user-avatar">{initials}</span>

                <span className="nav-user-info">
                  <small>Welcome back</small>
                  <strong>{userName}</strong>
                </span>

                <span className="dropdown-arrow">⌄</span>
              </button>

              <div className={`account-menu ${accountOpen ? "show" : ""}`}>
                <div className="account-menu-heading">
                  <strong>{userName}</strong>
                  <small>{user.email}</small>
                </div>

                <NavLink to="/profile" onClick={closeMenus}>
                  <span>◉</span> My Profile
                </NavLink>

                <button type="button" onClick={handleLogout}>
                  <span>↪</span> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="guest-actions">
              <Link to="/login" className="login-btn" onClick={closeMenus}>
                Log In
              </Link>

              <Link to="/register" className="signup-btn" onClick={closeMenus}>
                Get Started <span>→</span>
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          className={`mobile-menu-toggle ${mobileOpen ? "menu-open" : ""}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>
    </header>
  );
}

export default Navbar;
