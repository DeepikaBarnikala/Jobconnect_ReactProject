import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function AddJob() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "Full Time",
    experience: "",
    salary: "",
    category: "",
    workMode: "On-site",
    description: "",
    skills: "",
    requirements: "",
    applicationDeadline: ""
  });

  // Load existing job when editing
  useEffect(() => {
    if (isEditMode) {
      loadJob();
    }
  }, [id]);

  async function loadJob() {
    try {
      const response = await api.get(`/jobs/${id}`);

      const job = response.data;

      setFormData({
        title: job.title || "",
        company: job.company || "",
        location: job.location || "",
        jobType: job.jobType || "Full Time",
        experience: job.experience || "",
        salary: job.salary || "",
        category: job.category || "",
        workMode: job.workMode || "On-site",
        description: job.description || "",

        // Convert array into comma separated text
        skills: Array.isArray(job.skills)
          ? job.skills.join(", ")
          : job.skills || "",

        requirements: Array.isArray(job.requirements)
          ? job.requirements.join(", ")
          : job.requirements || "",

        applicationDeadline: job.applicationDeadline || ""
      });
    } catch (error) {
      console.error("Error loading job:", error);
      alert("Failed to load job.");
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const jobData = {
      ...formData,

      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),

      requirements: formData.requirements
        .split(",")
        .map((requirement) => requirement.trim())
        .filter(Boolean)
    };

    try {
      if (isEditMode) {
        // Update existing job
        await api.put(`/jobs/${id}`, jobData);

        alert("Job updated successfully!");
      } else {
        // Add new job
        const newJob = {
          ...jobData,
          postedDate: new Date().toISOString().split("T")[0],
          rating: 0
        };

        await api.post("/jobs", newJob);

        alert("Job added successfully!");
      }

      navigate("/jobs");

    } catch (error) {
      console.error("Error saving job:", error);

      if (isEditMode) {
        alert("Failed to update job.");
      } else {
        alert("Failed to add job.");
      }
    }
  }

  return (
    <div className="form-container">

      <h2>
        {isEditMode ? "Edit Job" : "Add New Job"}
      </h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={formData.company}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <select
          name="jobType"
          value={formData.jobType}
          onChange={handleChange}
        >
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>

        <input
          type="text"
          name="experience"
          placeholder="Experience (e.g., 0-2 Years)"
          value={formData.experience}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="salary"
          placeholder="Salary (e.g., ₹6 - ₹10 LPA)"
          value={formData.salary}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <select
          name="workMode"
          value={formData.workMode}
          onChange={handleChange}
        >
          <option value="On-site">On-site</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        <textarea
          name="description"
          placeholder="Job Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <textarea
          name="skills"
          placeholder="Skills separated by commas (e.g., Java, SQL, Spring Boot)"
          value={formData.skills}
          onChange={handleChange}
          required
        />

        <textarea
          name="requirements"
          placeholder="Requirements separated by commas"
          value={formData.requirements}
          onChange={handleChange}
          required
        />

        <label>Application Deadline</label>

        <input
          type="date"
          name="applicationDeadline"
          value={formData.applicationDeadline}
          onChange={handleChange}
          required
        />

        <button type="submit" className="submit-btn">
          {isEditMode ? "Update Job" : "Add Job"}
        </button>

        <button
          type="button"
          className="cancel-btn"
          onClick={() => navigate("/jobs")}
        >
          Cancel
        </button>

      </form>
    </div>
  );
}

export default AddJob;