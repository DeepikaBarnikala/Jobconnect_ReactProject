
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeSavedJob } from "../redux/savedJobsSlice";

function SavedJobs() {
  const dispatch = useDispatch();

  const savedJobs = useSelector((state) => state.savedJobs.jobs);

  function handleRemove(jobId) {
    dispatch(removeSavedJob(jobId));
  }

  return (
    <main className="saved-page">
      <section className="saved-hero">
        <div>
          <span className="saved-eyebrow">YOUR CAREER SHORTLIST</span>
          <h1>Saved Jobs</h1>
          <p>
            Keep track of opportunities you're interested in
            and take the next step in your career.
          </p>
        </div>

        <div className="saved-count-card">
          <span className="saved-count-icon">♡</span>
          <div>
            <strong>{savedJobs.length}</strong>
            <span>
              {savedJobs.length === 1 ? "Saved job" : "Saved jobs"}
            </span>
          </div>
        </div>
      </section>

      <section className="saved-content">
        <div className="saved-section-heading">
          <div>
            <h2>Your shortlist</h2>
            <p>Opportunities you've bookmarked for later.</p>
          </div>

          <Link to="/jobs" className="saved-browse-btn">
            + Explore Jobs
          </Link>
        </div>

        {savedJobs.length === 0 ? (
          <div className="saved-empty">
            <div className="saved-empty-icon">♡</div>
            <h2>No saved jobs yet</h2>
            <p>
              When you find a job you like, bookmark it
              and it will appear here.
            </p>
            <Link to="/jobs" className="saved-primary-btn">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="saved-grid">
            {savedJobs.map((job) => (
              <article className="saved-card" key={job.id}>
                <div className="saved-card-top">
                  <div className="saved-company-logo">
                    {job.company?.charAt(0) || "J"}
                  </div>

                  <button
                    className="saved-remove-icon"
                    type="button"
                    onClick={() => handleRemove(job.id)}
                    aria-label={`Remove ${job.title} from saved jobs`}
                    title="Remove saved job"
                  >
                    ♥
                  </button>
                </div>

                <h3>{job.title}</h3>
                <p className="saved-company-name">{job.company}</p>

                <div className="saved-details">
                  <span>📍 {job.location || "Location not specified"}</span>
                  <span>💼 {job.jobType || "Job type not specified"}</span>
                  <span>🏠 {job.workMode || "Work mode not specified"}</span>
                </div>

                <div className="saved-tags">
                  {job.experience && (
                    <span>{job.experience}</span>
                  )}
                  {job.salary && <span>{job.salary}</span>}
                </div>

                <div className="saved-card-bottom">
                  <span className="saved-rating">
                    ⭐ {job.rating ?? "Not rated"}
                  </span>

                  <div className="saved-card-actions">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="saved-view-btn"
                    >
                      View Details
                    </Link>

                    <button
                      className="saved-remove-btn"
                      type="button"
                      onClick={() => handleRemove(job.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default SavedJobs;