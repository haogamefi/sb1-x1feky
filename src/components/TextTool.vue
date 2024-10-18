<script setup lang="ts">
import { ref, onMounted } from 'vue';

const originalFormat = ref('{1}----{2}----{3}----{4}');
const targetFormat = ref('{1}----{2}');
const inputText = ref('');
const outputText = ref('');
const replacementCount = ref(0);

const showToast = ref(false);
const toastMessage = ref('');

onMounted(() => {
  const f1 = localStorage.getItem("zh_format1");
  if (f1) {
    originalFormat.value = f1;
  }
  const f2 = localStorage.getItem("zh_format2");
  if (f2) {
    targetFormat.value = f2;
  }
});

function showToastMessage(message: string) {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
}

function getAllFgf(format: string) {
  const arr = [];
  const reg = /}(.*?){/g;
  let m;
  while ((m = reg.exec(format)) !== null) {
    arr.push(m[1]);
  }
  return arr;
}

function getAllIndex(format: string) {
  const arr = [];
  const reg = /{(\d+)}/g;
  let m;
  while ((m = reg.exec(format)) !== null) {
    arr.push(m[1]);
  }
  return arr;
}

function format2NoFgf(dataLines: string[], regFgf1: RegExp, index2: string[]) {
  const resArr = [];
  for (const line of dataLines) {
    const columns = line.split(regFgf1);
    resArr.push(columns[parseInt(index2[0]) - 1]);
    resArr.push("\n");
  }
  return resArr;
}

function convertText() {
  const fgf1 = getAllFgf(originalFormat.value);
  if (fgf1.length === 0) {
    showToastMessage("原文本格式输入错误，获取分割符失败。");
    return;
  }

  const data = inputText.value.trim();
  if (data.length === 0) {
    showToastMessage("请填写待转换的文本！");
    return;
  }

  const index2 = getAllIndex(targetFormat.value);
  if (index2.length === 0) {
    showToastMessage("转换后格式输入错误，获取索引失败。");
    return;
  }

  const dataLines = data.split(/\r\n|\n/);
  const escapedFgf1 = fgf1.map(f => 
    f.replace(/[|$*?+]/g, "[$&]")
  );

  const reg = new RegExp(escapedFgf1.join("|"));
  let resArr: string[] = [];

  if (index2.length > 1) {
    const fgf2 = getAllFgf(targetFormat.value);
    if (fgf2.length === 0) {
      showToastMessage("转换后格式输入错误，获取分割符失败。");
      return;
    }
    for (const line of dataLines) {
      const columns = line.split(reg);
      for (let j = 0; j < index2.length; j++) {
        resArr.push(columns[parseInt(index2[j]) - 1]);
        if (j !== index2.length - 1) {
          resArr.push(fgf2[j]);
        }
      }
      resArr.push("\n");
    }
  } else {
    resArr = format2NoFgf(dataLines, reg, index2);
  }

  outputText.value = resArr.join("");
  replacementCount.value = dataLines.length;

  localStorage.setItem("zh_format1", originalFormat.value);
  localStorage.setItem("zh_format2", targetFormat.value);

  showToastMessage("转换完成！");
}
</script>

<template>
  <div class="text-tool">
    <h2>文本格式转换</h2>
    <div class="format-inputs">
      <div class="input-group">
        <label for="originalFormat">原文本格式:</label>
        <input id="originalFormat" v-model="originalFormat" type="text" />
      </div>
      <div class="input-group">
        <label for="targetFormat">转换后格式:</label>
        <input id="targetFormat" v-model="targetFormat" type="text" />
      </div>
    </div>
    <div class="text-areas">
      <div class="input-group">
        <label for="inputText">这里输入需要转换的文本:</label>
        <textarea id="inputText" v-model="inputText" rows="10"></textarea>
      </div>
      <div class="input-group">
        <label for="outputText">这里显示转换结果:</label>
        <textarea id="outputText" v-model="outputText" rows="10" readonly></textarea>
      </div>
    </div>
    <button @click="convertText" class="convert-btn">转换</button>
    <p class="result-count">转换前个数: {{ inputText.split('\n').length }} 转换后个数: {{ outputText.split('\n').length }} 替换次数: {{ replacementCount }}</p>
    
    <div v-if="showToast" class="toast">
      {{ toastMessage }}
    </div>
  </div>
</template>

<style scoped>
.text-tool {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  color: var(--accent-color);
  margin-bottom: 20px;
}

.format-inputs {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"], textarea {
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  background-color: var(--background-color);
  color: var(--text-color);
}

.text-areas {
  display: flex;
  justify-content: space-between;
}

.text-areas .input-group {
  width: 48%;
}

textarea {
  width: 100%;
  resize: vertical;
}

.convert-btn {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
}

.convert-btn:hover {
  background-color: var(--hover-color);
}

.result-count {
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
}

.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: var(--accent-color);
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
</style>