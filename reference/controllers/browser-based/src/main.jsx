import * as  React from 'react'
import * as ReactDOM from 'react-dom/client'
// import './index.css'
import { App } from './App.jsx'

// Import our custom CSS
import './scss/styles.scss'
// Import all of Bootstrap's JS
// import * as bootstrap from 'bootstrap'




// console.log('main')
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

