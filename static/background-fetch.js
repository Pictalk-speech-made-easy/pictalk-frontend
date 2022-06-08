const apiUrl = 'https://api.pictalk.org'
//const apiUrl = 'http://localhost:3001'
let pictogramList = [];
checkAuthenticated(self);
async function checkAuthenticated(self) {
  const cookies = await self.cookieStore.getAll();
  const token = cookies.filter((c) => c.name == 'jwt')[0]?.value;
  const tokenExp = cookies.filter((c) => c.name == 'expirationDate')[0]?.value;
  if (new Date().getTime() < +tokenExp && token) {
    pictogramList.concat(await checkMissingPictos(self, token));
    fetchFromList();
  }
}
if (!('BackgroundFetchManager' in self)) {
  console.log("Background manager not supported");
} else {
  setTimeout(function () {
    checkAuthenticated(self);
  }, 60000);
}

async function checkMissingPictos(self, token) {
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
      allPictosAndCollections.forEach((cacheRequest) => {
        if (toFetchImages.indexOf(cacheRequest) != -1) {
          toFetchImages[toFetchImages.indexOf(cacheRequest)] = toFetchImages[toFetchImages.length - 1];
          toFetchImages.pop();
        }
      });
      resolve(toFetchImages.filter(element => {
        return element !== undefined;
      }));
    }).catch((err) => {
      reject(err);
    });
  });
}

async function fetchFromList() {
  let toFetchPictos = [];
  for (let i = 0; ((i < 10) && (i < pictogramList.length)); i++) {
    toFetchPictos.push(pictogramList.pop());
  }
  caches.open("pictos").then(async (cache) => {
    try {
      if (navigator.onLine) {
        await cache.addAll(toFetchPictos);
        fetchFromList()
      }
    } catch (err) {
      console.log(err);
      setTimeout(function () {
        fetchFromList();
      }, 10000);
    }
  });
}
