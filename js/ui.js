// ===== МОДУЛЬ UI =====

import { items, deleteItem, toggleCompleteToday, isCompletedToday } from './storage.js';
import { getStatus, getItemColor, getNextRepeatDate } from './tasks.js';  // ← добавили getNextRepeatDate

const todayList = document.getElementById('todayList');
const allItemsList = document.getElementById('allItemsList');

// ============================================================
// 1. РЕНДЕР СПИСКА "ПОВТОРИТЬ СЕГОДНЯ"
// ============================================================
export function renderTodayList() {
    todayList.innerHTML = '';
    let hasTodayTasks = false;

    items.forEach(item => {
        const status = getStatus(item);
        if (status === 'repeat') {
            hasTodayTasks = true;
            const color = getItemColor(item);
            const li = document.createElement('li');
            li.style.borderLeftColor = color;
            li.className = 'task-item';

            const checkboxId = `today-checkbox-${item.id}`;
            const isChecked = isCompletedToday(item);

            // Сколько раз уже повторяли
            const repeatCount = item.completedDates ? item.completedDates.length : 0;
            const repeatLabel = repeatCount === 0 ? 'Первое повторение' : `${repeatCount + 1}-е повторение`;

            li.innerHTML = `
                <div class="task-item">
                    <input type="checkbox" class="custom-checkbox" id="${checkboxId}" ${isChecked ? 'checked' : ''}>
                    <label for="${checkboxId}" class="checkbox-label"></label>
                    <div class="info">
                        <span class="topic">
                            <span class="color-preview" style="background-color: ${color};"></span>
                            ${item.text}
                        </span>
                        <span class="date">${repeatLabel} • Добавлено: ${new Date(item.studyDate).toLocaleDateString()}</span>
                    </div>
                    <button class="delete-btn" data-id="${item.id}">🗑️</button>
                </div>
            `;

            todayList.appendChild(li);
        }
    });

    if (!hasTodayTasks) {
        todayList.innerHTML = `
            <li style="background: #e9ecef; border-left-color: #6c757d;">
                ✨ Отлично! На сегодня повторений нет.
            </li>
        `;
    }

    // Чекбоксы
    document.querySelectorAll('.custom-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const id = Number(e.target.id.replace('today-checkbox-', ''));
            toggleCompleteToday(id);
            if (window.renderAll) window.renderAll();
        });
    });

    // Удаление
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number(e.target.dataset.id);
            deleteItem(id);
            if (window.renderAll) window.renderAll();
        });
    });
}

// ============================================================
// 2. РЕНДЕР СПИСКА "ВСЕ ТЕМЫ"
// ============================================================
export function renderAllItemsList() {
    allItemsList.innerHTML = '';

    const sorted = [...items].sort((a, b) => {
        const statusA = getStatus(a);
        const statusB = getStatus(b);
        if (statusA === 'repeat' && statusB !== 'repeat') return -1;
        if (statusB === 'repeat' && statusA !== 'repeat') return 1;
        if (statusA === 'completed-today' && statusB !== 'completed-today') return -1;
        if (statusB === 'completed-today' && statusA !== 'completed-today') return 1;
        return 0;
    });

    sorted.forEach(item => {
        const status = getStatus(item);
        const color = getItemColor(item);
        const li = document.createElement('li');
        li.style.borderLeftColor = color;
        li.className = 'task-item';

        const isChecked = isCompletedToday(item);
        const repeatCount = item.completedDates ? item.completedDates.length : 0;

        let badge = '';
        if (status === 'repeat') {
            badge = '<span class="status-badge">🔔 Повторить сегодня</span>';
        } else if (status === 'completed-today') {
            badge = '<span class="status-badge done">✅ Выполнено сегодня</span>';
        } else if (status === 'waiting') {
            const nextDate = getNextRepeatDate(item);
            if (nextDate) {
                const daysUntil = Math.ceil((nextDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                if (daysUntil > 0) {
                    badge = `<span class="status-badge waiting">⏳ Через ${daysUntil} дн.</span>`;
                } else {
                    badge = '<span class="status-badge waiting">⏳ Ожидает</span>';
                }
            } else {
                badge = '<span class="status-badge waiting">⏳ Ожидает</span>';
            }
        }

        // Информация о прогрессе повторений
        const stages = [1, 3, 7, 30];
        const totalStages = stages.length;
        const progressText = repeatCount < totalStages 
            ? `Повторение ${repeatCount + 1}/${totalStages}` 
            : '✅ Все повторения завершены!';

        li.innerHTML = `
            <div class="task-item">
                <input type="checkbox" class="custom-checkbox" id="all-checkbox-${item.id}" ${isChecked ? 'checked' : ''}>
                <label for="all-checkbox-${item.id}" class="checkbox-label"></label>
                <div class="info">
                    <span class="topic">
                        <span class="color-preview" style="background-color: ${color};"></span>
                        ${item.text}
                    </span>
                    <span class="date">${progressText} • ${new Date(item.studyDate).toLocaleDateString()}</span>
                </div>
                <div>
                    ${badge}
                    <button class="delete-btn" data-id="${item.id}">🗑️</button>
                </div>
            </div>
        `;

        allItemsList.appendChild(li);
    });

    // ===== ОБРАБОТЧИКИ ДЛЯ ЧЕКБОКСОВ В "ВСЕ ТЕМЫ" =====
    document.querySelectorAll('#allItemsList .custom-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const id = Number(e.target.id.replace('all-checkbox-', ''));
            toggleCompleteToday(id);
            if (window.renderAll) window.renderAll();
        });
    });

    // ===== ОБРАБОТЧИКИ ДЛЯ КНОПОК УДАЛЕНИЯ =====
    document.querySelectorAll('#allItemsList .delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number(e.target.dataset.id);
            deleteItem(id);
            if (window.renderAll) window.renderAll();
        });
    });
}