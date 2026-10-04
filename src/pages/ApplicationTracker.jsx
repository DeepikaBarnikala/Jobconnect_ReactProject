
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const statusOptions = [
  "Applied",
  "Under Review",
  "Interview",
  "Offer",
  "Rejected",
];

const statusIcons = {
  Applied: "send",
  "Under Review": "eye",
  Interview: "calendar-check",
  Offer: "trophy",
  Rejected: "x-circle",
};

function ApplicationTracker() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setError("");

      const [applicationResponse, jobResponse] =
        await Promise.all([
          api.get("/applications"),
          api.get("/jobs"),
        ]);

      setApplications(applicationResponse.data);
      setJobs(jobResponse.data);
    } catch (error) {
      console.error("Error fetching application data:", error);
      setError("Unable to load your applications. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const countByStatus = (status) =>
    applications.filter(
      (application) => application.status === status
    ).length;

  const total = applications.length;
  const activeCount =
    countByStatus("Applied") +
    countByStatus("Under Review") +
    countByStatus("Interview");

  const interviewCount = countByStatus("Interview");
  const offerCount = countByStatus("Offer");

  const responseRate =
    total > 0
      ? Math.round(
          ((interviewCount + offerCount) / total) * 100
        )
      : 0;

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const matchesStatus =
        filterStatus === "All" ||
        application.status === filterStatus;

      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        application.title?.toLowerCase().includes(searchText) ||
        application.company?.toLowerCase().includes(searchText) ||
        application.location?.toLowerCase().includes(searchText);

      return matchesStatus && matchesSearch;
    });
  }, [applications, filterStatus, search]);

  const availableJobs = jobs.filter(
    (job) =>
      !applications.some(
        (application) =>
          String(application.jobId) === String(job.id)
      )
  );

  async function handleAddApplication(event) {
    event.preventDefault();

    if (!selectedJob) {
      alert("Please select a job.");
      return;
    }

    const job = jobs.find(
      (item) => String(item.id) === String(selectedJob)
    );

    if (!job) {
      alert("Selected job was not found.");
      return;
    }

    const newApplication = {
      jobId: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      status: "Applied",
      appliedDate: new Date().toISOString().split("T")[0],
      notes: "",
    };

    try {
      const response = await api.post(
        "/applications",
        newApplication
      );

      setApplications((previous) => [
        response.data,
        ...previous,
      ]);

      setSelectedJob("");
      setFilterStatus("All");
      setSearch("");

      alert("Application added successfully!");
    } catch (error) {
      console.error("Error adding application:", error);
      alert("Could not add application. Please try again.");
    }
  }

  async function handleStatusChange(applicationId, newStatus) {
    setUpdatingId(applicationId);

    try {
      const response = await api.patch(
        `/applications/${applicationId}`,
        { status: newStatus }
      );

      setApplications((previous) =>
        previous.map((application) =>
          String(application.id) === String(applicationId)
            ? response.data
            : application
        )
      );
    } catch (error) {
      console.error("Error updating application:", error);
      alert("Could not update application status.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(applicationId) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this application?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/applications/${applicationId}`);

      setApplications((previous) =>
        previous.filter(
          (application) =>
            String(application.id) !== String(applicationId)
        )
      );
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Could not delete application.");
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "Date not available";

    const date = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function exportApplications() {
    if (applications.length === 0) {
      alert("There are no applications to export.");
      return;
    }

    const headers = [
      "Job Title",
      "Company",
      "Location",
      "Status",
      "Applied Date",
      "Notes",
    ];

    const rows = applications.map((application) =>
      [
        application.title,
        application.company,
        application.location,
        application.status,
        application.appliedDate,
        application.notes,
      ].map((value) =>
        `"${String(value || "").replace(/"/g, '""')}"`
      )
    );

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "jobconnect-applications.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="application-page application-loading">
        <div className="application-loader"></div>
        <h3>Preparing your career dashboard...</h3>
        <p>Loading your application data</p>
      </div>
    );
  }

  return (
    <div className="application-page">
      {/* Dashboard Header */}

      <section className="application-hero">
        <div className="application-hero-content">
          <span className="application-eyebrow">
            <span className="live-dot"></span>
            YOUR CAREER CONTROL CENTER
          </span>

          <h1>
            Your Career.
            <br />
            <span>One Dashboard.</span>
          </h1>

          <p>
            Every application, every interview, every opportunity —
            track your career journey with clarity.
          </p>

          <div className="application-hero-actions">
            <a href="#add-application" className="hero-primary-btn">
              + Track New Application
            </a>

            <button
              type="button"
              className="hero-secondary-btn"
              onClick={exportApplications}
            >
              ↓ Export Report
            </button>
          </div>
        </div>

        <div className="application-hero-visual">
          <div className="hero-orbit orbit-one"></div>
          <div className="hero-orbit orbit-two"></div>

          <div className="hero-center-icon">
            <span>JC</span>
            <small>CAREER</small>
          </div>

          <div className="hero-floating-card floating-card-one">
            <span>Applications</span>
            <strong>{total}</strong>
            <small>Total tracked</small>
          </div>

          <div className="hero-floating-card floating-card-two">
            <span>Interview Progress</span>
            <strong>{interviewCount}</strong>
            <small>Interview stage</small>
          </div>
        </div>
      </section>

      {error && (
        <div className="application-error">
          {error}
          <button type="button" onClick={fetchData}>
            Retry
          </button>
        </div>
      )}

      {/* Analytics Cards */}

      <section className="application-stats">
        <button
          type="button"
          className={`application-stat-card stat-total ${
            filterStatus === "All" ? "stat-selected" : ""
          }`}
          onClick={() => setFilterStatus("All")}
        >
          <div className="stat-icon">▤</div>
          <span>Total Applications</span>
          <strong>{total}</strong>
          <small>All tracked opportunities</small>
          <div className="stat-bottom-line"></div>
        </button>

        <button
          type="button"
          className={`application-stat-card stat-active ${
            filterStatus === "Applied" ? "stat-selected" : ""
          }`}
          onClick={() => setFilterStatus("Applied")}
        >
          <div className="stat-icon">↗</div>
          <span>Applied</span>
          <strong>{countByStatus("Applied")}</strong>
          <small>Applications submitted</small>
          <div className="stat-bottom-line"></div>
        </button>

        <button
          type="button"
          className={`application-stat-card stat-interview ${
            filterStatus === "Interview" ? "stat-selected" : ""
          }`}
          onClick={() => setFilterStatus("Interview")}
        >
          <div className="stat-icon">▣</div>
          <span>Interviews</span>
          <strong>{interviewCount}</strong>
          <small>Interview opportunities</small>
          <div className="stat-bottom-line"></div>
        </button>

        <button
          type="button"
          className={`application-stat-card stat-offer ${
            filterStatus === "Offer" ? "stat-selected" : ""
          }`}
          onClick={() => setFilterStatus("Offer")}
        >
          <div className="stat-icon">✦</div>
          <span>Offers</span>
          <strong>{offerCount}</strong>
          <small>Offers received</small>
          <div className="stat-bottom-line"></div>
        </button>
      </section>

      {/* Analytics and Pipeline */}

      <section className="application-analytics">
        <div className="analytics-panel">
          <div className="analytics-panel-heading">
            <div>
              <span className="analytics-kicker">
                PERFORMANCE OVERVIEW
              </span>
              <h2>Application Insights</h2>
              <p>Your current application distribution</p>
            </div>

            <div className="analytics-total">
              <strong>{total}</strong>
              <span>Applications</span>
            </div>
          </div>

          <div className="pipeline-chart">
            {statusOptions.map((status) => {
              const count = countByStatus(status);
              const percentage =
                total > 0 ? (count / total) * 100 : 0;

              return (
                <button
                  type="button"
                  className={`pipeline-row ${
                    filterStatus === status
                      ? "pipeline-selected"
                      : ""
                  }`}
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  title={`Show ${status} applications`}
                >
                  <div className="pipeline-row-top">
                    <span className="pipeline-name">
                      <span
                        className={`pipeline-dot pipeline-${status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      ></span>
                      {status}
                    </span>

                    <strong>{count}</strong>
                  </div>

                  <div className="pipeline-track">
                    <div
                      className={`pipeline-fill pipeline-fill-${status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="chart-hint">
            <span>↗</span> Select any stage to filter your applications.
          </p>
        </div>

        <div className="analytics-panel response-panel">
          <span className="analytics-kicker">
            CAREER MOMENTUM
          </span>

          <h2>Response Overview</h2>
          <p>Interview and offer progress</p>

          <div className="response-circle">
            <div className="response-circle-inner">
              <strong>{responseRate}%</strong>
              <span>Progress rate</span>
            </div>
          </div>

          <div className="response-legend">
            <div>
              <span className="legend-dot legend-interview"></span>
              <span>Interviews</span>
              <strong>{interviewCount}</strong>
            </div>

            <div>
              <span className="legend-dot legend-offer"></span>
              <span>Offers</span>
              <strong>{offerCount}</strong>
            </div>

            <div>
              <span className="legend-dot legend-active"></span>
              <span>Active applications</span>
              <strong>{activeCount}</strong>
            </div>
          </div>

          <small className="analytics-disclaimer">
            Response rate = interview and offer stages divided by
            total applications. This is a tracking metric, not a
            hiring probability.
          </small>
        </div>
      </section>

      {/* Add Application */}

      <section
        className="application-add-card"
        id="add-application"
      >
        <div className="add-card-content">
          <span className="add-card-label">NEW OPPORTUNITY</span>
          <h2>Found an interesting role?</h2>
          <p>
            Add it to your tracker and keep your job search organized.
          </p>
        </div>

        <form onSubmit={handleAddApplication}>
          <label htmlFor="application-job">
            Select a job from JobConnect
          </label>

          <div className="add-application-controls">
            <select
              id="application-job"
              value={selectedJob}
              onChange={(event) =>
                setSelectedJob(event.target.value)
              }
              required
            >
              <option value="">Choose a job to track</option>

              {availableJobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} — {job.company}
                </option>
              ))}
            </select>

            <button type="submit" disabled={!selectedJob}>
              + Add Application
            </button>
          </div>

          {availableJobs.length === 0 && (
            <small>
              All available jobs are already in your tracker.
            </small>
          )}
        </form>
      </section>

      {/* Application Management */}

      <section className="application-list-section">
        <div className="application-list-heading">
          <div>
            <span className="analytics-kicker">
              YOUR OPPORTUNITIES
            </span>
            <h2>Application Journey</h2>
            <p>Manage every opportunity from one place.</p>
          </div>

          <button
            type="button"
            className="export-button"
            onClick={exportApplications}
          >
            ↓ Export CSV
          </button>
        </div>

        <div className="application-toolbar">
          <div className="application-search">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search company, role or location..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search applications"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(event) =>
              setFilterStatus(event.target.value)
            }
            aria-label="Filter applications by status"
          >
            <option value="All">All Applications</option>

            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="application-result-count">
          Showing <strong>{filteredApplications.length}</strong> of{" "}
          <strong>{total}</strong> applications
          {filterStatus !== "All" && (
            <button
              type="button"
              onClick={() => setFilterStatus("All")}
            >
              Clear filter ×
            </button>
          )}
        </div>

        {filteredApplications.length === 0 ? (
          <div className="application-empty">
            <div className="empty-illustration">▤</div>
            <h3>No applications found</h3>
            <p>
              Try another search or add a job to start tracking your
              career journey.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilterStatus("All");
              }}
            >
              Show All Applications
            </button>

            <Link to="/jobs">Explore Jobs →</Link>
          </div>
        ) : (
          <div className="application-list">
            {filteredApplications.map((application) => {
              const status = statusOptions.includes(application.status)
                ? application.status
                : "Applied";

              const statusIndex = statusOptions.indexOf(status);

              return (
                <article
                  className="application-card"
                  key={application.id}
                >
                  <div className="application-company-icon">
                    {(application.company || "J")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="application-card-content">
                    <div className="application-card-top">
                      <div>
                        <h3>{application.title}</h3>
                        <p>{application.company}</p>
                      </div>

                      <span
                        className={`application-status status-${status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {status}
                      </span>
                    </div>

                    <div className="application-meta">
                      <span>
                        ♧ {application.location || "Location not specified"}
                      </span>

                      <span>
                        ◷ Applied {formatDate(application.appliedDate)}
                      </span>
                    </div>

                    <div className="application-progress">
                      <div className="progress-labels">
                        <span>Application progress</span>
                        <span>
                          {status === "Rejected"
                            ? "Closed"
                            : `${statusIndex + 1} / 4`}
                        </span>
                      </div>

                      <div className="progress-steps">
                        {statusOptions.slice(0, 4).map((step, index) => (
                          <div
                            key={step}
                            className={`progress-step ${
                              status !== "Rejected" &&
                              index <= statusIndex
                                ? "progress-step-active"
                                : ""
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>

                    <div className="application-card-actions">
                      <label>
                        Update Status

                        <select
                          value={status}
                          disabled={
                            String(updatingId) === String(application.id)
                          }
                          onChange={(event) =>
                            handleStatusChange(
                              application.id,
                              event.target.value
                            )
                          }
                        >
                          {statusOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>

                      <div className="application-action-buttons">
                        <Link
                          to={`/jobs/${application.jobId}`}
                          className="application-view-btn"
                        >
                          View Job →
                        </Link>

                        <button
                          type="button"
                          className="application-delete-btn"
                          onClick={() =>
                            handleDelete(application.id)
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default ApplicationTracker;