<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: { type: Object, required: true }
})
const emit = defineEmits(['update:modelValue', 'cancel', 'save'])

const titleInput = ref(null)
let debounceTimer = null

const debouncedSend = (text) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    console.log(`Отправляем "${text}" на сервер`)
  }, 500)
}

const updateField = (field, value) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
  if (field === 'title') {
    debouncedSend(value)
  }
}

watch(() => props.modelValue.title, (newTitle, oldTitle) => {
  if (oldTitle === undefined && newTitle !== undefined) {
    nextTick(() => {
      titleInput.value?.focus()
    })
  }
}, { immediate: true })
</script>

<template>
  <form @submit.prevent="$emit('save', modelValue)">
    <div class="input-group">
      <label>Название книги</label>
      <input 
        ref="titleInput"
        :value="modelValue.title" 
        @input="updateField('title', $event.target.value)" 
        required
      >
    </div>

    <div class="input-group">
      <label>Описание</label>
      <textarea 
        :value="modelValue.desc" 
        rows="3" 
        @input="updateField('desc', $event.target.value)" 
      />
    </div>

    <div class="input-group">
      <label>Жанр</label>
      <input 
        :value="modelValue.genre" 
        @input="updateField('genre', $event.target.value)"
      />
    </div>

    <div class="age-checkbox">
      <label>18+</label>
      <input 
        type="checkbox" 
        :checked="modelValue.adult" 
        @change="updateField('adult', $event.target.checked)"
      />
    </div>

    <div class="form-buttons">
      <button type="button" @click="$emit('cancel')">Отмена</button>
      <button type="submit">Сохранить</button>
    </div>
  </form>
</template>
