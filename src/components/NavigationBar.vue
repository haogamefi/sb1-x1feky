<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['change-page'])

const categories = ref([
  { name: 'BTC', subItems: ['Brc20', 'Rune', 'seedup'] },
  { name: 'FB', subItems: ['Brc20', 'Rune', 'Cat20'] },
  { name: 'EVM', subItems: ['批量MINT', '批量归集', 'ERC1155'] },
  { name: 'Tool', subItems: ['钱包批量生成', '文本工具'] }
])

const textToolSubItems = ['格式转换']

const activeCategory = ref('')
const activeSubItem = ref('')
const activeTextToolItem = ref('')
const navRef = ref<HTMLElement | null>(null)

const setActiveCategory = (category: string) => {
  activeCategory.value = category
  activeSubItem.value = ''
  activeTextToolItem.value = ''
}

const clearActiveCategory = () => {
  activeCategory.value = ''
  activeSubItem.value = ''
  activeTextToolItem.value = ''
}

const selectSubItem = (category: string, subItem: string) => {
  activeCategory.value = category
  activeSubItem.value = subItem
  activeTextToolItem.value = ''
  emit('change-page', `${category} - ${subItem}`)
}

const selectTextToolItem = (item: string) => {
  activeTextToolItem.value = item
  emit('change-page', `Tool - 文本工具 - ${item}`)
}

const hasSubItems = (category: string, subItem: string) => {
  return category === 'Tool' && subItem === '文本工具'
}

const handleClickOutside = (event: MouseEvent) => {
  if (navRef.value && !navRef.value.contains(event.target as Node)) {
    clearActiveCategory()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

watch([activeCategory, activeSubItem, activeTextToolItem], () => {
  if (!activeCategory.value) {
    activeSubItem.value = ''
    activeTextToolItem.value = ''
  }
  if (!activeSubItem.value) {
    activeTextToolItem.value = ''
  }
})
</script>

<template>
  <nav class="navigation-bar" ref="navRef">
    <div class="logo">MaiG</div>
    <ul class="categories">
      <li v-for="category in categories" :key="category.name" 
          @mouseenter="setActiveCategory(category.name)" 
          @mouseleave="clearActiveCategory">
        <button :class="{ active: activeCategory === category.name }">
          {{ category.name }}
          <span class="arrow">▼</span>
        </button>
        <ul v-if="activeCategory === category.name" class="sub-items">
          <li v-for="subItem in category.subItems" :key="subItem">
            <button @click="selectSubItem(category.name, subItem)" :class="{ active: activeSubItem === subItem }">
              {{ subItem }}
              <span v-if="category.name === 'Tool' && subItem === '文本工具'" class="arrow right">▶</span>
            </button>
            <ul v-if="category.name === 'Tool' && subItem === '文本工具' && activeSubItem === '文本工具'" class="文本工具-items">
              <li v-for="item in textToolSubItems" :key="item">
                <button @click="selectTextToolItem(item)" :class="{ active: activeTextToolItem === item }">
                  {{ item }}
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.navigation-bar {
  background-color: var(--background-color);
  padding: 10px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  position: relative;
  z-index: 10;
}

.logo {
  background-color: #FFD700;
  color: #000000;
  font-weight: bold;
  font-size: 18px;
  padding: 8px 16px;
  border-radius: 8px;
  margin-right: 40px;
}

.categories {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-grow: 1;
  justify-content: center;
}

.categories > li {
  margin: 0 20px;
  position: relative;
}

button {
  font-size: 16px;
  padding: 10px 15px;
  border-radius: 4px;
  color: var(--text-color);
  display: flex;
  align-items: center;
  font-weight: 500;
  transition: color 0.3s ease;
}

button:hover, button:focus {
  color: #60a5fa;
}

button .arrow {
  font-size: 12px;
  margin-left: 5px;
}

button .arrow.right {
  margin-left: auto;
}

button.active {
  font-weight: bold;
  background-color: var(--accent-color);
  color: var(--background-color);
}

.sub-items {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 5px 0;
  list-style-type: none;
  min-width: 160px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.sub-items li {
  padding: 2px 5px;
  position: relative;
}

.sub-items button {
  width: 100%;
  text-align: left;
  padding: 8px 15px;
  font-size: 14px;
  justify-content: space-between;
}

.sub-items button:hover {
  background-color: var(--hover-color);
}

.文本工具-items {
  position: absolute;
  left: 100%;
  top: 0;
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 5px 0;
  list-style-type: none;
  min-width: 160px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.文本工具-items li {
  padding: 2px 5px;
}

.文本工具-items button {
  width: 100%;
  text-align: left;
  padding: 6px 12px;
  font-size: 13px;
}

.文本工具-items button:hover {
  background-color: var(--hover-color);
}
</style>