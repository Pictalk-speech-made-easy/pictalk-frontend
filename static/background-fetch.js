//const apiUrl = 'https://api.pictalk.org'
const apiUrl = 'http://localhost:3001'
let pictogramList = [];

const bc = new BroadcastChannel('offline-ready');
const bc2 = new BroadcastChannel('sync');
var totalPictoImages = null;
var authenticated = false;
var broadcastProgressInterval = null;

if (!('BackgroundFetchManager' in self)) {
  console.log("Background manager not supported");
} else {
  checkAuthenticated(self);
}

function broadcastProgress() {
  bc.postMessage({ progress: pictogramList.length, total: totalPictoImages });
}

async function checkAuthenticated(self) {
  console.log("Check Authenticated");
  const cookies = await self.cookieStore.getAll();
  const token = cookies.filter((c) => c.name == 'jwt')[0]?.value;
  const tokenExp = cookies.filter((c) => c.name == 'expirationDate')[0]?.value;
  if (new Date().getTime() < +tokenExp && token) {
    authenticated = true;
    broadcastProgressInterval = setInterval(function () {
      broadcastProgress();
    }, 2000);
    pictogramList.concat(await checkMissingPictos(self, token));
    fetchFromList();
    setTimeout(function () {
      checkAuthenticated(self);
    }, 60000);
  } else {
    authenticated = false;
    clearInterval(broadcastProgressInterval);
    setTimeout(function () {
      checkAuthenticated(self);
    }, 5000);
  }
}

async function checkMissingPictos(self, token) {
  console.log("checkMissingPictos");
  let collections = await self.fetch(apiUrl + '/collection', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  collections = await collections.json();

  let pictos = await self.fetch(apiUrl + '/picto', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  pictos = await pictos.json();

  bc2.postMessage({ collections: collections, pictos: pictos });

  pictos = pictos.filter((picto) => picto.image != '' && picto.image);
  collections = collections.filter((collection) => collection.image != '' && collection.image);

  // Create list with only URLs of pictos and collections
  let allPictosAndCollections = pictos.map((picto) => apiUrl + '/image/pictalk/' + picto.image).concat(collections.map((collection) => apiUrl + '/image/pictalk/' + collection.image));

  // Remove all duplicatas
  allPictosAndCollections = allPictosAndCollections.filter(function (item, pos) {
    return allPictosAndCollections.indexOf(item) == pos;
  });

  let toFetchImages = [...allPictosAndCollections];
  pictogramList = await new Promise(function (resolve, reject) {
    caches.open("pictos").then(async (cache) => {
      allPictosAndCollections = await Promise.all(allPictosAndCollections.map((pictoOrCollection) =>
        cache.match(new Request(pictoOrCollection), {
          ignoreSearch: false,
          ignoreVary: true
        })
      ));
      allPictosAndCollections = allPictosAndCollections.map((resp) => resp?.url);
      totalPictoImages = allPictosAndCollections.length;
      allPictosAndCollections.forEach((cacheRequest) => {
        if (toFetchImages.indexOf(cacheRequest) != -1) {
          toFetchImages[toFetchImages.indexOf(cacheRequest)] = toFetchImages[toFetchImages.length - 1];
          toFetchImages.pop();
        }
      });
      const filteredToFetchImages = toFetchImages.filter(element => {
        return element !== undefined;
      });
      resolve(filteredToFetchImages);
    }).catch((err) => {
      reject(err);
    });
  });
}

async function fetchFromList() {
  console.log("fetchFromList");
  if (!authenticated) {
    return;
  }
  let toFetchPictos = [];
  for (let i = 0; ((i < 10) && (i < pictogramList.length)); i++) {
    toFetchPictos.push(pictogramList.pop());
  }
  if (toFetchPictos.length != 0) {
    caches.open("pictos").then(async (cache) => {
      try {
        if (navigator.onLine) {
          await cache.addAll(toFetchPictos);
          bc.postMessage({ progress: pictogramList.length, total: totalPictoImages });
          fetchFromList();
        }
      } catch (err) {
        console.log(err);
        if (err?.response?.status === 401) {
          totalPictoImages = null;
          pictogramList = [];
        } else {
          setTimeout(function () {
            fetchFromList();
          }, 10000);
        }
      }
    });
  }
}
