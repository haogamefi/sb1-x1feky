<script setup lang="ts">
import { ref, computed } from 'vue';
import { ethers } from 'ethers';
import * as bitcoin from 'bitcoinjs-lib';
import { showToast } from '../utils/toast';

interface Chain {
  id: string;
  name: string;
}

interface Wallet {
  address: string;
  privateKey: string;
  mnemonic: string;
}

const chains: Chain[] = [
  { id: 'BTC', name: 'Bitcoin' },
  { id: 'ETH', name: 'Ethereum' },
  { id: 'BSC', name: 'Binance Smart Chain' },
];

const selectedChain = ref('BTC');
const mnemonicLength = ref(12);
const walletCount = ref(1);
const generatedWalletCount = ref(1);
const generatedWallets = ref<Wallet[]>([]);

const mnemonicLengths = [12, 15, 18, 21, 24];

const isEVMChain = computed(() => ['ETH', 'BSC'].includes(selectedChain.value));

function generateWallets() {
  generatedWallets.value = [];
  for (let i = 0; i < walletCount.value; i++) {
    if (selectedChain.value === 'BTC') {
      generateBTCWallet();
    } else {
      generateEVMWallet();
    }
  }
  showToast({
    message: `成功生成 ${walletCount.value} 个 ${selectedChain.value} 钱包`,
    type: 'success',
    duration: 3000
  });
}

function generateBTCWallet() {
  const network = bitcoin.networks.bitcoin;
  const keyPair = bitcoin.ECPair.makeRandom({ network });
  const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network });
  const privateKey = keyPair.toWIF();
  const mnemonic = 'Not available for BTC'; // BTC doesn't use mnemonics in this simple implementation

  if (address) {
    generatedWallets.value.push({ address, privateKey, mnemonic });
  }
}

function generateEVMWallet() {
  const wallet = ethers.Wallet.createRandom();
  const address = wallet.address;
  const privateKey = wallet.privateKey;
  const mnemonic = wallet.mnemonic?.phrase || 'Not available';

  generatedWallets.value.push({ address, privateKey, mnemonic });
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    showToast({
      message: '已复制到剪贴板',
      type: 'success',
      duration: 2000
    });
  }).catch(err => {
    console.error('无法复制文本: ', err);
    showToast({
      message: '复制失败',
      type: 'error',
      duration: 2000
    });
  });
}

function exportWallets() {
  let csv = 'Address,Private Key,Mnemonic\n';
  generatedWallets.value.forEach(wallet => {
    csv += `${wallet.address},${wallet.privateKey},${wallet.mnemonic}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedChain.value}_wallets.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
</script>

<template>
  <div class="wallet-batch-creation">
    <h2>批量生成 {{ selectedChain }} 钱包地址</h2>
    
    <div class="options">
      <div class="option-group">
        <label>选择批量生成钱包的链：</label>
        <div class="chain-buttons">
          <button 
            v-for="chain in chains" 
            :key="chain.id"
            @click="selectedChain = chain.id"
            :class="{ active: selectedChain === chain.id }"
          >
            {{ chain.name }}
          </button>
        </div>
      </div>
      
      <div class="option-group" v-if="isEVMChain">
        <label>选择助记词长度：</label>
        <div class="mnemonic-buttons">
          <button 
            v-for="length in mnemonicLengths" 
            :key="length"
            @click="mnemonicLength = length"
            :class="{ active: mnemonicLength === length }"
          >
            {{ length }}位
          </button>
        </div>
      </div>

      <div class="option-group">
        <label>生成数量：</label>
        <div class="quantity-input">
          <button @click="walletCount = Math.max(1, walletCount - 1)">-</button>
          <input type="number" v-model="walletCount" min="1" max="100">
          <button @click="walletCount = Math.min(100, walletCount + 1)">+</button>
        </div>
      </div>

      <div class="option-group">
        <label>生成的钱包地址数量：</label>
        <div class="quantity-input">
          <button @click="generatedWalletCount = Math.max(1, generatedWalletCount - 1)">-</button>
          <input type="number" v-model="generatedWalletCount" min="1" max="100">
          <button @click="generatedWalletCount = Math.min(100, generatedWalletCount + 1)">+</button>
        </div>
      </div>
    </div>

    <button @click="generateWallets" class="generate-button">立即生成</button>

    <div v-if="generatedWallets.length > 0" class="generated-wallets">
      <h3>生成的钱包：</h3>
      <button @click="exportWallets" class="export-button">导出 CSV</button>
      <table>
        <thead>
          <tr>
            <th>地址</th>
            <th>私钥</th>
            <th>助记词</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(wallet, index) in generatedWallets" :key="index">
            <td>
              {{ wallet.address }}
              <button @click="copyToClipboard(wallet.address)" class="copy-button">复制</button>
            </td>
            <td>
              {{ wallet.privateKey.slice(0, 10) }}...
              <button @click="copyToClipboard(wallet.privateKey)" class="copy-button">复制</button>
            </td>
            <td>
              {{ wallet.mnemonic.slice(0, 10) }}...
              <button @click="copyToClipboard(wallet.mnemonic)" class="copy-button">复制</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.wallet-batch-creation {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  color: var(--accent-color);
  margin-bottom: 20px;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  font-weight: bold;
}

.chain-buttons, .mnemonic-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

button {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  background-color: var(--background-color);
  color: var(--text-color);
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}

button:hover {
  background-color: var(--hover-color);
}

button.active {
  background-color: var(--accent-color);
  color: var(--background-color);
}

.quantity-input {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-input input {
  width: 60px;
  text-align: center;
  padding: 5px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.generate-button {
  width: 100%;
  padding: 10px;
  background-color: var(--accent-color);
  color: var(--background-color);
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.generate-button:hover {
  background-color: var(--hover-color);
}

.generated-wallets {
  margin-top: 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  border: 1px solid var(--border-color);
  padding: 10px;
  text-align: left;
}

th {
  background-color: var(--accent-color);
  color: var(--background-color);
}

.copy-button {
  padding: 2px 5px;
  font-size: 12px;
  margin-left: 5px;
}

.export-button {
  margin-bottom: 10px;
  padding: 5px 10px;
  background-color: var(--accent-color);
  color: var(--background-color);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.export-button:hover {
  background-color: var(--hover-color);
}
</style>