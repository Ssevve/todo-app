const form = document.querySelector('form');
const formInput = document.querySelector('.form-input');
const todoContainer = document.querySelector('.todo-container');

let todos = [];

function addTodo(text) {
	const todo = {
		id: Date.now().toString(),
		text,
		completed: false,
	};

	todos.push(todo);
	storeTodos();
	return todo;
}

function renderTodo(todo) {
	const markup = `
      <div class="todo" data-todoid="${todo.id}">
        <input id="todo-${todo.id}" class="todo-checkbox" type="checkbox" />
        <label class="clickable" for="todo-${todo.id}">
          <span class="custom-checkbox"></span>
          <div class="text-fields">
            <span class="todo-text">${todo.text}</span>
            <input class="todo-edit-field hide" type="text" />
          </div>
        </label>
        <div class="todo-buttons">
          <button class="btn btn-edit"><i class="far fa-edit"></i></button>
          <button class="btn btn-delete">
            <i class="far fa-trash-alt"></i>
          </button>
        </div>
      </div>
    `;

	todoContainer.insertAdjacentHTML('beforeend', markup);
}

function deleteTodo(id) {
	const todo = findTodo(id);
	todo.remove();

	const index = todos.findIndex((todo) => todo.id === id);
	todos.splice(index, 1);

	storeTodos();
}

function toggleEdit(id) {
	const todo = findTodo(id);
	const editField = todo.querySelector('.todo-edit-field');
	const textField = todo.querySelector('.todo-text');
	const label = todo.querySelector('label');
	const checkbox = todo.querySelector('.todo-checkbox');
	const customCheckbox = todo.querySelector('.custom-checkbox');

	todo.classList.toggle('edit-mode');
	editField.value = textField.textContent;
	editField.classList.toggle('hide');
	textField.classList.toggle('hide');
	label.classList.toggle('clickable');
	customCheckbox.classList.toggle('invisible');

	if (checkbox.disabled) {
		checkbox.disabled = false;
		checkbox.style.cursor = 'pointer';
	} else {
		checkbox.disabled = true;
		checkbox.style.cursor = 'default';
		editField.focus();
	}
}

function findTodo(id) {
	const allTodos = Array.from(document.querySelectorAll('.todo'));
	return allTodos.find((el) => el.dataset.todoid === id);
}

function storeTodos() {
	localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
	todos = JSON.parse(localStorage.getItem('todos')) || [];
	todos.forEach((todo) => renderTodo(todo));
}

function clearTodos() {
	todoContainer.innerHTML = '';
}

function crossOutCompleted(todo) {
	const id = todo.id;
	const domTodo = document.querySelector(`[data-todoid="${id}"]`);
	const label = domTodo.querySelector('label');
	const btnEdit = domTodo.querySelector('.btn-edit');
	const checkbox = domTodo.querySelector('.todo-checkbox');

	if (todo.completed) {
		label.classList.remove('completed');
		label.classList.add('completed');
		btnEdit.classList.remove('completed');
		btnEdit.classList.add('completed');
		checkbox.checked = true;
	} else {
		label.classList.remove('completed');
		btnEdit.classList.remove('completed');
		checkbox.checked = false;
	}
}

window.addEventListener('load', () => {
	clearTodos();
	loadTodos();
	todos.forEach((todo) => {
		crossOutCompleted(todo);
	});
});

form.addEventListener('submit', (e) => {
	e.preventDefault();
	const todo = addTodo(formInput.value);
	renderTodo(todo);
	formInput.value = '';
});

todoContainer.addEventListener('click', (e) => {
	const id = e.target.closest('.todo').dataset.todoid;
	if (e.target.matches('.btn-delete, .btn-delete *')) {
		deleteTodo(id);
	}

	if (e.target.matches('.btn-edit, .btn-edit *')) {
		toggleEdit(id);
	}
});

todoContainer.addEventListener('change', (e) => {
	const id = e.target.closest('.todo').dataset.todoid;
	const todo = todos.find((todo) => todo.id === id);
	if (e.target.matches('.todo-checkbox')) {
		if (e.target.checked) {
			todo.completed = true;
			crossOutCompleted(todo);
			storeTodos();
		} else {
			todo.completed = false;
			crossOutCompleted(todo);
			storeTodos();
		}
	}
});

todoContainer.addEventListener('focusout', (e) => {
	const textField = e.target.previousElementSibling;
	const id = e.target.closest('.todo').dataset.todoid;
	const todo = todos.find((todo) => todo.id === id);

	if (e.target.matches('.todo-edit-field')) {
		textField.textContent = e.target.value;
		todo.text = e.target.value;
		storeTodos();
	}
});
