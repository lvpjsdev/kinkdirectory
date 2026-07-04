/* eslint-disable unused-imports/no-unused-vars */
import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import ru from '../locales/ru.json'

export type MessageSchema = typeof en

// Define our supported locales
const SUPPORTED_LOCALES = ['en', 'ru'] as const
type SupportedLocale = typeof SUPPORTED_LOCALES[number]

// Create a map of all locale messages for type safety
const messages: Record<SupportedLocale, MessageSchema | Partial<MessageSchema>> = {
  en,
  ru: ru as unknown as Partial<MessageSchema>,
}

// Create i18n instance
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  missingWarn: false, // Disable warnings for missing translations
})

export default i18n
