// ===== ГЛАВНЫЙ МОДУЛЬ =====

import { addItem } from './storage.js';
import { renderCalendar, goToPrevMonth, goToNextMonth } from './calendar.js';
import { renderTodayList, renderAllItemsList } from './ui.js';

window.renderAll = function() {
    renderCalendar();
    renderTodayList();
    renderAllItemsList();
};

document.getElementById('addBtn').addEventListener('click', () => {
    const input = document.getElementById('topicInput');
    const colorSelect = document.getElementById('colorSelect');
    const text = input.value.trim();

    if (text === '') {
        alert('Введите тему!');
        return;
    }

    addItem(text, colorSelect.value);
    input.value = '';
    colorSelect.value = '#3498db';
    window.renderAll();
});

document.getElementById('topicInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('addBtn').click();
    }
});

document.getElementById('prevMonthBtn').addEventListener('click', goToPrevMonth);
document.getElementById('nextMonthBtn').addEventListener('click', goToNextMonth);

window.renderAll();

console.log('📚 Приложение "Интервальное повторение" запущено!');