import React, { useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import { generateTodoBreakdown } from "../services/aiService";
import "./SelectionToolbar.css";

const SelectionToolbar = () => {
  const {
    selectedTodoItems,
    setSelectedTodoItems,
    breakdownLevel,
    setBreakdownLevel,
    currentProject,
    currentFile,
    fileContent,
    saveFileContent,
  } = useAppContext();

  const [isGenerating, setIsGenerating] = useState(false);

  // Clear all selections
  const clearSelection = () => {
    setSelectedTodoItems([]);
  };

  // Generate breakdowns for selected todos
  const handleBreakdown = async () => {
    if (!currentProject || !currentFile || selectedTodoItems.length === 0)
      return;

    setIsGenerating(true);

    try {
      // Parse the current content to find the selected todos
      const lines = fileContent.split("\n");
      const selectedTodoTexts = [];

      // Extract the text of selected todos
      for (const id of selectedTodoItems) {
        const todoId = id.replace("todo-", "");
        const lineIndex = parseInt(todoId, 10);

        if (!isNaN(lineIndex) && lineIndex < lines.length) {
          const line = lines[lineIndex].trim();
          // Extract the text without the bullet
          const text = line.replace(/^[-*]\s+\[[ x]\]\s+/, "").trim();
          selectedTodoTexts.push({ id, text, lineIndex });
        }
      }

      // Generate breakdowns for each selected todo
      let newContent = fileContent;

      for (const todo of selectedTodoTexts) {
        const breakdown = await generateTodoBreakdown(
          todo.text,
          breakdownLevel
        );

        if (breakdown && breakdown.length > 0) {
          // Insert the breakdown under the todo
          const contentLines = newContent.split("\n");
          const indentation = contentLines[todo.lineIndex].match(/^\s*/)[0];
          const subIndentation = indentation + "  ";

          // Create the breakdown lines with proper indentation
          const breakdownLines = breakdown.map(
            (item) => `${subIndentation}- [ ] ${item}`
          );

          // Insert the breakdown after the todo
          contentLines.splice(todo.lineIndex + 1, 0, ...breakdownLines);
          newContent = contentLines.join("\n");
        }
      }

      // Save the updated content
      saveFileContent(newContent);

      // Clear selection after breakdown
      clearSelection();
    } catch (error) {
      console.error("Failed to generate breakdown:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="selection-toolbar">
      <button onClick={clearSelection}>
        Clear Selection ({selectedTodoItems.length})
      </button>

      <button onClick={handleBreakdown} disabled={isGenerating}>
        {isGenerating ? "Generating..." : "Break Down"}
      </button>

      <div className="breakdown-slider">
        <span>Level:</span>
        <input
          type="range"
          min="1"
          max="5"
          value={breakdownLevel}
          onChange={(e) => setBreakdownLevel(parseInt(e.target.value, 10))}
        />
        <span>{breakdownLevel}</span>
      </div>
    </div>
  );
};

export default SelectionToolbar;
