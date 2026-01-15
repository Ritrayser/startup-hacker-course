<script setup>
import { computed } from 'vue'

const props = defineProps({
  book: { type: Object, required: true },
  hoverBookId: Number,
  hoverRating: Number
})

const emit = defineEmits(['edit', 'delete', 'setRating', 'hoverEnter', 'hoverLeave'])

const rated = computed(() => props.book.rating > 0)
const getCoverColor = (id) => {
  const colors = ['#4A90E2', '#E74C3C', '#2ECC71', '#F39C12', '#9B59B6']
  return colors[(id - 1) % 5]
}
</script>

<template>
  <div class="book">
    <div class="cover" :style="'background: ' + getCoverColor(book.id)">
      <div class="big-star" :class="{ empty: !book.rating }">
        {{ book.rating || '-' }}
      </div>
    </div>

    <div class="info">
      <h3>{{ book.title }}</h3>
      <p>{{ book.desc }}</p>
      <div class="meta">
        <span class="genre">{{ book.genre }}</span>
        <span v-if="book.adult" class="adult">18+</span>
      </div>

      <!-- Рейтинг -->
      <div class="rating-stars">
        <span
          v-for="star in 5"
          :key="star"
          class="star"
          :class="{
            active: star <= book.rating || (hoverBookId === book.id && star <= hoverRating),
            inactive: star > book.rating || (hoverBookId === book.id && star > hoverRating)
          }"
          @click="emit('setRating', star)"
          @mouseenter="emit('hoverEnter', star)"
          @mouseleave="emit('hoverLeave')"
        >
          ⭐
        </span>
      </div>

      <div class="rating-num" :class="{ rated }">
        {{ book.rating }}/5
      </div>

      <div class="book-actions">
        <button @click="emit('edit', book)" class="edit-btn">Изменить</button>
        <button @click="emit('delete', book)" class="delete-btn">Удалить</button>
      </div>
    </div>
  </div>
</template>
