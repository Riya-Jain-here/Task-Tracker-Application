import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProjectPage = () => {
  const [projectName, setProjectName] = useState("");
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [filter, setFilter] = useState("All");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchTasks();
    fetchProjectName();
  }, [id]);

  const fetchProjectName = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/projects/${id}`, {
        headers,
      });
      setProjectName(res.data.name);
    } catch (err) {
      alert("Failed to fetch project details");
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tasks/${id}`, {
        headers,
      });
      setTasks(res.data);
    } catch (err) {
      alert("Failed to fetch tasks");
    }
  };

  const createTask = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/tasks/${id}`,
        { title, description, status },
        { headers }
      );
      setTasks([...tasks, res.data]);
      setTitle("");
      setDescription("");
      setStatus("Pending");
    } catch (err) {
      alert("Failed to create task");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers,
      });
      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        { status: newStatus },
        { headers }
      );
      setTasks(tasks.map((t) => (t._id === taskId ? res.data : t)));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const filteredTasks =
    filter === "All" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div className="container-fluid container d-flex justify-content-center mt-5 vh-100 mb-5">
      <div className="w-100" style={{ maxWidth: "700px" }}>
        <h2 className="mb-4 text-primary text-center">
          {projectName ? `${projectName} Tasks` : "Loading..."}
        </h2>

        {/* Create Task Form */}
        <div className="card p-3 mb-4 shadow-sm ">
          <h5>Add New Task</h5>
          <div className="mb-2">
            <input
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task Title"
            />
          </div>
          <div className="mb-2">
            <input
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task Description"
            />
          </div>
          <div className="mb-3">
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
          <button className="btn btn-success" onClick={createTask}>
            Add Task
          </button>
        </div>

        {/* Filter */}
        <div className="mb-3">
          <label className="me-2">Filter:</label>
          <select
            className="form-select w-auto d-inline"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>

        {/* Task List */}
        <ul className="list-group">
          {filteredTasks.map((t) => (
            <li
              key={t._id}
              className="list-group-item d-flex flex-column align-items-start"
            >
              {editTaskId === t._id ? (
                <>
                  <div className="mb-2 w-100">
                    <input
                      className="form-control mb-2"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Edit Title"
                    />
                    <input
                      className="form-control mb-2"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Edit Description"
                    />
                    <select
                      className="form-select mb-2"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                    <div className="d-flex">
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={async () => {
                          try {
                            const res = await axios.put(
                              `http://localhost:5000/api/tasks/${t._id}`,
                              {
                                title: editTitle,
                                description: editDescription,
                                status: editStatus,
                              },
                              { headers }
                            );
                            setTasks(
                              tasks.map((task) =>
                                task._id === t._id ? res.data : task
                              )
                            );
                            setEditTaskId(null);
                          } catch (err) {
                            alert("Failed to update task");
                          }
                        }}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setEditTaskId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-100 d-flex justify-content-between align-items-start">
                    <div>
                      <strong>{t.title}</strong>
                      <div className="text-muted small">{t.description}</div>
                      <span className="badge bg-secondary mt-1">
                        {t.status}
                      </span>
                    </div>
                    <div className="d-flex flex-column align-items-end">
                      <button
                        className="btn btn-sm btn-outline-primary mb-2"
                        onClick={() => {
                          setEditTaskId(t._id);
                          setEditTitle(t.title);
                          setEditDescription(t.description);
                          setEditStatus(t.status);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteTask(t._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <small className="text-muted mt-2">
                    Created: {new Date(t.createdAt).toLocaleString()}
                    {t.completedAt && (
                      <>
                        {" "}
                        | Completed: {new Date(t.completedAt).toLocaleString()}
                      </>
                    )}
                  </small>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProjectPage;
