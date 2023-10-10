import React, { useEffect, useState, useRef } from 'react'
import { debounce } from 'lodash-es'
import './App.css'
import { Button, message } from 'antd'

function App() {
  const [enable, setEnable] = useState(false)

  useEffect(() => {
    const handleScroll = debounce(function (e: Event) {
      if (!enable) {
        return
      }

      chrome.runtime.sendMessage({ posY: window.scrollY }, function () {})
    }, 500)

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [enable])

  useEffect(() => {
    const handleGestureEnd = debounce(function (e: any) {
      if (!enable) {
        return
      }

      chrome.runtime.sendMessage({ scale: e.scale }, function () {})
    }, 500)

    window.addEventListener('gestureend', handleGestureEnd)
    return () => {
      window.removeEventListener('gestureend', handleGestureEnd)
    }
  }, [enable])

  useEffect(() => {
    const handleMessage = (request: any, sender: any, sendResponse: any) => {
      if (request.posY) {
        window.scrollTo({
          top: request.posY,
          left: 0,
          behavior: 'smooth',
        })
      }
      return true
    }
    chrome.runtime.onMessage.addListener(handleMessage)
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage)
    }
  }, [])

  useEffect(() => {
    chrome.storage.sync.get(['enable'], async function (result: any) {
      setEnable(result.enable)
    })
  }, [])

  return null
}

export default App
