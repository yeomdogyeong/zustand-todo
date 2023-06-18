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
}));

const TodoList = () => {
  const [text, setText] = useState("");
  const todos = useStore((state) => state.todos);
  const addTodo = useStore((state) => state.addTodo);
  const toggleTodo = useStore((state) => state.toggleTodo);

  return (
    <div className="p-4">
      <input
        className="border rounded p-2 mr-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
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
              <span className={todo.completed ? "line-through" : ""}>
                {todo.text}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
