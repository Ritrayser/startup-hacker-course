<script setup>
const props = defineProps({
  modelValue: { type: Object, required: true }
})
const emit = defineEmits(['update:modelValue', 'cancel', 'save'])

const updateField = (field, value) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}
</script>

<template>
  <form @submit.prevent="emit('save')">
    <div class="input-group">
      <label>Название книги</label>
      <input :value="modelValue.title" @input="updateField('title', $event.target.value)" required>
    </div>

    <div class="input-group">
      <label>Описание</label>
      <textarea :value="modelValue.desc" rows="3" @input="updateField('desc', $event.target.value)" />
    </div>

    <div class="input-group">
      <label>Жанр</label>
      <input :value="modelValue.genre" @input="updateField('genre', $event.target.value)">
    </div>

    <div class="input-group">
      <label><input type="checkbox" :checked="modelValue.adult" @change="updateField('adult', $event.target.checked)"> 18+</label>
    </div>

    <div class="form-buttons">
      <button type="button" @click="emit('cancel')">Отмена</button>
      <button type="submit">Сохранить</button>
    </div>
  </form>
</template>
