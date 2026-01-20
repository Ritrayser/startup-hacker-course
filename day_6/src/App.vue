<template>
  <div id="app">
    <nav class="navbar">
      <router-link to="/" class="nav-link">📚 Книги</router-link>
      <router-link to="/about" class="nav-link">ℹ️ О нас</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<script setup>
</script>

<style>
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 2rem;
  display: flex;
  gap: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 18px;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: rgba(255,255,255,0.2);
}
</style>
