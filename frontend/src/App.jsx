import { useState } from 'react'
import './App.css'

function App() {
  const [text, setText] = useState('')
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

  const handleSave = async (path) => {
    setLoading(true)
    setMessage(null)
    try {
      const response = await fetch(`${apiBase}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Request failed')
      }
      setMessage({ type: 'success', text: data.message || 'Saved successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>Local Development Sandbox</h1>
      <p className="subtitle">Save a text entry to storage or the database.</p>

      <label className="label" htmlFor="text-input">
        Text input
      </label>
      <input
        id="text-input"
        className="input"
        type="text"
        placeholder="Type something..."
        value={text}
        onChange={(event) => setText(event.target.value)}
      />

      <div className="buttons">
        <button
          type="button"
          onClick={() => handleSave('/api/storage')}
          disabled={loading || text.trim() === ''}
        >
          Save to Storage
        </button>
        <button
          type="button"
          onClick={() => handleSave('/api/database')}
          disabled={loading || text.trim() === ''}
        >
          Save to Database
        </button>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  )
}

export default App
