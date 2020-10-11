<script>
    import * as Smelte from 'smelte'
    import { createEventDispatcher, tick } from 'svelte';
    import { Select } from "smelte";

    export let taskName;
    export let taskId;
    export let taskProject;
    export let projectId = taskProject ? taskProject.id : '';
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
                id: taskId,
                project_id: projectId,
                name: taskName,
                color: projects[projectIndex].color,
                status: taskStatus,
                description: ''
            });

        projectColor = projects[projectIndex].color;     
    };

    const dispatch = createEventDispatcher();

    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', taskId);
        dispatch('taskDragStart', {}); 
    };

    const handleTaskEditable = async (e) => {
        taskEditable = !taskEditable;
        draggable = !taskEditable;

        try{
            await tick();
            const parentDiv = document.getElementById('task-'+taskId);                  
            const txtField = document.getElementById('txt-task-'+taskId);

            parentDiv.draggable=draggable;
            if(taskEditable){
                setTimeout(() => { txtField && txtField.focus() }, 200);
            }else{
                txtField && txtField.blur();
            }
        }catch(err){

        }
    };

    const handleTaskDone = () => {
        taskStatus < 3 ? taskStatus++ : taskStatus = 1;      
        handleTaskChanged();
    };

    const handleDragEnd = () => { dispatch('taskDragEnd', {}); };
    
    const handleTaskChanged = () => {
        try{
            dispatch('taskChanged', {
                id: taskId,
                project_id: projectId,
                name: taskName,
                color: projectColor,
                status: taskStatus,
                description: ''
            });
        }catch(error){
            console.log('error', error);
        }
    };

    const handleEnter = (evt) => {
        evt.target.addEventListener('keyup',(e)=>{
            if (e.key === 'Enter' || e.keyCode === 13) {
                handleTaskChanged();
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
    <div id="task-{taskId}" class="task" draggable="true" on:dragstart={handleDragStart} on:dragend={handleDragEnd} >
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
        <Smelte.Button id="btn-edit-task-{taskId}" class="editButton" color='gray' text small icon='edit'
                on:click="{handleTaskEditable}" />
    </div>

     <!-- Color -->
    <div id="btn-prop-task-{taskId}" style="background-color:{projectColor};" class="projectColor"/>
</div>

<!-- {#if true} -->
{#if taskEditable}
    <div class="edit-task-name">
        <Smelte.TextField label="Task name" id="txt-task-{taskId}" bind:value={taskName} style='background-color:white;' 
            on:focus={handleEnter} size="60" on:blur="{() => handleTaskChanged()}" />
    </div>
    <div class="edit-task-name">
        <small class="edit-project-color text-xs">Project name</small>        
        <Select bind:value={projectId} label={projectName} items={projects} forceBgColorWhite forceTextColorBlack
            on:change="{() => handleTaskChangeProject()}" />            
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
        grid-template-columns: 1fr;
        justify-content: center;
        align-items: center;
        margin-left: 30px
    }

    .checkbox{
        display: flex;
        margin-left: 10px;
        justify-content: center;
        align-items: center;
    }

    .task{
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .projectColor{
        margin-left: 17px;
        width: 3px;
        z-index: 50;
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




