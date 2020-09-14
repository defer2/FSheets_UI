<script>
	import Subslot from "./Subslot.svelte";	
    import Slot from "./Slot.svelte";	
    import Button from "smelte/src/components/Button";

    
    /********************************** DATA KITCHEN */
    let subslots_hour1 = new Array();
    let subslots_hour2 = new Array();
    let subslots_hour3 = new Array();
    
    let subslot1 = new Object();
    let subslot2 = new Object();
    let subslot3 = new Object();
    
    subslot1.id="1";
    subslot1.name="SUBSLOT #1";
    subslot1.color="#a5d5d3";
    
    subslot2.id="2";
    subslot2.name="SUBSLOT #2";
    subslot2.color="#c5d5d3";
    
    subslot3.id="3";
    subslot3.name="SUBSLOT #3";
    subslot3.color="#e5d5d3";

    subslots_hour1.push(subslot1);
    subslots_hour1.push(subslot2);
    subslots_hour1.push(subslot3);
    
   
    subslots_hour3.push(subslot3);
    subslots_hour3.push(subslot1);

    let slots = new Array();
    let slot1 = new Object();
    let slot2 = new Object();
    let slot3 = new Object();

    slot1.hour="1";
    slot1.subslots=subslots_hour1;

    slot2.hour="2";
    slot2.subslots=subslots_hour2;

    slot3.hour="3";
    slot3.subslots=subslots_hour3;

    slots.push(slot1);
    slots.push(slot2);
    slots.push(slot3);
    /********************************** DATA KITCHEN */
    /********************************** FUNCTIONS */
    let showRemoveSubslot = false;

	const handleSubslotDragStart = () => {showRemoveSubslot=true;};
    const handleSubslotDragEnd = () => {showRemoveSubslot=false;};
    
    function handleSubslotAdded(event) {
        let newSubslot = new Object();
        newSubslot.name = event.detail.subslotName;
        newSubslot.id = event.detail.subslotId;
        newSubslot.color = event.detail.subslotColor;
        let slotHour = event.detail.slotId;

        let targetSlot = new Object;
        for(let i=0;i<slots.length;i++){
            if(slots[i].hour == slotHour)
                targetSlot = slots[i];
        }

        const index = slots.findIndex(slot => slot.hour === slotHour);
        if (index > -1) {
            slots.splice(index, 1);
        }

        if(!targetSlot.subslots) targetSlot.subslots = new Array();
        targetSlot.subslots.push(newSubslot);
        slots.push(targetSlot);

        slots = slots;
        slots.sort((a,b) => (a.hour > b.hour) ? 1 : ((b.hour > a.hour) ? -1 : 0)); 
    }

    function handleSubslotRemoved(event) {
        let subslotId = event.detail.subslotId;
        let slotId = event.detail.slotId;

        let targetSlot = new Object;
        let nuevoSubslots = new Array();

        for(let i=0;i<slots.length;i++){
            if(slots[i].hour == slotId){
                console.log('en TS este slot es '+slots[i].hour);
                targetSlot=slots[i];
                for(let j=0;j<targetSlot.subslots.length;j++){
                    if(targetSlot.subslots[j].id != subslotId){
                        console.log('en TS este subslot no se borra '+targetSlot.subslots[j].id);

                        nuevoSubslots.push(targetSlot.subslots[j]);
                    }else{
                        console.log('en TS este subslot si se borra '+targetSlot.subslots[j].id);
                    }
                }
                slots[i].subslots=nuevoSubslots;
                break;
            }
        }

     

        slots = slots;
        slots.sort((a,b) => (a.hour > b.hour) ? 1 : ((b.hour > a.hour) ? -1 : 0)); 
    }
</script>


    <div class="container">
        <div class="timesheet-header">
            <div class="semana">
                <Button icon="first_page" text light flat/>
            </div>
            <div class="ayer">
                <Button icon="chevron_left" text/>               
            </div>
            <div class="title"><h5>Today</h5></div>
        </div>
        <div class="slots">
            {#each slots as slot}
                <Slot hour="{slot.hour}" subslots={slot.subslots} 
                on:subslotAdded={handleSubslotAdded} on:subslotDragStart={handleSubslotDragStart} on:subslotDragEnd={handleSubslotDragEnd} on:removeSubslotTimesheet={handleSubslotRemoved}/> 
            {/each}
        </div>
    </div>

<style>

    .container{
		box-shadow: 2px 2px 8px  rgba(0,0,0,0.1);
        background-color: white;
    }

	.timesheet-header {
        display: grid;
        grid-template-columns: 10% 10% 64%;
		border-radius: 2px;

        text-align: center;
        background: #fff;
        height: 90px;
        align-items: center;
	}

    .slots{
        height: 600px;
    }

    .ayer {
        display: flex;
        justify-content: center;
        align-items: center;    
        height: 100%;
    }
    .semana {
        display: flex;
        justify-content: center;
        align-items: center;   
        height: 100%;
    }
	.title {
        padding: 16px;
	}

</style>