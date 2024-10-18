<script setup lang="ts">
import { ref, watch } from 'vue'
import NavigationBar from './components/NavigationBar.vue'
import AccountSidebar from './components/AccountSidebar.vue'
import ContentArea from './components/ContentArea.vue'

const isSidebarOpen = ref(false)
const currentPage = ref('BTC')
const isDarkMode = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const changePage = (page: string) => {
  currentPage.value = page
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
}

watch(isDarkMode, (newValue) => {
  document.body.classList.toggle('dark-mode', newValue)
})
</script>

<template>
  <div class="app-container" :class="{ 'dark-mode': isDarkMode }">
    <NavigationBar @change-page="changePage" />
    <div class="main-content">
      <ContentArea :current-page="currentPage" />
      <AccountSidebar :is-open="isSidebarOpen" @toggle="toggleSidebar" />
    </div>
    <button @click="toggleDarkMode" class="theme-toggle">
      {{ isDarkMode ? '☀️' : '🌙' }}
    </button>
  </div>
</template>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--background-color);
  color: var(--text-color);
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.theme-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: var(--accent-color);
  color: var(--background-color);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.1s;
}

.theme-toggle:hover {
  transform: scale(1.1);
}

.theme-toggle:active {
  transform: scale(0.9);
}
</style>