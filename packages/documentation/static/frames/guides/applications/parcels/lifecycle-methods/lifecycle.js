function registerLifecycle(self) {
  Object.assign(
    self,
    {
      bootstrap: () => Promise.resolve(null),
      mount: () => Promise.resolve(null),
      unmount: () => Promise.resolve(null),
      update: () => Promise.resolve(null),
    }
  )
}

// 👇 https://dontkry.com/posts/code/browserify-and-the-universal-module-definition.html
(function register(self, factory) {
  self.__MY_PARCEL = {}
  factory(self.__MICRO_LC_ERROR, self)
}(window, registerLifecycle))
