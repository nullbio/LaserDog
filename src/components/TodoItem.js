import React, { useState } from "react";
import "./TodoItem.css";

const TodoItem = ({
  todo,
  onToggle,
  onUpdate,
  onDelete,
  onSelect,
  isSelected,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleEdit = () => {
    setEditText(todo.text);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  // Generate a preview of nested items
  const generatePreview = () => {
    if (!todo.items || todo.items.length === 0) return null;

    const previewItems = todo.items.map((item) => {
      // Truncate long item texts
      const truncatedText =
        item.text.length > 20 ? item.text.substring(0, 20) + "..." : item.text;
      return truncatedText;
    });

    // Limit to 3 items in the preview
    const displayItems = previewItems.slice(0, 3);
    const hasMore = previewItems.length > 3;

    return (
      <div className="todo-preview">
        {displayItems.join(", ")}
        {hasMore && ` and ${previewItems.length - 3} more...`}
      </div>
    );
  };

  return (
    <div className={`todo-item ${isSelected ? "selected" : ""}`}>
      <div className="todo-item-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={onToggle}
          className="todo-checkbox"
        />

        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            autoFocus
            className="todo-edit-input"
          />
        ) : (
          <div className="todo-text-container">
            <span
              className={`todo-text ${todo.completed ? "completed" : ""}`}
              onClick={onSelect}
            >
              {todo.text}
            </span>

            <div className="todo-actions">
              <button
                className="todo-action-button edit-button"
                onClick={handleEdit}
                title="Edit"
              >
                ✎
              </button>
              <button
                className="todo-action-button delete-button"
                onClick={onDelete}
                title="Delete"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {todo.items && todo.items.length > 0 && (
          <button
            className={`expand-button ${isExpanded ? "expanded" : ""}`}
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? "▼" : "►"}
          </button>
        )}
      </div>

      {!isExpanded && todo.items && todo.items.length > 0 && generatePreview()}
    </div>
  );
};

export default TodoItem;
