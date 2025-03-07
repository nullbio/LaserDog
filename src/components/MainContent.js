import React from "react";
import { useAppContext } from "../contexts/AppContext";
import TodoList from "./TodoList";
import "./MainContent.css";

const MainContent = () => {
  const { currentProject, currentFile, fileContent, saveFileContent } =
    useAppContext();

  // Handle content changes based on file type
  const handleContentChange = (content) => {
    saveFileContent(content);
  };

  // If no project or file is selected, show a welcome message
  if (!currentProject || !currentFile) {
    return (
      <div className="main-content empty-state">
        <h2>Welcome to LaserDog</h2>
        <p>Select a project or create a new one to get started.</p>
      </div>
    );
  }

  // Render different content based on file type
  const renderContent = () => {
    if (currentFile.type === "todo") {
      return <TodoList content={fileContent} onChange={handleContentChange} />;
    } else {
      // For other file types, render a simple text editor
      return (
        <textarea
          className="file-editor"
          value={fileContent}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Start typing..."
        />
      );
    }
  };

  return (
    <div className="main-content">
      <div className="file-header">
        <h2>{currentFile.name}</h2>
        <span className="project-name">{currentProject.name}</span>
      </div>
      {renderContent()}
    </div>
  );
};

export default MainContent;
