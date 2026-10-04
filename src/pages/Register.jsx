
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const passwordRules = [
  {
    label: "At least 8 characters",
    test: (password) => password.length >= 8,
  },
  {
    label: "One lowercase letter (a-z)",
    test: (password) => /[a-z]/.test(password),
  },
  {
    label: "One uppercase letter (A-Z)",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    label: "One number (0-9)",
    test: (password) => /\d/.test(password),
  },
  {
    label: "One special character (@, #, $, !)",
    test: (password) => /[^A-Za-z0-9\s]/.test(password),
  },
];

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizedEmail = email.trim().toLowerCase();

  const passedRules = passwordRules.filter((rule) =>
    rule.test(password)
  ).length;

  const passwordIsStrong = passedRules === passwordRules.length;

  const strengthLabel =
    password.length === 0
      ? "Enter a password"
      : passedRules <= 2
      ? "Weak"
      : passedRules <= 4
      ? "Moderate"
      : "Strong";

  async function handleRegister(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter your full name.");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (!emailRegex.test(normalizedEmail)) {
      setError("Please enter a valid email address, such as name@example.com.");
      return;
    }

    if (!passwordIsStrong) {
      setError("Your password is weak. Please complete all password requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please check and try again.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/users");

      const existingUser = response.data.find(
        (user) => user.email?.trim().toLowerCase() === normalizedEmail
      );

      if (existingUser) {
        setError("An account with this email already exists. Please log in.");
        return;
      }

      await api.post("/users", {
        name: trimmedName,
        email: normalizedEmail,
        password,
      });

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        "Unable to create your account right now. Please check your API server and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-heading">
          <div className="auth-logo">J</div>

          <h2>Create your JobConnect account</h2>

          <p>
            Join JobConnect and organize your career journey.
          </p>
        </div>

        <form onSubmit={handleRegister} noValidate>
          <div className="form-group">
            <label htmlFor="register-name">Full Name</label>

            <input
              id="register-name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email Address</label>

            <input
              id="register-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            {email.length > 0 && !emailRegex.test(normalizedEmail) && (
              <small className="validation-hint">
                Enter a valid email format, for example name@example.com.
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="register-password">Password</label>

            <div className="password-input-wrapper">
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="password-strength">
              <div className="strength-heading">
                <span>Password strength</span>
                <strong
                  className={
                    passedRules === 5
                      ? "strength-strong"
                      : passedRules >= 3
                      ? "strength-medium"
                      : "strength-weak"
                  }
                >
                  {strengthLabel}
                </strong>
              </div>

              <div className="strength-track">
                <div
                  className={`strength-fill strength-level-${passedRules}`}
                />
              </div>
            </div>

            <div className="password-rules">
              {passwordRules.map((rule) => {
                const passed = rule.test(password);

                return (
                  <div
                    className={`password-rule ${
                      passed ? "rule-passed" : "rule-pending"
                    }`}
                    key={rule.label}
                  >
                    <span>{passed ? "✓" : "○"}</span>
                    {rule.label}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="register-confirm-password">
              Confirm Password
            </label>

            <div className="password-input-wrapper">
              <input
                id="register-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword((prev) => !prev)
                }
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            {confirmPassword.length > 0 && (
              <small
                className={
                  password === confirmPassword
                    ? "validation-success"
                    : "validation-hint"
                }
              >
                {password === confirmPassword
                  ? "Passwords match."
                  : "Passwords do not match."}
              </small>
            )}
          </div>

          {error && (
            <div className="auth-message auth-error" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-message auth-success" role="status">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;