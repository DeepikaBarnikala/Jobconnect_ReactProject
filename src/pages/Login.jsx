import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.get("/users", {
        params: {
          email: normalizedEmail
        }
      });

      const user = response.data[0];

      if (!user || user.password !== password) {
        setError("Invalid email or password.");
        return;
      }

      // Get the user's display name
      const userName =
        user.name ||
        user.fullName ||
        user.username ||
        "";

      /*
        Role handling

        Existing users who don't have a role are treated
        as candidates by default.
      */
      const userRole = user.role || "candidate";

      // Save logged-in user information
      const loggedInUser = {
        id: user.id,
        name: userName,
        email: user.email,
        role: userRole
      };

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(loggedInUser)
      );

      // Notify Navbar and other components
      window.dispatchEvent(new Event("authChanged"));

      alert("Login successful!");

      /*
        If the user originally tried to access a protected page,
        send them there after login.

        Example:
        /jobs
        /jobs/3
        /saved-jobs
      */
      const redirectParam = new URLSearchParams(
        location.search
      ).get("redirect");

      if (redirectParam) {
        navigate(redirectParam);
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-wrapper">

        {/* =========================================
            LEFT SIDE
        ========================================= */}

        <div className="auth-showcase">

          <div className="auth-showcase-content">

            <Link to="/" className="auth-brand">
              <span className="auth-brand-icon">
                J
              </span>

              <span>
                Job<span>Connect</span>
              </span>
            </Link>

            <div className="auth-showcase-text">

              <span className="auth-eyebrow">
                YOUR CAREER. YOUR FUTURE.
              </span>

              <h1>
                Find opportunities
                <span> that move you forward.</span>
              </h1>

              <p>
                Discover jobs, explore career paths, build your
                skills, and take the next step toward your dream
                career.
              </p>

            </div>

            <div className="auth-features">

              <div className="auth-feature">

                <div className="auth-feature-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Discover Opportunities
                  </strong>

                  <span>
                    Find jobs that match your skills.
                  </span>
                </div>

              </div>

              <div className="auth-feature">

                <div className="auth-feature-icon">
                  ◆
                </div>

                <div>
                  <strong>
                    Build Your Career
                  </strong>

                  <span>
                    Explore roadmaps and career resources.
                  </span>
                </div>

              </div>

              <div className="auth-feature">

                <div className="auth-feature-icon">
                  ★
                </div>

                <div>
                  <strong>
                    Track Your Progress
                  </strong>

                  <span>
                    Save jobs and manage your applications.
                  </span>
                </div>

              </div>

            </div>
          </div>

          <div className="auth-decoration auth-decoration-one"></div>

          <div className="auth-decoration auth-decoration-two"></div>

        </div>


        {/* =========================================
            RIGHT SIDE
        ========================================= */}

        <div className="auth-form-section">

          <div className="auth-form-card">

            {/* MOBILE BRAND */}

            <div className="auth-mobile-brand">

              <Link to="/" className="auth-brand">

                <span className="auth-brand-icon">
                  J
                </span>

                <span>
                  Job<span>Connect</span>
                </span>

              </Link>

            </div>


            {/* HEADING */}

            <div className="auth-heading">

              <span className="auth-form-label">
                WELCOME BACK
              </span>

              <h2>
                Sign in to your account
              </h2>

              <p>
                Continue your journey with JobConnect.
              </p>

            </div>


            {/* ERROR */}

            {error && (
              <div className="auth-error">

                <span>
                  !
                </span>

                <p>
                  {error}
                </p>

              </div>
            )}


            {/* LOGIN FORM */}

            <form
              onSubmit={handleSubmit}
              className="auth-form"
            >

              {/* EMAIL */}

              <div className="auth-field">

                <label htmlFor="login-email">
                  Email Address
                </label>

                <div className="auth-input-wrapper">

                  <span className="input-icon">
                    ✉
                  </span>

                  <input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    autoComplete="email"
                    required
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div className="auth-field">

                <div className="auth-label-row">

                  <label htmlFor="login-password">
                    Password
                  </label>

                  <span className="password-hint">
                    Keep it secure
                  </span>

                </div>

                <div className="auth-input-wrapper">

                  <span className="input-icon">
                    ●
                  </span>

                  <input
                    id="login-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>


              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={isLoading}
              >

                {isLoading ? (
                  <>
                    <span className="auth-spinner"></span>

                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In

                    <span className="auth-arrow">
                      →
                    </span>
                  </>
                )}

              </button>

            </form>


            {/* DIVIDER */}

            <div className="auth-divider">
              <span>
                OR
              </span>
            </div>


            {/* REGISTER */}

            <p className="auth-switch">

              Don't have an account?

              <Link to="/register">
                Create one
              </Link>

            </p>


            {/* SECURITY */}

            <div className="auth-security">

              <span>
                🔒
              </span>

              <span>
                Your account information stays private.
              </span>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;