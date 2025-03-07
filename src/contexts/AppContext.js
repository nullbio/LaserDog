import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

// Create context
const AppContext = createContext();

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // State for projects and files
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [fileHistory, setFileHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // UI state
  const [sidebarPosition, setSidebarPosition] = useState("left");
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [selectedTodoItems, setSelectedTodoItems] = useState([]);
  const [breakdownLevel, setBreakdownLevel] = useState(3); // Default level for AI breakdown

  // API keys for LLM services
  const [apiKeys, setApiKeys] = useState({});

  // Load projects on initial render
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectsData = await window.api.getProjects();
        setProjects(projectsData);

        // If there are projects, select the first one
        if (projectsData.length > 0) {
          setCurrentProject(projectsData[0]);

          // Load files for the first project
          const files = await window.api.getProjectFiles(projectsData[0].id);
          if (files.length > 0) {
            // Find the todo file or use the first file
            const todoFile =
              files.find((file) => file.type === "todo") || files[0];
            setCurrentFile(todoFile);
            setFileContent(todoFile.content);

            // Initialize history with the current content
            setFileHistory([todoFile.content]);
            setHistoryIndex(0);
          }
        }
      } catch (error) {
        console.error("Failed to load projects:", error);
      }
    };

    loadProjects();
  }, []);

  // Save file content with history tracking
  const saveFileContent = useCallback(
    async (content) => {
      if (!currentProject || !currentFile) return;

      try {
        await window.api.saveFileContent({
          projectId: currentProject.id,
          fileId: currentFile.id,
          content,
        });

        // Update the content state
        setFileContent(content);

        // Add to history if content is different from the last entry
        if (fileHistory[historyIndex] !== content) {
          // Remove any forward history if we're not at the end
          const newHistory = fileHistory.slice(0, historyIndex + 1);
          newHistory.push(content);
          setFileHistory(newHistory);
          setHistoryIndex(newHistory.length - 1);
        }
      } catch (error) {
        console.error("Failed to save file content:", error);
      }
    },
    [currentProject, currentFile, fileHistory, historyIndex]
  );

  // Undo/Redo functionality
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setFileContent(fileHistory[newIndex]);

      // Save the content to the file
      if (currentProject && currentFile) {
        window.api.saveFileContent({
          projectId: currentProject.id,
          fileId: currentFile.id,
          content: fileHistory[newIndex],
        });
      }
    }
  }, [historyIndex, fileHistory, currentProject, currentFile]);

  const redo = useCallback(() => {
    if (historyIndex < fileHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setFileContent(fileHistory[newIndex]);

      // Save the content to the file
      if (currentProject && currentFile) {
        window.api.saveFileContent({
          projectId: currentProject.id,
          fileId: currentFile.id,
          content: fileHistory[newIndex],
        });
      }
    }
  }, [historyIndex, fileHistory, currentProject, currentFile]);

  // Create a new project
  const createProject = useCallback(async (projectName) => {
    try {
      const newProject = await window.api.createProject(projectName);
      setProjects((prev) => [...prev, newProject]);
      return newProject;
    } catch (error) {
      console.error("Failed to create project:", error);
      return null;
    }
  }, []);

  // Create a new file
  const createFile = useCallback(async (projectId, fileName, fileType) => {
    try {
      const newFile = await window.api.createFile({
        projectId,
        fileName,
        fileType,
      });

      // Update projects state with the new file
      setProjects((prev) => {
        return prev.map((project) => {
          if (project.id === projectId) {
            return {
              ...project,
              files: [...project.files, newFile],
            };
          }
          return project;
        });
      });

      return newFile;
    } catch (error) {
      console.error("Failed to create file:", error);
      return null;
    }
  }, []);

  // Delete a file
  const deleteFile = useCallback(
    async (projectId, fileId) => {
      try {
        const success = await window.api.deleteFile({
          projectId,
          fileId,
        });

        if (success) {
          // Update projects state by removing the file
          setProjects((prev) => {
            return prev.map((project) => {
              if (project.id === projectId) {
                return {
                  ...project,
                  files: project.files.filter((file) => file.id !== fileId),
                };
              }
              return project;
            });
          });

          // If the current file is being deleted, select another file
          if (currentFile && currentFile.id === fileId) {
            const project = projects.find((p) => p.id === projectId);
            if (project && project.files.length > 1) {
              const newCurrentFile = project.files.find(
                (file) => file.id !== fileId
              );
              setCurrentFile(newCurrentFile);
              setFileContent(newCurrentFile.content);

              // Reset history
              setFileHistory([newCurrentFile.content]);
              setHistoryIndex(0);
            } else {
              setCurrentFile(null);
              setFileContent("");
              setFileHistory([]);
              setHistoryIndex(-1);
            }
          }
        }

        return success;
      } catch (error) {
        console.error("Failed to delete file:", error);
        return false;
      }
    },
    [currentFile, projects]
  );

  // Update settings
  const updateSettings = useCallback(async (settings) => {
    try {
      await window.api.updateSettings(settings);

      // Update local state
      if (settings.sidebarPosition) {
        setSidebarPosition(settings.sidebarPosition);
      }

      if (settings.apiKeys) {
        setApiKeys(settings.apiKeys);
      }

      return true;
    } catch (error) {
      console.error("Failed to update settings:", error);
      return false;
    }
  }, []);

  // Switch to a different project
  const switchProject = useCallback(
    async (projectId) => {
      const project = projects.find((p) => p.id === projectId);
      if (!project) return false;

      setCurrentProject(project);

      try {
        const files = await window.api.getProjectFiles(projectId);
        if (files.length > 0) {
          // Find the todo file or use the first file
          const todoFile =
            files.find((file) => file.type === "todo") || files[0];
          setCurrentFile(todoFile);
          setFileContent(todoFile.content);

          // Reset history
          setFileHistory([todoFile.content]);
          setHistoryIndex(0);
        } else {
          setCurrentFile(null);
          setFileContent("");
          setFileHistory([]);
          setHistoryIndex(-1);
        }

        return true;
      } catch (error) {
        console.error("Failed to switch project:", error);
        return false;
      }
    },
    [projects]
  );

  // Switch to a different file
  const switchFile = useCallback(
    async (fileId) => {
      if (!currentProject) return false;

      const file = currentProject.files.find((f) => f.id === fileId);
      if (!file) return false;

      setCurrentFile(file);
      setFileContent(file.content);

      // Reset history
      setFileHistory([file.content]);
      setHistoryIndex(0);

      return true;
    },
    [currentProject]
  );

  // Context value
  const contextValue = {
    // State
    projects,
    currentProject,
    currentFile,
    fileContent,
    sidebarPosition,
    isSettingsPanelOpen,
    selectedTodoItems,
    breakdownLevel,
    apiKeys,

    // Setters
    setProjects,
    setCurrentProject,
    setCurrentFile,
    setFileContent,
    setSidebarPosition,
    setIsSettingsPanelOpen,
    setSelectedTodoItems,
    setBreakdownLevel,
    setApiKeys,

    // Actions
    saveFileContent,
    undo,
    redo,
    createProject,
    createFile,
    deleteFile,
    updateSettings,
    switchProject,
    switchFile,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
