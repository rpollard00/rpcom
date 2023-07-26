import { useCallback, useEffect, useState, createContext } from 'react'

type Toast = (toast: string) => void
const ToastContext = createContext<Toast>(() => "hello")

export default ToastContext

export const ToastContextProvider = ({children}: {children: JSX.Element}) => {
  const [toasts, setToasts] = useState<Array<string>>([]);

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => setToasts(toasts => toasts.slice(1)),
      3000)
      return () => clearTimeout(timer)
    }
  },[toasts])

  const addToast = useCallback(
    function(toast: string) {
      setToasts(toasts => [ ...toasts, toast])
    },
  [setToasts])

  const value: Toast = addToast

   return (
    <ToastContext.Provider value={value}>
    {children}
    <div className="fixed bottom-[1rem] left-[1rem] rounded-">
      {
      toasts.map(toast => { return (
        <div className="text-black w-fit h-[2-rem] border-solid border-2 border-red-500 bg-red-300 rounded-sm p-1 m-3" key={toast}>
          {toast}
        </div>
      )})
      }
    </div>
    </ToastContext.Provider>
  )
}
