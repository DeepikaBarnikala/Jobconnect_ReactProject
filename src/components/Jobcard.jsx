
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveJob, removeSavedJob } from "../redux/savedJobsSlice";

function JobCard({ job, onDelete }) {
  const dispatch = useDispatch();

  const savedJobs = useSelector((state) => state.savedJobs.jobs);

  const [imageError, setImageError] = useState(false);

  const companyName = job.company || "Company";

  const isSaved = savedJobs.some(
    (savedJob) => String(savedJob.id) === String(job.id)
  );

  const logoUrl =
    job.companyLogo ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      companyName
    )}&background=E8F0FF&color=2457A6&size=128&bold=true`;

  function handleSave() {
    if (isSaved) {
      dispatch(removeSavedJob(job.id));
    } else {
      dispatch(saveJob(job));
    }
  }

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="company-logo">
          {!imageError ? (
            <img
              src={logoUrl}
              alt={`${companyName} logo`}
              onError={() => setImageError(true)}
            />
          ) : (
            <span>{companyName.charAt(0).toUpperCase()}</span>
          )}
        </div>

        <button
          className="save-btn"
          onClick={handleSave}
          type="button"
          aria-label={isSaved ? "Remove saved job" : "Save job"}
          title={isSaved ? "Remove from saved jobs" : "Save job"}
        >
          {isSaved ? "♥" : "♡"}
        </button>
      </div>

      <h3>{job.title}</h3>

      <p className="company">{companyName}</p>

      <div className="job-info">
        <span>📍 {job.location}</span>
        <span>💼 {job.jobType}</span>
        <span>🏠 {job.workMode}</span>
      </div>

      <div className="job-meta">
        <span>{job.experience}</span>
        <span>{job.salary}</span>
      </div>

      <div className="job-card-footer">
        <span>⭐ {job.rating ?? 0}</span>
      </div>

      <div className="job-actions">
        <Link to={`/jobs/${job.id}`} className="view-btn">
          View
        </Link>

        <Link to={`/edit-job/${job.id}`} className="edit-btn">
          Edit
        </Link>

        <button
          className="delete-btn"
          onClick={() => onDelete(job.id)}
          type="button"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default JobCard;