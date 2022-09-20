((global: Window) => {
  Object.defineProperty(
    global,
    'purehtml',
    {
      value: {
        bootstrap: () => {
          console.log('purehtml bootstrap')
          return Promise.resolve()
        },
        mount: () => {
          console.log('purehtml mount')
        },
        unmount: () => {
          console.log('purehtml unmount')
          return Promise.resolve()
        },
      },
    }
  )
})(window)
