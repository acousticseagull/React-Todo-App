import React, {useState, useEffect, useMemo} from 'react';

function Ago ({date}) {
  const then = new Date(date);
  const now = new Date();
  const seconds = Math.round((now - then) / 1000);
  const minutes = Math.round(seconds / 60);

  return <small style={{
      fontSize: '.8rem',
      color: '#BDC3C7'
    }}>
    {seconds < 5 ? 
    'just now' 
    : seconds < 60 ? 
    seconds + 'seconds ago' 
    : seconds < 90 ? 'about a minute ago'
    : minutes < 60 ? minutes + ' minutes ago' : ''}
  </small>;
};

export default function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    setTodos(JSON.parse(localStorage.getItem('todos')));
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const add = (e) => {
    e.preventDefault();
    const description = e.target.description;
    const value = description.value;
    if (!value.length) return;
    setTodos(s => [...s, {
      id: Date.now(),
      description: value,
      createdOn: new Date(),
      done: false
    }]);
    description.focus();
    description.value = '';
  };

  const remove = () => {
    setTodos(s => s.filter(item => !item.done));
  };

  const done = (id) => {
    setTodos(s => s.map(item => {
      if (item.id == id) {
        return {
          ...item,
          done: !item.done
        };
      }
      return item;
    }))
  };

  const doneTodos = useMemo(() => {
    return todos.filter(item => item.done);
  }, [todos]);

  const todoCount = useMemo(() => todos.filter(item => !item.done).length);

  const Form = () => {
    return <form style={{
        border: '1px solid #626567',
        padding: '.5rem',
        borderRadius: '.25rem',
        display: 'flex'
      }} 
      onSubmit={(e) => add(e)}>
        <input style={{
          flexGrow: 1,
          border: 'none',
          outline: 'none',
          fontSize: '1.25rem'
        }}
        placeholder="What do you want to do?"
        type="text" name="description" />
        <button style={{
          border: 'none',
          backgroundColor: '#3498DB',
          color: '#EBF5FB',
          borderRadius: '.25rem',
          padding: '.5rem 1rem',
          cursor: 'pointer',
          fontSize: '1.25rem'
        }} type="submit">Add</button>
      </form>
  };

  return (
    <div>
      <h1 style={{
        textAlign: 'center',
        marginBottom: 0,
        fontSize: '3.5rem'
      }}>Todo List</h1>

      <p style={{
        textAlign: 'center',
        marginTop: 0,
        fontSize: '1.25rem'
      }}>
        You have {todoCount > 0 ? <strong>{todoCount}</strong> : 'no'} {todoCount == 1 ? 'todo' : 'todos'}  left to complete
      </p>

      <Form />

      <ul style={{
        fontSize: '1.25rem',
        padding: 0,
        listStyle: 'none',
        margin: '2rem 0 0',
        borderBottom: '1px solid #BDC3C7',
      }}>
        {
          todos.map(item => 
            <li key={item.id} style={{
                textDecoration: item.done ? 'line-through' : 'none',
                color: item.done ? '#BDC3C7' : 'inherit',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                borderTop: '1px solid #BDC3C7',
                padding: '.5rem 0'
              }}>
              <input style={{
                height: '1.25rem',
                width: '1.25rem',
                marginRight: '.5rem'
              }}
              type="checkbox" id={'todo' + item.id} checked={item.done} onChange={() => done(item.id)} />
              <label style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexGrow: 1,
                cursor: 'pointer'
              }} htmlFor={'todo' + item.id}>
                <span>{item.description}</span>
                <Ago date={item.createdOn} />
              </label>
            </li>
          )
        }
      </ul>

      {doneTodos.length ?
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button style={{
            border: 'none',
            backgroundColor: '#E74C3C',
            color: '#FDEDEC',
            borderRadius: '.25rem',
            padding: '.5rem 1rem',
            cursor: 'pointer',
            fontSize: '1.25rem',
            marginTop: '2rem'
          }}
          type="button" onClick={() => remove()}>Remove {doneTodos.length} completed</button>
        </div>
        : ''
      }
    </div>
  );
}
