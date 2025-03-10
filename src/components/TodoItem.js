import React, { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { cn } from "../lib/utils";

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
      <div className="text-xs text-muted-foreground mt-1 pl-8">
        {displayItems.join(", ")}
        {hasMore && ` and ${previewItems.length - 3} more...`}
      </div>
    );
  };

  return (
    <Card
      className={cn(
        "mb-2 overflow-hidden border-l-4",
        isSelected ? "border-l-primary shadow-md" : "border-l-transparent",
        todo.completed ? "bg-muted/50" : "bg-card"
      )}
    >
      <div className="p-3 flex items-start gap-2">
        <div className="pt-1">
          <Checkbox checked={todo.completed} onCheckedChange={onToggle} />
        </div>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              autoFocus
              className="w-full px-2 py-1 text-sm border rounded-md"
            />
          ) : (
            <div className="flex items-start justify-between gap-2">
              <span
                className={cn(
                  "text-sm cursor-pointer",
                  todo.completed ? "text-muted-foreground line-through" : ""
                )}
                onClick={onSelect}
              >
                {todo.text}
              </span>

              <div className="flex items-center shrink-0 space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  onClick={handleEdit}
                  title="Edit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={onDelete}
                  title="Delete"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
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
                </Button>
              </div>
            </div>
          )}
        </div>

        {todo.items && todo.items.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse" : "Expand"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(
                "transition-transform",
                isExpanded ? "rotate-180" : ""
              )}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </Button>
        )}
      </div>

      {!isExpanded && todo.items && todo.items.length > 0 && generatePreview()}
    </Card>
  );
};

export default TodoItem;
