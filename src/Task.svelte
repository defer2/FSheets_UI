<script>
    import * as Smelte from 'smelte'
    import { createEventDispatcher } from 'svelte';
    import { Select } from "smelte";

    export let taskName;
    export let taskId;
    export let projectId;
    export let taskProject;
    export let taskDescription;
    export let taskStatus;
    export let projects;
    
    let taskEditable = false;
    let draggable = true;
    let projectColor = taskProject ? taskProject.color : '';
    let projectName;

    taskProject && taskProject.name ? projectName = taskProject.name : projectName = "Select a project...";
    
	const handleTaskChangeProject = () => {
        const projectIndex = projects.findIndex(project => project.value == projectId);
    
        if(projectId)
            dispatch('taskChanged', {
                taskId: taskId,
                taskProjectId: projectId,
                taskName: taskName,
                taskColor: projects[projectIndex].color,
                taskStatus: taskStatus,
                taskDescription: ''
            });

        projectColor = projects[projectIndex].color;
        
    };

    const dispatch = createEventDispatcher();

    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', e.target.id);
        dispatch('taskDragStart', {
            taskId: taskId
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
            
            let txtField = document.getElementById(txtId);
            
            if(taskEditable){
                setTimeout(function() {
                    if(txtField)
                        txtField.focus();
                }, 200);
            }else{
                if(txtField)
                    txtField.blur();
            }
        }catch(err){

        }
    };

    const handleTaskDone = (e) => {
        taskStatus < 3 ? taskStatus++ : taskStatus = 1;
        
        try{
            dispatch('taskChanged', {
                taskId: taskId,
                taskProjectId: projectId,
                taskName: taskName,
                taskColor: projectColor,
                taskStatus: taskStatus,
                taskDescription: ''
            });
        }catch(error){
            console.log('error', error);
        }
    };

    const handleDragEnd = () => { dispatch('taskDragEnd', {}); };
    
    const handleTaskChanged = (e) => {
        dispatch('taskChanged', {
            taskId: taskId,
            taskProjectId: projectId,
            taskName: taskName,
            taskColor: projectColor,
            taskStatus: taskStatus,
            taskDescription: ''
        });
    };

    const handleEnter = (evt) => {
        evt.target.addEventListener('keyup',(e)=>{
            if (e.key === 'Enter' || e.keyCode === 13) {
                handleTaskChanged(evt);
            }
        });

    };
</script>

<div class="task-container">
    <!-- Checkbox -->
    <div class="checkbox">
        {#if taskStatus==1}
            <Smelte.Button id="chk-done-task-{taskId}" color='gray' text  small icon='done'
                    on:click="{handleTaskDone}" />
        {:else if taskStatus==2}
            <Smelte.Button  id="chk-done-task-{taskId}" color='gray' text  small icon='remove_circle_outline'
            on:click="{handleTaskDone}" />
        {:else}
            <Smelte.Button  id="chk-done-task-{taskId}" color='gray' text  small icon='undo'
            on:click="{handleTaskDone}" />
        {/if}
    </div>
   
    <!-- Tarea -->
    <div id="task-{taskId}" class="task" draggable="true" data-projectId="{projectId}"
            data-id="{taskId}" data-status={projectId} data-description={taskDescription} data-color="{projectColor}" data-name="{taskName}" 
            on:dragstart={handleDragStart} on:dragend={handleDragEnd} >
            <!-- Texto -->
        {#if taskStatus==2}
            <div ondrop="return false;" style='text-decoration:line-through;color:gray;'>
                {taskName}
            </div>
        {:else}
            <div ondrop="return false;">
                {taskName}
            </div>
        {/if}
    </div>

     <!-- Propiedades -->
     <div class="taskControls" id="taskControls">
        <div class="editButton">
            <Smelte.Button  id="btn-edit-task-{taskId}" class="editButton" color='gray' text  small icon='edit'
                on:click="{handleTaskEditable}" />
        </div>
        <div class="deleteButton"/>
        <div class="properties"/>    
    </div>

     <!-- Color -->
    <div id="btn-prop-task-{taskId}" style="background-color:{projectColor};" class="projectColor"/>
</div>

<!-- {#if true} -->
{#if taskEditable}
    <div class="edit-task-name">
        <Smelte.TextField label="Task name" id="txt-task-{taskId}" style='background-color:white;' 
        on:focus={handleEnter} size="60" on:blur="{() => handleTaskChanged()}"
        bind:value={taskName} data-projectId="{projectId}" data-name="{taskName}" data-id="{taskId}" data-status={taskStatus} data-description={taskDescription}  data-color="{projectColor}"/>
    </div>
    <div class="edit-task-name">
        <small class="edit-project-color text-xs">Project name</small>        
        <Select bind:value={projectId} label={projectName} items={projects}
            forceBgColorWhite forceTextColorBlack
            on:change="{() => handleTaskChangeProject()}" >            
        </Select>
    </div>    
{/if}

<style>

    .task-container{
        display: grid;
        grid-template-columns: 10% 74% 15% 1%;
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
        margin-left: 2px;
        width: 3px;
    }


    .edit-project-color{
        width: 80%;
        margin-left: 18px;
        color: gray;
    }  
    .edit-task-name{
        width: 80%;
        margin-left: 50px;
        margin-bottom: 25px;
        padding-top: -20px;
    }    
    
</style>




