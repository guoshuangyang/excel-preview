import type { CallbackArgsType, eventNameType } from "~/@types/event/index";
// 默认把鼠标的各种事件抛出去,事件进行统一管理
class PublicScribe {
  events: { [key: string]: Function[] };
  constructor() {
    this.events = {};
  }
  on(eventName: eventNameType, callback: (args: CallbackArgsType) => void) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }
  emit(eventName: eventNameType, args: CallbackArgsType) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => {
        callback(args);
      });
    }
  }
  off(eventName: eventNameType, callback: (args: CallbackArgsType) => void) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        (item) => item !== callback
      );
    }
  }
  clear() {
    this.events = {};
  }
}

// 暂时已知的事件包含 mouseDblClick mouseDown mouseOver
export default new PublicScribe();
