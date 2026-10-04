import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });

    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const name = user.name.trim();
      const email = user.email.trim().toLowerCase();
      const password = user.password;

      if (!name || !email || !password) {
        setError("Please fill in all fields.");
        return;
      }

      if (name.length < 2) {
        setError("Please enter your full name.");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      setIsLoading(true);

      // Check whether email already exists
      const response = await api.get("/users", {
        params: { email }
      });

      if (response.data.length > 0) {
        setError("This email is already registered.");
        return;
      }

      // Create new user
      await api.post("/users", {
        name,
        email,
        password
      });

      alert("Registration successful! Please log in.");

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-wrapper">

        {/* LEFT SIDE */}
        <div className="auth-showcase register-showcase">

          <div className="auth-showcase-content">

            <Link to="/" className="auth-brand">
              <span className="auth-brand-icon">J</span>
              <span>Job<span>Connect</span></span>
            </Link>

            <div className="auth-showcase-text">
              <span className="auth-eyebrow">
                START YOUR JOURNEY
              </span>

              <h1>
                Your next
                <span> opportunity starts here.</span>
              </h1>

              <p>
                Create your JobConnect account and unlock a complete
                career experience built around your goals.
              </p>
            </div>

            <div className="auth-features">

              <div className="auth-feature">
                <div className="auth-feature-icon">⌕</div>
                <div>
                  <strong>Explore Jobs</strong>
                  <span>Search opportunities across domains.</span>
                </div>
              </div>

              <div className="auth-feature">
                <div className="auth-feature-icon">↗</div>
                <div>
                  <strong>Career Roadmaps</strong>
                  <span>Know what to learn for your target role.</span>
                </div>
              </div>

              <div className="auth-feature">
                <div className="auth-feature-icon">♡</div>
                <div>
                  <strong>Save Opportunities</strong>
                  <span>Keep your favorite jobs in one place.</span>
                </div>
              </div>

            </div>
          </div>

          <div className="auth-decoration auth-decoration-one"></div>
          <div className="auth-decoration auth-decoration-two"></div>

        </div>

        {/* RIGHT SIDE */}
        <div className="auth-form-section">

          <div className="auth-form-card register-card">

            <div className="auth-mobile-brand">
              <Link to="/" className="auth-brand">
                <span className="auth-brand-icon">J</span>
                <span>Job<span>Connect</span></span>
              </Link>
            </div>

            <div className="auth-heading">
              <span className="auth-form-label">
                CREATE YOUR PROFILE
              </span>

              <h2>Create your account</h2>

              <p>
                Join JobConnect and start building your career.
              </p>
            </div>

            {error && (
              <div className="auth-error">
                <span>!</span>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">

              {/* NAME */}
              <div className="auth-field">
                <label htmlFor="register-name">
                  Full Name
                </label>

                <div className="auth-input-wrapper">
                  <span className="input-icon">◉</span>

                  <input
                    id="register-name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={user.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="auth-field">
                <label htmlFor="register-email">
                  Email Address
                </label>

                <div className="auth-input-wrapper">
                  <span className="input-icon">✉</span>

                  <input
                    id="register-email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={user.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="auth-field">
                <div className="auth-label-row">
                  <label htmlFor="register-password">
                    Password
                  </label>

                  <span className="password-hint">
                    6+ characters
                  </span>
                </div>

                <div className="auth-input-wrapper">
                  <span className="input-icon">●</span>

                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={user.password}
                    onChange={handleChange}
                    autoComplete="new-password"
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
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* PASSWORD STRENGTH */}
              <div className="password-strength">
                <div
                  className={
                    user.password.length === 0
                      ? "strength-bar"
                      : user.password.length < 6
                      ? "strength-bar weak"
                      : user.password.length < 10
                      ? "strength-bar medium"
                      : "strength-bar strong"
                  }
                ></div>

                <span>
                  {user.password.length === 0
                    ? "Create a strong password"
                    : user.password.length < 6
                    ? "Weak password"
                    : user.password.length < 10
                    ? "Good password"
                    : "Strong password"}
                </span>
              </div>

              {/* REGISTER BUTTON */}
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="auth-spinner"></span>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <span className="auth-arrow">→</span>
                  </>
                )}
              </button>

            </form>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <p className="auth-switch">
              Already have an account?
              <Link to="/login">Sign in</Link>
            </p>

            <div className="auth-security">
              <span>🔒</span>
              <span>Join JobConnect and start your journey.</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;