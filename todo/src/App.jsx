import { useState } from 'react'
import './App.css'

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const addTodo = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    setTodos([...todos, input]);
    setInput('');
  };

  const removeTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div className="App">
      <h1>This is a TODO Application</h1>
    <div className="todo-app">
      <h2>USE HERE</h2>
      <form onSubmit={addTodo}>
        <input
          type="text"
          value={input}
          className="right-10 left-15 p-2 border border-gray-300 rounded"
          onChange={e => setInput(e.target.value)}
          placeholder="Add a new todo"
        />
        <button  className="p-3"type="submit">Add</button>
      </form>
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>
            {todo}  
            <button onClick={() => removeTodo(i)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
}

export default TodoApp;