
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Map, List } from "lucide-react";

import api from "../services/api";
import JobCard from "../components/JobCard";
import JobMap from "../components/JobMap";

function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [category, setCategory] = useState(
    searchParams.get("category") || ""
  );

  const [jobType, setJobType] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [sort, setSort] = useState("newest");

  const [viewMode, setViewMode] = useState("list");
  const [locationFilter, setLocationFilter] = useState("");

  const resultsRef = useRef(null);

  // Fetch jobs
  useEffect(() => {
    getJobs();
  }, []);

  async function getJobs() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/jobs");
      setJobs(response.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Unable to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Delete job
  async function handleDelete(jobId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/jobs/${jobId}`);

      setJobs((previousJobs) =>
        previousJobs.filter((job) => job.id !== jobId)
      );

      alert("Job deleted successfully!");
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Unable to delete job. Please try again.");
    }
  }

  // Get category
  function getCategory(job) {
    return job.category || job.department || "Other";
  }

  // Get job type
  function getJobType(job) {
    return (
      job.jobType ||
      job.type ||
      job.employmentType ||
      "Not specified"
    );
  }

  // Convert salary into a comparable number
  function getSalary(job) {
    const salaryValue =
      job.salary || job.package || job.ctc || "";

    const match = String(salaryValue)
      .replace(/,/g, "")
      .match(/\d+(\.\d+)?/);

    if (!match) return 0;

    let amount = Number(match[0]);

    if (/lpa|lakhs?|lac/i.test(String(salaryValue))) {
      amount *= 100000;
    } else if (/k/i.test(String(salaryValue))) {
      amount *= 1000;
    }

    return amount;
  }

  // Dynamic categories
  const categories = useMemo(() => {
    return [
      ...new Set(jobs.map((job) => getCategory(job))),
    ].sort();
  }, [jobs]);

  // Dynamic job types
  const jobTypes = useMemo(() => {
    return [
      ...new Set(jobs.map((job) => getJobType(job))),
    ].sort();
  }, [jobs]);

  // Search, category, type and salary filtering
  const jobsForMap = useMemo(() => {
    let result = [...jobs];

    const searchText = search.trim().toLowerCase();

    if (searchText) {
      result = result.filter((job) => {
        const searchableText = [
          job.title,
          job.company,
          job.location,
          getCategory(job),
          ...(Array.isArray(job.skills)
            ? job.skills
            : [job.skills || ""]),
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(searchText);
      });
    }

    if (category) {
      result = result.filter(
        (job) =>
          getCategory(job).toLowerCase() ===
          category.toLowerCase()
      );
    }

    if (jobType) {
      result = result.filter(
        (job) =>
          getJobType(job).toLowerCase() ===
          jobType.toLowerCase()
      );
    }

    if (salaryRange === "below-50000") {
      result = result.filter(
        (job) => getSalary(job) > 0 && getSalary(job) < 50000
      );
    } else if (salaryRange === "50000-100000") {
      result = result.filter(
        (job) =>
          getSalary(job) >= 50000 &&
          getSalary(job) <= 100000
      );
    } else if (salaryRange === "above-100000") {
      result = result.filter(
        (job) => getSalary(job) > 100000
      );
    }

    return result;
  }, [jobs, search, category, jobType, salaryRange]);

  // Apply location filter and sorting
  const filteredJobs = useMemo(() => {
    let result = [...jobsForMap];

    if (locationFilter) {
      result = result.filter(
        (job) =>
          String(job.location || "").trim().toLowerCase() ===
          locationFilter.trim().toLowerCase()
      );
    }

    if (sort === "salary-high") {
      result.sort((a, b) => getSalary(b) - getSalary(a));
    } else if (sort === "salary-low") {
      result.sort((a, b) => getSalary(a) - getSalary(b));
    } else if (sort === "title") {
      result.sort((a, b) =>
        String(a.title || "").localeCompare(String(b.title || ""))
      );
    } else if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.postedDate || 0) -
          new Date(a.postedDate || 0)
      );
    }

    return result;
  }, [jobsForMap, locationFilter, sort]);

  // Update search URL
  function handleSearchChange(value) {
    setSearch(value);

    const params = new URLSearchParams(searchParams);

    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    setSearchParams(params, { replace: true });
  }

  // Update category URL
  function handleCategoryChange(value) {
    setCategory(value);

    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }

    setSearchParams(params, { replace: true });
  }

  // Clear all filters
  function clearFilters() {
    setSearch("");
    setCategory("");
    setJobType("");
    setSalaryRange("");
    setSort("newest");
    setLocationFilter("");
    setSearchParams({});
  }

  // Select location from map
  function handleLocationSelect(location) {
    setLocationFilter(location);
    setViewMode("list");
  }

  // Scroll to matching job results
  useEffect(() => {
    if (locationFilter && viewMode === "list") {
      const timer = setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [locationFilter, viewMode]);

  const hasActiveFilters =
    search ||
    category ||
    jobType ||
    salaryRange ||
    locationFilter;

  if (loading) {
    return (
      <div className="loading">
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <section className="jobs-page">
      {/* Page heading */}
      <div className="page-heading">
        <div>
          <span className="section-label">
            CAREER OPPORTUNITIES
          </span>

          <h1>Explore Jobs</h1>

          <p>
            Discover opportunities that match your skills and career goals.
          </p>
        </div>

        <Link to="/add-job" className="add-job-btn">
          + Add Job
        </Link>
      </div>

      {error && (
        <div className="map-empty-message">
          {error}
          <button type="button" onClick={getJobs}>
            Retry
          </button>
        </div>
      )}

      {/* Search and filters */}
      <div className="jobs-filter-panel">
        <div className="job-search">
          <input
            type="text"
            placeholder="Search by job title, company, skill..."
            value={search}
            onChange={(event) =>
              handleSearchChange(event.target.value)
            }
          />

          <button type="button" className="search-btn">
            Search
          </button>
        </div>

        <div className="jobs-filter-row">
          <select
            value={category}
            onChange={(event) =>
              handleCategoryChange(event.target.value)
            }
          >
            <option value="">All Categories</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={jobType}
            onChange={(event) => setJobType(event.target.value)}
          >
            <option value="">All Job Types</option>

            {jobTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={salaryRange}
            onChange={(event) =>
              setSalaryRange(event.target.value)
            }
          >
            <option value="">All Salary Ranges</option>
            <option value="below-50000">Below ₹50,000</option>
            <option value="50000-100000">
              ₹50,000 – ₹1,00,000
            </option>
            <option value="above-100000">
              Above ₹1,00,000
            </option>
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="salary-high">
              Salary: High to Low
            </option>
            <option value="salary-low">
              Salary: Low to High
            </option>
            <option value="title">Job Title: A–Z</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              className="clear-filters-btn"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results toolbar */}
      <div
        className="jobs-results-toolbar"
        ref={resultsRef}
      >
        <div>
          <h2>Available Opportunities</h2>

          <p>
            {filteredJobs.length}{" "}
            {filteredJobs.length === 1 ? "job" : "jobs"} found
          </p>
        </div>

        <div className="jobs-view-toolbar">
          <button
            type="button"
            className={`view-toggle ${
              viewMode === "list" ? "active" : ""
            }`}
            onClick={() => setViewMode("list")}
            aria-pressed={viewMode === "list"}
          >
            <List size={17} />
            List
          </button>

          <button
            type="button"
            className={`view-toggle ${
              viewMode === "map" ? "active" : ""
            }`}
            onClick={() => setViewMode("map")}
            aria-pressed={viewMode === "map"}
          >
            <Map size={17} />
            Map
          </button>
        </div>
      </div>

      {/* Selected location */}
      {locationFilter && (
        <div className="active-location-filter">
          <span>
            Showing jobs in <strong>{locationFilter}</strong>
          </span>

          <button
            type="button"
            onClick={() => setLocationFilter("")}
          >
            Clear Location ×
          </button>
        </div>
      )}

      {/* Map or job list */}
      {viewMode === "map" ? (
        <JobMap
          jobs={jobsForMap}
          onLocationSelect={handleLocationSelect}
        />
      ) : filteredJobs.length > 0 ? (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="map-empty-message">
          <h3>No jobs found</h3>

          <p>
            Try changing your search or filters to find more opportunities.
          </p>

          <button
            type="button"
            className="clear-filters-btn"
            onClick={clearFilters}
          >
            Clear All Filters
          </button>
        </div>
      )}
    </section>
  );
}

export default Jobs;