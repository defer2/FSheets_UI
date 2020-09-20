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
    
    let resizable = false;
    let wasResized = false;
    let setInitialSizes = false;
    const dispatch = createEventDispatcher();

    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', e.target.id);
        dispatch('subslotDragStart', {
            subslotId: e.target.id
        }); 
    };

    const handleDragEnd = () => { dispatch('subslotDragEnd', {}); };
    
    const handleRemovesubslotTimesheet = () => {        
        dispatch('removesubslotTimesheetForSlot', {
            subslotId: subslotId,
            slotId: slotId
        });
    };

    const handleResizeOption = () => {
        resizable = !resizable;
    };

    const handleMouseUp = () => {
        if(wasResized){
            dispatch('subslotsChangeSize', {
                    slotId: slotId,
                    subslotId: subslotId
                }); 
            wasResized = false;
        }
    };
    
    const handleResize = (node) => {
        if(!setInitialSizes){
            setInitialSizes = true;
            subslotHeight = node.clientHeight;
        }else{
            wasResized = true;
            node.setAttribute('data-height',node.clientHeight+1);
        }
    };
</script>

<style>

    .subslot-container{
        display: grid;
        grid-template-columns: 84% 15% 1%;
        position: relative;
        border-top: 0.1em rgb(224, 224, 224) dashed;
        min-height: 35px;
        max-height: 160px;
        margin-top: -0.05em; 
        position: relative;
    }

    .subslot{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 84%;
        position: absolute;

    }

    .subslotControls{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 15%;
        position: absolute;
        right: 0;

    }

    .projectColor{
        width: 1%;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;

    }

    .resize{
        resize: vertical;
        overflow: hidden;
    }
</style>

<div id={'subslot-container-'+subslotId} 
    data-slotId="{slotId}" data-taskId="{taskId}" data-height="{subslotHeight}" data-subslotId="{subslotId}" data-project="{JSON.stringify(project)}"
    class="{resizable === true ? 'subslot-container resize': 'subslot-container'}" style="height: {subslotHeight}px;" 
    on:mouseover="{handleResizeOption}" on:mouseup="{handleMouseUp}" on:mouseout="{handleResizeOption}" use:watchResize="{handleResize}">

    <!-- Tarea -->   
    <div id="subslot-{subslotId}" class="subslot" data-name="{subslotName}" data-slotId="{slotId}" data-project="{JSON.stringify(project)}"
            data-id="{subslotId}" data-color="{project.color}" data-taskId="{taskId}" draggable="true" 
            on:dragstart={handleDragStart} on:dragend={handleDragEnd}>
            
            <!-- Texto -->
            <div ondrop="return false;" style='background-color:white' data-slotId="{slotId}">
                {subslotName}
            </div>
    </div>

     <!-- Propiedades -->
     <div class="subslotControls" id="subslotControls-subslot-{subslotId}" data-slotId="{slotId}">
            <div class="deleteButton" data-slotId="{slotId}">
                <Button id="btn-del-subslot-{slotId}-{subslotId}" data-taskId="{taskId}" data-subslotId="{subslotId}" data-slotId={slotId} 
                on:click="{handleRemovesubslotTimesheet}" color='gray' text small icon='delete'/>
            </div>
    </div>

     <!-- Color -->
    <div style="background-color:{project.color};" class="projectColor" id="project-subslot-{subslotId}" data-slotId="{slotId}">
    </div>
</div>

