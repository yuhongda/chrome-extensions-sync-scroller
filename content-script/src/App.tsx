import React, { useEffect, useState, useRef } from 'react'
import { debounce } from 'lodash-es'
import './App.css'
import { Button, message } from 'antd'

function App() {
  const [enable, setEnable] = useState(false)

  useEffect(() => {
    const handleMouseUp = debounce(function (e: MouseEvent) {
      if (!enable) {
        return
      }
      const selection = window.getSelection()
      if (selection) {
        if (selection.toString()) {
          setText(selection.toString())
          show({
            event: e,
          })
        }
      }
    }, 500)

    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [enable])

  useEffect(() => {
    const handleMessage = (request: any, sender: any, sendResponse: any) => {
      if (request.text) {
        message.info(
          <>
            <strong>Translate it result:</strong>
            <div>{request.text}</div>
            <div>{request.result}</div>
          </>,
        )
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
