let db;

const request = indexedDB.open("budgetDb", 1);

request.onupgradeneeded = function (event) {
  db = event.target.result;

  if (db.objectStoreNames.length === 0) {
    db.createObjectStore("pending", { autoIncrement: true });
  }
};

request.onerror = function (event) {
  console.log(`Oh no! ${event.target.errorCode}`);
};

request.onsuccess = function (event) {
  console.log("success!");
  db = event.target.result;

  if (navigator.online) {
    console.log("Backend is online!");
    checkDatabse();
  }
};

function saveRecord(record) {
  const transaction = db.transaction(["<object store name here>"], "readwrite");
  const store = transaction.objectStore("<object store name here>");
  store.add(record);
}

function checkDatabase() {
  const transaction = db.transaction(["<object store name here>"], "readwrite");
  const store = transaction.objectStore("<object store name here>");
  const getAll = store.getAll();
  //get all on success
  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then(() => {
          const transaction = db.transaction(
            ["<object store name here>"],
            "readwrite"
          );
          const store = transaction.objectStore("<object store name here>");
          store.clear();
        });
    }
  };
}
//
