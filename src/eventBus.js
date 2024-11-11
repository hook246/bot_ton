// EventBus.js
export class EventBus {
    constructor() {
      this.listeners = {};
    }
  
    subscribe(eventName, callback) {
      if (!this.listeners[eventName]) {
        this.listeners[eventName] = [];
      }
      this.listeners[eventName].push(callback);
    }
  
    publish(eventName, data) {
      if (this.listeners[eventName]) {
        this.listeners[eventName].forEach((callback) => callback(data));
      }
    }
  };

  export const BUS_EVENT = {
    WALLET_LOGIN : 'WALLET_LOGIN_INFO',
    GAME_VIEW_LOADED: 'GAME_VIEW_LOADED',
    USE_WALLET_CONNECT: 'USE_WALLET_CONNECT',
    SHOW_LOADING: 'SHOW_LOADING'
  }
  
  // 创建 EventBus 实例并挂载到 window 对象上
  //window.eventBus = new EventBus();
  
  // 现在你可以在任何地方使用 window.eventBus 了
  // 订阅事件
// window.eventBus.subscribe('send', (data) => {
//     console.log('Received message:', data);
//   });
  
//    发布事件
//   window.eventBus.publish('send', 'smg1');