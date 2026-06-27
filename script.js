document.getElementById('addTaskBtn').addEventListener('click', addTask);

function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();

    if (taskText === '') {
        alert('Введите задачу!');
        return;
    }

    const list = document.getElementById('taskList');
    const li = document.createElement('li');
    li.textContent = taskText;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Удалить';
    deleteBtn.addEventListener('click', () => {
        list.removeChild(li);
    });

    li.appendChild(deleteBtn);
    list.appendChild(li);

    input.value = '';
}