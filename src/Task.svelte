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
    let open = false;
    let menuProjectTimer;
    let selectedProject = "";
    let projectColor = taskProject ? taskProject.color : '';
    let items = projects;

	const handleTaskChangeProject = (e) => {
        if(selectedProject)
            dispatch('taskChanged', {
                taskId: taskId,
                taskProjectId: selectedProject,
                taskName: '',
                taskColor: '',
                taskStatus: '',
                taskDescription: ''
            });
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

            setTimeout(function() {
                let txtField = document.getElementById(txtId);
                if(txtField)
                    txtField.focus();
            }, 200);
        }catch(err){

        }
    };


    const handleTaskDone = (e) => {
        taskStatus < 3 ? taskStatus++ : taskStatus = 1;
        
        try{
            dispatch('taskChanged', {
                taskId: taskId,
                taskName: '',
                taskColor: '',
                taskStatus: taskStatus,
                taskDescription: '',
                taskProjectId: '',
            });
        }catch(error){
            console.log('error', error);
        }
    };

    const handleDragEnd = () => { dispatch('taskDragEnd', {}); };
    
    const handleTaskChanged = (e) => {
        dispatch('taskChanged', {
            taskId: taskId,
            taskName: taskName,
            taskColor: '',
            taskStatus: '',
            taskDescription: '',
            taskProjectId: '',
        });
    };

    const handleEnter = (evt) => {
			evt.target.addEventListener('keyup',(e)=>{
				if (e.key === 'Enter' || e.keyCode === 13) {
                    handleTaskChanged(evt);
				}
			});

    };

    const handleProjectsMenuOpen = (e) => {
        clearTimeout(menuProjectTimer);
        menuProjectTimer = null;
        const timeout = 250;
        setTimeout(()=> open = true, timeout);
    };

    const handleProjectsMenuClose = (e) => {
        const timeout = 250;
        const closeMenu = () =>{
            open = false;
        };
        menuProjectTimer = setTimeout(closeMenu, timeout);
    };



    let showList = false;

    let value1 = "";
  let value2 = "";
  let value3 = "";
  let value4 = "";



let selectedItems = [];

function toggle(i) {
  return v => v.detail
    ? selectedItems.push(i)
    : selectedItems = selectedItems.filter(si => si !== i);
}

$: selectedLabel = selectedItems.map(i => i.text).join(", ");

const label = "A select";
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
    <div id="task-{taskId}" class="task"  draggable="true" 
            data-projectId="{projectId}" data-id="{taskId}" data-status={taskStatus} data-description={taskDescription} data-color="{projectColor}" data-name="{taskName}" 
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
        <div class="properties">    
           
        </div>    
    </div>

     <!-- Color -->
    <div style="background-color:{projectColor};" class="projectColor" id="project-task-{taskId}" on:mouseout={handleProjectsMenuClose} on:mouseover={handleProjectsMenuOpen}>
        <Smelte.Menu bind:open {items} bind:value={selectedProject} itemColor={projectColor} on:click={handleTaskChangeProject} on:mouseover={handleProjectsMenuOpen}>
            <div slot="activator">
                <div style='width:15px' id="btn-prop-task-{taskId}" >&nbsp;</div>
            </div>
        </Smelte.Menu>
    </div>
</div>

{#if taskEditable}
    <div class="edit-task-name">
        <Smelte.TextField label="Task name" id="txt-task-{taskId}" style='background-color:white;' 
        on:focus={handleEnter} size="60" 
        bind:value={taskName} data-projectId="{projectId}" data-name="{taskName}" data-id="{taskId}" data-status={taskStatus} data-description={taskDescription}  data-color="{projectColor}"/>
    </div>
    <div class="edit-task-name">
        <Select label="Project" {items} autocomplete on:change={v => (projectId = v.detail)} />
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


    .edit-task-name{
        width: 80%;
        height: 60px;
        margin-left: 20px;
    }    
</style>




