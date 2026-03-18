import { useState, useEffect, useRef } from 'react'
import { AI_PROVIDERS, getAISettings, saveAISettings, clearAISettings } from '../utils/aiProviders'

function maskKey(key) {
  if (!key || key.length < 8) return '******'
  return key.slice(0, 4) + '****' + key.slice(-4)
}

export default function AISettingsPanel({ isOpen, onClose }) {
  const [provider, setProvider] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('')
  const [saved, setSaved] = useState(false)
  const [hasSavedKey, setHasSavedKey] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [maskedKey, setMaskedKey] = useState('')
  const overlayRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      const settings = getAISettings()
      if (settings?.provider) {
        setProvider(settings.provider)
        setModel(settings.model || '')
        if (settings.apiKey) {
          setHasSavedKey(true)
          setMaskedKey(maskKey(settings.apiKey))
          setApiKey('')
          setIsEditing(false)
        } else {
          setHasSavedKey(false)
          setApiKey('')
          setIsEditing(true)
        }
      } else {
        setProvider('')
        setApiKey('')
        setModel('')
        setHasSavedKey(false)
        setIsEditing(false)
      }
      setSaved(false)
    }
  }, [isOpen])

  const currentProvider = AI_PROVIDERS.find(p => p.id === provider)

  const handleProviderChange = (pid) => {
    setProvider(pid)
    const p = AI_PROVIDERS.find(p => p.id === pid)
    setModel(p?.defaultModel || '')
    const settings = getAISettings()
    if (settings?.provider === pid && settings?.apiKey) {
      setHasSavedKey(true)
      setMaskedKey(maskKey(settings.apiKey))
      setApiKey('')
      setIsEditing(false)
    } else {
      setHasSavedKey(false)
      setApiKey('')
      setIsEditing(true)
    }
    setSaved(false)
  }

  const handleSave = () => {
    if (!provider) return
    if (isEditing && !apiKey) return
    const settings = getAISettings()
    const keyToSave = isEditing ? apiKey : settings?.apiKey
    if (!keyToSave) return

    saveAISettings({
      provider,
      apiKey: keyToSave,
      model: model || currentProvider?.defaultModel
    })
    setSaved(true)
    setHasSavedKey(true)
    setMaskedKey(maskKey(keyToSave))
    setApiKey('')
    setIsEditing(false)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleClear = () => {
    clearAISettings()
    setProvider('')
    setApiKey('')
    setModel('')
    setHasSavedKey(false)
    setIsEditing(false)
    setSaved(false)
  }

  const handleReenterKey = () => {
    setIsEditing(true)
    setApiKey('')
    setHasSavedKey(false)
  }

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      style={S.overlay}
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
    >
      <div style={S.panel}>
        {/* Header */}
        <div style={S.header}>
          <div>
            <h2 style={S.title}>AI Model Settings</h2>
            <p style={S.subtitle}>Choose your preferred AI provider and enter your API key</p>
          </div>
          <button onClick={onClose} style={S.closeBtn} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div style={S.divider} />

        {/* Step 1: Provider */}
        <div style={S.stepLabel}>
          <span style={S.stepNum}>1</span>
          Select Provider
        </div>
        <div style={S.providerGrid}>
          {AI_PROVIDERS.map(p => {
            const active = provider === p.id
            return (
              <button
                key={p.id}
                onClick={() => handleProviderChange(p.id)}
                style={{
                  ...S.providerCard,
                  ...(active ? S.providerCardActive : {}),
                }}
              >
                <div style={{ ...S.providerName, color: active ? '#1E293B' : '#475569' }}>{p.name}</div>
                <div style={{ ...S.providerDesc, color: active ? '#64748B' : '#94A3B8' }}>{p.description}</div>
                {active && <div style={S.activeCheck}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>}
              </button>
            )
          })}
        </div>

        {/* Step 2 & 3: Model + Key */}
        {currentProvider && (
          <>
            <div style={{ ...S.stepLabel, marginTop: 24 }}>
              <span style={S.stepNum}>2</span>
              Choose Model
            </div>
            <div style={S.modelList}>
              {currentProvider.models.map(m => {
                const active = (model || currentProvider.defaultModel) === m.id
                return (
                  <button
                    key={m.id}
                    onClick={() => { setModel(m.id); setSaved(false) }}
                    style={{
                      ...S.modelBtn,
                      ...(active ? S.modelBtnActive : {}),
                    }}
                  >
                    <div style={{
                      ...S.radioOuter,
                      borderColor: active ? '#DA291C' : '#CBD5E1',
                    }}>
                      {active && <div style={S.radioInner} />}
                    </div>
                    <span style={{ color: active ? '#1E293B' : '#64748B', fontWeight: active ? 600 : 400 }}>
                      {m.name}
                    </span>
                  </button>
                )
              })}
            </div>

            <div style={{ ...S.stepLabel, marginTop: 24 }}>
              <span style={S.stepNum}>3</span>
              API Key
            </div>

            {hasSavedKey && !isEditing ? (
              <div style={S.savedKeyRow}>
                <div style={S.maskedKeyBox}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span style={{ color: '#64748B', fontSize: 13, fontFamily: 'monospace', userSelect: 'none' }}>
                    {maskedKey}
                  </span>
                  <span style={{ color: '#16A34A', fontSize: 11, fontWeight: 600, marginLeft: 'auto' }}>Configured</span>
                </div>
                <button onClick={handleReenterKey} style={S.reenterBtn}>
                  Change
                </button>
              </div>
            ) : (
              <div>
                <div style={S.keyInputWrap}>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={e => { setApiKey(e.target.value); setSaved(false) }}
                    placeholder={currentProvider.keyPlaceholder}
                    autoComplete="off"
                    spellCheck="false"
                    onCopy={e => e.preventDefault()}
                    onCut={e => e.preventDefault()}
                    style={S.keyInput}
                  />
                  <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <div style={{ marginTop: 6, fontSize: 11, color: '#94A3B8' }}>
                  Your key is stored locally in your browser and never saved on our server.{' '}
                  <a
                    href={currentProvider.keyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#DA291C', textDecoration: 'none', fontWeight: 500 }}
                  >
                    Get API Key
                    <svg style={{ marginLeft: 2, verticalAlign: 'middle' }} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </>
        )}

        {/* Divider */}
        <div style={{ ...S.divider, marginTop: 24 }} />

        {/* Actions */}
        <div style={S.actions}>
          <button onClick={handleClear} style={S.resetBtn}>Reset</button>
          <button
            onClick={handleSave}
            disabled={!provider || (isEditing && !apiKey)}
            style={{
              ...S.saveBtn,
              opacity: (!provider || (isEditing && !apiKey)) ? 0.4 : 1,
              cursor: (!provider || (isEditing && !apiKey)) ? 'not-allowed' : 'pointer',
              background: saved ? '#16A34A' : '#DA291C',
            }}
          >
            {saved ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Saved
              </>
            ) : 'Save Settings'}
          </button>
        </div>

        {/* Status */}
        {hasSavedKey && !isEditing && (
          <div style={S.statusBar}>
            <div style={S.statusDot} />
            <span>Active: <strong>{currentProvider?.name}</strong></span>
            <span style={{ color: '#CBD5E1' }}> / </span>
            <span>{currentProvider?.models.find(m => m.id === (model || currentProvider?.defaultModel))?.name}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// Styles — 白底留白，干净清爽
// ============================================================
const S = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(4px)',
  },
  panel: {
    background: '#fff',
    borderRadius: 16,
    padding: '28px 32px',
    width: '92%',
    maxWidth: 540,
    maxHeight: '85vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
  },
  title: {
    margin: 0, fontSize: 20, fontWeight: 700, color: '#1E293B',
    fontFamily: "'Georgia', serif",
  },
  subtitle: {
    margin: '4px 0 0', fontSize: 13, color: '#94A3B8', fontWeight: 400,
  },
  closeBtn: {
    background: '#F8FAFC', border: '1px solid #E2E8F0',
    borderRadius: 8, width: 32, height: 32,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: '#94A3B8', flexShrink: 0,
    transition: 'background 0.15s',
  },
  divider: {
    height: 1, background: '#F1F5F9', margin: '18px 0',
  },
  stepLabel: {
    display: 'flex', alignItems: 'center', gap: 8,
    fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 12,
  },
  stepNum: {
    width: 22, height: 22, borderRadius: '50%',
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    color: '#DA291C', fontSize: 11, fontWeight: 700,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },

  // Provider cards
  providerGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))',
    gap: 10,
  },
  providerCard: {
    padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
    border: '1.5px solid #E2E8F0',
    background: '#fff',
    textAlign: 'left', transition: 'all 0.15s', position: 'relative',
    overflow: 'hidden',
  },
  providerCardActive: {
    background: '#FEF2F2',
    borderColor: '#DA291C',
  },
  providerName: {
    fontWeight: 600, fontSize: 13, lineHeight: 1.3,
  },
  providerDesc: {
    fontSize: 10, marginTop: 3, lineHeight: 1.3,
  },
  activeCheck: {
    position: 'absolute', top: 6, right: 6,
    width: 18, height: 18, borderRadius: '50%',
    background: '#DA291C',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },

  // Model radio buttons
  modelList: {
    display: 'flex', flexDirection: 'column', gap: 6,
  },
  modelBtn: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 14px', borderRadius: 8,
    background: '#fff',
    border: '1.5px solid #E2E8F0',
    cursor: 'pointer', fontSize: 13, transition: 'all 0.15s',
    textAlign: 'left',
  },
  modelBtnActive: {
    background: '#FEF2F2',
    borderColor: '#FECACA',
  },
  radioOuter: {
    width: 16, height: 16, borderRadius: '50%',
    border: '2px solid #CBD5E1',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, transition: 'border-color 0.15s',
  },
  radioInner: {
    width: 8, height: 8, borderRadius: '50%',
    background: '#DA291C',
  },

  // Saved key display
  savedKeyRow: {
    display: 'flex', alignItems: 'center', gap: 10,
  },
  maskedKeyBox: {
    flex: 1, display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 14px', borderRadius: 8,
    background: '#F0FDF4',
    border: '1px solid #BBF7D0',
  },
  reenterBtn: {
    padding: '10px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    color: '#64748B', cursor: 'pointer', whiteSpace: 'nowrap',
    transition: 'background 0.15s',
  },

  // Key input
  keyInputWrap: {
    position: 'relative',
  },
  keyInput: {
    width: '100%', padding: '10px 14px 10px 36px', borderRadius: 8,
    background: '#F8FAFC',
    border: '1.5px solid #E2E8F0',
    color: '#1E293B', fontSize: 13, boxSizing: 'border-box',
    outline: 'none', fontFamily: 'monospace',
    WebkitTextSecurity: 'disc',
    transition: 'border-color 0.15s',
  },

  // Actions
  actions: {
    display: 'flex', gap: 10, marginTop: 16,
  },
  resetBtn: {
    padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500,
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    color: '#64748B', cursor: 'pointer',
    transition: 'all 0.15s',
  },
  saveBtn: {
    flex: 1, padding: '11px 20px', borderRadius: 8,
    border: 'none', fontWeight: 600, fontSize: 14,
    color: '#fff', transition: 'all 0.2s',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  },

  // Status bar
  statusBar: {
    display: 'flex', alignItems: 'center', gap: 6,
    marginTop: 14, padding: '10px 14px', borderRadius: 8,
    background: '#F8FAFC',
    border: '1px solid #F1F5F9',
    fontSize: 12, color: '#64748B',
  },
  statusDot: {
    width: 6, height: 6, borderRadius: '50%',
    background: '#16A34A', flexShrink: 0,
    boxShadow: '0 0 6px rgba(22,163,74,0.3)',
  },
}
