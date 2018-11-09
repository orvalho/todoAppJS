'use strict';

const todoList = {
  todos: [],
  countTodos: function() {
    const totalTodos = this.todos.length;
    let completedTodos = 0;

    // count how many todos are completed
    this.todos.forEach(todo => {
      if(todo.completed) {
        completedTodos++;
      }
    });

    const leftTodos = totalTodos - completedTodos;

    return {
      totalTodos: totalTodos,
      completedTodos: completedTodos,
      leftTodos: leftTodos
    }
  },
  addTodo: function(todoText) {
    this.todos.push(
      {
        todoText: todoText,
        completed: false
      }
    );
  },
  toggleCompleted: function(position) {
    this.todos[position].completed = !this.todos[position].completed;
  },
  toggleAll: function() {
    const todosCount = this.countTodos();

    this.todos.forEach(todo => {
      // case 1: all items are completed -> uncheck all
      if(todosCount.totalTodos === todosCount.completedTodos) {
        todo.completed = false;
      }
      // case 2: some or none items are completed -> check all
      else {
        todo.completed = true;
      }
    });
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
    view.displayToggleAllCheckbox();
  },
  toggleCompleted: function(position) {
    todoList.toggleCompleted(position);
    view.displayTodo();
    view.displayToggleAllCheckbox();
  },
  toggleAll: function() {
    todoList.toggleAll();
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
      const todoLabel = document.createElement('label');
      todoLabel.className = 'todoText';
      todoLabel.textContent = todo.todoText;
      if(todo.completed === false) {
        todoLi.appendChild(this.createToggleCompletedCheckbox(false));
      } else {
        todoLi.appendChild(this.createToggleCompletedCheckbox(true));
        todoLi.className += ' completed';
      }
      todoLi.appendChild(todoLabel);
      todosUl.appendChild(todoLi);
    });
  },
  displayToggleAllCheckbox: function() {
    const toggleAllCheckbox = document.getElementById('toggleAllCheckbox');
    if(toggleAllCheckbox === null) {
      const addTodoContainer = document.getElementById('addTodoContainer');
      addTodoContainer.insertBefore(this.createToggleAllCheckbox(), addTodoContainer.childNodes[0]);
    }

    const todosCount = todoList.countTodos();
    todoList.todos.forEach(todo => {
      if(todosCount.totalTodos === todosCount.completedTodos) {
        document.getElementById('toggleAllCheckbox').checked = true;
      } else {
        document.getElementById('toggleAllCheckbox').checked = false;
      }
    });
  },
  createToggleCompletedCheckbox: function(isChecked) {
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.className = 'toggleCompletedCheckbox';
    checkbox.checked = isChecked;
    return checkbox;
  },
  createToggleAllCheckbox: function() {
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.id = 'toggleAllCheckbox';
    return checkbox;
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

    const todosUl = document.getElementById('todoItems');
    todosUl.addEventListener('click', function(e) {
      const elementClicked = e.target;
      switch(elementClicked.className) {
        //listener for checkbox to toggle completed state
        case 'toggleCompletedCheckbox':
          handlers.toggleCompleted(parseInt(elementClicked.parentNode.id));
          break;
      }
    });

    //listener for toggle all checkbox
    addTodoContainer.addEventListener('click', function(e) {
      if(e.target.id === 'toggleAllCheckbox') {
      handlers.toggleAll();
      }
    });
  }
};

view.setUpEventListeners();
