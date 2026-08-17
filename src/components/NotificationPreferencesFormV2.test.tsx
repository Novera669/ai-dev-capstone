import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { NotificationPreferencesFormV2 } from './NotificationPreferencesFormV2'

describe('NotificationPreferencesFormV2', () => {
  it('renders with default values', () => {
    render(<NotificationPreferencesFormV2 />)

    expect(
      screen.getByRole('heading', { name: /notification preferences/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', { name: /email notifications/i }),
    ).toBeChecked()
    expect(
      screen.getByRole('checkbox', { name: /sms notifications/i }),
    ).not.toBeChecked()
    expect(screen.getByLabelText(/notification frequency/i)).toHaveValue('weekly')
    expect(screen.queryByLabelText(/phone number/i)).not.toBeInTheDocument()
  })

  it('shows the phone field when SMS notifications are enabled', async () => {
    const user = userEvent.setup()
    render(<NotificationPreferencesFormV2 />)

    await user.click(screen.getByRole('checkbox', { name: /sms notifications/i }))

    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
  })

  it('shows a validation error when SMS is on and phone number is missing', async () => {
    const user = userEvent.setup()
    render(<NotificationPreferencesFormV2 />)

    await user.click(screen.getByRole('checkbox', { name: /sms notifications/i }))
    await user.click(screen.getByRole('button', { name: /^save$/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /phone number is required when sms notifications are enabled/i,
    )
  })

  it('clears the phone error when SMS is toggled off', async () => {
    const user = userEvent.setup()
    render(<NotificationPreferencesFormV2 />)

    await user.click(screen.getByRole('checkbox', { name: /sms notifications/i }))
    await user.click(screen.getByRole('button', { name: /^save$/i }))

    expect(await screen.findByRole('alert')).toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: /sms notifications/i }))

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
    expect(screen.queryByLabelText(/phone number/i)).not.toBeInTheDocument()
  })

  it('submits valid data to the console', async () => {
    const user = userEvent.setup()
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    render(<NotificationPreferencesFormV2 />)

    await user.click(screen.getByRole('checkbox', { name: /sms notifications/i }))
    await user.type(screen.getByLabelText(/phone number/i), '+1 (555) 123-4567')
    await user.selectOptions(
      screen.getByLabelText(/notification frequency/i),
      'daily',
    )
    await user.click(screen.getByRole('button', { name: /^save$/i }))

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith({
        emailNotifications: true,
        smsNotifications: true,
        frequency: 'daily',
        phoneNumber: '+1 (555) 123-4567',
      })
    })

    consoleSpy.mockRestore()
  })
})
