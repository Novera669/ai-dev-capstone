import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { NotificationPreferencesForm } from './NotificationPreferencesForm'
import { defaultNotificationPreferences } from '../types/notificationPreferences'

describe('NotificationPreferencesForm', () => {
  it('renders delivery channels and notification types', () => {
    render(<NotificationPreferencesForm />)

    expect(
      screen.getByRole('heading', { name: /notification preferences/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Email' })).toBeChecked()
    expect(
      screen.getByRole('checkbox', { name: 'Marketing & promotions' }),
    ).not.toBeChecked()
  })

  it('disables type controls when all channels are off', async () => {
    const user = userEvent.setup()
    render(<NotificationPreferencesForm />)

    await user.click(screen.getByRole('checkbox', { name: 'Email' }))
    await user.click(screen.getByRole('checkbox', { name: 'Push notifications' }))

    expect(screen.getByRole('checkbox', { name: 'Security alerts' })).toBeDisabled()
    expect(
      screen.getByText(/enable a delivery channel above/i),
    ).toBeInTheDocument()
  })

  it('shows quiet hours time inputs when enabled', async () => {
    const user = userEvent.setup()
    render(<NotificationPreferencesForm />)

    await user.click(
      screen.getByRole('checkbox', {
        name: /pause non-critical notifications during quiet hours/i,
      }),
    )

    expect(screen.getByLabelText(/^From$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^To$/i)).toBeInTheDocument()
  })

  it('validates that at least one channel stays enabled', async () => {
    const user = userEvent.setup()
    render(<NotificationPreferencesForm />)

    await user.click(screen.getByRole('checkbox', { name: 'Email' }))
    await user.click(screen.getByRole('checkbox', { name: 'Push notifications' }))
    await user.click(screen.getByRole('button', { name: /save preferences/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(
      /enable at least one delivery channel/i,
    )
  })

  it('calls onSave with updated preferences', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn().mockResolvedValue(undefined)

    render(
      <NotificationPreferencesForm
        initialPreferences={defaultNotificationPreferences}
        onSave={onSave}
      />,
    )

    await user.click(screen.getByRole('checkbox', { name: 'SMS' }))
    await user.click(
      screen.getByRole('checkbox', { name: 'Marketing & promotions' }),
    )
    await user.click(
      screen.getByRole('radio', { name: /weekly digest/i }),
    )
    await user.click(screen.getByRole('button', { name: /save preferences/i }))

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          channels: expect.objectContaining({ sms: true }),
          categories: expect.objectContaining({ marketing: true }),
          digestFrequency: 'weekly',
        }),
      )
    })

    expect(screen.getByRole('status')).toHaveTextContent(/preferences saved/i)
  })
})
