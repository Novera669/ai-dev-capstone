export type NotificationChannel = 'email' | 'push' | 'sms'

export type NotificationCategory =
  | 'security'
  | 'productUpdates'
  | 'reminders'
  | 'marketing'

export type DigestFrequency = 'instant' | 'daily' | 'weekly'

export interface NotificationPreferences {
  channels: Record<NotificationChannel, boolean>
  categories: Record<NotificationCategory, boolean>
  digestFrequency: DigestFrequency
  quietHoursEnabled: boolean
  quietHoursStart: string
  quietHoursEnd: string
}

export const defaultNotificationPreferences: NotificationPreferences = {
  channels: {
    email: true,
    push: true,
    sms: false,
  },
  categories: {
    security: true,
    productUpdates: true,
    reminders: true,
    marketing: false,
  },
  digestFrequency: 'instant',
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
}

export const channelLabels: Record<NotificationChannel, string> = {
  email: 'Email',
  push: 'Push notifications',
  sms: 'SMS',
}

export const categoryLabels: Record<NotificationCategory, string> = {
  security: 'Security alerts',
  productUpdates: 'Product updates',
  reminders: 'Reminders',
  marketing: 'Marketing & promotions',
}

export const digestFrequencyLabels: Record<DigestFrequency, string> = {
  instant: 'Instant — notify me as events happen',
  daily: 'Daily digest — one summary per day',
  weekly: 'Weekly digest — one summary per week',
}

export function hasActiveChannel(preferences: NotificationPreferences): boolean {
  return Object.values(preferences.channels).some(Boolean)
}
