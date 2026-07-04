<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import DebugModal from './components/debug/DebugModal.vue'
import KinkListView from './components/KinkListView.vue'
import { useKinkListState } from './composables/useKinkList'
import { useTelegram } from './composables/useTelegram'

const { viewListFromUrl } = useKinkListState()
const toast = useToast()
const { t } = useI18n()
const { isTelegram, expand, ready, getThemeParams } = useTelegram()

const THEME_VAR_MAP: Record<string, string> = {
  bg_color: '--tg-bg-color',
  text_color: '--tg-text-color',
  hint_color: '--tg-hint-color',
  link_color: '--tg-link-color',
  button_color: '--tg-button-color',
  button_text_color: '--tg-button-text-color',
  secondary_bg_color: '--tg-secondary-bg-color',
  accent_text_color: '--tg-accent-text-color',
  section_bg_color: '--tg-section-bg-color',
  section_header_text_color: '--tg-section-header-text-color',
  subtitle_text_color: '--tg-subtitle-text-color',
  destructive_text_color: '--tg-destructive-text-color',
}

function applyTelegramTheme() {
  const params = getThemeParams()
  if (!params)
    return

  const root = document.documentElement
  for (const [key, cssVar] of Object.entries(THEME_VAR_MAP)) {
    const value = params[key as keyof typeof params]
    if (value)
      root.style.setProperty(cssVar, value)
  }
}

// Check for list parameter in URL
onMounted(() => {
  if (isTelegram) {
    ready()
    expand()
    applyTelegramTheme()
  }

  // Get URL parameters directly from browser's URL API
  const urlParams = new URLSearchParams(window.location.search)
  const listParam = urlParams.get('list')

  if (listParam) {
    try {
      const result = viewListFromUrl(listParam)
      if (!result) {
        // Failed to import - show error toast
        toast.add({
          title: t('app.import_error'),
          description: t('app.import_error_old_format'),
          color: 'error',
        })

        // Remove the list parameter from URL to avoid repeated errors
        if (window.history) {
          window.history.replaceState({}, document.title, window.location.pathname)
        }
      }
    }
    catch (e) {
      console.error('Failed to view list from URL', e)

      // Show error toast
      toast.add({
        title: t('app.import_error'),
        description: t('app.import_error_old_format'),
        color: 'error',
      })

      // Remove the list parameter from URL to avoid repeated errors
      if (window.history) {
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
  }
})
</script>

<template>
  <UApp>
    <div class="min-h-screen">
      <KinkListView />
      <DebugModal />
    </div>
  </UApp>
</template>

<style scoped>
</style>
