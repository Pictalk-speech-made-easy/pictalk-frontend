apiUrl = 'https://apidev.pictalk.org'
checkAuthenticated(self);
async function checkAuthenticated(self) {
	const cookies = await self.cookieStore.getAll();
	const token = cookies.filter((c) => c.name == 'jwt')[0]?.value;
	const tokenExp = cookies.filter((c) => c.name == 'expirationDate')[0]?.value;

	if (new Date().getTime() < +tokenExp && token) {
		checkMissingPictosAndFetch(self, token);
	}
	setTimeout(function () {
		checkAuthenticated(self);
	}, 60000);
}

async function checkMissingPictosAndFetch(self, token) {
	if (!('BackgroundFetchManager' in self)) {
		console.log("Background manager not supported");
	}

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
	let allPictosAndCollections = pictos.map((picto) => apiUrl + '/image/pictalk/' + picto.image).concat(collections.map((collection) => apiUrl + '/image/pictalk/' + collection.image));
	allPictosAndCollections = allPictosAndCollections.filter(function (item, pos) {
		return allPictosAndCollections.indexOf(item) == pos;
	});

	let toFetchImages = [...allPictosAndCollections];
	caches.open("pictos").then(async (cache) => {
		await Promise.all(allPictosAndCollections.map((pictoOrCollection) =>
			cache.match(new Request(pictoOrCollection.image), {
				ignoreSearch: false,
				ignoreVary: true
			})
		));

		allPictosAndCollections.forEach((cacheRequest) => { toFetchImages[toFetchImages.indexOf(cacheRequest)] = toFetchImages[toFetchImages.length - 1]; toFetchImages.pop(); });

		try {
			console.log(toFetchImages.length);
			if (navigator.onLine) {
				await cache.addAll(toFetchImages);
			}
			//await Promise.all(allPictosAndCollections.map((image) => cache.add(image)));
		} catch (err) {
			console.log(err);
		}
	});
}
//


// waitForCookieChange