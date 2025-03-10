import React, { useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { cn } from "../lib/utils";

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
    <div className="w-64 h-full border-r bg-card flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold mb-4">LaserDog</h1>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Projects</h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setIsAddingProject(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="sr-only">Add Project</span>
            </Button>
          </div>

          {isAddingProject ? (
            <form
              onSubmit={handleCreateProject}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Project name"
                autoFocus
                className="flex-1 px-2 py-1 text-sm border rounded-md"
              />
              <Button type="submit" size="sm" className="h-7">
                Add
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7"
                onClick={() => setIsAddingProject(false)}
              >
                Cancel
              </Button>
            </form>
          ) : null}

          <div className="space-y-1">
            {projects.map((project) => (
              <div
                key={project.id}
                className={cn(
                  "px-2 py-1.5 text-sm rounded-md cursor-pointer",
                  currentProject && currentProject.id === project.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted"
                )}
                onClick={() => switchProject(project.id)}
              >
                {project.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {currentProject && (
        <div className="p-4 flex-1 overflow-auto">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium">Files</h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setIsAddingFile(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="sr-only">Add File</span>
            </Button>
          </div>

          {isAddingFile ? (
            <form
              onSubmit={handleCreateFile}
              className="flex items-center space-x-2 mb-2"
            >
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="File name"
                autoFocus
                className="flex-1 px-2 py-1 text-sm border rounded-md"
              />
              <Button type="submit" size="sm" className="h-7">
                Add
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7"
                onClick={() => setIsAddingFile(false)}
              >
                Cancel
              </Button>
            </form>
          ) : null}

          <div className="space-y-1">
            {currentProject.files.map((file) => (
              <div
                key={file.id}
                className={cn(
                  "group px-2 py-1.5 text-sm rounded-md cursor-pointer flex items-center justify-between",
                  currentProject.currentFileId === file.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted"
                )}
                onClick={() => switchFile(currentProject.id, file.id)}
              >
                <span className="truncate">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                  onClick={(e) => handleDeleteFile(file.id, e)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
