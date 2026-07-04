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
