import {useEffect, useState} from 'react'

export const useDelayedState = (initialState: boolean, delayValue: number) => {
  const [animationState, setAnimationState] = useState(initialState)

  useEffect(() => {
    let timeoutReference: NodeJS.Timeout
    if (initialState) {
      setAnimationState(initialState)
    } else {
      timeoutReference = setTimeout(() => {
        setAnimationState(initialState)
      }, delayValue)
    }
    return () => clearTimeout(timeoutReference)
  }, [initialState, delayValue])

  return [animationState, setAnimationState]
}
