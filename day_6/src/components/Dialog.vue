<script setup>
defineProps({
  title: String
})
</script>

<template>
  <div class="form-overlay" @click.self="$emit('cancel')">
    <div class="form-box">
      <header>
        <slot name="title">
          <h3>{{ title }}</h3>
        </slot>
      </header>
      <slot />
    </div>
  </div>
</template>