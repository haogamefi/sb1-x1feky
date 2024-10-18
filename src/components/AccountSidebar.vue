<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from '../utils/toast'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['toggle'])

const accountName = ref('User123')
const btcWallet = ref('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh')
const evmWallet = ref('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')

const toggleSidebar = () => {
  emit('toggle')
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    showToast({
      message: '地址已复制到剪贴板',
      type: 'success',
      duration: 2000
    })
  }).catch(err => {
    console.error('无法复制文本: ', err)
    showToast({
      message: '复制失败',
      type: 'error',
      duration: 2000
    })
  })
}

const expandedWallets = ref({
  btc: false,
  evm: false
})

const toggleWallet = (wallet: 'btc' | 'evm') => {
  expandedWallets.value[wallet] = !expandedWallets.value[wallet]
}
</script>

<template>
  <div class="account-sidebar" :class="{ 'sidebar-open': isOpen }">
    <button class="toggle-btn" @click="toggleSidebar">
      {{ isOpen ? '>' : '<' }}
    </button>
    <div v-if="isOpen" class="sidebar-content">
      <div class="user-info">
        <div class="user-avatar">
          <span>{{ accountName[0] }}</span>
        </div>
        <h2>{{ accountName }}</h2>
      </div>
      <div class="wallet-card">
        <div class="wallet-header" @click="toggleWallet('btc')">
          <h3>BTC Wallet</h3>
          <span class="arrow" :class="{ 'arrow-down': expandedWallets.btc }">▼</span>
        </div>
        <div v-if="expandedWallets.btc" class="wallet-addresses">
          <p @click="copyToClipboard(btcWallet)">{{ btcWallet }}</p>
        </div>
      </div>
      <div class="wallet-card">
        <div class="wallet-header" @click="toggleWallet('evm')">
          <h3>EVM Wallet</h3>
          <span class="arrow" :class="{ 'arrow-down': expandedWallets.evm }">▼</span>
        </div>
        <div v-if="expandedWallets.evm" class="wallet-addresses">
          <p @click="copyToClipboard(evmWallet)">{{ evmWallet }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.account-sidebar {
  background-color: var(--background-color);
  height: 100%;
  position: relative;
  transition: width 0.3s ease;
  width: 50px;
  border-left: 1px solid var(--border-color);
}

.sidebar-open {
  width: 340px;
}

.toggle-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 20px;
  color: var(--text-color);
  background: none;
  border: none;
  padding: 5px;
  cursor: pointer;
  z-index: 10;
  transition: color 0.3s ease;
}

.toggle-btn:hover {
  color: var(--accent-color);
}

.sidebar-content {
  padding: 60px 15px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--accent-color);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
}

.user-avatar span {
  font-size: 18px;
  color: var(--background-color);
  font-weight: bold;
}

h2 {
  font-size: 16px;
  margin: 0;
}

.wallet-card {
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.wallet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.wallet-header h3 {
  margin: 0;
  font-size: 14px;
  color: var(--accent-color);
}

.arrow {
  font-size: 12px;
  transition: transform 0.3s ease;
}

.arrow-down {
  transform: rotate(180deg);
}

.wallet-addresses {
  margin-top: 5px;
}

.wallet-addresses p {
  word-break: break-all;
  font-size: 12px;
  margin: 5px 0;
  cursor: pointer;
  padding: 5px;
  background-color: var(--hover-color);
  border-radius: 4px;
}

.wallet-addresses p:hover {
  background-color: var(--accent-color);
  color: var(--background-color);
}
</style>