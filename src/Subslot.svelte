<script>
    import Checkbox from "smelte/src/components/Checkbox";
    import TextField from "smelte/src/components/Textfield";
    import Button from "smelte/src/components/Button";


    import { createEventDispatcher } from 'svelte'
    import { element } from "svelte/internal";

    export let subslotName;
    export let subslotId;
    export let projectColor;
    export let slotId;

    /*Functions*/
    const dispatch = createEventDispatcher();

    const onDragStart = (e) => {
        e.dataTransfer.setData('text/plain', e.target.id);
        dispatch('subslotDragStart', {
            subslotId: e.target.id
        }); 
    };

    const onDragEnd = () => { dispatch('subslotDragEnd', {}); };
    
    const removesubslotTimesheet = (e) => {        
        let subslotId = document.getElementById(e.target.id).getAttribute('data-subslotid');
        let slotId = document.getElementById(e.target.id).getAttribute('data-slotid');
    
        console.log('subslot');
        console.log('subslotId '+subslotId);
        console.log('slotId '+slotId);
        dispatch('removesubslotTimesheetForSlot', {
            subslotId: subslotId,
            slotId: slotId
        });
    };
</script>

<style>
    .subslot-container{
        display: grid;
        grid-template-columns: 84% 14% 2%;
        position: relative;
        border-top: 0.1em rgb(224, 224, 224) dashed;

    }

    .subslotControls{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        justify-content: center;
        align-items: center;
        margin-right: 15px;

    }

    .subslot{
        display: flex;
        justify-content: center;
        align-items: center;
        
    }
    .resize{
        resize: vertical;
        overflow: auto;
    }
</style>

<div class="subslot-container resize">
    <!-- Tarea -->   
    <div id="subslot-{subslotId}" class="subslot" data-name="{subslotName}" 
            data-id="{subslotId}" data-color="{projectColor}" draggable="true" 
            on:dragstart={onDragStart} on:dragend={onDragEnd} >
            
            <!-- Texto -->
            <div ondrop="return false;" style='background-color:white'>
                {subslotName}
            </div>
    </div>

     <!-- Propiedades -->
     <div class="subslotControls" id="subslotControls">
            <div class="deleteButton">
                <Button id="btn-del-subslot-{slotId}-{subslotId}" data-subslotId="{subslotId}" data-slotId={slotId} on:click="{removesubslotTimesheet}" color='gray' text small icon='delete'/>
            </div>
    </div>

     <!-- Color -->
    <div style="background-color:{projectColor};" id="project-subslot-{subslotId}" >
    </div>
</div>

