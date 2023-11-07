import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const body = document.querySelector('body')
const app = document.createElement('div')
const APP_ID = '__chrome_extension_sync_scroller__'

app.id = APP_ID
if (body) {
  body.prepend(app)
}

const container = document.getElementById(APP_ID)
const root = ReactDOM.createRoot(container!)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
