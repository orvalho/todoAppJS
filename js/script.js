'use strict';

const todoList = {
  todos: [],
  addTodo: function(todoText) {
    this.todos.push(
      {
        todoText: todoText
      }
    );
  }
};

const handlers = {
  addTodo: function() {
    const addTodoTextInput = document.getElementById('addTodoTextInput');
    //check if input is not empty before creating a new todo
    if(addTodoTextInput.value.trim() !== '') {
      todoList.addTodo(addTodoTextInput.value.trim()); //trim input
    }
    addTodoTextInput.value = ''; //clear input
    view.displayTodo();
  }
};

const view = {
  displayTodo: function() {
    const todosUl = document.getElementById('todoItems');
    //clear todos shown on a screen before looping through todo list
    todosUl.textContent = '';
    todoList.todos.forEach((todo, position) => {
      const todoLi = document.createElement('li');
      todoLi.className = 'todoItem';
      todoLi.id = position;
      todoLi.textContent = todo.todoText;
      todosUl.appendChild(todoLi);
    });
  },
  setUpEventListeners: function() {

    //listener for button which user clicks to add a new todo
    const addTodoButton = document.getElementById('addTodoButton');
    addTodoButton.addEventListener('click', function() {
      handlers.addTodo();
    });

    //listener for enter key on input field where user writes to add a new todo
    addTodoTextInput.addEventListener('keyup', function(e) {
      if(e.keyCode === 13) {
        handlers.addTodo();
      }
    });

    //listener for input field to prevent it from losing focus
    addTodoTextInput.addEventListener('blur', function() {
      setTimeout(function() {
        addTodoTextInput.focus();
      }, 20);
    });

  }
};

view.setUpEventListeners();
