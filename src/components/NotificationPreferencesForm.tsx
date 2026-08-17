import { useState } from 'react'
import type {
  DigestFrequency,
  NotificationCategory,
  NotificationChannel,
  NotificationPreferences,
} from '../types/notificationPreferences'
import {
  categoryLabels,
  channelLabels,
  defaultNotificationPreferences,
  digestFrequencyLabels,
  hasActiveChannel,
} from '../types/notificationPreferences'
import './NotificationPreferencesForm.css'

export interface NotificationPreferencesFormProps {
  initialPreferences?: NotificationPreferences
  onSave?: (preferences: NotificationPreferences) => void | Promise<void>
}

export function NotificationPreferencesForm({
  initialPreferences = defaultNotificationPreferences,
  onSave,
}: NotificationPreferencesFormProps) {
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(initialPreferences)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>(
    'idle',
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const channelsActive = hasActiveChannel(preferences)

  function updateChannel(channel: NotificationChannel, enabled: boolean) {
    setPreferences((current) => ({
      ...current,
      channels: { ...current.channels, [channel]: enabled },
    }))
    setStatus('idle')
  }

  function updateCategory(category: NotificationCategory, enabled: boolean) {
    setPreferences((current) => ({
      ...current,
      categories: { ...current.categories, [category]: enabled },
    }))
    setStatus('idle')
  }

  function updateDigestFrequency(frequency: DigestFrequency) {
    setPreferences((current) => ({ ...current, digestFrequency: frequency }))
    setStatus('idle')
  }

  function updateQuietHoursEnabled(enabled: boolean) {
    setPreferences((current) => ({ ...current, quietHoursEnabled: enabled }))
    setStatus('idle')
  }

  function updateQuietHours(field: 'quietHoursStart' | 'quietHoursEnd', value: string) {
    setPreferences((current) => ({ ...current, [field]: value }))
    setStatus('idle')
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)

    if (!hasActiveChannel(preferences)) {
      setStatus('error')
      setErrorMessage('Enable at least one delivery channel.')
      return
    }

    if (
      preferences.quietHoursEnabled &&
      preferences.quietHoursStart === preferences.quietHoursEnd
    ) {
      setStatus('error')
      setErrorMessage('Quiet hours start and end times must differ.')
      return
    }

    if (!onSave) {
      setStatus('saved')
      return
    }

    setStatus('saving')

    try {
      await onSave(preferences)
      setStatus('saved')
    } catch {
      setStatus('error')
      setErrorMessage('Could not save preferences. Please try again.')
    }
  }

  return (
    <form
      className="notification-preferences-form"
      onSubmit={handleSubmit}
      aria-labelledby="notification-preferences-heading"
    >
      <header className="notification-preferences-form__header">
        <h1 id="notification-preferences-heading">Notification preferences</h1>
        <p>Choose how and when you want to hear from us.</p>
      </header>

      <fieldset className="notification-preferences-form__section">
        <legend>Delivery channels</legend>
        <p className="notification-preferences-form__hint">
          Select where notifications may be sent.
        </p>
        <ul className="notification-preferences-form__toggle-list">
          {(Object.keys(channelLabels) as NotificationChannel[]).map((channel) => (
            <li key={channel}>
              <label className="notification-preferences-form__toggle">
                <input
                  type="checkbox"
                  checked={preferences.channels[channel]}
                  onChange={(event) => updateChannel(channel, event.target.checked)}
                />
                <span>{channelLabels[channel]}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset
        className="notification-preferences-form__section"
        disabled={!channelsActive}
      >
        <legend>Notification types</legend>
        <p className="notification-preferences-form__hint">
          {channelsActive
            ? 'Pick the topics you care about.'
            : 'Enable a delivery channel above to configure notification types.'}
        </p>
        <ul className="notification-preferences-form__toggle-list">
          {(Object.keys(categoryLabels) as NotificationCategory[]).map((category) => (
            <li key={category}>
              <label className="notification-preferences-form__toggle">
                <input
                  type="checkbox"
                  checked={preferences.categories[category]}
                  onChange={(event) =>
                    updateCategory(category, event.target.checked)
                  }
                />
                <span>{categoryLabels[category]}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset
        className="notification-preferences-form__section"
        disabled={!channelsActive}
      >
        <legend>Frequency</legend>
        <div className="notification-preferences-form__radio-group">
          {(Object.keys(digestFrequencyLabels) as DigestFrequency[]).map(
            (frequency) => (
              <label
                key={frequency}
                className="notification-preferences-form__radio"
              >
                <input
                  type="radio"
                  name="digestFrequency"
                  value={frequency}
                  checked={preferences.digestFrequency === frequency}
                  onChange={() => updateDigestFrequency(frequency)}
                />
                <span>{digestFrequencyLabels[frequency]}</span>
              </label>
            ),
          )}
        </div>
      </fieldset>

      <fieldset
        className="notification-preferences-form__section"
        disabled={!channelsActive}
      >
        <legend>Quiet hours</legend>
        <label className="notification-preferences-form__toggle">
          <input
            type="checkbox"
            checked={preferences.quietHoursEnabled}
            onChange={(event) => updateQuietHoursEnabled(event.target.checked)}
          />
          <span>Pause non-critical notifications during quiet hours</span>
        </label>

        {preferences.quietHoursEnabled && (
          <div className="notification-preferences-form__time-row">
            <label>
              From
              <input
                type="time"
                value={preferences.quietHoursStart}
                onChange={(event) =>
                  updateQuietHours('quietHoursStart', event.target.value)
                }
              />
            </label>
            <label>
              To
              <input
                type="time"
                value={preferences.quietHoursEnd}
                onChange={(event) =>
                  updateQuietHours('quietHoursEnd', event.target.value)
                }
              />
            </label>
          </div>
        )}
      </fieldset>

      {status === 'error' && errorMessage && (
        <p className="notification-preferences-form__message notification-preferences-form__message--error" role="alert">
          {errorMessage}
        </p>
      )}

      {status === 'saved' && (
        <p
          className="notification-preferences-form__message notification-preferences-form__message--success"
          role="status"
        >
          Preferences saved.
        </p>
      )}

      <div className="notification-preferences-form__actions">
        <button type="submit" disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : 'Save preferences'}
        </button>
      </div>
    </form>
  )
}
