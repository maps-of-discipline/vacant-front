import { useToast } from 'primevue';

export default class Toast {
  constructor(life = 3000) {
    this.toast = useToast();
    this.life = life;
  }
  success(message, summary = null) {
    this.toast.add({
      severity: 'success',
      summary: summary || 'Успех',
      detail: message,
      life: this.life,
    });
  }
  info(message, summary = null) {
    this.toast.add({
      severity: 'info',
      summary: summary || 'Информация',
      detail: message,
      life: this.life,
    });
  }
  warn(message, summary = null) {
    this.toast.add({
      severity: 'warn',
      summary: summary || 'Внимание',
      detail: message,
      life: this.life,
    });
  }
  error(message, summary = null) {
    this.toast.add({
      severity: 'error',
      summary: summary || 'Ошибка',
      detail: message,
      life: this.life,
    });
  }
  secondary(message, summary = null) {
    this.toast.add({
      severity: 'secondary',
      summary: summary || 'Информация',
      detail: message,
      life: this.life,
    });
  }
  contrast(message, summary = null) {
    this.toast.add({
      severity: 'contrast',
      summary: summary || 'Информация',
      detail: message,
      life: this.life,
    });
  }
}
