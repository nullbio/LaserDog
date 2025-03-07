import React, { useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import "./Sidebar.css";

const Sidebar = () => {
  const {
    projects,
    currentProject,
    switchProject,
    createProject,
    switchFile,
    createFile,
    deleteFile,
  } = useAppContext();

  const [newProjectName, setNewProjectName] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isAddingFile, setIsAddingFile] = useState(false);

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      createProject(newProjectName.trim());
      setNewProjectName("");
      setIsAddingProject(false);
    }
  };

  const handleCreateFile = (e) => {
    e.preventDefault();
    if (newFileName.trim() && currentProject) {
      createFile(currentProject.id, newFileName.trim());
      setNewFileName("");
      setIsAddingFile(false);
    }
  };

  const handleDeleteFile = (fileId, e) => {
    e.stopPropagation();
    if (
      currentProject &&
      window.confirm("Are you sure you want to delete this file?")
    ) {
      deleteFile(currentProject.id, fileId);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>LaserDog</h2>
      </div>

      <div className="sidebar-section">
        <div className="section-header">
          <h3>Projects</h3>
          <button
            className="add-button"
            onClick={() => setIsAddingProject(!isAddingProject)}
          >
            {isAddingProject ? "×" : "+"}
          </button>
        </div>

        {isAddingProject && (
          <form onSubmit={handleCreateProject} className="add-form">
            <input
              type="text"
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              autoFocus
            />
            <button type="submit">Add</button>
          </form>
        )}

        <ul className="project-list">
          {projects.map((project) => (
            <li
              key={project.id}
              className={
                currentProject && project.id === currentProject.id
                  ? "active"
                  : ""
              }
              onClick={() => switchProject(project.id)}
            >
              {project.name}
            </li>
          ))}
          {projects.length === 0 && (
            <li className="empty-message">No projects yet</li>
          )}
        </ul>
      </div>

      {currentProject && (
        <div className="sidebar-section">
          <div className="section-header">
            <h3>Files</h3>
            <button
              className="add-button"
              onClick={() => setIsAddingFile(!isAddingFile)}
            >
              {isAddingFile ? "×" : "+"}
            </button>
          </div>

          {isAddingFile && (
            <form onSubmit={handleCreateFile} className="add-form">
              <input
                type="text"
                placeholder="File name"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                autoFocus
              />
              <button type="submit">Add</button>
            </form>
          )}

          <ul className="file-list">
            {currentProject.files.map((file) => (
              <li
                key={file.id}
                className={
                  file.id === currentProject.currentFile?.id ? "active" : ""
                }
                onClick={() => switchFile(file.id)}
              >
                {file.name}
                <button
                  className="delete-button"
                  onClick={(e) => handleDeleteFile(file.id, e)}
                >
                  ×
                </button>
              </li>
            ))}
            {currentProject.files.length === 0 && (
              <li className="empty-message">No files yet</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
