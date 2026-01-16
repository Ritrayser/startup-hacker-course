<script setup>
import { ref, computed } from 'vue'

// по конспекту: ref для реактивности
const books = ref([
  { id: 1, title: 'Властелин колец', desc: 'Эпическая сага', genre: 'Фэнтези', adult: false, rating: 0 },
  { id: 2, title: '1984', desc: 'Антиутопия', genre: 'Антиутопия', adult: true, rating: 0 },
  { id: 3, title: 'Чистый код', desc: 'Как писать код', genre: 'Разработка', adult: false, rating: 0 },
  { id: 4, title: 'Дюна', desc: 'Космическая эпопея', genre: 'Sci-Fi', adult: false, rating: 0 },
  { id: 5, title: 'Гарри Поттер', desc: 'Школа волшебников', genre: 'Фэнтези', adult: false, rating: 0 }
])

// сделал форму по конспекту день 3
const showForm = ref(false)
const editingBookId = ref(null)
const formData = ref({
  title: '',
  desc: '',
  genre: '',
  adult: false
})

// для звездочек hover (день 3 события)
const hoverBookId = ref(null)
const hoverRating = ref(0)

// посчитал статистику (computed из конспекта)
const totalBooks = computed(() => books.value.length)
const averageRating = computed(() => {
  if (!books.value.length) return 0
  const sum = books.value.reduce((acc, book) => acc + book.rating, 0)
  return (sum / books.value.length).toFixed(1)
})

// функция для цвета обложки
const getCoverColor = (id) => {
  const colors = ['#4A90E2', '#E74C3C', '#2ECC71', '#F39C12', '#9B59B6']
  return colors[(id - 1) % 5]
}

// ставлю рейтинг по клику (день 3 @click)
const setRating = (book, stars) => {
  book.rating = stars
}

// hover для звездочек
const starEnter = (bookId, stars) => {
  hoverBookId.value = bookId
  hoverRating.value = stars
}

const starLeave = () => {
  hoverBookId.value = null
  hoverRating.value = 0
}

// открываю форму (день 3 события)
const openAddForm = () => {
  editingBookId.value = null
  formData.value = { title: '', desc: '', genre: '', adult: false }
  showForm.value = true
}

const openEditForm = (book) => {
  editingBookId.value = book.id
  formData.value = { 
    title: book.title, 
    desc: book.desc, 
    genre: book.genre, 
    adult: book.adult 
  }
  showForm.value = true
}

// сохраняю форму (день 3 v-model + @submit.prevent)  
const saveBook = () => {
  if (!formData.value.title.trim()) return
  
  if (editingBookId.value) {
    // редактирую
    const bookIndex = books.value.findIndex(b => b.id === editingBookId.value)
    if (bookIndex !== -1) {
      books.value[bookIndex].title = formData.value.title
      books.value[bookIndex].desc = formData.value.desc
      books.value[bookIndex].genre = formData.value.genre
      books.value[bookIndex].adult = formData.value.adult
    }
  } else {
    // добавляю новую
    books.value.push({
      id: Date.now(),
      title: formData.value.title,
      desc: formData.value.desc,
      genre: formData.value.genre,
      adult: formData.value.adult,
      rating: 0
    })
  }
  
  showForm.value = false
}

const closeForm = () => {
  showForm.value = false
}

// удаление (просто @click)
const removeBook = (book) => {
  if (confirm(`Точно удалить "${book.title}"?`)) {
    books.value = books.value.filter(b => b.id !== book.id)
  }
}

// сбрасываю все рейтинги
const resetRatings = () => {
  if (confirm('Обнулить все рейтинги?')) {
    books.value.forEach(book => book.rating = 0)
  }
}
</script>

<template>
  <div class="app">
    <!-- добавил статистику -->
    <div v-if="totalBooks" class="stats">
      <span>Книг: {{ totalBooks }}</span>
      <span>Рейтинг: {{ averageRating }}</span>
      <button @click="resetRatings" class="reset-btn">Сбросить все</button>
    </div>
    
    <h1>📚 Мои книги ({{ totalBooks }})</h1>
    
    <!-- кнопка добавления -->
    <button @click="openAddForm" class="add-book-btn">➕ Добавить</button>
    
    <!-- по конспекту: v-for с :key -->
    <div class="books">
      <div v-for="book in books" :key="book.id" class="book">
        
        <!-- цветная обложка -->
        <div class="cover" :style="'background: ' + getCoverColor(book.id)">
          <!-- большая звездочка с рейтингом (день 3 :class) -->
          <div class="big-star" :class="{ empty: !book.rating }">
            {{ book.rating || '-' }}
          </div>
        </div>
        
        <!-- инфа о книге -->
        <div class="info">
          <h3>{{ book.title }}</h3>
          <p>{{ book.desc }}</p>
          <div class="meta">
            <span class="genre">{{ book.genre }}</span>
            <!-- по конспекту: v-if -->
            <span v-if="book.adult" class="adult">18+</span>
          </div>
          
          <!-- звездочки которые кликаются (день 3 @click + :class) -->
          <div class="rating-stars">
            <span 
              v-for="star in 5" 
              :key="star"
              class="star"
              :class="{ 
                active: star <= book.rating || (hoverBookId === book.id && star <= hoverRating),
                inactive: star > book.rating || (hoverBookId === book.id && star > hoverRating)
              }"
              @click="setRating(book, star)"
              @mouseenter="starEnter(book.id, star)"
              @mouseleave="starLeave"
            >
              ⭐
            </span>
          </div>
          
          <!-- текущее значение рейтинга -->
          <div class="rating-num" :class="{ 'rated': book.rating }">
            {{ book.rating }}/5
          </div>
          
          <!-- кнопки -->
          <div class="book-actions">
            <button @click="openEditForm(book)" class="edit-btn">Изменить</button>
            <button @click="removeBook(book)" class="delete-btn">Удалить</button>
          </div>
        </div>
      </div>
    </div>

    <!-- форма (день 3 v-model везде) -->
    <div v-if="showForm" class="form-overlay" @click.self="closeForm">
      <div class="form-box">
        <h3>{{ editingBookId ? 'Править книгу' : 'Новая книга' }}</h3>
        
        <form @submit.prevent="saveBook">
          <div class="input-group">
            <label>Название книги</label>
            <input v-model="formData.title" required>
          </div>
          
          <div class="input-group">
            <label>Описание</label>
            <textarea v-model="formData.desc" rows="3"></textarea>
          </div>
          
          <div class="input-group">
            <label>Жанр</label>
            <input v-model="formData.genre">
          </div>
          
          <div class="input-group">
            <label>
              <input type="checkbox" v-model="formData.adult"> 18+
            </label>
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
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
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

.edit-btn, .delete-btn {
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
  background: rgba(0,0,0,0.5);
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
  order: -1;  /* Галочка перед текстом */
}

/* Кнопки ПО ЦЕНТРУ */
.form-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;  /* ← Выровнил по центру */
  margin-top: 20px;
}
</style>
