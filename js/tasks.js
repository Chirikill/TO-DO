// ===== МОДУЛЬ ЗАДАЧ =====

export function addDays(date, days) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}

// Получить дату последнего выполнения задачи
function getLastCompletedDate(item) {
    if (!item.completedDates || item.completedDates.length === 0) {
        return null;
    }
    const sorted = [...item.completedDates].sort();
    return new Date(sorted[sorted.length - 1]);
}

// Получить следующую дату повторения
export function getNextRepeatDate(item) {
    const stages = [1, 3, 7, 30];
    const lastDate = getLastCompletedDate(item);
    
    if (!lastDate) {
        const studyDate = new Date(item.studyDate);
        studyDate.setHours(0, 0, 0, 0);
        return addDays(studyDate, 1);
    }

    const completedCount = item.completedDates.length;
    const nextStageIndex = Math.min(completedCount, stages.length - 1);
    const daysToAdd = stages[nextStageIndex];
    
    return addDays(lastDate, daysToAdd);
}

// Получить статус задачи на сегодня
export function getStatus(item) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayStr = today.toISOString();
    if (item.completedDates.includes(todayStr)) {
        return 'completed-today';
    }

    const nextDate = getNextRepeatDate(item);
    if (nextDate && nextDate.getTime() === today.getTime()) {
        return 'repeat';
    }

    return 'waiting';
}

// Получить ВСЕ даты повторений (для календаря)
export function getRepeatDates(item) {
    const stages = [1, 3, 7, 30];
    const dates = [];
    
    // Если задача полностью завершена (все 4 повторения сделаны)
    if (item.completedDates && item.completedDates.length >= stages.length) {
        return dates; // Возвращаем пустой массив — больше нет повторений
    }

    // Начинаем с даты изучения
    let currentDate = new Date(item.studyDate);
    currentDate.setHours(0, 0, 0, 0);

    // Если есть выполненные повторения — начинаем с последней выполненной даты
    if (item.completedDates && item.completedDates.length > 0) {
        const sorted = [...item.completedDates].sort();
        const lastCompleted = new Date(sorted[sorted.length - 1]);
        lastCompleted.setHours(0, 0, 0, 0);
        currentDate = lastCompleted;
    }

    // Определяем, сколько повторений уже сделано
    const completedCount = item.completedDates ? item.completedDates.length : 0;
    
    // Берём интервалы, начиная с того, который ещё не использован
    // Если completedCount = 0 → берём все интервалы [1, 3, 7, 30]
    // Если completedCount = 1 → берём [3, 7, 30] (первое уже сделано)
    // Если completedCount = 2 → берём [7, 30] и т.д.
    const remainingStages = stages.slice(completedCount);
    
    // Строим даты для оставшихся повторений
    let nextDate = currentDate;
    remainingStages.forEach(days => {
        nextDate = addDays(nextDate, days);
        dates.push(nextDate);
    });

    return dates;
}

// Получить задачи на конкретную дату (для календаря)
export function getTasksForDate(date, items) {
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    const result = [];

    items.forEach(item => {
        const dates = getRepeatDates(item);
        dates.forEach(d => {
            if (d.getTime() === target.getTime()) {
                const dateStr = d.toISOString();
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
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
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