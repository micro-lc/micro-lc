import {useEffect, useState} from 'react'

export const useDelayedState = (initialState: boolean, delayValue: number) => {
  const [animationState, setAnimationState] = useState(initialState)

  useEffect(() => {
    if (initialState) {
      setAnimationState(initialState)
    } else {
      setTimeout(() => {
        setAnimationState(initialState)
      }, delayValue)
    }
  }, [initialState, delayValue])

  return [animationState, setAnimationState]
}
