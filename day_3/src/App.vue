<template>
  <div class="app">
    <!-- Статистика -->
    <div v-if="totalBooks" class="stats">
      <span>Книг: {{ totalBooks }}</span>
      <span>Рейтинг: {{ averageRating }}</span>
      <button @click="resetRatings" class="reset-btn">Сбросить все</button>
    </div>

    <h1>📚 Мои книги ({{ totalBooks }})</h1>

    <!-- Кнопка добавления -->
    <button @click="openAddForm" class="add-book-btn">➕ Добавить</button>

    <!-- Список книг -->
    <div class="books">
      <div v-for="book in books" :key="book.id" class="book">
        <!-- Обложка: URL или цветной фон -->
        <div class="cover" :style="{ backgroundImage: getCoverColor(book.cover_url, book.id) }">
         <div v-if="!book.cover_url" class="cover-placeholder">
            📚
          </div>
          <!-- Большая звездочка с рейтингом -->
          <div class="big-star" :class="{ empty: !book.rating }">
            {{ book.rating || '-' }}
          </div>
        </div>

        <!-- Информация о книге -->
        <div class="info">
          <h3>{{ book.title }}</h3>
          <p>{{ book.desc }}</p>
          <div class="meta">
            <span v-for="genreId in book.genres" :key="genreId" class="genre">
              {{genres.find(g => g.id === genreId)?.name}}
            </span>
            <span v-if="book.adult" class="adult">18+</span>
          </div>

          <!-- Интерактивные звездочки -->
          <div class="rating-stars">
            <span v-for="star in 5" :key="star" class="star" :class="{
              active: star <= book.rating || (hoverBookId === book.id && star <= hoverRating),
              inactive: star > book.rating || (hoverBookId === book.id && star > hoverRating)
            }" @click="setRating(book, star)" @mouseenter="starEnter(book.id, star)" @mouseleave="starLeave">
              ⭐
            </span>
          </div>

          <!-- Текущее значение рейтинга -->
          <div class="rating-num" :class="{ 'rated': book.rating }">
            {{ book.rating }}/5
          </div>

          <!-- Кнопки действий -->
          <div class="book-actions">
            <button @click="openEditForm(book)" class="edit-btn">Изменить</button>
            <button @click="removeBook(book)" class="delete-btn">Удалить</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальная форма -->
    <div v-if="showForm" class="form-overlay" @click.self="closeForm">
      <div class="form-box">
        <h3>{{ editingBookId ? 'Править книгу' : 'Новая книга' }}</h3>

        <form @submit.prevent="saveBook">
          <div class="input-group">
            <label>Название книги</label>
            <input v-model="formData.title" required>
          </div>

          <div class="input-group">
            <label>Обложка (URL)</label>
            <input v-model="formData.cover_url" type="url" placeholder="https://example.com/cover.jpg">
            <div v-if="formData.cover_url" class="cover-preview">
              <img :src="formData.cover_url" alt="Preview" class="preview-img">
            </div>
          </div>

          <div class="input-group">
            <label>Жанры (Ctrl+Click для нескольких)</label>
            <select v-model="formData.genre_ids" multiple size="6" class="genre-select">
              <option v-for="genre in genres" :key="genre.id" :value="genre.id">
                {{ genre.name }}
              </option>
            </select>
          </div>

          <!-- ИСПРАВЛЕННАЯ ГАЛОЧКА 18+ -->
          <div class="input-group">
            <div class="age-checkbox">
              <label>18+</label>
              <input type="checkbox" v-model="formData.adult">
            </div>
          </div>

          <div class="form-buttons">
            <button type="button" @click="closeForm">Отмена</button>
            <button type="submit">{{ editingBookId ? 'Сохранить' : 'Добавить' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Жанры для multiple select
const genres = ref([
  { id: 1, name: 'Фэнтези' },
  { id: 2, name: 'Антиутопия' },
  { id: 3, name: 'Разработка' },
  { id: 4, name: 'Sci-Fi' },
  { id: 5, name: 'Детектив' },
  { id: 6, name: 'Роман' },
  { id: 7, name: 'Фантастика' },
  { id: 8, name: 'Любовный роман' }
])

const books = ref([
  {
    id: 1,
    title: 'Властелин колец',
    desc: 'Эпическая сага',
    genres: [1],
    adult: false,
    rating: 0,
    cover_url: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR2RTlfu5uewJaMHUfBXesIlvZoOHWqDKkuFZy95NyLcIe57tgxwkDyOpuLIcZ9T0rJ8gF7lJjsi1Al91e_s8R-un6jRJ796A'
  },
  {
    id: 2,
    title: '1984',
    desc: 'Антиутопия',
    genres: [2],
    adult: true,
    rating: 0,
    cover_url: 'https://imo10.labirint.ru/books/863652/cover.jpg/484-0'
  },
  {
    id: 3,
    title: 'Чистый код',
    desc: 'Как писать код',
    genres: [3],
    adult: false,
    rating: 0,
    cover_url: 'https://ir.ozone.ru/s3/multimedia-1-5/c1000/7377225557.jpg'
  },
  {
    id: 4,
    title: 'Дюна',
    desc: 'Космическая эпопея',
    genres: [4],
    adult: false,
    rating: 0,
    cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbkfAb9cPkSWAF-zIZOFfNgiMdp7t3R_R9Wg&s'
  },
  {
    id: 5,
    title: 'Гарри Поттер',
    desc: 'Школа волшебников',
    genres: [1],
    adult: false,
    rating: 0,
    cover_url: 'https://www.moscowbooks.ru/image/book/454/orig/i454685.jpg?cu=20180101000000'
  }
])

const showForm = ref(false)
const editingBookId = ref(null)
const formData = ref({
  title: '',
  desc: '',
  cover_url: '',
  genre_ids: [],
  adult: false
})

const hoverBookId = ref(null)
const hoverRating = ref(0)

const totalBooks = computed(() => books.value.length)
const averageRating = computed(() => {
  if (!books.value.length) return 0
  const sum = books.value.reduce((acc, book) => acc + book.rating, 0)
  return (sum / books.value.length).toFixed(1)
})

const getCoverColor = (coverUrl, id) => {
  if (coverUrl) {
    return `url(${coverUrl})`
  }
  const colors = ['#4A90E2', '#E74C3C', '#2ECC71', '#F39C12', '#9B59B6']
  return colors[(id - 1) % 5]
}

const setRating = (book, stars) => {
  book.rating = stars
}

const starEnter = (bookId, stars) => {
  hoverBookId.value = bookId
  hoverRating.value = stars
}

const starLeave = () => {
  hoverBookId.value = null
  hoverRating.value = 0
}

const openAddForm = () => {
  editingBookId.value = null
  formData.value = { title: '', desc: '', cover_url: '', genre_ids: [], adult: false }
  showForm.value = true
}

const openEditForm = (book) => {
  editingBookId.value = book.id
  formData.value = {
    title: book.title,
    desc: book.desc,
    cover_url: book.cover_url || '',
    genre_ids: book.genres || [],
    adult: book.adult
  }
  showForm.value = true
}

const saveBook = () => {
  if (!formData.value.title.trim()) return

  if (editingBookId.value) {
    const bookIndex = books.value.findIndex(b => b.id === editingBookId.value)
    if (bookIndex !== -1) {
      books.value[bookIndex] = {
        ...books.value[bookIndex],
        title: formData.value.title,
        desc: formData.value.desc,
        cover_url: formData.value.cover_url,
        genres: [...formData.value.genre_ids],
        adult: formData.value.adult
      }
    }
  } else {
    books.value.push({
      id: Date.now(),
      title: formData.value.title,
      desc: formData.value.desc,
      cover_url: formData.value.cover_url,
      genres: [...formData.value.genre_ids],
      adult: formData.value.adult,
      rating: 0
    })
  }
  showForm.value = false
}

const closeForm = () => {
  showForm.value = false
}

const removeBook = (book) => {
  if (confirm(`Точно удалить "${book.title}"?`)) {
    books.value = books.value.filter(b => b.id !== book.id)
  }
}

const resetRatings = () => {
  if (confirm('Обнулить все рейтинги?')) {
    books.value.forEach(book => book.rating = 0)
  }
}
</script>

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
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.cover-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2.5rem;
  opacity: 0.7;
}

.info {
  padding: 15px;
}

h3 {
  margin: 0 0 5px 0;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
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

/* Статистика */
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

/* Форма */
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

/* ГАЛОЧКА 18+ СПРАВА - ПРОСТО */
.age-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
}

.age-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin: 0;
  accent-color: #dc3545;
  flex-shrink: 0;
}

.age-checkbox label {
  margin: 0;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  user-select: none;
}

.cover-preview {
  margin-top: 8px;
}

.preview-img {
  max-width: 100px;
  max-height: 120px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.genre-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  min-height: 150px;
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
</style>
