import { writable } from 'svelte/store';
import config from '../conf/configuration.js'
import {alertstore} from './alert.js'


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

const formatDate = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let month = date.getMonth()+1;
  let day = date.getDate();

  month = month < 10 ? '0'+month : month;
  day = day < 10 ? '0'+day : day;
  minutes = minutes < 10 ? '0'+minutes : minutes;
  hours = hours < 10 ? '0'+hours : hours;
  seconds = seconds < 10 ? '0'+seconds : seconds;

  let strTime = hours + ':' + minutes + ':' + seconds;
  return date.getFullYear() + "-" + month + "-" + day + "T" + strTime;
};

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

  function addTask(task) {
    saved = toObj(localStorage.getItem(key));
    saved.push(task);
    console.log(task);


    setFromFrontend(saved);
    createTaskTAPI(task);
  }

  function removeTask(task) {
    saved = toObj(localStorage.getItem(key));

    const taskIndex = saved.findIndex(t => t.id == task.id);
    saved.splice(taskIndex, 1);

    setFromFrontend(saved);
    deleteTasksTAPI(task);
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
      let parameterProjectId='project_id='+task.project_id;

      url = url+'?'+parameterName+'&'+parameterStatus+'&'+parameterDescription+'&'+parameterProjectId;

      var requestOptions = {
        method: 'PUT',
        redirect: 'follow',
      };

      const taskIndex = saved.findIndex(taskf => taskf.id == task.id);

      fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => data[0])
        .then(newTask => {
          saved[taskIndex] = newTask;
          setFromBackend(saved);
          alertstore.message('Task updated successfully');
        })        
        .catch(error => {
          console.log('error updating task to backend', error);
          saved[taskIndex] = prevTask;
          setFromBackend(saved);
          alertstore.error('Ups there was an error...');
        });
	  });
	}

  async function createTaskTAPI(task){
    configuration.then(configuration => {
      let url = configuration.API_TASKS_URL+'/create?name='+task.name;

      var requestOptions = {
        method: 'POST',
        redirect: 'follow'
      };

      const taskIndex = saved.findIndex(t => t.name == task.name);
      console.log(task);

      fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => data[0])
        .then(newTask => {
          console.log(newTask);

          saved[taskIndex] = newTask;
          setFromBackend(saved);
          alertstore.message('Task added successfully');
        })
        .catch(error => {
          console.log('error adding task to backend', error);
          saved.splice(taskIndex, 1);
          setFromBackend(saved);
          alertstore.error('Ups there was an error...');
        });
    });
  }

  async function deleteTasksTAPI(task){
    configuration.then(configuration => {
      let url = configuration.API_TASKS_URL+'/delete/'+task.id;

      var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
      };

      fetch(url, requestOptions)
        .then(() => {
          alertstore.message('Task deleted successfully');
        })
        .catch(error => {
          console.log('error deleting task from backend', error);
          saved.push(task);
          setFromBackend(saved);
          alertstore.error('Ups there was an error...');
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

  function addSubslot(task) {
    saved = toObj(localStorage.getItem(key));
    
    const slotIndex = saved.Slots.findIndex(slot => slot.id == task.slot_id);
    saved.Slots[slotIndex].Subslots.push(task);

    setFromFrontend(saved);
    createSubslotTAPI(task);
  }

  function removeSubslot(subslot) {
    saved = toObj(localStorage.getItem(key));

    const slotIndex = saved.Slots.findIndex(slot => slot.id == subslot.slot_id);
    const subslotIndex = saved.Slots[slotIndex].Subslots.findIndex(t => t.id == subslot.id);

    const removedSubslot = saved.Slots[slotIndex].Subslots[subslotIndex];
    saved.Slots[slotIndex].Subslots.splice(subslotIndex, 1);

    setFromFrontend(saved);
    deleteSubslotTAPI(removedSubslot);
  }

  function updateSubslot(subslot) {
    saved = toObj(localStorage.getItem(key));

    const slotIndex = saved.Slots.findIndex(slot => slot.id == subslot.slot_id);
    const subslotIndex = saved.Slots[slotIndex].Subslots.findIndex(t => t.id == subslot.id);

    const updatedSubslot = saved.Slots[slotIndex].Subslots[subslotIndex];
    saved.Slots[slotIndex].Subslots[subslotIndex] = subslot;

    setFromFrontend(saved);
    updateSubslotTAPI(subslot, updatedSubslot) ;
  }

  async function updateSubslotTAPI(subslot, updatedSubslot){
    configuration.then(configuration => {

      let url = configuration.API_TIMESHEETS_URL+'/subslots';
      
      const parameterSubslotId='/'+subslot.id;
      const parameterSlotId='slot_id='+subslot.slot_id;
      const parameterStartDate='start_date='+formatDate(new Date(subslot.start_date));
      const parameterEndDate='end_date='+formatDate(new Date(subslot.end_date));
      const parameterOperation='operation=change_dates';

      url += parameterSubslotId+'?'+parameterSlotId+'&'+parameterStartDate+'&'+parameterEndDate+'&'+parameterOperation; 
      
    var requestOptions = {
      method: 'PUT',
      redirect: 'follow'
    };

    fetch(url, requestOptions)
    .then(response => response.json())
    .then(data => data[0])
    .then(() => {
      saved.ppm_synced = 1;
      setFromBackend(saved);
    })        
    .catch(error => {
      console.log('error updating subslot from backend', error);
      const slotIndex = saved.Slots.findIndex(slot => slot.id == updatedSubslot.slot_id);
      const subslotIndex = saved.Slots[slotIndex].Subslots.findIndex(subslot => subslot.id == updatedSubslot.id);

      saved.Slots[slotIndex].Subslots[subslotIndex] = updatedSubslot;
      setFromBackend(saved);
    });
  }); 

  
}

  async function deleteSubslotTAPI(removedSubslot) {
    configuration.then(configuration => {
      let url = configuration.API_TIMESHEETS_URL+'/subslots/'+removedSubslot.id;

      var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
      };

      fetch(url, requestOptions)
        .then(response => response)
        .then(() => {
          saved.ppm_synced = 1;
          setFromBackend(saved);
        }) 
        .catch(error => {
          console.log('error removing subslot from backend', error);
          const slotIndex = saved.Slots.findIndex(slot => slot.id == removedSubslot.slot_id);
          saved.Slots[slotIndex].Subslots.push(removedSubslot);
          setFromBackend(saved);
      }); 
    });
  }

  async function createSubslotTAPI(task) {
    configuration.then(configuration => {
      let url = configuration.API_TIMESHEETS_URL+'/subslots/quick';

      const parameterSlotId='slot_id='+task.slot_id;
      const parameterTaskId='task_id='+task.task_id;
      const parameterTaskName='task_name='+task.task_name;
      const parameterTaskColor='task_color='+task.project.color.replace('#','%23');

      url = url+'?'+parameterSlotId+'&'+parameterTaskId+'&'+parameterTaskName+'&'+parameterTaskColor;

      var requestOptions = {
        method: 'POST',
        redirect: 'follow'
      };

      
      fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => data[0])
        .then(newSubslot => {
          const slotIndex = saved.Slots.findIndex(slot => slot.id == task.slot_id);
          const subslotIndex = saved.Slots[slotIndex].Subslots.findIndex(subslot => subslot.task_id == task.task_id);

          saved.Slots[slotIndex].Subslots[subslotIndex].id = newSubslot.id;
          saved.ppm_synced = 1;

          setFromBackend(saved);
        })
        .catch(error => {
          console.log('error adding subslot to backend', error);
          const slotIndex = saved.Slots.findIndex(slot => slot.id == task.slot_id);
          const subslotIndex = saved.Slots[slotIndex].Subslots.findIndex(subslot => subslot.task_id == task.task_id);

          saved.Slots[slotIndex].Subslots.splice(subslotIndex, 1);
          setFromBackend(saved);
        });
    });
  }    

  
  function setFromFrontend(value) {
    localStorage.setItem(key, toString(value));
    return store.set(value);
  }
  
  function set(value) {
    localStorage.setItem(key, toString(value));
    return store.set(value);
	}

  function setFromBackend(value) {
    localStorage.setItem(key, toString(value));
    return store.set(value);
	}

  return {
    subscribe: store.subscribe,
    addSubslot,
    removeSubslot,
    updateSubslot,
    set,
    setFromFrontend,
    update: store.update
  }
}