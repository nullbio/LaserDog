import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useAppContext } from "../contexts/AppContext";
import TodoItem from "./TodoItem";
import SelectionToolbar from "./SelectionToolbar";
import "./TodoList.css";

// Parse the todo content into a hierarchical structure
const parseTodoContent = (content) => {
  const lines = content.split("\n");
  const todos = [];
  let currentIndent = 0;
  let currentParent = { items: todos, level: 0 };
  const stack = [currentParent];

  // Skip the title line if it starts with #
  const startIndex = lines[0]?.startsWith("#") ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Count the indent level (number of spaces at the beginning)
    const indent = lines[i].search(/\S|$/);
    const indentLevel = Math.floor(indent / 2);

    // Check if it's a todo item (starts with - or * or number.)
    if (line.match(/^[-*]\s+/) || line.match(/^\d+\.\s+/)) {
      // Extract the text without the bullet
      const text = line.replace(/^[-*]\d+\.\s+/, "").trim();

      // Create the todo item
      const todoItem = {
        id: `todo-${i}`,
        text,
        completed: line.includes("[x]"),
        items: [],
        level: indentLevel,
      };

      // Adjust the stack based on indent level
      if (indentLevel > currentIndent) {
        // Going deeper
        stack.push(currentParent);
        currentParent =
          stack[stack.length - 1].items[
            stack[stack.length - 1].items.length - 1
          ];
      } else if (indentLevel < currentIndent) {
        // Going back up
        while (indentLevel < stack[stack.length - 1].level) {
          stack.pop();
        }
        currentParent = stack[stack.length - 1];
      }

      currentIndent = indentLevel;
      currentParent.items.push(todoItem);
    }
  }

  return todos;
};

// Convert the hierarchical structure back to text
const todoToContent = (todos, level = 0) => {
  let content = "";
  const indent = " ".repeat(level * 2);

  todos.forEach((todo) => {
    const bullet = todo.completed ? "- [x]" : "- [ ]";
    content += `${indent}${bullet} ${todo.text}\n`;

    if (todo.items && todo.items.length > 0) {
      content += todoToContent(todo.items, level + 1);
    }
  });

  return content;
};

const TodoList = ({ content, onChange }) => {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState("");
  const { selectedTodoItems, setSelectedTodoItems } = useAppContext();

  // Parse the content into todos when it changes
  useEffect(() => {
    const parsedTodos = parseTodoContent(content);
    setTodos(parsedTodos);
  }, [content]);

  // Update the content when todos change
  const updateContent = (newTodos) => {
    const title = content.split("\n")[0]?.startsWith("#")
      ? content.split("\n")[0] + "\n\n"
      : "# Todo List\n\n";

    const newContent = title + todoToContent(newTodos);
    onChange(newContent);
  };

  // Handle adding a new todo
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    const newTodo = {
      id: `todo-${Date.now()}`,
      text: newTodoText,
      completed: false,
      items: [],
      level: 0,
    };

    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    updateContent(newTodos);
    setNewTodoText("");
  };

  // Handle toggling a todo's completed state
  const handleToggleTodo = (id) => {
    const toggleTodoRecursive = (items) => {
      return items.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }
        if (todo.items && todo.items.length > 0) {
          return { ...todo, items: toggleTodoRecursive(todo.items) };
        }
        return todo;
      });
    };

    const newTodos = toggleTodoRecursive(todos);
    setTodos(newTodos);
    updateContent(newTodos);
  };

  // Handle updating a todo's text
  const handleUpdateTodo = (id, newText) => {
    const updateTodoRecursive = (items) => {
      return items.map((todo) => {
        if (todo.id === id) {
          return { ...todo, text: newText };
        }
        if (todo.items && todo.items.length > 0) {
          return { ...todo, items: updateTodoRecursive(todo.items) };
        }
        return todo;
      });
    };

    const newTodos = updateTodoRecursive(todos);
    setTodos(newTodos);
    updateContent(newTodos);
  };

  // Handle deleting a todo
  const handleDeleteTodo = (id) => {
    const deleteTodoRecursive = (items) => {
      return items.filter((todo) => {
        if (todo.id === id) {
          return false;
        }
        if (todo.items && todo.items.length > 0) {
          todo.items = deleteTodoRecursive(todo.items);
        }
        return true;
      });
    };

    const newTodos = deleteTodoRecursive(todos);
    setTodos(newTodos);
    updateContent(newTodos);

    // Remove from selection if selected
    if (selectedTodoItems.includes(id)) {
      setSelectedTodoItems(selectedTodoItems.filter((itemId) => itemId !== id));
    }
  };

  // Handle selecting/deselecting a todo
  const handleSelectTodo = (id) => {
    if (selectedTodoItems.includes(id)) {
      setSelectedTodoItems(selectedTodoItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedTodoItems([...selectedTodoItems, id]);
    }
  };

  // Handle drag and drop
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Helper function to find a todo by path
    const findTodoByPath = (path, items) => {
      const [index, ...rest] = path;
      if (rest.length === 0) {
        return items[index];
      }
      return findTodoByPath(rest, items[index].items);
    };

    // Helper function to remove a todo by path
    const removeTodoByPath = (path, items) => {
      const [index, ...rest] = path;
      if (rest.length === 0) {
        const [removed] = items.splice(index, 1);
        return removed;
      }
      const removed = removeTodoByPath(rest, items[index].items);
      return removed;
    };

    // Helper function to insert a todo at path
    const insertTodoAtPath = (path, items, todo) => {
      const [index, ...rest] = path;
      if (rest.length === 0) {
        items.splice(index, 0, todo);
        return;
      }
      insertTodoAtPath(rest, items[index].items, todo);
    };

    // Parse the paths
    const sourcePath = source.droppableId.split("-").map(Number);
    const destPath = destination.droppableId.split("-").map(Number);

    // Clone the todos
    const newTodos = JSON.parse(JSON.stringify(todos));

    // Remove from source
    const todoToMove = removeTodoByPath(
      [...sourcePath, source.index],
      newTodos
    );

    // Insert at destination
    insertTodoAtPath([...destPath, destination.index], newTodos, todoToMove);

    // Update state and content
    setTodos(newTodos);
    updateContent(newTodos);
  };

  // Render the todo items recursively
  const renderTodos = (items, path = []) => {
    return (
      <Droppable droppableId={path.join("-")} type={`list-${path.length}`}>
        {(provided) => (
          <ul
            className="todo-list"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {items.map((todo, index) => (
              <Draggable key={todo.id} draggableId={todo.id} index={index}>
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TodoItem
                      todo={todo}
                      onToggle={() => handleToggleTodo(todo.id)}
                      onUpdate={(text) => handleUpdateTodo(todo.id, text)}
                      onDelete={() => handleDeleteTodo(todo.id)}
                      onSelect={() => handleSelectTodo(todo.id)}
                      isSelected={selectedTodoItems.includes(todo.id)}
                    />
                    {todo.items &&
                      todo.items.length > 0 &&
                      renderTodos(todo.items, [...path, index])}
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    );
  };

  return (
    <div className="todo-list-container">
      <DragDropContext onDragEnd={handleDragEnd}>
        {renderTodos(todos)}
      </DragDropContext>

      <form className="add-todo-form" onSubmit={handleAddTodo}>
        <input
          type="text"
          placeholder="Add a new todo..."
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
        />
        <button type="submit">+</button>
      </form>

      {selectedTodoItems.length > 0 && <SelectionToolbar />}
    </div>
  );
};

export default TodoList;
