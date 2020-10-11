import { writable } from 'svelte/store';

const alert = () => {                
    const store = writable();
  
    function message(value) {
        let alert = {
            color: 'success',
            text: value
        };
        return store.set(alert);        
    }
    
    function warning(value) {
        let alert = {
            color: 'alert',
            text: value
        };
        return store.set(alert);        
    }
  
    function error(value) {
        let alert = {
            color: 'error',
            text: value
        };
        return store.set(alert);    
    }
  
    return {
      subscribe: store.subscribe,
      message,
      warning,
      error,
      update: store.update
    }
  }

  export const alertstore = alert();

