<script setup lang="ts">
import { ref, computed } from 'vue';
import TextTool from './TextTool.vue';
import FBBrc20 from './FBBrc20.vue';
import WalletBatchCreation from './WalletBatchCreation.vue';

const props = defineProps<{
  currentPage: string
}>();

const currentTool = computed(() => {
  const [category, tool, subTool] = props.currentPage.split(' - ');
  return subTool?.toLowerCase() || tool?.toLowerCase() || '';
});
</script>

<template>
  <div class="content-area">
    <h2>{{ currentPage }}</h2>
    <TextTool v-if="currentTool === '格式转换'" />
    <FBBrc20 v-else-if="currentPage === 'FB - Brc20'" />
    <WalletBatchCreation v-else-if="currentPage === 'Tool - 钱包批量生成'" />
    <p v-else>Content for {{ currentPage }} goes here.</p>
  </div>
</template>

<style scoped>
.content-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: var(--background-color);
}

h2 {
  color: var(--accent-color);
  font-size: 24px;
  margin-bottom: 20px;
}

p {
  color: var(--text-color);
  font-size: 16px;
  line-height: 1.6;
}
</style>