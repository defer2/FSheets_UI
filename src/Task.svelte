<script>
    import Checkbox from "smelte/src/components/Checkbox";
    import TextField from "smelte/src/components/Textfield";
    import Button from "smelte/src/components/Button";
    import { createEventDispatcher } from 'svelte';

    export let taskName;
    export let taskId;
    export let projectId;
    export let taskProject;
    export let taskDescription;
    export let taskStatus;

    let taskEditable = false;
    let draggable = true;
    let projectColor = taskProject.color;


    const dispatch = createEventDispatcher();

    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', e.target.id);
        dispatch('taskDragStart', {
            taskId: e.target.id
        }); 
    };

    const handleTaskEditable = (e) => {
        taskEditable = !taskEditable;
        draggable = !taskEditable;

        try{
            let buttonId=e.target.id;
            let parentDivId=buttonId.replace('btn-edit-','').replace('txt-','');
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


    const handleTaskDone = (e) => {
        taskStatus == 2 ? taskStatus = 1 : taskStatus = 2
        
        try{
            let checkboxId=e.target.id;
            let txtId = checkboxId.replace('chk-done-','');
            let divParent = document.getElementById(txtId);

            dispatch('taskChanged', {
                taskId: divParent.getAttribute('data-id'),
                taskName: divParent.getAttribute('data-name'),
                taskColor: divParent.getAttribute('data-color'),
                taskStatus: taskStatus,
                taskDescription: divParent.getAttribute('data-description'),
                taskProjectId: divParent.getAttribute('data-projectId'),
            });

        }catch(error){
            console.log('error', error);
        }
    };

    const handleDragEnd = () => { dispatch('taskDragEnd', {}); };
    
    const handleTaskChanged = (e) => {
        dispatch('taskChanged', {
            taskId: document.getElementById(e.target.id).getAttribute('data-id'),
            taskName: e.target.value,
            taskColor: document.getElementById(e.target.id).getAttribute('data-color'),
            taskStatus: document.getElementById(e.target.id).getAttribute('data-status'),
            taskDescription: document.getElementById(e.target.id).getAttribute('data-description'),
            taskProjectId: document.getElementById(e.target.id).getAttribute('data-projectId'),
        });
    };

    const handleOnBlurTask = (e) => {
        let a = document.getElementById(e.target.id);
        a.parentElement.parentElement.draggable=true;
    };

    const handleEnter = (evt) => {
			evt.target.addEventListener('keyup',(e)=>{
				if (e.key === 'Enter' || e.keyCode === 13) {
                    e.target.blur();
				}
			});

    };

</script>

<style>
    .task-container{
        display: grid;
        grid-template-columns: 10% 74% 14% 2%;
        position: relative;
        border-top: 0.1em rgb(224, 224, 224) dashed;
        height: 60px;
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

    .projectColor{
        margin-left: 7px;
        width: 5px;
    }
</style>

<div class="task-container">
    <!-- Checkbox -->
    <div class="checkbox">
        <Button id="chk-done-task-{taskId}" color='gray' text  small icon='done'
                on:click="{handleTaskDone}" />
    </div>
   
    <!-- Tarea -->
    <div id="task-{taskId}" class="task"  draggable="true" 
            data-projectId="{projectId}" data-id="{taskId}" data-status={taskStatus} data-description={taskDescription} data-color="{projectColor}" data-name="{taskName}" 
            on:dragstart={handleDragStart} on:dragend={handleDragEnd} >
            <!-- Texto -->
        {#if taskStatus==2}
            {#if taskEditable}
                <TextField id="txt-task-{taskId}" style='text-decoration:line-through;background-color:white;'
                    on:focus={handleEnter} size="60" on:blur="{handleTaskChanged}" on:blur="{handleTaskEditable}"
                    value={taskName} data-projectId="{projectId}" data-name="{taskName}" data-id="{taskId}" data-status={taskStatus} data-description={taskDescription}  data-color="{projectColor}"/>
            {:else}
                <div ondrop="return false;" class='textfield' style='text-decoration:line-through;color:gray;background-color:white'>
                    {taskName}
                </div>
            {/if}
        {:else}
            {#if taskEditable}
                <TextField id="txt-task-{taskId}" style='background-color:white;' 
                    on:focus={handleEnter} size="60" on:blur="{handleTaskChanged}" on:blur="{handleTaskEditable}"
                    value={taskName} data-projectId="{projectId}" data-name="{taskName}" data-id="{taskId}" data-status={taskStatus} data-description={taskDescription}  data-color="{projectColor}"/>
            {:else}
                <div ondrop="return false;" style='background-color:white'>
                    {taskName}
                </div>
            {/if}
        {/if}
    </div>

     <!-- Propiedades -->
     <div class="taskControls" id="taskControls">
        <div class="editButton">
            <Button id="btn-edit-task-{taskId}" class="editButton" color='gray' text  small icon='edit'
                on:click="{handleTaskEditable}" />
        </div>
        <div class="deleteButton"/>
        <div class="properties"> 
            <Button id="btn-prop-task-{taskId}" icon="more_vert" text small/>
        </div>    
    </div>

     <!-- Color -->
    <div style="background-color:{projectColor};" class="projectColor" id="project-task-{taskId}" >
    </div>
</div>

