<template>
  <div class="flex-1 flex flex-col items-center justify-start min-w-0 w-full">
    <ChatPreview @follow-up="handleFollowUp" />
    <div class="w-full md:w-[375px] mt-4">
      <ExportButton />
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatPreview from './ChatPreview.vue'
import ExportButton from './ExportButton.vue'

const emit = defineEmits<{
  followUp: [instruction: string]
}>()

function handleFollowUp(text: string) {
  emit('followUp', text)
}
</script>
