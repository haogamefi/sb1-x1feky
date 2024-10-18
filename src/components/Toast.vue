<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface ToastProps {
  message: string;
  duration?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  type?: 'info' | 'success' | 'warning' | 'error';
}

const props = withDefaults(defineProps<ToastProps>(), {
  duration: 3000,
  position: 'bottom-right',
  type: 'info'
});

const visible = ref(false);

// 显示Toast
const show = () => {
  visible.value = true;
  setTimeout(() => {
    visible.value = false;
  }, props.duration);
};

// 在组件挂载后自动显示Toast
onMounted(() => {
  show();
});

// 确保在组件卸载时清除定时器
onUnmounted(() => {
  visible.value = false;
});
</script>

<template>
  <Transition name="fade">
    <div v-if="visible" class="toast" :class="[position, type]">
      {{ message }}
    </div>
  </Transition>
</template>

<style scoped>
.toast {
  position: fixed;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  max-width: 300px;
  z-index: 9999;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: opacity 0.3s, transform 0.3s;
}

.top-left {
  top: 20px;
  left: 20px;
}

.top-right {
  top: 20px;
  right: 20px;
}

.bottom-left {
  bottom: 20px;
  left: 20px;
}

.bottom-right {
  bottom: 20px;
  right: 20px;
}

.info {
  background-color: var(--accent-color);
  color: var(--background-color);
}

.success {
  background-color: #4caf50;
  color: white;
}

.warning {
  background-color: #ff9800;
  color: white;
}

.error {
  background-color: #f44336;
  color: white;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>