import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function InterviewScheduler() {
  const [interviews, setInterviews] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [selectedJob, setSelectedJob] = useState("");
  const [interviewType, setInterviewType] = useState("Technical");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [notes, setNotes] = useState("");

  const [filter, setFilter] = useState("Upcoming");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [interviewsResponse, jobsResponse] = await Promise.all([
        api.get("/interviews"),
        api.get("/jobs"),
      ]);

      setInterviews(interviewsResponse.data);
      setJobs(jobsResponse.data);
    } catch (err) {
      console.error(err);
      setInterviews([]);
      setError(
        "Unable to load interviews. Make sure JSON Server is running and the interviews collection exists."
      );
    } finally {
      setLoading(false);
    }
  }

  const sortedInterviews = useMemo(() => {
    const now = new Date();

    let result = [...interviews].sort(
      (a, b) =>
        new Date(`${a.interviewDate}T${a.interviewTime}`) -
        new Date(`${b.interviewDate}T${b.interviewTime}`)
    );

    if (filter === "Upcoming") {
      result = result.filter(
        (item) =>
          !item.completed &&
          new Date(`${item.interviewDate}T${item.interviewTime}`) >= now
      );
    }

    if (filter === "Completed") {
      result = result.filter((item) => item.completed);
    }

    return result;
  }, [interviews, filter]);

  const upcomingCount = interviews.filter((item) => {
    if (item.completed) return false;

    return (
      new Date(`${item.interviewDate}T${item.interviewTime}`) >=
      new Date()
    );
  }).length;

  const completedCount = interviews.filter(
    (item) => item.completed
  ).length;

  const todayCount = interviews.filter((item) => {
    if (item.completed) return false;

    const today = new Date().toISOString().split("T")[0];

    return item.interviewDate === today;
  }).length;

  async function handleAddInterview(event) {
    event.preventDefault();

    if (!selectedJob || !interviewDate || !interviewTime) {
      alert("Please select a job, date, and time.");
      return;
    }

    const selectedJobData = jobs.find(
      (job) => String(job.id) === String(selectedJob)
    );

    if (!selectedJobData) {
      alert("Selected job could not be found.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const newInterview = {
        jobId: selectedJobData.id,
        title: selectedJobData.title,
        company: selectedJobData.company,
        location: selectedJobData.location || "",
        interviewType,
        interviewDate,
        interviewTime,
        notes: notes.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };

      const response = await api.post("/interviews", newInterview);

      setInterviews((current) => [...current, response.data]);

      setSelectedJob("");
      setInterviewType("Technical");
      setInterviewDate("");
      setInterviewTime("");
      setNotes("");

      alert("Interview scheduled successfully.");
    } catch (err) {
      console.error(err);
      setError("Could not schedule the interview.");
    } finally {
      setSaving(false);
    }
  }

  async function markCompleted(id) {
    try {
      const response = await api.patch(`/interviews/${id}`, {
        completed: true,
      });

      setInterviews((current) =>
        current.map((item) =>
          item.id === id ? response.data : item
        )
      );
    } catch (err) {
      console.error(err);
      alert("Could not update the interview.");
    }
  }

  async function deleteInterview(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this interview?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/interviews/${id}`);

      setInterviews((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Could not delete the interview.");
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "No date";

    return new Date(`${dateString}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  function formatTime(timeString) {
    if (!timeString) return "No time";

    const [hour, minute] = timeString.split(":");
    const date = new Date();

    date.setHours(Number(hour), Number(minute), 0, 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function getInterviewState(interview) {
    if (interview.completed) {
      return "Completed";
    }

    const interviewDateTime = new Date(
      `${interview.interviewDate}T${interview.interviewTime}`
    );

    if (interviewDateTime < new Date()) {
      return "Passed";
    }

    return "Upcoming";
  }

  if (loading) {
    return (
      <div className="interview-page">
        <div className="interview-loading">
          <div className="interview-loader"></div>
          <h3>Loading interviews...</h3>
          <p>Preparing your interview schedule.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="interview-page">

      {/* HERO */}
      <section className="interview-hero">
        <div className="interview-hero-content">
          <span className="interview-eyebrow">
            📅 Interview Command Center
          </span>

          <h1>
            Never miss your next
            <span> opportunity.</span>
          </h1>

          <p>
            Schedule interviews, keep track of important dates,
            and stay organised throughout your job search.
          </p>

          <div className="interview-hero-actions">
            <a
              href="#schedule-interview"
              className="interview-primary-btn"
            >
              + Schedule Interview
            </a>

            <Link
              to="/applications"
              className="interview-secondary-btn"
            >
              View Applications →
            </Link>
          </div>
        </div>

        <div className="interview-hero-visual">
          <div className="calendar-card">
            <div className="calendar-card-top">
              <span>YOUR NEXT STEP</span>
              <strong>✓</strong>
            </div>

            <div className="calendar-icon">
              📅
            </div>

            <strong>Stay prepared</strong>

            <p>
              Keep every interview date and meeting in one place.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="interview-stats">
        <button
          className={`interview-stat ${
            filter === "Upcoming" ? "selected" : ""
          }`}
          onClick={() => setFilter("Upcoming")}
        >
          <span className="interview-stat-icon upcoming">
            📅
          </span>

          <div>
            <small>Upcoming</small>
            <strong>{upcomingCount}</strong>
          </div>
        </button>

        <button
          className={`interview-stat ${
            filter === "Today" ? "selected" : ""
          }`}
          onClick={() => setFilter("Today")}
        >
          <span className="interview-stat-icon today">
            ⏰
          </span>

          <div>
            <small>Today</small>
            <strong>{todayCount}</strong>
          </div>
        </button>

        <button
          className={`interview-stat ${
            filter === "Completed" ? "selected" : ""
          }`}
          onClick={() => setFilter("Completed")}
        >
          <span className="interview-stat-icon completed">
            ✓
          </span>

          <div>
            <small>Completed</small>
            <strong>{completedCount}</strong>
          </div>
        </button>

        <button
          className={`interview-stat ${
            filter === "All" ? "selected" : ""
          }`}
          onClick={() => setFilter("All")}
        >
          <span className="interview-stat-icon total">
            ◈
          </span>

          <div>
            <small>Total Interviews</small>
            <strong>{interviews.length}</strong>
          </div>
        </button>
      </section>

      {/* ERROR */}
      {error && (
        <div className="interview-error">
          <span>!</span>
          <p>{error}</p>
          <button onClick={loadData}>Retry</button>
        </div>
      )}

      {/* SCHEDULE */}
      <section
        className="schedule-interview-card"
        id="schedule-interview"
      >
        <div className="schedule-intro">
          <span className="schedule-label">
            PLAN AHEAD
          </span>

          <h2>Schedule an interview</h2>

          <p>
            Add the interview details so you always know what
            is coming next.
          </p>
        </div>

        <form onSubmit={handleAddInterview}>
          <div className="interview-form-grid">

            <div className="interview-field">
              <label>Select Job</label>

              <select
                value={selectedJob}
                onChange={(event) =>
                  setSelectedJob(event.target.value)
                }
              >
                <option value="">
                  Choose a job
                </option>

                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} — {job.company}
                  </option>
                ))}
              </select>
            </div>

            <div className="interview-field">
              <label>Interview Type</label>

              <select
                value={interviewType}
                onChange={(event) =>
                  setInterviewType(event.target.value)
                }
              >
                <option value="Technical">
                  Technical
                </option>

                <option value="HR">
                  HR
                </option>

                <option value="Managerial">
                  Managerial
                </option>

                <option value="Behavioural">
                  Behavioural
                </option>

                <option value="Phone Screen">
                  Phone Screen
                </option>

                <option value="Final Round">
                  Final Round
                </option>
              </select>
            </div>

            <div className="interview-field">
              <label>Date</label>

              <input
                type="date"
                value={interviewDate}
                onChange={(event) =>
                  setInterviewDate(event.target.value)
                }
              />
            </div>

            <div className="interview-field">
              <label>Time</label>

              <input
                type="time"
                value={interviewTime}
                onChange={(event) =>
                  setInterviewTime(event.target.value)
                }
              />
            </div>

          </div>

          <div className="interview-field interview-notes">
            <label>Notes</label>

            <textarea
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              placeholder="Add anything you need to remember..."
              rows="4"
            />
          </div>

          <button
            type="submit"
            className="schedule-submit-btn"
            disabled={saving}
          >
            {saving
              ? "Scheduling..."
              : "Schedule Interview →"}
          </button>
        </form>
      </section>

      {/* INTERVIEW LIST */}
      <section className="interview-list-section">

        <div className="interview-list-heading">
          <div>
            <span className="schedule-label">
              YOUR CALENDAR
            </span>

            <h2>
              {filter === "All"
                ? "All Interviews"
                : `${filter} Interviews`}
            </h2>

            <p>
              Keep your interview pipeline organised.
            </p>
          </div>

          <div className="interview-filter-buttons">
            <button
              className={filter === "Upcoming" ? "active" : ""}
              onClick={() => setFilter("Upcoming")}
            >
              Upcoming
            </button>

            <button
              className={filter === "Today" ? "active" : ""}
              onClick={() => setFilter("Today")}
            >
              Today
            </button>

            <button
              className={filter === "Completed" ? "active" : ""}
              onClick={() => setFilter("Completed")}
            >
              Completed
            </button>

            <button
              className={filter === "All" ? "active" : ""}
              onClick={() => setFilter("All")}
            >
              All
            </button>
          </div>
        </div>

        {filter === "Today"
          ? (
            <div className="interview-grid">
              {interviews
                .filter((item) => {
                  const today = new Date()
                    .toISOString()
                    .split("T")[0];

                  return (
                    !item.completed &&
                    item.interviewDate === today
                  );
                })
                .map((interview) => (
                  <InterviewCard
                    key={interview.id}
                    interview={interview}
                    formatDate={formatDate}
                    formatTime={formatTime}
                    getInterviewState={getInterviewState}
                    markCompleted={markCompleted}
                    deleteInterview={deleteInterview}
                  />
                ))}
            </div>
          )
          : sortedInterviews.length > 0 ? (
            <div className="interview-grid">
              {sortedInterviews.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  formatDate={formatDate}
                  formatTime={formatTime}
                  getInterviewState={getInterviewState}
                  markCompleted={markCompleted}
                  deleteInterview={deleteInterview}
                />
              ))}
            </div>
          ) : (
            <div className="interview-empty">
              <div className="interview-empty-icon">
                📅
              </div>

              <h3>No interviews here yet</h3>

              <p>
                Schedule your first interview to start
                building your interview calendar.
              </p>

              <a href="#schedule-interview">
                Schedule Interview
              </a>
            </div>
          )}
      </section>
    </div>
  );
}

function InterviewCard({
  interview,
  formatDate,
  formatTime,
  getInterviewState,
  markCompleted,
  deleteInterview,
}) {
  const state = getInterviewState(interview);

  return (
    <article
      className={`interview-card ${
        interview.completed ? "interview-completed" : ""
      }`}
    >
      <div className="interview-card-top">

        <div className="interview-company-icon">
          {interview.company
            ? interview.company.charAt(0).toUpperCase()
            : "J"}
        </div>

        <span className={`interview-state ${state.toLowerCase()}`}>
          {state}
        </span>
      </div>

      <h3>{interview.title}</h3>

      <p className="interview-company">
        {interview.company}
      </p>

      <div className="interview-details">

        <div>
          <span>📅 Date</span>
          <strong>
            {formatDate(interview.interviewDate)}
          </strong>
        </div>

        <div>
          <span>⏰ Time</span>
          <strong>
            {formatTime(interview.interviewTime)}
          </strong>
        </div>

        <div>
          <span>🎯 Type</span>
          <strong>
            {interview.interviewType}
          </strong>
        </div>

      </div>

      {interview.location && (
        <div className="interview-location">
          📍 {interview.location}
        </div>
      )}

      {interview.notes && (
        <div className="interview-notes-preview">
          <span>Notes</span>
          <p>{interview.notes}</p>
        </div>
      )}

      <div className="interview-card-actions">

        <Link
          to={`/jobs/${interview.jobId}`}
          className="interview-view-btn"
        >
          View Job
        </Link>

        {!interview.completed && (
          <button
            className="interview-complete-btn"
            onClick={() => markCompleted(interview.id)}
          >
            ✓ Complete
          </button>
        )}

        <button
          className="interview-delete-btn"
          onClick={() => deleteInterview(interview.id)}
        >
          Delete
        </button>

      </div>
    </article>
  );
}

export default InterviewScheduler;