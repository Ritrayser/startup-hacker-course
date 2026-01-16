<script setup>
import { ref, computed } from 'vue'
import BookCard from './components/BookCard.vue'
import BookForm from './components/BookForm.vue'
import Dialog from './components/Dialog.vue'

const books = ref([
  { id: 1, title: 'Властелин колец', desc: 'Эпическая сага', genre: 'Фэнтези', adult: false, rating: 0 },
  { id: 2, title: '1984', desc: 'Антиутопия', genre: 'Антиутопия', adult: true, rating: 0 },
  { id: 3, title: 'Чистый код', desc: 'Как писать код', genre: 'Разработка', adult: false, rating: 0 },
  { id: 4, title: 'Дюна', desc: 'Космическая эпопея', genre: 'Sci-Fi', adult: false, rating: 0 },
  { id: 5, title: 'Гарри Поттер', desc: 'Школа волшебников', genre: 'Фэнтези', adult: false, rating: 0 }
])

const showForm = ref(false)
const editingBookId = ref(null)
const formData = ref({ title: '', desc: '', genre: '', adult: false })

const hoverBookId = ref(null)
const hoverRating = ref(0)

const totalBooks = computed(() => books.value.length)
const averageRating = computed(() => {
  if (!books.value.length) return 0
  const sum = books.value.reduce((acc, b) => acc + b.rating, 0)
  return (sum / books.value.length).toFixed(1)
})

const openAddForm = () => {
  editingBookId.value = null
  formData.value = { title: '', desc: '', genre: '', adult: false }
  showForm.value = true
}

const openEditForm = (book) => {
  editingBookId.value = book.id
  formData.value = { ...book }
  showForm.value = true
}

const saveBook = () => {
  if (!formData.value.title.trim()) return
  if (editingBookId.value) {
    const i = books.value.findIndex(b => b.id === editingBookId.value)
    if (i !== -1) books.value[i] = { ...books.value[i], ...formData.value }
  } else {
    books.value.push({ id: Date.now(), ...formData.value, rating: 0 })
  }
  showForm.value = false
}

const removeBook = (book) => {
  if (confirm(`Удалить "${book.title}"?`))
    books.value = books.value.filter(b => b.id !== book.id)
}

const setRating = (book, stars) => (book.rating = stars)
const resetRatings = () => books.value.forEach(b => (b.rating = 0))
</script>

<template>
  <div class="app">
    <div v-if="totalBooks" class="stats">
      <span>Книг: {{ totalBooks }}</span>
      <span>Рейтинг: {{ averageRating }}</span>
      <button @click="resetRatings" class="reset-btn">Сбросить все</button>
    </div>

    <h1>📚 Мои книги ({{ totalBooks }})</h1>
    <button @click="openAddForm" class="add-book-btn">➕ Добавить</button>

    <div class="books">
      <BookCard
        v-for="book in books"
        :key="book.id"
        :book="book"
        :hoverBookId="hoverBookId"
        :hoverRating="hoverRating"
        @edit="openEditForm"
        @delete="removeBook"
        @setRating="(star) => setRating(book, star)"
        @hoverEnter="(star) => { hoverBookId = book.id; hoverRating = star }"
        @hoverLeave="() => { hoverBookId = null; hoverRating = 0 }"
      />
    </div>

    <Dialog v-if="showForm" title="Книга">
      <BookForm
        v-model="formData"
        @cancel="showForm = false"
        @save="saveBook"
      />
    </Dialog>
  </div>
</template>


<style>
.app {
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px;
}

.books {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.book {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.cover {
  height: 180px;
  position: relative;
}

.info {
  padding: 15px;
}

h3 {
  margin: 0 0 5px 0;
}

.meta {
  display: flex;
  gap: 10px;
  margin: 10px 0;
  font-size: 14px;
}

.genre {
  background: #3498db;
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
}

.adult {
  background: #e74c3c;
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
}

.rating {
  font-weight: bold;
  color: #f1c40f;
}

/* добавил стили только для новых фич */
.stats {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
  align-items: center;
  font-size: 16px;
}

.reset-btn {
  margin-left: auto;
  padding: 6px 12px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-book-btn {
  display: block;
  margin-bottom: 20px;
  padding: 10px 20px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.big-star {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 30px;
  height: 30px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
}

.big-star.empty {
  background: #999;
  color: white;
}

.rating-stars {
  display: flex;
  gap: 2px;
  margin: 10px 0;
}

.star {
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.star.active {
  color: #f1c40f;
  background: #fff3cd;
}

.star.inactive {
  color: #dee2e6;
}

.rating-num {
  font-weight: bold;
  color: #6c757d;
  font-size: 14px;
  margin: 8px 0;
}

.rating-num.rated {
  color: #f1c40f;
}

.book-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.edit-btn,
.delete-btn {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.edit-btn {
  background: #3498db;
  color: white;
}

.delete-btn {
  background: #e74c3c;
  color: white;
}

.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.form-box {
  background: white;
  padding: 25px;
  border-radius: 8px;
  max-width: 450px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.input-group input,
.input-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.form-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-buttons button:first-child {
  background: #6c757d;
  color: white;
}

.form-buttons button:last-child {
  background: #28a745;
  color: white;
}

/* 18+ и галочка СЛЕВА */
.input-group:has(input[type="checkbox"]) {
  display: flex;
  align-items: center;
  gap: 8px;  /* Отступ между текстом и галочкой */
}

.input-group:has(input[type="checkbox"]) input[type="checkbox"] {
  margin: 0;
  width: 18px;
  height: 18px;
  order: -1;  /* Галочка ПЕРЕД текстом (слева) */
}

/* Кнопки ПО ЦЕНТРУ */
.form-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;  /* ← ЦЕНТР */
  margin-top: 20px;
}
</style>
