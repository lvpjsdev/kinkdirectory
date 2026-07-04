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
const { isTelegram, expand, getThemeParams } = useTelegram()

function applyTelegramTheme() {
  const params = getThemeParams()
  if (!params) return

  const root = document.documentElement
  if (params.bg_color) root.style.setProperty('--tg-bg-color', params.bg_color)
  if (params.text_color) root.style.setProperty('--tg-text-color', params.text_color)
  if (params.hint_color) root.style.setProperty('--tg-hint-color', params.hint_color)
  if (params.link_color) root.style.setProperty('--tg-link-color', params.link_color)
  if (params.button_color) root.style.setProperty('--tg-button-color', params.button_color)
  if (params.button_text_color) root.style.setProperty('--tg-button-text-color', params.button_text_color)
  if (params.secondary_bg_color) root.style.setProperty('--tg-secondary-bg-color', params.secondary_bg_color)
  if (params.accent_text_color) root.style.setProperty('--tg-accent-text-color', params.accent_text_color)
  if (params.section_bg_color) root.style.setProperty('--tg-section-bg-color', params.section_bg_color)
  if (params.section_header_text_color) root.style.setProperty('--tg-section-header-text-color', params.section_header_text_color)
  if (params.subtitle_text_color) root.style.setProperty('--tg-subtitle-text-color', params.subtitle_text_color)
  if (params.destructive_text_color) root.style.setProperty('--tg-destructive-text-color', params.destructive_text_color)
}

// Check for list parameter in URL
onMounted(() => {
  if (isTelegram) {
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
