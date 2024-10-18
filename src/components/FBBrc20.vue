<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

const searchInput = ref('');
const allTokens = ref([
  { tick: 'ORDI', totalSupply: '21000000', holders: '12345', transfers: '54321', minted: '100%' },
  { tick: 'PEPE', totalSupply: '420690000000000', holders: '67890', transfers: '98765', minted: '100%' },
  { tick: 'MEME', totalSupply: '69000000000', holders: '23456', transfers: '65432', minted: '95%' },
  { tick: 'SATS', totalSupply: '2100000000000000', holders: '34567', transfers: '76543', minted: '88%' },
  { tick: 'PUNK', totalSupply: '10000', holders: '7890', transfers: '4321', minted: '100%' },
  { tick: 'DOGE', totalSupply: '100000000000', holders: '45678', transfers: '87654', minted: '92%' },
  { tick: 'MOON', totalSupply: '1969000000', holders: '56789', transfers: '98765', minted: '75%' },
  { tick: 'RARE', totalSupply: '1000000', holders: '3456', transfers: '2345', minted: '100%' },
  { tick: 'GOLD', totalSupply: '32000', holders: '6789', transfers: '5678', minted: '80%' },
  { tick: 'CATS', totalSupply: '9000000', holders: '12345', transfers: '23456', minted: '97%' },
  { tick: 'DOGS', totalSupply: '10000000', holders: '23456', transfers: '34567', minted: '95%' },
  { tick: 'FISH', totalSupply: '50000000', holders: '7890', transfers: '6789', minted: '88%' },
]);

const currentPage = ref(1);
const itemsPerPage = 10;

const filteredTokens = computed(() => {
  return allTokens.value.filter(token => 
    token.tick.toLowerCase().includes(searchInput.value.toLowerCase())
  );
});

const paginatedTokens = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTokens.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredTokens.value.length / itemsPerPage);
});

const searchToken = () => {
  currentPage.value = 1;
};

const changePage = (newPage: number) => {
  currentPage.value = newPage;
};

onMounted(() => {
  // No need to fetch data, as we're using mock data
});
</script>

<template>
  <div class="fb-brc20">
    <div class="search-bar">
      <input v-model="searchInput" placeholder="Search token" @keyup.enter="searchToken" />
      <button @click="searchToken">Search</button>
    </div>

    <div class="token-list">
      <table>
        <thead>
          <tr>
            <th>Tick</th>
            <th>Total Supply</th>
            <th>Holders</th>
            <th>Transfers</th>
            <th>Minted</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="token in paginatedTokens" :key="token.tick">
            <td>{{ token.tick }}</td>
            <td>{{ token.totalSupply }}</td>
            <td>{{ token.holders }}</td>
            <td>{{ token.transfers }}</td>
            <td>{{ token.minted }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">&lt; Prev</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Next &gt;</button>
    </div>
  </div>
</template>

<style scoped>
/* Styles remain unchanged */
</style>