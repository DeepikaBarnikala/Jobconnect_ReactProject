import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  // --------------------------------
  // Load logged-in user
  // --------------------------------
  function loadUser() {
    const savedUser = localStorage.getItem("loggedInUser");

    if (!savedUser) {
      setUser(null);
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);

      setUser({
        ...parsedUser,
        role: parsedUser.role || "candidate",
      });
    } catch (error) {
      console.error("Error loading logged-in user:", error);
      setUser(null);
    }
  }

  // --------------------------------
  // Listen for login / logout
  // --------------------------------
  useEffect(() => {
    loadUser();

    window.addEventListener("authChanged", loadUser);
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("authChanged", loadUser);
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setOpenMenu(null);
  }, [location.pathname]);

  // --------------------------------
  // Logout
  // --------------------------------
  function handleLogout() {
    localStorage.removeItem("loggedInUser");

    window.dispatchEvent(new Event("authChanged"));

    setUser(null);
    setOpenMenu(null);

    navigate("/");
  }

  // --------------------------------
  // Dropdown toggle
  // --------------------------------
  function toggleMenu(menu) {
    setOpenMenu((current) =>
      current === menu ? null : menu
    );
  }

  // --------------------------------
  // User information
  // --------------------------------
  const isLoggedIn = Boolean(user);

  const displayName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "User";

  const getInitials = () => {
    if (!displayName) return "U";

    const words = displayName
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length >= 2) {
      return (
        words[0].charAt(0) +
        words[1].charAt(0)
      ).toUpperCase();
    }

    return words[0].charAt(0).toUpperCase();
  };

  const canPostJobs =
    user?.role === "employer" ||
    user?.role === "admin";

  return (
    <>
      <style>
        {`
          /* =========================================
             JOBCONNECT - RESTORED WHITE NAVBAR
          ========================================== */

          .jc-old-navbar {
            position: sticky;
            top: 0;
            z-index: 1000;

            width: 100%;
            min-height: 82px;

            padding: 0 6%;

            display: flex;
            align-items: center;

            background: #ffffff;

            border-bottom: 1px solid #edf0f5;

            box-shadow:
              0 4px 18px rgba(28, 44, 74, 0.06);

            box-sizing: border-box;
          }

          /* =========================================
             LEFT - LOGO
          ========================================== */

          .jc-old-logo {
            display: flex;
            align-items: center;

            gap: 11px;

            text-decoration: none;

            flex-shrink: 0;

            min-width: 235px;
          }

          .jc-old-logo-icon {
            width: 46px;
            height: 46px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 12px;

            background:
              linear-gradient(
                135deg,
                #168cf5,
                #5967f5
              );

            color: #ffffff;

            font-size: 25px;
            font-weight: 900;

            box-shadow:
              0 7px 17px rgba(50, 119, 239, 0.22);
          }

          .jc-old-logo-text {
            font-size: 23px;
            font-weight: 850;

            letter-spacing: -0.7px;

            color: #172033;
          }

          .jc-old-logo-text span {
            color: #5967f5;
          }

          /* =========================================
             CENTER NAVIGATION
          ========================================== */

          .jc-old-nav-center {
            flex: 1;

            display: flex;
            align-items: center;
            justify-content: center;

            gap: 8px;

            height: 100%;
          }

          .jc-old-nav-link,
          .jc-old-nav-button {
            position: relative;

            height: 46px;

            padding: 0 14px;

            display: flex;
            align-items: center;
            justify-content: center;

            gap: 6px;

            border: none;

            border-radius: 11px;

            background: transparent;

            color: #506079;

            font-family: inherit;

            font-size: 14px;
            font-weight: 650;

            text-decoration: none;

            cursor: pointer;

            transition:
              background 0.2s ease,
              color 0.2s ease;
          }

          .jc-old-nav-link:hover,
          .jc-old-nav-button:hover {
            color: #315fd7;

            background: #f4f7ff;
          }

          .jc-old-nav-link.active {
            color: #315fd7;

            background: #eef4ff;
          }

          .jc-old-nav-link.active::after {
            content: "";

            position: absolute;

            bottom: 5px;

            left: 15px;
            right: 15px;

            height: 2px;

            border-radius: 5px;

            background: #4f6df5;
          }

          .jc-old-arrow {
            font-size: 10px;

            color: #7a879b;

            transition:
              transform 0.2s ease;
          }

          .jc-old-arrow.open {
            transform: rotate(180deg);
          }

          /* =========================================
             DROPDOWN
          ========================================== */

          .jc-old-dropdown-wrapper {
            position: relative;
          }

          .jc-old-dropdown {
            position: absolute;

            top: calc(100% + 7px);

            left: 50%;

            transform: translateX(-50%);

            width: 245px;

            padding: 8px;

            background: #ffffff;

            border: 1px solid #e8edf5;

            border-radius: 13px;

            box-shadow:
              0 16px 38px rgba(31, 49, 83, 0.14);

            animation:
              jcOldDropdown 0.15s ease;
          }

          @keyframes jcOldDropdown {
            from {
              opacity: 0;
              transform:
                translateX(-50%)
                translateY(-5px);
            }

            to {
              opacity: 1;
              transform:
                translateX(-50%)
                translateY(0);
            }
          }

          .jc-old-dropdown-heading {
            padding: 8px 11px 7px;

            color: #8995a8;

            font-size: 10px;
            font-weight: 800;

            text-transform: uppercase;

            letter-spacing: 0.8px;
          }

          .jc-old-dropdown-link {
            width: 100%;

            display: flex;
            align-items: center;
            justify-content: space-between;

            padding: 10px 12px;

            border-radius: 8px;

            color: #46546c;

            text-decoration: none;

            font-size: 13px;
            font-weight: 600;

            box-sizing: border-box;

            transition:
              background 0.2s ease,
              color 0.2s ease,
              transform 0.2s ease;
          }

          .jc-old-dropdown-link:hover {
            color: #315fd7;

            background: #f3f7ff;

            transform: translateX(2px);
          }

          .jc-old-dropdown-icon {
            color: #91a0b5;

            font-size: 13px;
          }

          /* =========================================
             RIGHT - USER AREA
          ========================================== */

          .jc-old-user-area {
            min-width: 235px;

            display: flex;
            align-items: center;
            justify-content: flex-end;

            gap: 12px;

            flex-shrink: 0;
          }

          .jc-old-user-card {
            min-height: 52px;

            padding: 5px 11px 5px 6px;

            display: flex;
            align-items: center;

            gap: 9px;

            background: #ffffff;

            border: 1px solid #e3e9f2;

            border-radius: 13px;

            box-sizing: border-box;
          }

          .jc-old-avatar {
            width: 42px;
            height: 42px;

            display: flex;
            align-items: center;
            justify-content: center;

            flex-shrink: 0;

            border-radius: 11px;

            background:
              linear-gradient(
                135deg,
                #1595e8,
                #4778f4
              );

            color: #ffffff;

            font-size: 13px;
            font-weight: 800;

            box-shadow:
              0 5px 12px rgba(54, 123, 232, 0.2);
          }

          .jc-old-user-info {
            display: flex;
            flex-direction: column;

            line-height: 1.15;

            min-width: 105px;
          }

          .jc-old-welcome {
            color: #91a0b5;

            font-size: 10px;
            font-weight: 500;

            margin-bottom: 4px;
          }

          .jc-old-user-name {
            color: #172033;

            font-size: 12px;
            font-weight: 750;

            white-space: nowrap;

            max-width: 130px;

            overflow: hidden;
            text-overflow: ellipsis;
          }

          .jc-old-user-arrow {
            color: #718096;

            font-size: 10px;

            margin-left: 2px;
          }

          /* =========================================
             LOGGED OUT BUTTONS
          ========================================== */

          .jc-old-login {
            display: flex;
            align-items: center;
            justify-content: center;

            height: 42px;

            padding: 0 15px;

            border-radius: 10px;

            color: #43516a;

            border: 1px solid #e1e7f0;

            text-decoration: none;

            font-size: 13px;
            font-weight: 700;

            transition: all 0.2s ease;
          }

          .jc-old-login:hover {
            color: #315fd7;

            border-color: #b9c9ed;

            background: #f6f8ff;
          }

          .jc-old-signup {
            display: flex;
            align-items: center;
            justify-content: center;

            height: 42px;

            padding: 0 17px;

            border-radius: 10px;

            color: #ffffff;

            background:
              linear-gradient(
                135deg,
                #347cf0,
                #5b61ef
              );

            text-decoration: none;

            font-size: 13px;
            font-weight: 700;

            box-shadow:
              0 6px 14px rgba(65, 103, 232, 0.2);
          }

          .jc-old-signup:hover {
            transform: translateY(-1px);

            box-shadow:
              0 8px 18px rgba(65, 103, 232, 0.27);
          }

          /* =========================================
             LOGOUT
          ========================================== */

          .jc-old-logout {
            height: 40px;

            padding: 0 13px;

            border-radius: 9px;

            background: #ffffff;

            border: 1px solid #e1e7f0;

            color: #56647a;

            font-family: inherit;

            font-size: 12px;
            font-weight: 700;

            cursor: pointer;

            transition: all 0.2s ease;
          }

          .jc-old-logout:hover {
            color: #e34d5f;

            background: #fff7f8;

            border-color: #f2c5cb;
          }

          /* =========================================
             RESPONSIVE
          ========================================== */

          @media (max-width: 1200px) {
            .jc-old-navbar {
              padding: 0 3%;
            }

            .jc-old-logo {
              min-width: 200px;
            }

            .jc-old-user-area {
              min-width: 200px;
            }

            .jc-old-nav-link,
            .jc-old-nav-button {
              padding: 0 10px;
            }
          }

          @media (max-width: 950px) {
            .jc-old-navbar {
              min-height: 76px;

              flex-wrap: wrap;

              padding: 12px 4%;
            }

            .jc-old-logo {
              min-width: auto;
            }

            .jc-old-user-area {
              min-width: auto;
            }

            .jc-old-nav-center {
              order: 3;

              width: 100%;

              flex-basis: 100%;

              padding-top: 5px;

              overflow-x: auto;

              justify-content: center;
            }
          }

          @media (max-width: 650px) {
            .jc-old-navbar {
              gap: 10px;
            }

            .jc-old-logo-text {
              font-size: 19px;
            }

            .jc-old-logo-icon {
              width: 40px;
              height: 40px;

              font-size: 21px;
            }

            .jc-old-user-card {
              border: none;

              padding: 0;
            }

            .jc-old-user-info {
              display: none;
            }

            .jc-old-nav-center {
              justify-content: flex-start;
            }

            .jc-old-nav-link,
            .jc-old-nav-button {
              height: 40px;

              padding: 0 9px;

              font-size: 12px;
            }
          }

          @media (max-width: 450px) {
            .jc-old-logo-text {
              display: none;
            }

            .jc-old-logout {
              padding: 0 9px;
            }
          }
        `}
      </style>

      <nav className="jc-old-navbar">

        {/* ======================================
            LEFT SIDE - JOBCONNECT LOGO
        ======================================= */}

        <Link
          to="/"
          className="jc-old-logo"
        >
          <span className="jc-old-logo-icon">
            J
          </span>

          <span className="jc-old-logo-text">
            Job<span>Connect</span>
          </span>
        </Link>


        {/* ======================================
            CENTER - MAIN NAVIGATION
        ======================================= */}

        <div className="jc-old-nav-center">

          {/* HOME */}
          <Link
            to="/"
            className={`jc-old-nav-link ${
              location.pathname === "/"
                ? "active"
                : ""
            }`}
          >
            Home
          </Link>


          {/* JOBS */}
          <div className="jc-old-dropdown-wrapper">

            <button
              type="button"
              className="jc-old-nav-button"
              onClick={() => toggleMenu("jobs")}
            >
              Jobs

              <span
                className={`jc-old-arrow ${
                  openMenu === "jobs"
                    ? "open"
                    : ""
                }`}
              >
                ▾
              </span>
            </button>

            {openMenu === "jobs" && (
              <div className="jc-old-dropdown">

                <div className="jc-old-dropdown-heading">
                  Job Discovery
                </div>

                <Link
                  to="/jobs"
                  className="jc-old-dropdown-link"
                >
                  <span>Find Jobs</span>

                  <span className="jc-old-dropdown-icon">
                    →
                  </span>
                </Link>

                <Link
                  to="/saved-jobs"
                  className="jc-old-dropdown-link"
                >
                  <span>Saved Jobs</span>

                  <span className="jc-old-dropdown-icon">
                    ♡
                  </span>
                </Link>

              </div>
            )}
          </div>


          {/* MY CAREER */}
          {isLoggedIn && (
            <div className="jc-old-dropdown-wrapper">

              <button
                type="button"
                className="jc-old-nav-button"
                onClick={() => toggleMenu("career")}
              >
                My Career

                <span
                  className={`jc-old-arrow ${
                    openMenu === "career"
                      ? "open"
                      : ""
                  }`}
                >
                  ▾
                </span>
              </button>

              {openMenu === "career" && (
                <div className="jc-old-dropdown">

                  <div className="jc-old-dropdown-heading">
                    Career Workspace
                  </div>

                  <Link
                    to="/dashboard"
                    className="jc-old-dropdown-link"
                  >
                    <span>Dashboard</span>
                    <span className="jc-old-dropdown-icon">
                      →
                    </span>
                  </Link>

                  <Link
                    to="/applications"
                    className="jc-old-dropdown-link"
                  >
                    <span>Applications</span>
                    <span className="jc-old-dropdown-icon">
                      →
                    </span>
                  </Link>

                  <Link
                    to="/interviews"
                    className="jc-old-dropdown-link"
                  >
                    <span>Interviews</span>
                    <span className="jc-old-dropdown-icon">
                      →
                    </span>
                  </Link>

                  <Link
                    to="/application-timeline"
                    className="jc-old-dropdown-link"
                  >
                    <span>
                      Application Timeline
                    </span>

                    <span className="jc-old-dropdown-icon">
                      →
                    </span>
                  </Link>

                  <Link
                    to="/career-analytics"
                    className="jc-old-dropdown-link"
                  >
                    <span>Career Analytics</span>

                    <span className="jc-old-dropdown-icon">
                      →
                    </span>
                  </Link>

                  <Link
                    to="/career-roadmap"
                    className="jc-old-dropdown-link"
                  >
                    <span>Career Roadmap</span>

                    <span className="jc-old-dropdown-icon">
                      →
                    </span>
                  </Link>

                </div>
              )}
            </div>
          )}


          {/* PROFILE */}
          {isLoggedIn && (
            <Link
              to="/profile"
              className={`jc-old-nav-link ${
                location.pathname === "/profile"
                  ? "active"
                  : ""
              }`}
            >
              Profile
            </Link>
          )}


          {/* POST A JOB */}
          {canPostJobs && (
            <Link
              to="/add-job"
              className={`jc-old-nav-link ${
                location.pathname === "/add-job"
                  ? "active"
                  : ""
              }`}
            >
              Post a Job
            </Link>
          )}

        </div>


        {/* ======================================
            RIGHT SIDE - USER
        ======================================= */}

        <div className="jc-old-user-area">

          {isLoggedIn ? (
            <>

              {/* User Profile Box */}
              <div className="jc-old-user-card">

                <div className="jc-old-avatar">
                  {getInitials()}
                </div>

                <div className="jc-old-user-info">

                  <span className="jc-old-welcome">
                    Welcome back
                  </span>

                  <span className="jc-old-user-name">
                    {displayName}
                  </span>

                </div>

                <span className="jc-old-user-arrow">
                  ▾
                </span>

              </div>


              {/* Logout */}
              <button
                type="button"
                className="jc-old-logout"
                onClick={handleLogout}
              >
                Logout
              </button>

            </>
          ) : (
            <>

              <Link
                to="/login"
                className="jc-old-login"
              >
                Log In
              </Link>

              <Link
                to="/register"
                className="jc-old-signup"
              >
                Get Started
              </Link>

            </>
          )}

        </div>

      </nav>
    </>
  );
}

export default Navbar;