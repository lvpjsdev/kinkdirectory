# Telegram Mini App Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Telegram Mini App support — auto theme, native buttons, and sharing via contacts.

**Architecture:** Create a `useTelegram()` composable wrapping `@twa-dev/sdk`, integrate theme CSS variables in `App.vue`, and add a Telegram share button to `ShareModal`. No bot, no encryption, no user binding.

**Tech Stack:** Vue 3, `@twa-dev/sdk`, NuxtUI v3, Tailwind CSS v4, vue-i18n

## Global Constraints

- No hardcoded strings — use `t('key')` from vue-i18n for all user-facing text
- NuxtUI components are auto-imported (UModal, UButton, etc.)
- Use `function` keyword for top-level functions, not arrow functions
- Mobile-first responsive design via Tailwind
- Code comments stay in English

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `package.json` | Modify | Add `@twa-dev/sdk` dependency |
| `src/types/telegram.d.ts` | Create | Global type declarations for `window.Telegram` |
| `src/composables/useTelegram.ts` | Create | Composable wrapping Telegram WebApp API |
| `src/App.vue` | Modify | Initialize Telegram, apply theme, handle expand |
| `src/style.css` | Modify | CSS variables for Telegram theme |
| `src/locales/en.json` | Modify | Add translation keys for Telegram share |
| `src/locales/ru.json` | Modify | Add Russian translation keys |
| `src/components/kinklist/modals/ShareModal.vue` | Modify | Add "Share via Telegram" button |

---

### Task 1: Install @twa-dev/sdk

**Covers:** Spec §Architecture (Dependencies)

**Files:**
- Modify: `package.json`

**Interfaces:**
- Consumes: (none)
- Produces: `@twa-dev/sdk` available for import

- [ ] **Step 1: Install the dependency**

```bash
yarn add @twa-dev/sdk
```

- [ ] **Step 2: Verify installation**

```bash
ls node_modules/@twa-dev/sdk/package.json
```

Expected: file exists

- [ ] **Step 3: Commit**

```bash
git add package.json yarn.lock
git commit -m "deps: add @twa-dev/sdk for Telegram Mini App support"
```

---

### Task 2: Create TypeScript declarations for Telegram

**Covers:** Spec §New Files (telegram.d.ts)

**Files:**
- Create: `src/types/telegram.d.ts`

**Interfaces:**
- Consumes: (none)
- Produces: `Window.Telegram` global type

- [ ] **Step 1: Create the type declaration file**

```ts
// src/types/telegram.d.ts
interface TelegramWebApp {
  expand: () => void
  close: () => void
  ready: () => void
  themeParams: {
    bg_color?: string
    text_color?: string
    hint_color?: string
    link_color?: string
    button_color?: string
    button_text_color?: string
    secondary_bg_color?: string
    accent_text_color?: string
    section_bg_color?: string
    section_header_text_color?: string
    subtitle_text_color?: string
    destructive_text_color?: string
  }
  BackButton: {
    show: () => void
    hide: () => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
  }
  initDataUnsafe?: {
    user?: {
      id: number
      first_name: string
      last_name?: string
      username?: string
    }
  }
  colorScheme: 'light' | 'dark'
}

interface Window {
  Telegram?: {
    WebApp: TelegramWebApp
  }
}
```

- [ ] **Step 2: Verify typecheck passes**

```bash
yarn typecheck
```

Expected: no errors related to telegram.d.ts

- [ ] **Step 3: Commit**

```bash
git add src/types/telegram.d.ts
git commit -m "feat: add TypeScript declarations for Telegram WebApp API"
```

---

### Task 3: Create useTelegram() composable

**Covers:** Spec §New Files (useTelegram.ts)

**Files:**
- Create: `src/composables/useTelegram.ts`

**Interfaces:**
- Consumes: `Window.Telegram` from Task 2
- Produces: `useTelegram()` function with `isTelegram`, `expand`, `close`, `getThemeParams`, `setBackButtonVisible`, `onBackButton`

- [ ] **Step 1: Create the composable**

```ts
// src/composables/useTelegram.ts
import WebApp from '@twa-dev/sdk'

export function useTelegram() {
  const isTelegram = !!window.Telegram?.WebApp
  const webApp = isTelegram ? (window.Telegram!.WebApp as typeof WebApp) : null

  function expand() {
    webApp?.expand()
  }

  function close() {
    webApp?.close()
  }

  function ready() {
    webApp?.ready()
  }

  function getThemeParams() {
    return webApp?.themeParams || null
  }

  function getColorScheme() {
    return webApp?.colorScheme || 'light'
  }

  function setBackButtonVisible(visible: boolean) {
    if (!webApp) return
    if (visible) {
      webApp.BackButton.show()
    } else {
      webApp.BackButton.hide()
    }
  }

  function onBackButton(callback: () => void) {
    webApp?.BackButton.onClick(callback)
  }

  function offBackButton(callback: () => void) {
    webApp?.BackButton.offClick(callback)
  }

  return {
    webApp,
    isTelegram,
    expand,
    close,
    ready,
    getThemeParams,
    getColorScheme,
    setBackButtonVisible,
    onBackButton,
    offBackButton,
  }
}
```

- [ ] **Step 2: Verify typecheck passes**

```bash
yarn typecheck
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/composables/useTelegram.ts
git commit -m "feat: add useTelegram() composable"
```

---

### Task 4: Add CSS variables for Telegram theme

**Covers:** Spec §Modified Files (style.css)

**Files:**
- Modify: `src/style.css`

**Interfaces:**
- Consumes: (none)
- Produces: CSS custom properties `--tg-*` available for theme mapping

- [ ] **Step 1: Add CSS variables**

```css
@import "tailwindcss";
@import "@nuxt/ui";

/* Telegram Mini App theme variables */
:root {
  --tg-bg-color: transparent;
  --tg-text-color: inherit;
  --tg-hint-color: inherit;
  --tg-link-color: inherit;
  --tg-button-color: inherit;
  --tg-button-text-color: inherit;
  --tg-secondary-bg-color: transparent;
  --tg-accent-text-color: inherit;
  --tg-section-bg-color: transparent;
  --tg-section-header-text-color: inherit;
  --tg-subtitle-text-color: inherit;
  --tg-destructive-text-color: inherit;
}
```

- [ ] **Step 2: Verify build passes**

```bash
yarn build
```

Expected: build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/style.css
git commit -m "feat: add CSS variables for Telegram theme"
```

---

### Task 5: Add translation keys for Telegram share

**Covers:** Spec §Modified Files (en.json, ru.json)

**Files:**
- Modify: `src/locales/en.json`
- Modify: `src/locales/ru.json`

**Interfaces:**
- Consumes: (none)
- Produces: `app.share_via_telegram` and `app.share_telegram_text` keys

- [ ] **Step 1: Add English translations**

In `src/locales/en.json`, inside the `"app"` object, add:

```json
"share_via_telegram": "Share via Telegram",
"share_telegram_text": "Check out my kink list:"
```

- [ ] **Step 2: Add Russian translations**

In `src/locales/ru.json`, inside the `"app"` object, add:

```json
"share_via_telegram": "Поделиться в Telegram",
"share_telegram_text": "Посмотри мой список кинков:"
```

- [ ] **Step 3: Verify typecheck passes**

```bash
yarn typecheck
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/locales/en.json src/locales/ru.json
git commit -m "feat(i18n): add Telegram share translation keys"
```

---

### Task 6: Integrate Telegram in App.vue

**Covers:** Spec §Modified Files (App.vue)

**Files:**
- Modify: `src/App.vue`

**Interfaces:**
- Consumes: `useTelegram()` from Task 3
- Produces: Telegram theme applied on mount, app expanded to full screen

- [ ] **Step 1: Update App.vue**

```vue
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
```

- [ ] **Step 2: Verify typecheck passes**

```bash
yarn typecheck
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/App.vue
git commit -m "feat: integrate Telegram theme and expand in App.vue"
```

---

### Task 7: Add Telegram share button to ShareModal

**Covers:** Spec §Modified Files (ShareModal.vue)

**Files:**
- Modify: `src/components/kinklist/modals/ShareModal.vue`

**Interfaces:**
- Consumes: `t()` from vue-i18n (existing)
- Produces: `shareViaTelegram()` function, button in template

- [ ] **Step 1: Update ShareModal.vue**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  url: string
}>()
const emit = defineEmits<{
  (e: 'close', copied: boolean): void
}>()
const { t } = useI18n()
const toast = useToast()
const copied = ref(false)

function copyShareUrl() {
  navigator.clipboard.writeText(props.url)
  copied.value = true

  // Show only one toast
  toast.add({
    title: t('app.copied'),
    description: t('app.copy_success'),
    icon: 'i-lucide-check-circle',
    color: 'success',
    duration: 3000,
  })

  // Close modal but don't trigger additional toasts in parent
  setTimeout(() => {
    emit('close', false)
  }, 1000)
}

function shareViaTelegram() {
  const text = encodeURIComponent(t('app.share_telegram_text'))
  const url = encodeURIComponent(props.url)
  window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank')
}

function handleCancel() {
  emit('close', false)
}
</script>

<template>
  <UModal
    :title="t('app.share_list')"
    :description="t('app.share_list_description')"
  >
    <template #body>
      <div class="space-y-6">
        <!-- Introduction -->
        <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div class="flex items-start space-x-3">
            <UIcon name="i-lucide-share" class="flex-shrink-0 text-lg text-primary-500 mt-0.5" />
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('app.share_info_text') }}
            </p>
          </div>
        </div>

        <!-- Share URL Section -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <label for="share-url" class="block text-sm font-medium">
              {{ t('app.share_link') }}
            </label>
            <UBadge color="primary" variant="soft" size="sm">
              {{ t('app.view_only') }}
            </UBadge>
          </div>

          <div class="relative">
            <UInput
              id="share-url"
              :model-value="props.url"
              readonly
              class="w-full pr-10"
              :class="{ 'border-success-500 ring-1 ring-success-500': copied }"
            />
            <div
              class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
              title="Copy link"
              @click="copyShareUrl"
            >
              <UIcon
                :name="copied ? 'i-lucide-check' : 'i-lucide-copy'"
                class="text-lg"
                :class="copied ? 'text-success-500' : 'text-gray-400'"
              />
            </div>
          </div>
        </div>

        <!-- Share Buttons -->
        <div class="flex flex-col sm:flex-row justify-center gap-3">
          <UButton
            size="md"
            icon="i-lucide-copy"
            variant="soft"
            color="primary"
            :disabled="copied"
            @click="copyShareUrl"
          >
            {{ copied ? t('app.copied') : t('app.copy_link') }}
          </UButton>
          <UButton
            size="md"
            icon="i-lucide-send"
            variant="soft"
            color="primary"
            @click="shareViaTelegram"
          >
            {{ t('app.share_via_telegram') }}
          </UButton>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <UButton
          variant="ghost"
          @click="handleCancel"
        >
          {{ t('app.close') }}
        </UButton>
        <UButton
          variant="solid"
          color="primary"
          :disabled="copied"
          @click="handleCancel"
        >
          {{ t('app.close') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
```

- [ ] **Step 2: Verify typecheck passes**

```bash
yarn typecheck
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/kinklist/modals/ShareModal.vue
git commit -m "feat: add Share via Telegram button to ShareModal"
```

---

### Task 8: Final verification

**Covers:** Spec §Verification

**Files:**
- (none — verification only)

**Interfaces:**
- Consumes: All previous tasks
- Produces: Confirmed passing typecheck, lint, and build

- [ ] **Step 1: Run typecheck**

```bash
yarn typecheck
```

Expected: no errors

- [ ] **Step 2: Run lint**

```bash
yarn lint
```

Expected: no errors

- [ ] **Step 3: Run build**

```bash
yarn build
```

Expected: build succeeds, output in `dist/`

- [ ] **Step 4: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix: address review feedback for Telegram Mini App integration"
```

---

## Summary

| Task | Description | Files Changed |
|------|-------------|---------------|
| 1 | Install @twa-dev/sdk | package.json, yarn.lock |
| 2 | TypeScript declarations | src/types/telegram.d.ts |
| 3 | useTelegram() composable | src/composables/useTelegram.ts |
| 4 | CSS variables for theme | src/style.css |
| 5 | Translation keys | src/locales/en.json, ru.json |
| 6 | App.vue integration | src/App.vue |
| 7 | ShareModal Telegram button | src/components/kinklist/modals/ShareModal.vue |
| 8 | Final verification | (none) |
