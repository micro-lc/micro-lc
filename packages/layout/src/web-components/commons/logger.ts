export const error = (...data: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(...data)
  }
}
