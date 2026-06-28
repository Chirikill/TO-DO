// ===== МОДУЛЬ ЗАДАЧ =====

function normalizeDate(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

export function addDays(date, days) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}

// ============================================================
// ФИКСИРОВАННЫЕ ДАТЫ ПОВТОРЕНИЙ (от studyDate)
// ============================================================

// Получить ВСЕ даты повторений (фиксированные!)
export function getRepeatDates(item) {
    const stages = [0, 1, 4, 11, 41];
    const studyDate = normalizeDate(item.studyDate);
    const dates = [];
    
    stages.forEach(days => {
        dates.push(normalizeDate(addDays(studyDate, days)));
    });
    
    return dates;
}

// Получить следующую дату повторения (которая ещё не выполнена)
export function getNextRepeatDate(item) {
    const today = normalizeDate(new Date());
    const allDates = getRepeatDates(item);
    
    // Находим первую дату, которая ещё не выполнена
    for (const date of allDates) {
        const dateStr = date.toISOString();
        if (!item.completedDates.includes(dateStr)) {
            // Если дата уже прошла → показываем сегодня
            if (date.getTime() <= today.getTime()) {
                return today;
            }
            return date;
        }
    }
    
    // Все даты выполнены
    return null;
}

export function getStatus(item) {
    const today = normalizeDate(new Date());
    const todayStr = today.toISOString();

    // 1. Проверяем, выполнена ли задача сегодня
    if (item.completedDates.includes(todayStr)) {
        return 'completed-today';
    }

    // 2. Проверяем, есть ли сегодня повторение (по фиксированному расписанию)
    const allDates = getRepeatDates(item);
    for (const date of allDates) {
        if (date.getTime() === today.getTime()) {
            const dateStr = date.toISOString();
            if (!item.completedDates.includes(dateStr)) {
                return 'repeat';
            }
        }
    }

    return 'waiting';
}

// Получить задачи на конкретную дату (для календаря)
export function getTasksForDate(date, items) {
    const target = normalizeDate(date);
    const result = [];

    items.forEach(item => {
        const dates = getRepeatDates(item);
        dates.forEach(d => {
            if (d.getTime() === target.getTime()) {
                const dateStr = d.toISOString();
                // Показываем задачу, если она ещё не выполнена на эту дату
                if (!item.completedDates.includes(dateStr)) {
                    result.push(item);
                }
            }
        });
    });

    return result;
}

// Получить цвета для даты (для календаря)
export function getColorsForDate(date, items) {
    const target = normalizeDate(date);
    const colors = new Set();

    items.forEach(item => {
        const dates = getRepeatDates(item);
        dates.forEach(d => {
            if (d.getTime() === target.getTime()) {
                const dateStr = d.toISOString();
                if (!item.completedDates.includes(dateStr)) {
                    colors.add(getItemColor(item));
                }
            }
        });
    });

    return Array.from(colors);
}

export function getItemColor(item) {
    return item.color || '#3498db';
}