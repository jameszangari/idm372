/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "public/dist/js/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/scripts/ServiceWorker.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/scripts/ServiceWorker.js":
/*!**************************************!*\
  !*** ./src/scripts/ServiceWorker.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var CACHE_NAME = 'version-1'; // bump this version when you make changes.\n// Put all your urls that you want to cache in this array\n\nvar urlsToCache = ['/login', '/tos', '/privacy', '/register/profile', '/register/bio', '/register/images', '/register/anthem', '/register/artist', '/register/playlist', '/register/connected', '/browse', '/favicons/apple-icon.png']; // Install the service worker and open the cache and add files mentioned in array to cache\n\nself.addEventListener('install', function (event) {\n  console.log('Service Worker: Installing....');\n  event.waitUntil( // Open the cache\n  caches.open(CACHE_NAME).then(function (cache) {\n    console.log('Opened cache'); // Add files to the cache\n\n    return cache.addAll(urlsToCache);\n  }));\n}); // keep fetching the requests from the user\n\nself.addEventListener('fetch', function (event) {\n  event.respondWith(caches.match(event.request).then(function (response) {\n    // Cache hit - return response\n    if (response) return response;\n    return fetch(event.request);\n  }));\n});\nself.addEventListener('activate', function (event) {\n  console.log('Service Worker: Activating....');\n  var cacheWhitelist = []; // add cache names which you do not want to delete\n\n  cacheWhitelist.push(CACHE_NAME);\n  event.waitUntil(caches.keys().then(function (cacheNames) {\n    return Promise.all(cacheNames.map(function (cacheName) {\n      if (!cacheWhitelist.includes(cacheName)) {\n        return caches.delete(cacheName);\n      }\n    }));\n  }));\n});\n\n//# sourceURL=webpack:///./src/scripts/ServiceWorker.js?");

/***/ })

/******/ });