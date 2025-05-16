import React from "react";
import { Link } from "react-router-dom";

const ProjectList = ({ projects }) => {
  return (
    <div>
      <h3>Your Projects</h3>
      <ul>
        {projects.map((p) => (
          <li key={p._id}>
            <Link to={`/project/${p._id}`}>{p.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
