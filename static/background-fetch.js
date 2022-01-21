console.log('Custom service worker!');
if (!('BackgroundFetchManager' in self)) {
	console.log("Background manager not supported");
}
console.log(self.cookieStore.getAll());
self.registration.backgroundFetch.fetch();

// if jwt cookie, fetch pictos and collections. If 401 then wait for cookie change. If not, backgroundFetch all images and cache them.

// waitForCookieChange