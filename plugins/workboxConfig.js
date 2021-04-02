var hasQuery = event.request.url.indexOf('?') != -1;
workbox.routing.registerRoute(
  new RegExp('https://apidev\\.pictalk\\.xyz/pictalk/image/.*\\.(png|jpg|jpeg|gif)'),
  new workbox.strategies.CacheFirst({
    cacheName: 'pictos',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [200] }),
      new workbox.rangeRequests.RangeRequestsPlugin(),
    ],
    matchOptions: {
      ignoreSearch: hasQuery,
      ignoreVary: true
    }
  }),
);