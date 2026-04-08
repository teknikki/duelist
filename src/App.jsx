import { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import './App.css'

const sampleRecords = [
  {
    id: 'rec_001',
    name: 'Toyota Tacoma Insurance',
    category: 'vehicle',
    expiresAt: '2026-04-15',
    urgency: 'overdue',
    parries: { total: 3, used: 3 },
    tags: ['toyota', 'progressive'],
    sensitive: true,
  },
  {
    id: 'rec_002',
    name: 'Home Insurance Policy',
    category: 'insurance',
    expiresAt: '2026-05-01',
    urgency: 'warning',
    parries: { total: 3, used: 1 },
    tags: ['homeowners', 'allstate'],
    sensitive: false,
  },
  {
    id: 'rec_003',
    name: "Luna's Rabies Vaccine",
    category: 'pet',
    expiresAt: '2026-06-15',
    urgency: 'warning',
    parries: { total: 3, used: 0 },
    tags: ['luna', 'vet'],
    sensitive: false,
  },
  {
    id: 'rec_004',
    name: 'Passport — Nikki',
    category: 'identity',
    expiresAt: '2029-03-22',
    urgency: 'clear',
    parries: { total: 3, used: 0 },
    tags: ['travel'],
    sensitive: true,
  },
  {
    id: 'rec_005',
    name: 'Toyota Tacoma Registration',
    category: 'vehicle',
    expiresAt: '2027-01-10',
    urgency: 'clear',
    parries: { total: 3, used: 0 },
    tags: ['toyota'],
    sensitive: false,
  },
]

function ParryDots({ total, used }) {
  return (
    <div className="parry-dots">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`parry-dot ${i < (total - used) ? 'active' : 'used'}`}
        />
      ))}
    </div>
  )
}

function RecordCard({ record }) {
  return (
    <div className={`record-card urgency-${record.urgency}`}>
      <div className="record-card-left">
        <div className="record-name">
          {record.name}
          {record.sensitive && <span className="lock-icon">🔒</span>}
        </div>
        <div className="record-meta">
          <span className="record-category">{record.category}</span>
          {record.tags.map(tag => (
            <span key={tag} className="record-tag">/{tag}</span>
          ))}
        </div>
      </div>
      <div className="record-card-right">
        <div className="record-date">{record.expiresAt}</div>
        <ParryDots total={record.parries.total} used={record.parries.used} />
      </div>
    </div>
  )
}

function LoginScreen({ onLogin }) {
  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="wordmark">duelist</div>
        <div className="tagline">--- stay sharp ---</div>
        <p className="login-description">
          Your documents. Your Drive. Never expired.
        </p>
        <button className="google-login-btn" onClick={onLogin}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
          </svg>
          sign in with Google
        </button>
        <p className="login-privacy">
          Your files stay in your Google Drive. We store nothing.
        </p>
      </div>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(null)

  const login = useGoogleLogin({
    onSuccess: (response) => setUser(response),
    onError: () => console.log('Login failed'),
    scope: 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file',
  })

  const overdue = sampleRecords.filter(r => r.urgency === 'overdue')
  const warning = sampleRecords.filter(r => r.urgency === 'warning')
  const clear = sampleRecords.filter(r => r.urgency === 'clear')

  if (!user) {
    return <LoginScreen onLogin={login} />
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <div>
            <div className="wordmark">duelist</div>
            <div className="tagline">--- stay sharp ---</div>
          </div>
          <button className="signout-btn" onClick={() => setUser(null)}>sign out</button>
        </div>
      </header>

      <main className="dashboard">
        {overdue.length > 0 && (
          <section className="urgency-section">
            <div className="urgency-banner overdue-banner">
              no parries left — {overdue.length} record{overdue.length > 1 ? 's' : ''} overdue
            </div>
            {overdue.map(r => <RecordCard key={r.id} record={r} />)}
          </section>
        )}

        {warning.length > 0 && (
          <section className="urgency-section">
            <div className="urgency-banner warning-banner">
              coming up — {warning.length} record{warning.length > 1 ? 's' : ''} expiring soon
            </div>
            {warning.map(r => <RecordCard key={r.id} record={r} />)}
          </section>
        )}

        {clear.length > 0 && (
          <section className="urgency-section">
            <div className="urgency-banner clear-banner">
              all clear — {clear.length} record{clear.length > 1 ? 's' : ''} in good shape
            </div>
            {clear.map(r => <RecordCard key={r.id} record={r} />)}
          </section>
        )}
      </main>

      <button className="fab">+</button>
    </div>
  )
}