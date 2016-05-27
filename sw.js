var files = [
  '/sw-test/',
  '/sw-test/index.html',
  '/sw-test/style.css',
  '/sw-test/app.js',
  '/sw-test/image-list.js',
  '/sw-test/star-wars-logo.jpg',
  '/sw-test/gallery/bountyHunters.jpg',
  '/sw-test/gallery/platzi.png',
  '/sw-test/gallery/snowTroopers.jpg'
];


this.addEventListener('install', function(event) {
  console.log("WORKER: install in progress", event);
  event.waitUntil(
    // v1: version
    caches
    .open('v1')
    .then(function(cache) { // API helps to caching responses
      console.info("WORKER: install complete");
      console.log("cache", cache);
      return cache
      .addAll(files);
    })
  );
});

this.addEventListener('fetch', function(event) {
  console.log("fetching...", event);
  var response;

  if (event.request.method !== 'GET') {
      console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);
      return;
    }

  event.respondWith(
    caches
    .match(event.request)
    .catch(function() {
      console.log("fetched request", fetch(event.request)) 
      return fetch(event.request);
  }).then(function(r) {
    console.log("fetch response", r);
    response = r;
    caches
    .open('v1')
    .then(function(cache) {
      cache
      .put(event.request, response);
    });
    console.log("result response", response.clone());
    return response.clone();
  }));

});


// self.addEventListener("activate", function(event) {
//   console.log('WORKER: activate event in progress.');

//   event.waitUntil(
//     caches
//       .keys()
//       .then(function (keys) {
//         return Promise.all(
//           keys
//             .filter(function (key) {
//               // Filter by keys that don't start with the latest version prefix.
//               return !key.startsWith(version);
//             })
//             .map(function (key) {
//               /* Return a promise that's fulfilled
//                  when each outdated cache is deleted.
//               */
//               return caches.delete(key);
//             })
//         );
//       })
//       .then(function() {
//         console.log('WORKER: activate completed.');
//       })
//   );
// });