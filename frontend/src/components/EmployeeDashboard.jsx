import { useState, useEffect } from 'react'
import './EmployeeDashboard.css'

const API = 'http://localhost:5000/api'

function EmployeeDashboard({ user, token, onLogout }) {
  const [userInfo, setUserInfo] = useState(user)
  const [draft, setDraft] = useState({ ...user })
  const [editMode, setEditMode] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch(`${API}/profile`, {
          headers: { Authorization: 'Bearer ' + token }
        })
        const data = await res.json()
        if (data.ok) {
          setUserInfo(data.user)
          setDraft(data.user)
        }
      } catch {
        //
      }
    }
    loadProfile()
  }, [token])

  const updateField = (field) => (e) => {
    setDraft((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const startEdit = () => {
    setDraft({ ...userInfo })
    setEditMode(true)
    setErr('')
  }

  const saveData = async () => {
    try {
      const res = await fetch(`${API}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify(draft)
      })
      const data = await res.json()
      if (!data.ok) {
        setErr(data.msg)
        return
      }
      setUserInfo(data.user)
      setEditMode(false)
      setErr('')
    } catch {
      setErr('Save failed')
    }
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Employee Dashboard</h1>
        <div className="header-right">
          <span className="user-email">{userInfo.email}</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome back, {userInfo.name}</h2>
          <p>Here is an overview of your activity.</p>
        </div>

        <div className="profile-card">
          <div className="profile-header">
            <h3>Profile Details</h3>
            {!editMode ? (
              <button className="edit-btn" onClick={startEdit}>
                Edit Profile
              </button>
            ) : (
              <button className="save-btn" onClick={saveData}>
                Save
              </button>
            )}
          </div>

          {err && <p className="error-message">{err}</p>}

          <table className="profile-table">
            <tbody>
              <tr>
                <td className="profile-label">Name</td>
                <td className="profile-value">
                  {editMode ? (
                    <input value={draft.name} onChange={updateField('name')} />
                  ) : (
                    <span>{userInfo.name}</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="profile-label">Email</td>
                <td className="profile-value">
                  {editMode ? (
                    <input value={draft.email} onChange={updateField('email')} />
                  ) : (
                    <span>{userInfo.email}</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="profile-label">Phone</td>
                <td className="profile-value">
                  {editMode ? (
                    <input value={draft.phone} onChange={updateField('phone')} />
                  ) : (
                    <span>{userInfo.phone || '—'}</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default EmployeeDashboard
