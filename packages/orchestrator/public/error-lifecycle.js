/* eslint-disable no-undef */
let errorMessage
let reasonMessage
function fn(self) {
  Object.assign(
    self,
    {
      bootstrap: () => Promise.resolve(),
      mount: async ({ message, reason }) => {
        errorMessage = document.querySelector('#error-message')
        errorMessage && (errorMessage.textContent = message !== undefined ? message : 'Oops! Something went wrong')
        reasonMessage = document.querySelector('#reason-message')
        typeof reason === 'string' && reasonMessage && (reasonMessage.textContent = reason)
        return null
      },
      unmount: () => Promise.resolve(null),
      update: async ({ message, reason }) => {
        console.log(message, reason)
        errorMessage && (errorMessage.textContent = message !== undefined ? message : 'Oops! Something went wrong')
        typeof reason === 'string' && reasonMessage && (reasonMessage.textContent = reason)
        return null
      },
    }
  )
}
(function register(self, factory) {
  self.__MICRO_LC_ERROR = {}
  factory(self.__MICRO_LC_ERROR, self)
}(window, fn))
