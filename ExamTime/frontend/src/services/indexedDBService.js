const DB_NAME = 'ExamTimeDB';
const DB_VERSION = 1;
const STORE_NAME = 'answers_store';

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = (event) => reject(event.target.error);
        request.onsuccess = (event) => resolve(event.target.result);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
    });
}

export async function saveAnswersToDB(id, data) {
    if (!id) return;
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put({ id, timestamp: Date.now(), data });
            request.onsuccess = () => resolve();
            request.onerror = (e) => reject(e.target.error);
        });
    } catch(e) {
        console.error('Loi luu IndexedDB:', e);
    }
}

export async function getAnswersFromDB(id) {
    if (!id) return null;
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(id);
            request.onsuccess = (event) => {
                const result = event.target.result;
                resolve(result ? result.data : null);
            };
            request.onerror = (e) => reject(e.target.error);
        });
    } catch(e) {
        console.error('Loi doc IndexedDB:', e);
        return null;
    }
}

export async function clearAnswersFromDB(id) {
    if (!id) return;
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = (e) => reject(e.target.error);
        });
    } catch(e) {
        console.error('Loi xoa IndexedDB:', e);
    }
}
