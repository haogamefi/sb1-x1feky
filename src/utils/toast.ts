import { createApp } from 'vue';
import Toast from '../components/Toast.vue';

interface ToastOptions {
  message: string;
  duration?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  type?: 'info' | 'success' | 'warning' | 'error';
}

/**
 * 显示一个Toast提示
 * @param options Toast配置选项
 * @param options.message Toast显示的消息
 * @param options.duration Toast显示的持续时间(毫秒)，默认3000ms
 * @param options.position Toast显示的位置，默认'bottom-right'
 * @param options.type Toast的类型，影响背景颜色，默认'info'
 */
export function showToast(options: ToastOptions): void {
  const { message, duration = 3000, position = 'bottom-right', type = 'info' } = options;

  // 创建一个新的div元素作为Toast的容器
  const toastContainer = document.createElement('div');
  document.body.appendChild(toastContainer);

  // 创建Toast组件的实例
  const toastApp = createApp(Toast, {
    message,
    duration,
    position,
    type,
  });

  // 将Toast组件挂载到新创建的div上
  toastApp.mount(toastContainer);

  // 设置定时器，在指定时间后移除Toast
  setTimeout(() => {
    toastApp.unmount();
    document.body.removeChild(toastContainer);
  }, duration);
}