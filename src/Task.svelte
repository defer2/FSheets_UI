<script>
    import Checkbox from "smelte/src/components/Checkbox";
    import TextField from "smelte/src/components/Textfield";
    import Button from "smelte/src/components/Button";


    import { createEventDispatcher } from 'svelte'
import { element } from "svelte/internal";
import Todolist from "./Todolist.svelte";

    export let taskName;
    export let isTodoList;
    export let taskId;
    export let projectColor;
    export let slotId;

    /*Functions*/

    let taskDone = false;
    let taskEditable = false;
    let draggable = true;

    const dispatch = createEventDispatcher();

    const onDragStart = (e) => {
        e.dataTransfer.setData('text/plain', e.target.id);
        dispatch('taskDragStart', {
            taskId: e.target.id
        }); 
    };

    const toggleTaskEditable = (e) => {
        taskEditable = !taskEditable;
        draggable = !taskEditable;

        try{
            let buttonId=e.target.id;
            let parentDivId=buttonId.replace('btn-edit-','').replace('txt-','')+'-'+isTodoList;
            let txtId=buttonId.replace('btn-edit-','txt-');
            
            let parentDiv = document.getElementById(parentDivId);      
            parentDiv.draggable=draggable;

            setTimeout(function() {
                let txtField = document.getElementById(txtId);
                if(txtField)
                    txtField.focus();
            }, 200);
        }catch(err){

        }
    };

    const toggleTaskDone = () => {
        taskDone = !taskDone;
    };

    const onDragEnd = () => { dispatch('taskDragEnd', {}); };
    
    const triggerEventTaskChanged = (e) => {
        dispatch('taskChanged', {
            taskId: document.getElementById(e.target.id).getAttribute('data-id'),
            taskName: e.target.value,
            taskColor: document.getElementById(e.target.id).getAttribute('data-color'),
        });
    };

    const handleOnBlurTask = (e) => {
        let a = document.getElementById(e.target.id);
        a.parentElement.parentElement.draggable=true;
    };

    const checkIfEnter = (evt) => {
			evt.target.addEventListener('keyup',(e)=>{
				if (e.key === 'Enter' || e.keyCode === 13) {
                    e.target.blur();
				}
			});

    };
    
    const removeTaskTimesheet = (e) => {
        let taskId = document.getElementById(e.target.id).getAttribute('data-taskid');
        let slotId = document.getElementById(e.target.id).getAttribute('data-slotid');
    
        dispatch('removeTaskTimesheetForSlot', {
            taskId: taskId,
            slotId: slotId
        });
    };

    const getStyleForTask = (e) => {
        if(!isTodoList){
            setTimeout(
                document.getElementById(e.target.id).style="resize: vertical;overflow: auto;"
                ,200);
        }
    };

    const removeStyleForTask = (e) => {
        if(!isTodoList){
            setTimeout(
                document.getElementById(e.target.id).style="resize: none;"
                ,200);
        }
    };

</script>

<style>
    .task-container{
        display: grid;
        grid-template-columns: 10% 74% 14% 2%;
        position: relative;
        border-top: 0.1em rgb(224, 224, 224) dashed;
    }

    .taskControls{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        justify-content: center;
        align-items: center;
        margin-right: 15px;

    }

    .properties{
        margin-left: 5px;
        display: flex;
        justify-content: left;
        align-items: center;
    }

    .checkbox{
        padding-top: 10px;
        display: flex;
        margin-left: 10px;
        justify-content: center;
        align-items: center;
    }

    .editButton{
        margin-left: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .task{
        display: flex;
        justify-content: center;
        align-items: center;
    }



</style>

<div class="task-container">
        <!-- Checkbox -->
    {#if isTodoList}
        <div class="checkbox">
            <Checkbox on:change="{toggleTaskDone}" small color='gray'/>
        </div>
    {:else}
        <div class="checkbox" />
    {/if}

    <!-- Tarea -->
    
    <div id="task-{taskId}-{isTodoList}" class="task" data-name="{taskName}" 
            data-id="{taskId}" data-color="{projectColor}" draggable="true" 
            on:dragstart={onDragStart} on:dragend={onDragEnd} >
            <!-- Texto -->
        {#if taskDone}
            {#if taskEditable}
                <TextField id="txt-task-{taskId}" style='text-decoration:line-through;background-color:white;'
                    on:focus={checkIfEnter} size="60" on:blur="{triggerEventTaskChanged}" on:blur="{toggleTaskEditable}"
                    value={taskName} data-id="{taskId}" data-color="{projectColor}"/>
            {:else}
                <div ondrop="return false;" class='textfield' style='text-decoration:line-through;background-color:white'>
                    {taskName}
                </div>
            {/if}
        {:else}
            {#if taskEditable}
                <TextField id="txt-task-{taskId}" style='background-color:white;' 
                    on:focus={checkIfEnter} size="60" on:blur="{triggerEventTaskChanged}" on:blur="{toggleTaskEditable}"
                    value={taskName} data-id="{taskId}" data-color="{projectColor}"/>
            {:else}
                <div ondrop="return false;" style='background-color:white'>
                    {taskName}
                </div>
            {/if}
        {/if}
    </div>

     <!-- Propiedades -->
     <div class="taskControls" id="taskControls">
        {#if isTodoList}
            <div class="editButton">
                <Button id="btn-edit-task-{taskId}" class="editButton" color='gray' text  small icon='edit'
                    on:click="{toggleTaskEditable}" />
            </div>
            <div class="deleteButton"/>
            <div class="properties"> 
                <Button id="btn-prop-task-{taskId}" icon="more_vert" text small/>
            </div>    
        {:else}
            <div class="editButton" />
            <div class="deleteButton">
                <Button id="btn-del-task-{taskId}" data-taskId={taskId} data-slotId={slotId} on:click="{removeTaskTimesheet}" color='gray' text small icon='delete' />
            </div>
            <div class="properties"/>  
        {/if}
    </div>

     <!-- Color -->
    <div style="background-color:{projectColor};" id="project-task-{taskId}" >
    </div>
</div>

