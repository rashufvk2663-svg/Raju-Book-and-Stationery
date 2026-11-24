const DB_NAME = "RajuBookStationery";
const DB_VERSION = 1;

let db;

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = event => {
      const database = event.target.result;

      const stores = [
        "products",
        "purchases",
        "sales",
        "weeklyStock",
        "settings",
        "transactions"
      ];

      stores.forEach(name => {
        if (!database.objectStoreNames.contains(name)) {
          database.createObjectStore(name, {
            keyPath: "id",
            autoIncrement: true
          });
        }
      });
    };

    request.onsuccess = event => {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = () => reject(request.error);
  });
}

function saveRecord(storeName, record) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const request = transaction.objectStore(storeName).put(record);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getAllRecords(storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const request = transaction.objectStore(storeName).getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function deleteRecord(storeName, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const request = transaction.objectStore(storeName).delete(id);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}
