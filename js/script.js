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
  },
  deleteTodo: function(position) {
    this.todos.splice(position, 1);
  },
  deleteCompletedTodos: function() {
    for(let i = this.todos.length - 1; i > -1; i--) {
        if(this.todos[i].completed) {
          this.deleteTodo(i);
        }
    }
  },
  editTodo: function(position, todoText) {
    this.todos[position].todoText = todoText;
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
    view.displayFooter();
  },
  toggleAll: function() {
    todoList.toggleAll();
    view.displayTodo();
    view.displayFooter();
  },
  deleteTodo: function(position) {
    todoList.deleteTodo(position);
    view.displayTodo();
    view.displayToggleAllCheckbox();
    view.displayFooter();
  },
  showDeleteButton: function(position) {
    document.getElementsByClassName('deleteButton')[position].style.display = 'inline';
  },
  hideDeleteButton: function(position) {
    document.getElementsByClassName('deleteButton')[position].style.display = 'none';
  },
  deleteCompletedTodos: function() {
    todoList.deleteCompletedTodos();
    view.displayTodo();
    view.displayFooter();
    view.displayToggleAllCheckbox();
  },
  editTodo: function(position, todoText) {
    todoList.editTodo(position, todoText);
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
      todoLi.appendChild(this.createDeleteButton());
      todosUl.appendChild(todoLi);
    });
  },
  displayFooter: function() {
      const footer = document.getElementById('footer');
      const deleteCompletedButton = document.getElementById('deleteCompletedButton')
      const todosCount = todoList.countTodos();
      if(deleteCompletedButton === null && todosCount.completedTodos > 0) {
        footer.appendChild(this.createDeleteCompletedButton());
      } else if(deleteCompletedButton && todosCount.completedTodos === 0) {
        deleteCompletedButton.parentNode.removeChild(deleteCompletedButton);
      }
  },
  displayToggleAllCheckbox: function() {
    const toggleAllCheckbox = document.getElementById('toggleAllCheckbox');

    if(toggleAllCheckbox && todoList.todos.length === 0) {
      toggleAllCheckbox.parentNode.removeChild(toggleAllCheckbox);
    }

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
  createDeleteButton: function() {
    const deleteButton = document.createElement('button');
    deleteButton.className = 'deleteButton';
    deleteButton.textContent = 'Delete';
    return deleteButton;
  },
  createDeleteCompletedButton: function() {
    const deleteCompletedButton = document.createElement('button');
    deleteCompletedButton.id = 'deleteCompletedButton';
    deleteCompletedButton.textContent = 'Delete completed';
    return deleteCompletedButton;
  },
  createEditTodoInputField: function(value) {
    const editTodoInputField = document.createElement('input');
    editTodoInputField.setAttribute('type', 'text');
    editTodoInputField.className = 'editTodoInputField';
    editTodoInputField.value = value;
    return editTodoInputField;
  },
  replaceLabelWithEditTodoInputField: function (oldElement, oldElementValue) {
    const newElement = view.createEditTodoInputField(oldElementValue);
    oldElement.parentNode.replaceChild(newElement, oldElement);
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

    // prevent add todo input field from losing focus (except when existing todo is in process of editing)
    setInterval(function() {
        if(document.querySelector('.editTodoInputField') === null) {
          addTodoTextInput.focus();
        } else {
          document.querySelector('.editTodoInputField').focus();
        }
      }, 500);

    const todosUl = document.getElementById('todoItems');
    todosUl.addEventListener('click', function(e) {
      const elementClicked = e.target;
      switch(elementClicked.className) {
        //listener for checkbox to toggle completed state
        case 'toggleCompletedCheckbox':
          handlers.toggleCompleted(parseInt(elementClicked.parentNode.id));
          break;
        //listener for delete button to delete a single todo
        case 'deleteButton':
          handlers.deleteTodo(parseInt(elementClicked.parentNode.id));
          break;
      }
    });

    // show delete button when user mouseover li element or its children
    todosUl.addEventListener('mouseover', function(e) {
      const element = e.target;
      if(element.parentElement.classList.contains('todoItem')) {
        handlers.showDeleteButton(parseInt(element.parentElement.id));
      }
      if(element.classList.contains('todoItem')) {
        handlers.showDeleteButton(parseInt(element.id));
      }
    });
    // hide delete button when user mouseout li element or its children
    todosUl.addEventListener('mouseout', function(e) {
      const element = e.target;
      if(element.parentElement.classList.contains('todoItem')) {
        handlers.hideDeleteButton(parseInt(element.parentElement.id));
      }
      if(element.classList.contains('todoItem')) {
        handlers.hideDeleteButton(parseInt(element.id));
      }
    });

    //listener for toggle all checkbox
    addTodoContainer.addEventListener('click', function(e) {
      if(e.target.id === 'toggleAllCheckbox') {
      handlers.toggleAll();
      }
    });

    //listener for delete completed todos button
    footer.addEventListener('click', function(e) {
      if(e.target.id === 'deleteCompletedButton') {
        handlers.deleteCompletedTodos();
      }
    });

    todosUl.addEventListener('dblclick', function(e) {
      //listener for creating input field for editing when dbl clicking on todo text
      if(e.target.className === 'todoText') {
        view.replaceLabelWithEditTodoInputField(e.target, e.target.textContent);
      }
      //listener for creating input field for editing when dbl clicking on <li> itself
      if(e.target.classList.contains('todoItem')) {
        view.replaceLabelWithEditTodoInputField(e.target.querySelector('.todoText'), e.target.querySelector('.todoText').textContent);
      }
    });

    //listener for edit todo input field to update todo text on Enter keyup event
    todosUl.addEventListener('keyup', function(e) {
        if(e.target.className === 'editTodoInputField' && e.keyCode === 13) {
            handlers.editTodo(e.target.parentNode.id, e.target.value);
        }
    });

    //listener for edit todo input field to update todo text on focusout event
    todosUl.addEventListener('focusout', function(e) {
        if(e.target.className === 'editTodoInputField') {
            handlers.editTodo(e.target.parentNode.id, e.target.value);
        }
    });
  }
};

view.setUpEventListeners();
