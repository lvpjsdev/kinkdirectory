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
              :title="t('app.copy_link')"
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
