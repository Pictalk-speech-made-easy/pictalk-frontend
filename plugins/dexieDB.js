export let db;
if (process.client) {
  const Dexie = require('dexie').Dexie;
  let username = 'default';
  const data = JSON.parse(window.localStorage.getItem('pictalk-data'));
  if (data?.user.username) {
    username = data.user.username;
  }
  db = new Dexie(`pictalk-${username}`);
  db.version(1).stores({
    pictogram: 'id, fatherCollectionId, public, userId',
    collection: 'id, collection, fatherCollectionId, partial, public, userId',
  });
  db.open().catch(function (e) {
    console.error("Open failed: " + e.stack);
  });
}

export function createDatabaseForUser(username) {
  const Dexie = require('dexie').Dexie;
  db = new Dexie(`pictalk-${username}`);
  db.version(1).stores({
    pictogram: 'id, fatherCollectionId, public, userId',
    collection: 'id, collection, fatherCollectionId, partial, public, userId',
  });
  return db.open();
}