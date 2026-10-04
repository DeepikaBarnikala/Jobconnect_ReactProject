import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function JobDetails() {

  const { id } = useParams();

  const [job, setJob] = useState(null);

  useEffect(() => {
    getJob();
  }, [id]);

  async function getJob() {

    try {

      const response = await api.get(
        `/jobs/${id}`
      );

      setJob(response.data);

    } catch (error) {

      console.error(
        "Error fetching job:",
        error
      );

    }
  }

  if (!job) {
    return <h2 className="loading">Loading...</h2>;
  }

  return (
    <div className="job-details">

      <div className="details-header">

        <div className="large-company-logo">
          {job.company.charAt(0)}
        </div>

        <div>
          <h1>{job.title}</h1>
          <h3>{job.company}</h3>
        </div>

      </div>

      <div className="details-info">

        <span>📍 {job.location}</span>
        <span>💼 {job.jobType}</span>
        <span>🏠 {job.workMode}</span>
        <span>💰 {job.salary}</span>
        <span>⭐ {job.rating}</span>

      </div>

      <section>
        <h2>Job Description</h2>

        <p>{job.description}</p>
      </section>

      <section>
        <h2>Required Skills</h2>

        <div className="skills">

          {job.skills.map((skill, index) => (
            <span key={index}>
              {skill}
            </span>
          ))}

        </div>
      </section>

      <section>
        <h2>Requirements</h2>

        <ul>

          {job.requirements.map(
            (requirement, index) => (
              <li key={index}>
                {requirement}
              </li>
            )
          )}

        </ul>
      </section>

      <section className="job-extra">

        <div>
          <strong>Experience</strong>
          <p>{job.experience}</p>
        </div>

        <div>
          <strong>Category</strong>
          <p>{job.category}</p>
        </div>

        <div>
          <strong>Posted</strong>
          <p>{job.postedDate}</p>
        </div>

        <div>
          <strong>Application Deadline</strong>
          <p>{job.applicationDeadline}</p>
        </div>

      </section>

      <button className="apply-btn">
        Apply Now
      </button>

    </div>
  );
}

export default JobDetails;