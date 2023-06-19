import React, { useState } from "react";
import { create } from "zustand";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type State = {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, newText: string) => void;
};

const useStore = create<State>((set) => ({
  todos: [],
  addTodo: (text) =>
    set((state) => ({
      todos: [
        ...state.todos,
        { id: state.todos.length, text, completed: false },
      ],
    })),
  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    })),
  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),
  editTodo: (id, newText) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      ),
    })),
}));

const TodoList = () => {
  const [text, setText] = useState("");
  const todos = useStore((state) => state.todos);
  const addTodo = useStore((state) => state.addTodo);
  const toggleTodo = useStore((state) => state.toggleTodo);
  const deleteTodo = useStore((state) => state.deleteTodo);
  const editTodo = useStore((state) => state.editTodo);

  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <div className="p-4">
      <input
        className="border rounded p-2 mr-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            addTodo(event.currentTarget.value);
            event.currentTarget.value = "";
          }
        }}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          addTodo(text);
          setText("");
        }}
      >
        Add Todo
      </button>

      <ul className="list-disc mt-4">
        {todos.map((todo) => (
          <li key={todo.id}>
            <label className="flex items-center">
              <input
                className="mr-2"
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              {editingId === todo.id ? (
                <>
                  <input
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    // onBlur={() => {
                    //   editTodo(todo.id, newText);
                    //   setEditingId(null);
                    // }}
                  />
                  <button
                    onClick={() => {
                      editTodo(todo.id, newText);
                      setEditingId(null);
                    }}
                    className="bg-green-400 hover:bg-green-500 text-white rounded p-1"
                  >
                    Save
                  </button>
                </>
              ) : (
                <span className={todo.completed ? "line-through" : ""}>
                  {todo.text}
                  <button
                    onClick={() => {
                      setEditingId(todo.id);
                      setNewText(todo.text);
                    }}
                    className="bg-green-400 hover:bg-green-500 text-white rounded p-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="bg-red-400 hover:bg-red-500 text-white rounded p-1"
                  >
                    Delete
                  </button>
                </span>
              )}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
