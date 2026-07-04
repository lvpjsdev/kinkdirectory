# Telegram Mini App Integration

## Overview

Add Telegram Mini App support to the kink directory app. No bot, no encryption, no user binding — just running inside Telegram's WebView with native UI integration and sharing via contacts.

## Requirements

1. **Environment detection** — detect `window.Telegram?.WebApp`
2. **Auto theme** — sync colors with Telegram's `themeParams`
3. **Native buttons** — BackButton + `expand()` to full screen
4. **Sharing** — "Share via Telegram" button using `https://t.me/share/url`

## Scope

### In scope
- `useTelegram()` composable wrapping `@twa-dev/sdk`
- Auto theme (dark/light from Telegram settings)
- BackButton handling
- `expand()` on mount
- Share via Telegram contacts button in ShareModal
- CSS variable mapping for Telegram theme colors
- Safe area handling for Telegram's bottom bar

### Out of scope
- Telegram bot (no BotFather, no webhooks)
- Telegram ID binding (`initDataUnsafe`)
- Encryption of URL data
- Inline Query sharing
- Server-side storage
- `sendData()` to bot

## Architecture

### Dependencies

```bash
yarn add @twa-dev/sdk
```

### New Files

#### `src/composables/useTelegram.ts`

```ts
import WebApp from '@twa-dev/sdk'

export function useTelegram() {
  const isTelegram = !!window.Telegram?.WebApp
  const webApp = isTelegram ? window.Telegram.WebApp : null

  function expand() {
    webApp?.expand()
  }

  function close() {
    webApp?.close()
  }

  function getThemeParams() {
    return webApp?.themeParams || null
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

  return {
    webApp,
    isTelegram,
    expand,
    close,
    getThemeParams,
    setBackButtonVisible,
    onBackButton,
  }
}
```

#### `src/types/telegram.d.ts`

```ts
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        expand: () => void
        close: () => void
        themeParams: Record<string, string>
        BackButton: {
          show: () => void
          hide: () => void
          onClick: (callback: () => void) => void
        }
        // ... other methods
      }
    }
  }
}

export {}
```

### Modified Files

#### `src/App.vue`

- Import `useTelegram()` composable
- Call `expand()` in `onMounted`
- Apply theme CSS variables from `themeParams`

#### `src/style.css`

- Add CSS custom properties for Telegram theme
- Fallback to current colors when not in Telegram

```css
:root {
  --tg-bg-color: transparent;
  --tg-text-color: inherit;
  --tg-hint-color: inherit;
  --tg-button-color: inherit;
  --tg-accent-color: inherit;
}
```

#### `src/components/kinklist/modals/ShareModal.vue`

- Add "Share via Telegram" button
- Opens `https://t.me/share/url?url=<encoded>&text=<text>`

```vue
<UButton
  icon="i-lucide-send"
  variant="soft"
  color="primary"
  @click="shareViaTelegram"
>
  {{ t('app.share_via_telegram') }}
</UButton>
```

```ts
function shareViaTelegram() {
  const text = encodeURIComponent(t('app.share_telegram_text'))
  const url = encodeURIComponent(props.url)
  window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank')
}
```

## Implementation Order

1. Install `@twa-dev/sdk`
2. Create `useTelegram()` composable
3. Create `telegram.d.ts` type declarations
4. Integrate in `App.vue` (init + expand + theme)
5. Add CSS variables for theme
6. Add Telegram share button to `ShareModal`
7. Test in Telegram WebView

## Verification

- Run `yarn typecheck` — no type errors
- Run `yarn lint` — no lint errors
- Run `yarn build` — successful build
- Manual test: open in Telegram Mini App environment
- Manual test: share button opens Telegram share dialog
