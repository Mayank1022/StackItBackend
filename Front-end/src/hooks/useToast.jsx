"use client"

import React, { useState, useCallback } from "react"

const toasts = []
const listeners = []

let toastCount = 0

function genId() {
  toastCount = (toastCount + 1) % Number.MAX_VALUE
  return toastCount.toString()
}

const addToast = (toast) => {
  const id = genId()
  const newToast = { ...toast, id }
  toasts.push(newToast)
  listeners.forEach((listener) => listener([...toasts]))

  // Auto remove after 5 seconds
  setTimeout(() => {
    removeToast(id)
  }, 5000)

  return id
}

const removeToast = (id) => {
  const index = toasts.findIndex((toast) => toast.id === id)
  if (index > -1) {
    toasts.splice(index, 1)
    listeners.forEach((listener) => listener([...toasts]))
  }
}

export function useToast() {
  const [toastList, setToastList] = useState([...toasts])

  const subscribe = useCallback((listener) => {
    listeners.push(listener)
    return () => {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  React.useEffect(() => {
    return subscribe(setToastList)
  }, [subscribe])

  const toast = useCallback((props) => {
    return addToast(props)
  }, [])

  const dismiss = useCallback((id) => {
    removeToast(id)
  }, [])

  return {
    toast,
    dismiss,
    toasts: toastList,
  }
}
