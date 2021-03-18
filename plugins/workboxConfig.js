workbox.routing.registerRoute(
  new RegExp('https://apidev\\.pictalk\\.xyz/pictalk/images/.*\\.(png|jpg|jpeg)'),
  new workbox.strategies.CacheFirst({
    cacheName: 'pictos',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [200] }),
      new workbox.rangeRequests.RangeRequestsPlugin(),
    ],
  }),
  'GET'
);