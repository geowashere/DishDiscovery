import { toast, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const tsuccess = text => toast.success(text, options)
export const terror = text => toast.error(text, options)

export const twarn = (text, ...args) => {
  const setIsToastVisibleFunctions = args.filter(
    arg => typeof arg === 'function'
  )

  setIsToastVisibleFunctions.forEach(setIsToastVisible => {
    if (setIsToastVisible !== null) {
      setIsToastVisible(true)
    }
  })

  toast.warn(text, {
    ...warnOptions,
    onClose: () => {
      setIsToastVisibleFunctions.forEach(setIsToastVisible => {
        if (setIsToastVisible !== null) {
          setIsToastVisible(false)
        }
      })
    },
  })
}

const options = {
  position: 'top-right',
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'dark',
  transition: Slide,
}

const warnOptions = {
  position: 'top-right',
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'dark',
  transition: Slide,
}
