<script>
    import Task from './Task.svelte'
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher();


    export let hour;
    export let tasks;
    


    function onDrop(event,slotId) {
        event.preventDefault();

        if(slotId){
            const id = event.dataTransfer.getData('text');
            const taskElement = document.getElementById(id);

            const taskName = taskElement.dataset.name;
            const taskId = taskElement.dataset.id;
            const taskColor = taskElement.dataset.color;

            // const dropzone = event.target;
            // dropzone.appendChild(draggableElement);
            // console.log('dropped '+taskId+' a '+slotId);
            // console.log('Event taskAdded triggered '+taskId)

            dispatch('taskAdded', {
                taskId: taskId,
                taskName: taskName,
                taskColor: taskColor,
                slotId: slotId
            });
        }
    }

    const handleTaskDragStart = () => {dispatch('taskDragStart', {});};
    const handleTaskDragEnd = () => {dispatch('taskDragEnd', {});};

    const handleRemoveTaskTimesheet = (e) => {
        let taskId = e.detail.taskId;
        let slotId = e.detail.slotId;
  
        dispatch('removeTaskTimesheet', {
            taskId: taskId,
            slotId: slotId
        });
                
    };

    const showResize = (e) => {
        e.target.className+=" resize";
    };

    const hideResize = (e) => {
        e.target.className.replace(' resize','');
    };
            
</script>


<style>
	.slot {
        display: grid;
        grid-template-columns: 20% 80%;
        text-align: left;
        min-height: 30px;
        border-bottom: 0.15em rgb(238, 238, 238) solid;
	}


    .hour{
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .resize{
        resize: vertical;
        overflow: auto;
    }

</style>

<div>
    <div class="slot" id="slot-{hour}" ondragover="return false;" on:drop={event => onDrop(event,hour)}>
        <div class="hour"><h5>{hour}</h5></div>
        <div class="tasks">
            {#each tasks as task}
                <div class="slot-task">
                    <Task on:removeTaskTimesheetForSlot="{handleRemoveTaskTimesheet}" on:taskDragStart={handleTaskDragStart} on:taskDragEnd={handleTaskDragEnd}
                        taskName={task.name} projectColor="{task.color}" taskId="{task.id}" slotId="{hour}"/>
                </div>
            {/each}
    </div>
    </div>
</div>

