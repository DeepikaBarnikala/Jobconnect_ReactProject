import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const careerOptions = [
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Data Science",
  "AI / Machine Learning",
  "Data Analytics",
  "Cybersecurity",
];

const jobTypeOptions = [
  "Full Time",
  "Part Time",
  "Internship",
  "Contract",
  "Freelance",
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

function Profile() {
  const user = getLoggedInUser();

  const [profile, setProfile] = useState(() => {
    try {
      const savedProfile = localStorage.getItem("jobConnectProfile");

      if (savedProfile) {
        return JSON.parse(savedProfile);
      }

      return {
        fullName: user?.name || "",
        email: user?.email || "",
        careerGoal:
          localStorage.getItem("careerGoal") ||
          "Frontend Development",
        skills: "",
        education: "",
        experience: "",
        preferredLocation: "",
        preferredJobType: "Full Time",
        about: "",
        resume: "",
      };
    } catch (error) {
      console.error("Error loading profile:", error);

      return {
        fullName: user?.name || "",
        email: user?.email || "",
        careerGoal: "Frontend Development",
        skills: "",
        education: "",
        experience: "",
        preferredLocation: "",
        preferredJobType: "Full Time",
        about: "",
        resume: "",
      };
    }
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!profile.fullName && user?.name) {
      setProfile((previous) => ({
        ...previous,
        fullName: user.name,
      }));
    }

    if (!profile.email && user?.email) {
      setProfile((previous) => ({
        ...previous,
        email: user.email,
      }));
    }
  }, [profile.email, profile.fullName, user]);

  const completion = useMemo(() => {
    const fields = [
      profile.fullName,
      profile.email,
      profile.careerGoal,
      profile.skills,
      profile.education,
      profile.experience,
      profile.preferredLocation,
      profile.preferredJobType,
      profile.about,
      profile.resume,
    ];

    const completedFields = fields.filter(
      (field) => String(field || "").trim() !== ""
    ).length;

    return Math.round((completedFields / fields.length) * 100);
  }, [profile]);

  function handleChange(event) {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  }

  function handleSave(event) {
  event.preventDefault();

  localStorage.setItem(
    "jobConnectProfile",
    JSON.stringify(profile)
  );

  localStorage.setItem("careerGoal", profile.careerGoal);

  // Calculate profile completion
  const fields = [
    profile.fullName,
    profile.email,
    profile.careerGoal,
    profile.skills,
    profile.education,
    profile.experience,
    profile.preferredLocation,
    profile.preferredJobType,
    profile.about,
    profile.resume,
  ];

  const completedFields = fields.filter(
    (field) => String(field || "").trim() !== ""
  ).length;

  const profileCompletion = Math.round(
    (completedFields / fields.length) * 100
  );

  // Save completion percentage
  localStorage.setItem(
    "profileCompletion",
    profileCompletion.toString()
  );

  const updatedUser = {
    ...user,
    name: profile.fullName,
    email: profile.email,
  };

  localStorage.setItem(
    "loggedInUser",
    JSON.stringify(updatedUser)
  );

  // Tell Navbar and Dashboard that profile changed
  window.dispatchEvent(new Event("authChanged"));
  window.dispatchEvent(new Event("profileUpdated"));

  setSaved(true);

  setTimeout(() => {
    setSaved(false);
  }, 3000);
}

  const firstName =
    profile.fullName?.split(" ")[0] || "User";

  return (
    <div className="profile-page">
      {/* PROFILE HERO */}
      <section className="profile-hero">
        <div className="profile-hero-content">
          <span className="profile-eyebrow">
            YOUR PROFESSIONAL PROFILE
          </span>

          <h1>Build your JobConnect profile</h1>

          <p>
            Keep your professional information updated so JobConnect
            can personalize your career roadmap, job discovery and
            future recommendations.
          </p>

          <div className="profile-hero-actions">
            <Link
              to="/career-roadmap"
              className="profile-hero-btn"
            >
              🗺️ View Career Roadmap
            </Link>

            <Link
              to="/jobs"
              className="profile-hero-btn secondary"
            >
              🔎 Explore Jobs
            </Link>
          </div>
        </div>

        <div className="profile-completion-card">
          <div className="profile-avatar">
            {firstName.charAt(0).toUpperCase()}
          </div>

          <span>Profile completion</span>

          <strong>{completion}%</strong>

          <div className="profile-progress">
            <span
              style={{
                width: `${completion}%`,
              }}
            ></span>
          </div>

          <small>
            {completion === 100
              ? "Your profile is complete 🎉"
              : "Complete more information to improve your profile."}
          </small>
        </div>
      </section>

      {/* PROFILE CONTENT */}
      <main className="profile-container">
        <form
          className="profile-form"
          onSubmit={handleSave}
        >
          {/* BASIC INFORMATION */}
          <section className="profile-section">
            <div className="profile-section-heading">
              <div className="profile-section-number">
                01
              </div>

              <div>
                <span className="section-label">
                  BASIC INFORMATION
                </span>

                <h2>Tell us about yourself</h2>

                <p>
                  This information will be used as your professional
                  identity on JobConnect.
                </p>
              </div>
            </div>

            <div className="profile-form-grid">
              <div className="profile-field">
                <label htmlFor="fullName">
                  Full Name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={profile.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="profile-field">
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </section>

          {/* CAREER */}
          <section className="profile-section">
            <div className="profile-section-heading">
              <div className="profile-section-number">
                02
              </div>

              <div>
                <span className="section-label">
                  CAREER DIRECTION
                </span>

                <h2>Where do you want to go?</h2>

                <p>
                  Your career goal will be connected with your
                  personalized JobConnect roadmap.
                </p>
              </div>
            </div>

            <div className="profile-form-grid">
              <div className="profile-field">
                <label htmlFor="careerGoal">
                  Career Goal
                </label>

                <select
                  id="careerGoal"
                  name="careerGoal"
                  value={profile.careerGoal}
                  onChange={handleChange}
                >
                  {careerOptions.map((career) => (
                    <option key={career} value={career}>
                      {career}
                    </option>
                  ))}
                </select>
              </div>

              <div className="profile-field">
                <label htmlFor="preferredJobType">
                  Preferred Job Type
                </label>

                <select
                  id="preferredJobType"
                  name="preferredJobType"
                  value={profile.preferredJobType}
                  onChange={handleChange}
                >
                  {jobTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="profile-field">
                <label htmlFor="preferredLocation">
                  Preferred Location
                </label>

                <input
                  id="preferredLocation"
                  name="preferredLocation"
                  type="text"
                  value={profile.preferredLocation}
                  onChange={handleChange}
                  placeholder="Example: Hyderabad, Bangalore, Remote"
                />
              </div>
            </div>
          </section>

          {/* SKILLS */}
          <section className="profile-section">
            <div className="profile-section-heading">
              <div className="profile-section-number">
                03
              </div>

              <div>
                <span className="section-label">
                  SKILLS
                </span>

                <h2>What can you do?</h2>

                <p>
                  Add the technical and professional skills you are
                  currently learning or already know.
                </p>
              </div>
            </div>

            <div className="profile-field">
              <label htmlFor="skills">
                Skills
              </label>

              <input
                id="skills"
                name="skills"
                type="text"
                value={profile.skills}
                onChange={handleChange}
                placeholder="Example: Python, SQL, React, JavaScript, Git"
              />

              <small className="profile-field-help">
                Separate multiple skills with commas.
              </small>
            </div>
          </section>

          {/* EDUCATION & EXPERIENCE */}
          <section className="profile-section">
            <div className="profile-section-heading">
              <div className="profile-section-number">
                04
              </div>

              <div>
                <span className="section-label">
                  BACKGROUND
                </span>

                <h2>Your education and experience</h2>

                <p>
                  Help employers understand your current professional
                  background.
                </p>
              </div>
            </div>

            <div className="profile-form-grid">
              <div className="profile-field">
                <label htmlFor="education">
                  Education
                </label>

                <textarea
                  id="education"
                  name="education"
                  value={profile.education}
                  onChange={handleChange}
                  placeholder="Example: B.Tech in Computer Science, XYZ University, 2026"
                  rows="5"
                ></textarea>
              </div>

              <div className="profile-field">
                <label htmlFor="experience">
                  Experience
                </label>

                <textarea
                  id="experience"
                  name="experience"
                  value={profile.experience}
                  onChange={handleChange}
                  placeholder="Example: Fresher / Internship / 1 year experience..."
                  rows="5"
                ></textarea>
              </div>
            </div>
          </section>

          {/* ABOUT */}
          <section className="profile-section">
            <div className="profile-section-heading">
              <div className="profile-section-number">
                05
              </div>

              <div>
                <span className="section-label">
                  PROFESSIONAL SUMMARY
                </span>

                <h2>Tell your story</h2>

                <p>
                  Write a short introduction about your interests,
                  strengths and career direction.
                </p>
              </div>
            </div>

            <div className="profile-field">
              <label htmlFor="about">
                About Me
              </label>

              <textarea
                id="about"
                name="about"
                value={profile.about}
                onChange={handleChange}
                placeholder="Example: I am a software development student interested in full-stack development, databases and problem solving..."
                rows="7"
              ></textarea>
            </div>
          </section>

          {/* RESUME */}
          <section className="profile-section">
            <div className="profile-section-heading">
              <div className="profile-section-number">
                06
              </div>

              <div>
                <span className="section-label">
                  RESUME
                </span>

                <h2>Connect your resume</h2>

                <p>
                  We will expand this section later into the JobConnect
                  Resume Center.
                </p>
              </div>
            </div>

            <div className="profile-field">
              <label htmlFor="resume">
                Resume Link
              </label>

              <input
                id="resume"
                name="resume"
                type="url"
                value={profile.resume}
                onChange={handleChange}
                placeholder="Paste your resume or portfolio URL"
              />

              <small className="profile-field-help">
                Example: Google Drive, portfolio or other resume link.
              </small>
            </div>
          </section>

          {/* SAVE */}
          <div className="profile-save-area">
            <div>
              {saved && (
                <span className="profile-saved-message">
                  ✓ Profile saved successfully
                </span>
              )}
            </div>

            <button
              type="submit"
              className="profile-save-btn"
            >
              Save Profile
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Profile;