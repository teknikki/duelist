import { useState } from 'react'
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

export default function App() {
  const overdue = sampleRecords.filter(r => r.urgency === 'overdue')
  const warning = sampleRecords.filter(r => r.urgency === 'warning')
  const clear = sampleRecords.filter(r => r.urgency === 'clear')

  return (
    <div className="app">
      <header className="app-header">
        <div className="wordmark">duelist</div>
        <div className="tagline">--- stay sharp ---</div>
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
