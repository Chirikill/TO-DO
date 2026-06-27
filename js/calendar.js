// ===== МОДУЛЬ КАЛЕНДАРЯ =====
// Отвечает за рендер календаря, навигацию и клики по дням

import { items } from './storage.js';
import { getTasksForDate, getColorsForDate, getItemColor } from './tasks.js';  // ← ДОБАВЛЯЕМ getItemColor!

export let currentMonth = new Date().getMonth();
export let currentYear = new Date().getFullYear();
export let selectedDate = null;

const container = document.getElementById('calendarContainer');
const title = document.getElementById('calendarTitle');
const dayTasksContainer = document.getElementById('dayTasksContainer');
const dayTasksList = document.getElementById('dayTasksList');
const selectedDateLabel = document.getElementById('selectedDateLabel');

// Рендер календаря
export function renderCalendar() {
    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    title.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1);
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let html = '<div class="calendar-grid">';
    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    weekDays.forEach(day => {
        html += `<div class="calendar-weekday">${day}</div>`;
    });

    // Пустые ячейки до первого дня месяца
    let startOffset = (firstDay.getDay() === 0) ? 6 : firstDay.getDay() - 1;
    for (let i = 0; i < startOffset; i++) {
        html += '<div class="calendar-day"></div>';
    }

    // Ячейки дней
    for (let day = 1; day <= daysInMonth; day++) {
        const dateObj = new Date(currentYear, currentMonth, day);
        dateObj.setHours(0, 0, 0, 0);

        const isToday = dateObj.getTime() === today.getTime();
        const tasks = getTasksForDate(dateObj, items);
        const hasTask = tasks.length > 0;
        const isSelected = selectedDate && dateObj.getTime() === selectedDate.getTime();

        // Получаем цвета для этого дня
        const colors = getColorsForDate(dateObj, items);

        let classes = 'calendar-day';
        if (isToday) classes += ' today';
        if (hasTask) classes += ' has-task';
        if (isSelected) classes += ' selected';

        // Создаём точки с цветами
        let dotsHtml = '';
        if (colors.length > 0) {
            dotsHtml = `<div class="task-dots">`;
            // Показываем максимум 3 точки, остальные — как +N
            const displayColors = colors.slice(0, 3);
            const remaining = colors.length - 3;
            displayColors.forEach(color => {
                dotsHtml += `<span class="dot" style="background-color: ${color};"></span>`;
            });
            if (remaining > 0) {
                dotsHtml += `<span class="dot" style="background-color: #999; font-size: 8px; display: inline-flex; align-items: center; justify-content: center; width: 12px; height: 12px; border-radius: 50%; color: white; background-color: #999;">+${remaining}</span>`;
            }
            dotsHtml += `</div>`;
        }

        html += `
            <div class="${classes}"
                 data-year="${currentYear}"
                 data-month="${currentMonth}"
                 data-day="${day}">
                ${day}
                ${dotsHtml}
            </div>
        `;
    }

    html += '</div>';
    container.innerHTML = html;

    // Навешиваем обработчики на дни
    document.querySelectorAll('.calendar-day[data-day]').forEach(el => {
        el.addEventListener('click', () => {
            const year = Number(el.dataset.year);
            const month = Number(el.dataset.month);
            const day = Number(el.dataset.day);
            selectedDate = new Date(year, month, day);
            selectedDate.setHours(0, 0, 0, 0);
            renderCalendar();
            renderDayTasks(selectedDate);
        });
    });

    // Восстанавливаем задачи на выбранный день, если он в этом месяце
    if (selectedDate) {
        if (selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear) {
            renderDayTasks(selectedDate);
        } else {
            dayTasksContainer.classList.remove('visible');
        }
    } else {
        dayTasksContainer.classList.remove('visible');
    }
}

// Отображение задач на выбранный день
export function renderDayTasks(date) {
    const tasks = getTasksForDate(date, items);

    const dateStr = date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    selectedDateLabel.textContent = dateStr;

    dayTasksList.innerHTML = '';
    if (tasks.length === 0) {
        dayTasksList.innerHTML = `
            <li style="border-left-color: #6c757d; color: #888;">
                📭 Нет задач на этот день
            </li>
        `;
    } else {
        tasks.forEach(item => {
            const li = document.createElement('li');
            const color = getItemColor(item);  // ← теперь getItemColor импортирован!
            li.style.borderLeftColor = color;
            li.textContent = item.text;
            dayTasksList.appendChild(li);
        });
    }

    dayTasksContainer.classList.add('visible');
}

// Навигация по месяцам
export function goToPrevMonth() {
    if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
    } else {
        currentMonth--;
    }
    selectedDate = null;
    renderCalendar();
}

export function goToNextMonth() {
    if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
    } else {
        currentMonth++;
    }
    selectedDate = null;
    renderCalendar();
}
