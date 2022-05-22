const apiUrl = 'https://api.pictalk.org'
//const apiUrl = 'http://localhost:3001'
let pictogramList = [];
checkAuthenticated(self);
async function checkAuthenticated(self) {
  const cookies = await self.cookieStore.getAll();
  const token = cookies.filter((c) => c.name == 'jwt')[0]?.value;
  const tokenExp = cookies.filter((c) => c.name == 'expirationDate')[0]?.value;
  let counter = 30;
  if (new Date().getTime() < +tokenExp && token) {
    if (counter <= 30) {
      counter = 0;
      pictogramList.concat(await checkMissingPictos(self, token));
    }
    fetchFromList();
    counter++
  }
  if (!('BackgroundFetchManager' in self)) {
    console.log("Background manager not supported");
  } else {
    setTimeout(function () {
      checkAuthenticated(self);
    }, 2000);
  }
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
      resolve(toFetchImages);
    }).catch((err) => {
      reject(err);
    });
  });
}

async function fetchFromList() {
  let toFetchPictos = [];
  console.log(pictogramList);
  for (let i = 0; i < 10; i++) {
    toFetchPictos.push(pictogramList.pop());
  }
  console.log(pictogramList);
  console.log(toFetchPictos);
  caches.open("pictos").then(async (cache) => {
    try {
      if (navigator.onLine) {
        await cache.addAll(toFetchPictos);
      }
      //await Promise.all(allPictosAndCollections.map((image) => cache.add(image)));
    } catch (err) {
      console.log(err);
    }
  });
}
