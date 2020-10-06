import { writable } from 'svelte/store';
import config from '../conf/configuration.js'

let configuration = {...config};

async function getSettingsTAPI(){ 
  const api_old = configuration.API_SETTINGS_URL;
  let url = configuration.API_SETTINGS_URL+'/view';        
 
  const settings = await fetch(url)
          .then(response => response)
    .then(data => data.json())
    .then(settings => {
      settings[0].API_SETTINGS_URL = api_old;
      return settings;
          })
          .catch(error => console.log('error', error));

      return settings[0];
}

configuration = getSettingsTAPI();


export const localStore = (key, initial) => {                

  const toString = (value) => JSON.stringify(value, null, 2) 
  const toObj = JSON.parse                                   

  if (localStorage.getItem(key) === null) {                  
    localStorage.setItem(key, toString(initial))             
  }

  const saved = toObj(localStorage.getItem(key))             

  const store = writable(saved)


  function set(value) {
		localStorage.setItem(key, toString(value))             
      return store.set(value)
	}

  return {
    subscribe: store.subscribe,
    set,
    update: store.update
  }
}

export const localStoreTodolist = (key, initial) => {                

  const toString = (value) => JSON.stringify(value, null, 2);
  const toObj = JSON.parse;

  if (localStorage.getItem(key) === null) {                  
    localStorage.setItem(key, toString(initial));          
  }

  let saved = toObj(localStorage.getItem(key));      
  const store = writable(saved);

  function addTask(value) {
    saved = toObj(localStorage.getItem(key));
    saved.push({name: value});

    setFromFrontend(saved);
    createTaskTAPI(value);
  }

  function removeTask(value) {
    saved = toObj(localStorage.getItem(key));

    const taskIndex = saved.findIndex(task => task.id == value);
    const removedTask = saved[taskIndex];
    saved.splice(taskIndex, 1);

    setFromFrontend(saved);
    deleteTasksTAPI(value, removedTask);
  }

  function updateTask(newTask) {
    saved = toObj(localStorage.getItem(key));

    const taskIndex = saved.findIndex(task => task.id == newTask.id);
    const prevTask = toString(saved[taskIndex]);
    saved[taskIndex] = newTask;
    setFromFrontend(saved);

    updateTaskTAPI(newTask, prevTask);
  }

  async function updateTaskTAPI(task, prevTask) {
    configuration.then(configuration => {
      let url = configuration.API_TASKS_URL+'/update/'+task.id;
      let parameterName='name='+task.name;
      let parameterStatus='status='+task.status;
      let parameterDescription='description='+task.description;
      let parameterProjectId='project_id='+task.projectId;

      url = url+'?'+parameterName+'&'+parameterStatus+'&'+parameterDescription+'&'+parameterProjectId;

      var requestOptions = {
        method: 'PUT',
        redirect: 'follow',
      };

      fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => data[0])
        .then(newTask => {
          const taskIndex = saved.findIndex(taskf => taskf.id == task.id);
          saved[taskIndex] = newTask;
          setFromBackend(saved);
        })        
        .catch(error => {
          console.log('error updating task to backend', error);
          const taskIndex = saved.findIndex(taskf => taskf.id == prevTask.id);
          saved[taskIndex] = prevTask;
          setFromBackend(saved);
        });
	  });
	}

  async function createTaskTAPI(taskName){
    configuration.then(configuration => {
      let url = configuration.API_TASKS_URL+'/create?name='+taskName;

      var requestOptions = {
        method: 'POST',
        redirect: 'follow'
      };

      fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => data[0])
        .then(newTask => {
          const taskIndex = saved.findIndex(task => task.name == taskName);
          saved[taskIndex] = newTask;
          setFromBackend(saved);
        })
        .catch(error => {
          console.log('error adding task to backend', error);
          const taskIndex = saved.findIndex(task => task.name == taskName);
          saved.splice(taskIndex, 1);
          setFromBackend(saved);
        }
          );
    });
  }

  async function deleteTasksTAPI(taskId, removedTask){
    configuration.then(configuration => {
      let url = configuration.API_TASKS_URL+'/delete/'+taskId;

      var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
      };

      fetch(url, requestOptions)
        .then(response => response)
        .catch(error => {
          console.log('error deleting task from backend', error);
          saved.push(removedTask);
          setFromBackend(saved);
        });
    });
  }
  
  function setFromFrontend(value) {
    localStorage.setItem(key, toString(value));
    return store.set(value);
	}

  function setFromBackend(value) {
    localStorage.setItem(key, toString(value));
    return store.set(value);
	}

  return {
    subscribe: store.subscribe,
    addTask,
    removeTask,
    updateTask,
    setFromFrontend,
    update: store.update
  }
}

export const localStoreTimesheet = (key, initial) => {                

  const toString = (value) => JSON.stringify(value, null, 2);
  const toObj = JSON.parse;

  if (localStorage.getItem(key) === null) {                  
    localStorage.setItem(key, toString(initial));          
  }

  let saved = toObj(localStorage.getItem(key));      
  const store = writable(saved);

  function addSubslot(value) {
    saved = toObj(localStorage.getItem(key));
    saved.push({name: value});

    setFromFrontend(saved);
    createTaskTAPI(value);
  }

  async function createSubslotTAPI(slotId, taskId, taskName, taskColor) {
    configuration.then(configuration => {
      let url = configuration.API_TIMESHEETS_URL+'/subslots/quick';

      const parameterSlotId='slot_id='+slotId;
      const parameterTaskId='task_id='+taskId;
      const parameterTaskName='task_name='+taskName;
      const parameterTaskColor='task_color='+taskColor.replace('#','%23');

      url = url+'?'+parameterSlotId+'&'+parameterTaskId+'&'+parameterTaskName+'&'+parameterTaskColor;

      var requestOptions = {
        method: 'POST',
        redirect: 'follow'
      };

      fetch(url, requestOptions)
        .then(response => response)
        .then(result => result)
        .catch(error => console.log('error', error));
    });

}    

  async function createTaskTAPI(taskName){
    configuration.then(configuration => {
      let url = configuration.API_TASKS_URL+'/create?name='+taskName;

      var requestOptions = {
        method: 'POST',
        redirect: 'follow'
      };

      fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => data[0])
        .then(newTask => {
          const taskIndex = saved.findIndex(task => task.name == taskName);
          saved[taskIndex] = newTask;
          setFromBackend(saved);
        })
        .catch(error => {
          console.log('error adding task to backend', error);
          const taskIndex = saved.findIndex(task => task.name == taskName);
          saved.splice(taskIndex, 1);
          setFromBackend(saved);
        }
          );
    });
  }
  
  function setFromFrontend(value) {
    localStorage.setItem(key, toString(value));
    return store.set(value);
	}

  function setFromBackend(value) {
    localStorage.setItem(key, toString(value));
    return store.set(value);
	}

  return {
    subscribe: store.subscribe,
    setFromFrontend,
    update: store.update
  }
}