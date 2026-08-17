import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import './NotificationPreferencesFormV2.css'

const frequencyValues = ['daily', 'weekly', 'never'] as const

const frequencyLabels: Record<(typeof frequencyValues)[number], string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  never: 'Never',
}

const phoneNumberPattern = /^\+?[\d\s\-().]{7,}$/

export const notificationPreferencesFormSchema = z
  .object({
    emailNotifications: z.boolean(),
    smsNotifications: z.boolean(),
    frequency: z.enum(frequencyValues),
    phoneNumber: z.string(),
  })
  .superRefine((data, ctx) => {
    if (!data.smsNotifications) {
      return
    }

    const phone = data.phoneNumber.trim()

    if (!phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Phone number is required when SMS notifications are enabled.',
        path: ['phoneNumber'],
      })
      return
    }

    if (!phoneNumberPattern.test(phone)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter a valid phone number.',
        path: ['phoneNumber'],
      })
    }
  })

export type NotificationPreferencesFormValues = z.infer<
  typeof notificationPreferencesFormSchema
>

const defaultValues: NotificationPreferencesFormValues = {
  emailNotifications: true,
  smsNotifications: false,
  frequency: 'weekly',
  phoneNumber: '',
}

export function NotificationPreferencesFormV2() {
  const phoneErrorId = useId()

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<NotificationPreferencesFormValues>({
    resolver: zodResolver(notificationPreferencesFormSchema),
    defaultValues,
  })

  const smsEnabled = watch('smsNotifications')

  useEffect(() => {
    if (!smsEnabled) {
      clearErrors('phoneNumber')
    }
  }, [smsEnabled, clearErrors])

  function onSubmit(data: NotificationPreferencesFormValues) {
    console.log(data)
  }

  const phoneError = errors.phoneNumber?.message

  return (
    <form
      className="notification-preferences-form-v2"
      onSubmit={handleSubmit(onSubmit)}
      aria-labelledby="notification-preferences-v2-heading"
      noValidate
    >
      <header className="notification-preferences-form-v2__header">
        <h1 id="notification-preferences-v2-heading">Notification preferences</h1>
        <p>Choose how you want to receive updates.</p>
      </header>

      <fieldset className="notification-preferences-form-v2__section">
        <legend>Channels</legend>
        <ul className="notification-preferences-form-v2__toggle-list">
          <li>
            <label className="notification-preferences-form-v2__toggle">
              <input type="checkbox" {...register('emailNotifications')} />
              <span>Email notifications</span>
            </label>
          </li>
          <li>
            <label className="notification-preferences-form-v2__toggle">
              <input type="checkbox" {...register('smsNotifications')} />
              <span>SMS notifications</span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset className="notification-preferences-form-v2__section">
        <legend>Frequency</legend>
        <label
          className="notification-preferences-form-v2__field"
          htmlFor="notification-frequency"
        >
          <span className="notification-preferences-form-v2__field-label">
            Notification frequency
          </span>
          <select
            id="notification-frequency"
            className="notification-preferences-form-v2__select"
            {...register('frequency')}
          >
            {frequencyValues.map((value) => (
              <option key={value} value={value}>
                {frequencyLabels[value]}
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      {smsEnabled && (
        <div className="notification-preferences-form-v2__phone-panel">
          <fieldset className="notification-preferences-form-v2__section">
            <legend>SMS details</legend>
            <label
              className="notification-preferences-form-v2__field"
              htmlFor="notification-phone-number"
            >
              <span className="notification-preferences-form-v2__field-label">
                Phone number
              </span>
              <input
                id="notification-phone-number"
                type="tel"
                autoComplete="tel"
                className="notification-preferences-form-v2__input"
                aria-invalid={phoneError ? true : undefined}
                aria-describedby={phoneError ? phoneErrorId : undefined}
                {...register('phoneNumber')}
              />
            </label>
            {phoneError && (
              <p
                id={phoneErrorId}
                className="notification-preferences-form-v2__field-error"
                role="alert"
              >
                {phoneError}
              </p>
            )}
          </fieldset>
        </div>
      )}

      <div className="notification-preferences-form-v2__actions">
        <button type="submit">Save</button>
      </div>
    </form>
  )
}
