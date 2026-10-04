import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const statusOrder = [
  "Applied",
  "Under Review",
  "Interview",
  "Offer",
];

function ApplicationTimeline() {
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTimelineData();
  }, []);

  async function loadTimelineData() {
    try {
      setLoading(true);
      setError("");

      const [applicationsResponse, interviewsResponse] =
        await Promise.all([
          api.get("/applications"),
          api.get("/interviews"),
        ]);

      setApplications(applicationsResponse.data);
      setInterviews(interviewsResponse.data);

      if (applicationsResponse.data.length > 0) {
        setSelectedApplication(applicationsResponse.data[0]);
      }
    } catch (err) {
      console.error(err);
      setError(
        "Unable to load application timeline. Make sure JSON Server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  const selectedInterview = useMemo(() => {
    if (!selectedApplication) return null;

    return interviews.find(
      (interview) =>
        String(interview.jobId) === String(selectedApplication.jobId)
    );
  }, [selectedApplication, interviews]);

  function getCurrentStep(status) {
    if (status === "Rejected") {
      return 0;
    }

    const index = statusOrder.indexOf(status);

    return index === -1 ? 0 : index;
  }

  function formatDate(dateString) {
    if (!dateString) return "Date unavailable";

    return new Date(`${dateString}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  function formatInterviewDate(interview) {
    if (!interview) return "";

    const date = formatDate(interview.interviewDate);
    const [hour, minute] = (interview.interviewTime || "00:00").split(":");

    const timeDate = new Date();
    timeDate.setHours(Number(hour), Number(minute), 0, 0);

    const time = timeDate.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });

    return `${date} at ${time}`;
  }

  if (loading) {
    return (
      <div className="timeline-page">
        <div className="timeline-loading">
          <div className="timeline-spinner"></div>
          <h3>Loading your timeline...</h3>
          <p>Preparing your application journey.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="timeline-page">

      {/* HERO */}
      <section className="timeline-hero">
        <div className="timeline-hero-content">
          <span className="timeline-eyebrow">
            APPLICATION JOURNEY
          </span>

          <h1>
            Track every step of your
            <span> job search.</span>
          </h1>

          <p>
            See where each application stands and keep important
            interview milestones in one place.
          </p>

          <div className="timeline-hero-actions">
            <Link
              to="/applications"
              className="timeline-primary-btn"
            >
              View Applications
            </Link>

            <Link
              to="/interviews"
              className="timeline-secondary-btn"
            >
              View Interviews
            </Link>
          </div>
        </div>

        <div className="timeline-hero-visual">
          <div className="timeline-visual-card">
            <div className="timeline-visual-line">
              <span className="visual-dot active"></span>
              <span className="visual-connector"></span>
              <span className="visual-dot active"></span>
              <span className="visual-connector"></span>
              <span className="visual-dot active"></span>
            </div>

            <div>
              <strong>Application Progress</strong>
              <small>Keep moving forward</small>
            </div>
          </div>
        </div>
      </section>

      {/* ERROR */}
      {error && (
        <div className="timeline-error">
          <span>!</span>
          <p>{error}</p>

          <button onClick={loadTimelineData}>
            Retry
          </button>
        </div>
      )}

      {/* MAIN */}
      {applications.length === 0 ? (
        <div className="timeline-empty">
          <div className="timeline-empty-icon">
            ◷
          </div>

          <h2>No applications yet</h2>

          <p>
            Start applying for jobs and your application journey
            will appear here.
          </p>

          <Link to="/jobs">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="timeline-layout">

          {/* APPLICATION LIST */}
          <aside className="timeline-sidebar">

            <div className="timeline-sidebar-header">
              <span>YOUR APPLICATIONS</span>
              <strong>{applications.length}</strong>
            </div>

            <div className="timeline-application-list">
              {applications.map((application) => (
                <button
                  key={application.id}
                  type="button"
                  className={`timeline-application-item ${
                    selectedApplication?.id === application.id
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedApplication(application)
                  }
                >
                  <div className="timeline-item-logo">
                    {application.company
                      ? application.company
                          .charAt(0)
                          .toUpperCase()
                      : "J"}
                  </div>

                  <div className="timeline-item-info">
                    <strong>
                      {application.title}
                    </strong>

                    <span>
                      {application.company}
                    </span>

                    <small className={`timeline-status-${application.status
                      ?.toLowerCase()
                      .replace(/\s+/g, "-")}`}>
                      {application.status}
                    </small>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* TIMELINE */}
          {selectedApplication && (
            <main className="timeline-content">

              {/* APPLICATION HEADER */}
              <div className="timeline-application-header">

                <div className="timeline-company-logo">
                  {selectedApplication.company
                    ? selectedApplication.company
                        .charAt(0)
                        .toUpperCase()
                    : "J"}
                </div>

                <div>
                  <span className="timeline-label">
                    APPLICATION
                  </span>

                  <h2>
                    {selectedApplication.title}
                  </h2>

                  <p>
                    {selectedApplication.company}
                    {selectedApplication.location
                      ? ` • ${selectedApplication.location}`
                      : ""}
                  </p>
                </div>

                <span
                  className={`timeline-current-status timeline-status-${selectedApplication.status
                    ?.toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {selectedApplication.status}
                </span>
              </div>

              {/* PROGRESS */}
              <section className="timeline-progress-card">

                <div className="timeline-progress-heading">
                  <div>
                    <span className="timeline-label">
                      CURRENT PROGRESS
                    </span>

                    <h3>
                      {selectedApplication.status}
                    </h3>
                  </div>

                  <strong>
                    {selectedApplication.status === "Rejected"
                      ? "Closed"
                      : `${getCurrentStep(
                          selectedApplication.status
                        ) + 1}/4`}
                  </strong>
                </div>

                <div className="timeline-progress-bar">
                  <span
                    style={{
                      width:
                        selectedApplication.status ===
                        "Rejected"
                          ? "100%"
                          : `${
                              ((getCurrentStep(
                                selectedApplication.status
                              ) +
                                1) /
                                4) *
                              100
                            }%`,
                    }}
                  ></span>
                </div>

              </section>

              {/* TIMELINE */}
              <section className="timeline-card">

                <div className="timeline-section-heading">
                  <div>
                    <span className="timeline-label">
                      JOURNEY
                    </span>

                    <h3>
                      Application Timeline
                    </h3>
                  </div>
                </div>

                <div className="timeline-events">

                  {/* APPLIED */}
                  <div className="timeline-event completed">
                    <div className="timeline-event-marker">
                      ✓
                    </div>

                    <div className="timeline-event-content">
                      <span>
                        {formatDate(
                          selectedApplication.appliedDate
                        )}
                      </span>

                      <h4>
                        Application Submitted
                      </h4>

                      <p>
                        Your application was added to the
                        JobConnect tracker.
                      </p>
                    </div>
                  </div>

                  {/* UNDER REVIEW */}
                  <div
                    className={`timeline-event ${
                      selectedApplication.status ===
                        "Under Review" ||
                      selectedApplication.status ===
                        "Interview" ||
                      selectedApplication.status === "Offer"
                        ? "completed"
                        : ""
                    }`}
                  >
                    <div className="timeline-event-marker">
                      {selectedApplication.status ===
                        "Under Review" ||
                      selectedApplication.status ===
                        "Interview" ||
                      selectedApplication.status === "Offer"
                        ? "✓"
                        : "2"}
                    </div>

                    <div className="timeline-event-content">
                      <span>APPLICATION STAGE</span>

                      <h4>
                        Under Review
                      </h4>

                      <p>
                        The application is being reviewed by
                        the employer.
                      </p>
                    </div>
                  </div>

                  {/* INTERVIEW */}
                  <div
                    className={`timeline-event ${
                      selectedApplication.status ===
                        "Interview" ||
                      selectedApplication.status === "Offer" ||
                      selectedInterview
                        ? "completed"
                        : ""
                    }`}
                  >
                    <div className="timeline-event-marker">
                      {selectedInterview ||
                      selectedApplication.status ===
                        "Interview" ||
                      selectedApplication.status === "Offer"
                        ? "✓"
                        : "3"}
                    </div>

                    <div className="timeline-event-content">
                      <span>
                        {selectedInterview
                          ? formatInterviewDate(selectedInterview)
                          : "NEXT MILESTONE"}
                      </span>

                      <h4>
                        Interview
                      </h4>

                      {selectedInterview ? (
                        <>
                          <p>
                            {selectedInterview.interviewType} interview
                            scheduled with{" "}
                            <strong>
                              {selectedApplication.company}
                            </strong>
                            .
                          </p>

                          <div className="timeline-interview-badge">
                            📅 Interview Scheduled
                          </div>
                        </>
                      ) : (
                        <p>
                          Your interview milestone will appear
                          here when scheduled.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* FINAL OUTCOME */}
                  <div
                    className={`timeline-event ${
                      selectedApplication.status === "Offer" ||
                      selectedApplication.status === "Rejected"
                        ? "completed"
                        : ""
                    }`}
                  >
                    <div className="timeline-event-marker">
                      {selectedApplication.status === "Offer" ||
                      selectedApplication.status === "Rejected"
                        ? "✓"
                        : "4"}
                    </div>

                    <div className="timeline-event-content">

                      <span>
                        FINAL OUTCOME
                      </span>

                      <h4>
                        {selectedApplication.status === "Offer"
                          ? "Offer Received"
                          : selectedApplication.status ===
                            "Rejected"
                          ? "Application Closed"
                          : "Decision Pending"}
                      </h4>

                      <p>
                        {selectedApplication.status ===
                        "Offer"
                          ? "This application reached the offer stage."
                          : selectedApplication.status ===
                            "Rejected"
                          ? "This application is marked as rejected."
                          : "The final outcome has not been recorded yet."}
                      </p>

                    </div>
                  </div>

                </div>
              </section>

              {/* APPLICATION DETAILS */}
              <section className="timeline-details-card">

                <div>
                  <span>APPLIED ON</span>

                  <strong>
                    {formatDate(
                      selectedApplication.appliedDate
                    )}
                  </strong>
                </div>

                <div>
                  <span>STATUS</span>

                  <strong>
                    {selectedApplication.status}
                  </strong>
                </div>

                <div>
                  <span>JOB ID</span>

                  <strong>
                    #{selectedApplication.jobId}
                  </strong>
                </div>

                <Link
                  to={`/jobs/${selectedApplication.jobId}`}
                >
                  View Job →
                </Link>

              </section>

            </main>
          )}
        </div>
      )}
    </div>
  );
}

export default ApplicationTimeline;