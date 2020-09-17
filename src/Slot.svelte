<script>
    import Subslot from './Subslot.svelte'
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher();

    export let hour;
    export let subslots;
    export let slotId;


    hour = new Date(hour).getHours();

    function onDrop(event,slotId) {
        event.preventDefault();

        if(slotId){
            const id = event.dataTransfer.getData('text');
            const subslotElement = document.getElementById(id);

            const subslotName = subslotElement.dataset.name;
            // const subslotColor = subslotElement.dataset.color;
            const subslotId = subslotElement.dataset.id;

            dispatch('subslotAdded', {
                subslotId: subslotId,
                slotId: slotId,
                subslotName: subslotName
            });
        }
    }

    const handlesubslotDragStart = () => {dispatch('subslotDragStart', {});};
    const handlesubslotDragEnd = () => {dispatch('subslotDragEnd', {});};

    const handleRemoveSubslotTimesheet = (e) => {
        let subslotId = e.detail.subslotId;
        let slotId = e.detail.slotId;
  
        dispatch('removeSubslotTimesheet', {
            subslotId: subslotId,
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
        width:100%;
	}


    .hour{
        display: flex;
        justify-content: center;
        align-items: center;
    }



</style>

<div>
    <div class="slot" id="slot-{slotId}" ondragover="return false;" on:drop={event => onDrop(event,slotId)}>
        <div class="hour"><h5>{hour}</h5></div>
        <div class="subslots">
            {#each subslots as subslot}
                <div class="slot-subslot">
                    <Subslot on:removesubslotTimesheetForSlot="{handleRemoveSubslotTimesheet}" on:subslotDragStart={handlesubslotDragStart} on:subslotDragEnd={handlesubslotDragEnd}
                        subslotName={subslot.task_name} projectColor="{subslot.color}" subslotId="{subslot.id}" slotId="{hour}"/>
                </div>
            {/each}
    </div>
    </div>
</div>

