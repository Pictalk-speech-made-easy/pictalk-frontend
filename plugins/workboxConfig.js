workbox.routing.registerRoute(
  new RegExp('https://api\\.pictalk\\.org/image/pictalk/.*\\.(png|jpg|jpeg|gif|webp)'),
  //new RegExp('http://localhost:3001/image/pictalk/.*\\.(png|jpg|jpeg|gif)'),
  new workbox.strategies.CacheFirst({
    cacheName: 'pictos',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [200] }),
      new workbox.rangeRequests.RangeRequestsPlugin(),
    ],
    matchOptions: {
      ignoreSearch: false,
      ignoreVary: true
    }
  }),
);
