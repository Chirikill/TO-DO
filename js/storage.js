// ===== МОДУЛЬ ХРАНИЛИЩА =====

export let items = [];

export function loadItems() {
    const stored = localStorage.getItem('studyItems');
    items = stored ? JSON.parse(stored) : [];
    // Миграция: у старых задач добавляем completedDates, если нет
    items.forEach(item => {
        if (!item.completedDates) {
            item.completedDates = [];
        }
    });
    saveItems();
    return items;
}

export function saveItems() {
    localStorage.setItem('studyItems', JSON.stringify(items));
}

export function addItem(text, color) {
    const newItem = {
        id: Date.now(),
        text: text,
        color: color || '#3498db',
        studyDate: new Date().toISOString(),
        completedDates: []
    };
    items.push(newItem);
    saveItems();
    return newItem;
}

export function deleteItem(id) {
    items = items.filter(item => item.id !== id);
    saveItems();
}

export function toggleCompleteToday(id) {
    const item = items.find(item => item.id === id);
    if (!item) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString();

    const index = item.completedDates.indexOf(todayStr);
    if (index === -1) {
        item.completedDates.push(todayStr);
        console.log(`✅ Задача "${item.text}" выполнена на ${todayStr}`);
    } else {
        item.completedDates.splice(index, 1);
        console.log(`↩️ Отмена выполнения задачи "${item.text}" на ${todayStr}`);
    }
    saveItems();
}

export function isCompletedToday(item) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString();
    return item.completedDates.includes(todayStr);
}

loadItems();