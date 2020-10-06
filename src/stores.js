import { localStoreTodolist, localStoreTimesheet } from './localStore.js'

const todolistStore = localStoreTodolist('todolistStore', []);
const timesheetStore = localStoreTimesheet('timesheetStore', []);

export {
    todolistStore, 
    timesheetStore
}