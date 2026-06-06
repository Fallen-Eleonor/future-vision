import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useConversation } from '@elevenlabs/react'
import type { DisconnectionDetails } from '@elevenlabs/client'
import { VoiceAliceCloud } from './VoiceAliceCloud'

const CLOUD_SIZE = 120
const MARGIN = 20

function formatDisconnect(details: DisconnectionDetails): string {
  if (details.reason === 'error') {
    return details.message || 'Ошибка соединения'
  }
  if (details.reason === 'agent') {
    return 'Агент завершил разговор'
  }
  return 'Разговор завершён'
}

async function ensureMicrophoneAccess(): Promise<void> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('Микрофон недоступен в этом браузере')
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  for (const track of stream.getTracks()) {
    track.stop()
  }
}

export function VoiceAssistantWidget() {
  const {
    status,
    message,
    isSpeaking,
    isListening,
    startSession,
    endSession,
    getInputVolume,
    getOutputVolume,
    sendUserActivity,
  } = useConversation({
    onConnect: () => {
      setSessionError(null)
      setExpanded(true)
    },
    onDisconnect: (details) => {
      setSessionError(formatDisconnect(details))
      setExpanded(false)
    },
    onError: (errorMessage) => {
      setSessionError(errorMessage)
    },
  })

  const [expanded, setExpanded] = useState(false)
  const [level, setLevel] = useState(0)
  const [anchored, setAnchored] = useState(true)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [busy, setBusy] = useState(false)
  const [sessionError, setSessionError] = useState<string | null>(null)

  const rootRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    originX: number
    originY: number
    moved: boolean
  } | null>(null)
  const suppressClickRef = useRef(false)

  const connected = status === 'connected'
  const connecting = status === 'connecting'
  const live = connected || connecting

  useEffect(() => {
    if (!connected) {
      setLevel(0)
      return
    }

    let raf = 0
    const tick = () => {
      const v = isSpeaking ? getOutputVolume() : getInputVolume()
      setLevel(typeof v === 'number' ? v : 0)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [connected, isSpeaking, getInputVolume, getOutputVolume])

  useEffect(() => {
    if (!connected) return

    sendUserActivity()
    const interval = window.setInterval(() => {
      sendUserActivity()
    }, 30_000)

    return () => window.clearInterval(interval)
  }, [connected, sendUserActivity])

  const clampPosition = useCallback((x: number, y: number) => {
    const maxX = Math.max(MARGIN, window.innerWidth - CLOUD_SIZE - MARGIN)
    const maxY = Math.max(MARGIN, window.innerHeight - CLOUD_SIZE - MARGIN)
    return {
      x: Math.min(maxX, Math.max(MARGIN, x)),
      y: Math.min(maxY, Math.max(MARGIN, y)),
    }
  }, [])

  const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return
    const root = rootRef.current
    if (!root) return

    const rect = root.getBoundingClientRect()
    if (anchored) {
      setAnchored(false)
      setCoords(clampPosition(rect.left, rect.top))
    }

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: rect.left,
      originY: rect.top,
      moved: false,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY
    if (Math.hypot(dx, dy) > 8) {
      drag.moved = true
      setExpanded(false)
    }

    setCoords(clampPosition(drag.originX + dx, drag.originY + dy))
  }

  const onPointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    suppressClickRef.current = drag.moved
    dragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const onCloudClick = async () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }

    if (connected) {
      setExpanded((v) => !v)
      return
    }

    if (connecting || busy) return

    setBusy(true)
    setSessionError(null)

    try {
      await ensureMicrophoneAccess()
      startSession()
    } catch (error) {
      const text =
        error instanceof DOMException && error.name === 'NotAllowedError'
          ? 'Разрешите доступ к микрофону в браузере'
          : error instanceof Error
            ? error.message
            : 'Не удалось начать разговор'
      setSessionError(text)
      console.error('[VoiceAssistant]', error)
    } finally {
      setBusy(false)
    }
  }

  const onEnd = () => {
    setBusy(true)
    try {
      endSession()
    } finally {
      setBusy(false)
      setExpanded(false)
      setSessionError(null)
    }
  }

  const statusLabel =
    status === 'connected'
      ? isSpeaking
        ? 'Говорю…'
        : isListening
          ? 'Слушаю…'
          : 'На связи'
      : status === 'connecting'
        ? 'Подключаюсь…'
        : status === 'error'
          ? message || sessionError || 'Ошибка'
          : 'Нажмите на облако'

  const hintLabel =
    sessionError || message
      ? sessionError || message
      : status === 'connected'
        ? isSpeaking
          ? 'Ассистент отвечает'
          : isListening
            ? 'Слушаю вас'
            : 'Готов к диалогу'
        : connecting
          ? 'Подключение…'
          : 'Спросите меня'

  const rootStyle: React.CSSProperties = anchored
    ? { right: MARGIN, bottom: MARGIN, left: 'auto', top: 'auto' }
    : { left: coords.x, top: coords.y, right: 'auto', bottom: 'auto' }

  return createPortal(
    <div ref={rootRef} className="voice-assistant-root" style={rootStyle}>
      {expanded && (
        <div className="voice-assistant-panel">
          <p className="voice-assistant-panel-title">Голосовой ассистент</p>
          <p className="voice-assistant-panel-status">{statusLabel}</p>
          {sessionError && !connected && (
            <p className="voice-assistant-panel-error">{sessionError}</p>
          )}
          {connected ? (
            <button type="button" className="voice-assistant-panel-btn" onClick={onEnd} disabled={busy}>
              Завершить разговор
            </button>
          ) : (
            <button type="button" className="voice-assistant-panel-btn" onClick={onCloudClick} disabled={busy || connecting}>
              {busy || connecting ? 'Подключение…' : 'Начать разговор'}
            </button>
          )}
        </div>
      )}

      <p className={`voice-assistant-hint ${sessionError || message ? 'voice-assistant-hint--error' : ''}`}>
        {hintLabel}
      </p>

      <button
        type="button"
        className={`voice-assistant-cloud-btn ${live ? 'voice-assistant-cloud-btn--live' : ''}`}
        aria-label={connected ? 'Голосовой ассистент, перетащите чтобы переместить' : 'Запустить голосового ассистента'}
        onClick={onCloudClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        disabled={busy && !connected}
      >
        <VoiceAliceCloud
          level={level}
          live={live}
          speaking={isSpeaking}
          connecting={connecting}
        />
      </button>
    </div>,
    document.body,
  )
}
