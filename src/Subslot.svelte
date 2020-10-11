<script>
    import Button from "smelte/src/components/Button";
    import { createEventDispatcher } from 'svelte'
    import { watchResize } from "svelte-watch-resize";

    
    export let subslotName;
    export let subslotId;
    export let project;
    export let slotId;
    export let taskId;
    export let subslotHeight;
    export let taskColor;

    let resizable = false;
    let setInitialSizes = false;
    const dispatch = createEventDispatcher();
    
    const handleRemovesubslotTimesheet = () => {       
        dispatch('removeSubslotTimesheet', {
            id: subslotId,
            slot_id: slotId
        });
    };

    const handleResizeOption = () => {
        resizable = !resizable;
    };
    
   
    let timeout;
    const handleResize = (node) => {
        if(!setInitialSizes){
            setInitialSizes = true;
            subslotHeight = node.clientHeight;
        }else{
            if(resizable){
                clearTimeout(timeout);
                timeout = setTimeout(() =>{
                        node.setAttribute('data-height',node.clientHeight+1);
                        dispatch('subslotChangeSize', {
                            id: subslotId,
                            slot_id: slotId,
                            height: node.clientHeight+1
                        }); 
                    },500);
            }
        }
    };

</script>

<style>

    .subslot-container{
        display: grid;
        grid-template-columns: 84% 15% 1%;
        align-items: center;
        border-top: 0.1em rgb(224, 224, 224) dashed;
        min-height: 35px;
        max-height: 160px;
        margin-top: -0.05em; 
    }

    .subslot{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 84%;
    }

    .subslotControls{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 15%;
        right: 0;

    }

    .projectColor{
        margin-top: 5px;
        width: 3px;
        height: calc(100% + 2px);
        margin-left: 17px;
        width: 3px;
        z-index: 50;
    }

    .resize{
        resize: vertical;
        overflow: hidden;
    }



</style>

<div id={'subslot-container-'+subslotId} class="{resizable === true ? 'subslot-container resize': 'subslot-container'}"
    data-subslotId="{subslotId}" data-slotId="{slotId}" data-taskId="{taskId}" 
    data-name="{subslotName}" data-project="{JSON.stringify(project)}" data-color="{project.color}"
    data-height="{subslotHeight}" style="height: {subslotHeight}px;" 
    on:mouseover="{() => handleResizeOption()}" on:mouseout="{() => handleResizeOption()}" use:watchResize="{(node) => handleResize(node)}">

    <!-- Tarea -->   
    <div id="subslot-{subslotId}" class="subslot" data-name="{subslotName}" data-slotId="{slotId}" 
        data-project="{JSON.stringify(project)}"
        data-id="{subslotId}" data-color="{project.color}" data-taskId="{taskId}">
            
            <!-- Texto -->
            <div ondrop="return false;" data-slotId="{slotId}">
                {subslotName}
            </div>
    </div>

     <!-- Propiedades -->
     <div class="subslotControls" id="subslotControls-subslot-{subslotId}" data-slotId="{slotId}">
            <div class="deleteButton" data-slotId="{slotId}">
                <Button id="btn-del-subslot-{slotId}-{subslotId}" data-taskId="{taskId}" data-subslotId="{subslotId}" data-slotId={slotId} 
                on:click="{handleRemovesubslotTimesheet}" color='gray' text small icon='remove_circle_outline'/>
            </div>
    </div>

     <!-- Color -->
    <div style="background-color:{project.color};" class="projectColor" id="project-subslot-{subslotId}" data-slotId="{slotId}">
    </div>
</div>

