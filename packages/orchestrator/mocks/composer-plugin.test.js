/* eslint-disable no-shadow */
/* eslint-disable no-undef */
function fn(exports, _) {
  Object.assign(exports, {
    async bootstrap() {
      return Promise.resolve(null)
    },

    async mount() {
      return Promise.resolve(null)
    },

    async unmount() {
      return Promise.resolve(null)
    },

    async update() {
      return Promise.resolve(null)
    },
  })
}

(function register(global, factory) {
  global.__MICRO_LC_COMPOSER = {}
  factory(global.__MICRO_LC_COMPOSER, global)
}(window, fn))
