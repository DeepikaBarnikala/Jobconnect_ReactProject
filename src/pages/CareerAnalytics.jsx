
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function CareerAnalytics() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/applications");

      setApplications(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Unable to load career analytics. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const total = applications.length;

  const countStatus = (status) =>
    applications.filter(
      (app) =>
        String(app.status || "").toLowerCase() ===
        status.toLowerCase()
    ).length;

  const applied = countStatus("Applied");
  const underReview = countStatus("Under Review");
  const interviews = countStatus("Interview");
  const offers = countStatus("Offer");
  const rejected = countStatus("Rejected");

  const responseRate =
    total > 0
      ? Math.round(((interviews + offers + rejected) / total) * 100)
      : 0;

  const interviewRate =
    total > 0
      ? Math.round((interviews / total) * 100)
      : 0;

  const offerRate =
    total > 0
      ? Math.round((offers / total) * 100)
      : 0;

  const statusData = [
    { label: "Applied", count: applied, className: "applied" },
    {
      label: "Under Review",
      count: underReview,
      className: "under-review",
    },
    {
      label: "Interview",
      count: interviews,
      className: "interview",
    },
    { label: "Offer", count: offers, className: "offer" },
    { label: "Rejected", count: rejected, className: "rejected" },
  ];

  const recentApplications = [...applications]
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.appliedDate || 0) -
        new Date(a.updatedAt || a.appliedDate || 0)
    )
    .slice(0, 5);

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-loading">
          Loading your career analytics...
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div>
          <p className="analytics-eyebrow">CAREER OVERVIEW</p>
          <h1>Career Analytics</h1>
          <p>
            Track your job applications, interviews, and career progress
            in one place.
          </p>
        </div>

        <Link to="/applications" className="analytics-action-btn">
          View Applications
        </Link>
      </div>

      {error && (
        <div className="analytics-error">
          {error}
          <button onClick={fetchApplications}>Retry</button>
        </div>
      )}

      <div className="analytics-stats">
        <div className="analytics-stat-card">
          <div className="analytics-stat-icon purple">▤</div>
          <p>Total Applications</p>
          <h2>{total}</h2>
          <span>Applications tracked</span>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon blue">◷</div>
          <p>Interviews</p>
          <h2>{interviews}</h2>
          <span>{interviewRate}% of applications</span>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon green">✓</div>
          <p>Offers Received</p>
          <h2>{offers}</h2>
          <span>{offerRate}% offer rate</span>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon orange">↗</div>
          <p>Response Rate</p>
          <h2>{responseRate}%</h2>
          <span>Interview, offer, or rejection</span>
        </div>
      </div>

      <div className="analytics-grid">
        <section className="analytics-card">
          <div className="analytics-card-heading">
            <div>
              <h2>Application Status</h2>
              <p>Current distribution of your applications</p>
            </div>
          </div>

          {total === 0 ? (
            <div className="analytics-empty">
              No applications available yet.
              <Link to="/jobs">Explore jobs</Link>
            </div>
          ) : (
            <div className="analytics-status-list">
              {statusData.map((item) => (
                <div className="analytics-status-item" key={item.label}>
                  <div className="analytics-status-label">
                    <span>{item.label}</span>
                    <strong>{item.count}</strong>
                  </div>

                  <div className="analytics-bar">
                    <div
                      className={`analytics-bar-fill ${item.className}`}
                      style={{
                        width: `${(item.count / total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="analytics-card">
          <div className="analytics-card-heading">
            <div>
              <h2>Career Performance</h2>
              <p>Progress based on your tracked applications</p>
            </div>
          </div>

          <div className="analytics-performance">
            <div className="analytics-performance-item">
              <div>
                <span>Interview Rate</span>
                <strong>{interviewRate}%</strong>
              </div>
              <div className="analytics-performance-track">
                <div
                  className="analytics-performance-fill interview-progress"
                  style={{ width: `${interviewRate}%` }}
                />
              </div>
            </div>

            <div className="analytics-performance-item">
              <div>
                <span>Offer Rate</span>
                <strong>{offerRate}%</strong>
              </div>
              <div className="analytics-performance-track">
                <div
                  className="analytics-performance-fill offer-progress"
                  style={{ width: `${offerRate}%` }}
                />
              </div>
            </div>

            <div className="analytics-insight">
              <strong>Keep moving forward!</strong>
              <p>
                Keep your application statuses updated to monitor your
                job search progress.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="analytics-card analytics-recent">
        <div className="analytics-card-heading">
          <div>
            <h2>Recent Applications</h2>
            <p>Your latest five tracked applications</p>
          </div>

          <Link to="/applications">View all</Link>
        </div>

        {recentApplications.length === 0 ? (
          <div className="analytics-empty">
            You have not tracked any applications yet.
            <Link to="/jobs">Browse available jobs</Link>
          </div>
        ) : (
          <div className="analytics-table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentApplications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.jobTitle || app.title || "Job Application"}</td>
                    <td>{app.company || "Not specified"}</td>
                    <td>
                      {app.appliedDate
                        ? new Date(app.appliedDate).toLocaleDateString()
                        : "Not available"}
                    </td>
                    <td>
                      <span
                        className={`analytics-status-badge ${String(
                          app.status || "Applied"
                        )
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {app.status || "Applied"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="analytics-footer">
        <Link to="/jobs" className="analytics-action-btn">
          Explore More Jobs
        </Link>
      </div>
    </div>
  );
}

export default CareerAnalytics;