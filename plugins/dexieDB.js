import Dexie from 'dexie';

let username = 'default';
if (process.client) {
  const data = JSON.parse(window.localStorage.getItem('pictalk-data'));
  if (data?.user.username) {
    username = data.user.username;
  }
}
export const db = new Dexie(`pictalk-${username}`);
db.version(1).stores({
  pictogram: 'id, fatherCollectionId, public, userId',
  collection: 'id, collection, fatherCollectionId, partial, public, userId',
});
db.open().catch(function (e) {
  console.error("Open failed: " + e.stack);
})


