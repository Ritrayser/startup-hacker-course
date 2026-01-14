<script setup>
import { ref } from 'vue'

// по конспекту: ref для реактивности
const books = ref([
  { id: 1, title: 'Властелин колец', desc: 'Эпическая сага', genre: 'Фэнтези', adult: false, rating: 5 },
  { id: 2, title: '1984', desc: 'Антиутопия', genre: 'Антиутопия', adult: true, rating: 4 },
  { id: 3, title: 'Чистый код', desc: 'Как писать код', genre: 'Разработка', adult: false, rating: 3 },
  { id: 4, title: 'Дюна', desc: 'Космическая эпопея', genre: 'Sci-Fi', adult: false, rating: 5 },
  { id: 5, title: 'Гарри Поттер', desc: 'Школа волшебников', genre: 'Фэнтези', adult: false, rating: 2 }
])

// функция для цвета обложки
const getCoverColor = (id) => {
  const colors = ['#4A90E2', '#E74C3C', '#2ECC71', '#F39C12', '#9B59B6']
  return colors[(id - 1) % 5]
}
</script>

<template>
  <div class="app">
    <h1>📚 Мои книги ({{ books.length }})</h1>
    
    <!-- по конспекту: v-for с :key -->
    <div class="books">
      <div v-for="book in books" :key="book.id" class="book">
        
        <!-- цветная обложка -->
        <div class="cover" :style="'background: ' + getCoverColor(book.id)"></div>
        
        <!-- инфа о книге -->
        <div class="info">
          <h3>{{ book.title }}</h3>
          <p>{{ book.desc }}</p>
          <div class="meta">
            <span class="genre">{{ book.genre }}</span>
            <!-- по конспекту: v-if -->
            <span v-if="book.adult" class="adult">18+</span>
          </div>
          
          <!-- рейтинг книг-->
          <div class="rating">
            ⭐ {{ book.rating }}/5
          </div>
        </div>
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
</style>
