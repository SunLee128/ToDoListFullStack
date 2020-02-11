import React, { Component } from 'react';
import TodoItem from './TodoItem'
import TodoForm from './TodoForm'

const APIURL = '/api/todos/';

class ToDoList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      todos: []
    };
  }

  componentWillMount () {
    this.loadTodos();
  }

  loadTodos () {
    fetch(APIURL)
    .then(resp => {
      if (!resp.ok) {
        if (resp.status >= 400 && resp.status < 500) {
          return resp.json().then(data => {
            const err = { errorMessage: data.message };
            throw err;
          });
        } else {
          const err = { errorMessage: 'Please try again later, server is not responding' };
          throw err;
        }
      }
      return resp.json();
    })
    .then(todos => this.setState({ todos }));
  }

  addTodo = (val) => {
    fetch(APIURL,{
      method: 'post',
      headers: new Headers({
        'Content-Type' : 'application/json'
      }),
      body: JSON.stringify({name: val})
    })
    .then(resp => {
      if (!resp.ok) {
        if (resp.status >= 400 && resp.status < 500) {
          return resp.json().then(data => {
            const err = { errorMessage: data.message };
            throw err;
          });
        } else {
          const err = { errorMessage: 'Please try again later, server is not responding' };
          throw err;
        }
      }
      return resp.json();
    })
    .then(newTodo => {
      this.setState({todos: [...this.state.todos, newTodo]})
    })
  }

  deleteTodo(id) {
    const deleteURL = APIURL + id
    fetch(deleteURL,{
      method: 'delete',
    })
    .then(resp => {
      if (!resp.ok) {
        if (resp.status >= 400 && resp.status < 500) {
          return resp.json().then(data => {
            const err = { errorMessage: data.message };
            throw err;
          });
        } else {
          const err = { errorMessage: 'Please try again later, server is not responding' };
          throw err;
        }
      }
      return resp.json();
    })
    .then(()=> {
      const todos = this.state.todos.filter(todo=> todo._id !== id )
      this.setState({todos: todos})
    })
  }

  render () {
    const todos = this.state.todos.map((t) =>(
      <TodoItem
        key={t._id}
        {...t}
        onDelete = {this.deleteTodo.bind(this, t._id)}
      />
    ))
    return (
      <div>
        <h1>To Do List</h1>
        <TodoForm addTodo={this.addTodo}/>
        <ul>
          {todos}
        </ul>
      </div>
    );
  }
}

export default ToDoList;
