import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/projects", {
        headers,
      });
      setProjects(res.data);
    } catch (err) {
      alert("Failed to fetch projects");
    }
  };

  const createProject = async (e) => {
    e.preventDefault();
    if (!name) {
      alert("Project name is required");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/projects",
        { name },
        { headers }
      );
      setProjects([...projects, res.data]);
      setName("");
    } catch (err) {
      alert("Maximum 4 projects can be created");
    }
  };

  const deleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/projects/${projectId}`, {
        headers,
      });
      setProjects(projects.filter((p) => p._id !== projectId));
    } catch (err) {
      alert("Failed to delete project");
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card p-4 shadow-lg"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <h2 className="text-center mb-4">Dashboard</h2>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="d-grid mb-4">
          <button
            className="btn btn-primary"
            onClick={createProject}
            disabled={projects.length >= 4}
          >
            Create Project
          </button>
        </div>

        <ul className="list-group">
          {projects.map((p) => (
            <li
              key={p._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/project/${p._id}`)}
              >
                {p.name}
              </span>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => deleteProject(p._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
