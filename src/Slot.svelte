<script>
    import Subslot from './Subslot.svelte'
    import { afterUpdate, createEventDispatcher } from 'svelte'
    import { timesheetStore } from "./stores.js";


    afterUpdate(async () => {
        subslots = subslotsCalculateSize(subslots);
    });

    const dispatch = createEventDispatcher();

    export let hour;
    export let subslots;
    export let slotId;


    let slotStartDate = new Date(hour);
    let slotHour = JSON.stringify(slotStartDate.getHours());

    const minSubslotHeight = 35;
    const maxSlotHeight = 160;

    /* HANDLE FUNCTIONS */
    const handleSubslotAdded = (event, slotId) => {
        event.preventDefault();
        if(!slotId) return;
            
        const draggingElement = document.getElementById(event.dataTransfer.getData('text'));
        const taskId = draggingElement.dataset.id;

        let subslot = subslotAlreadyExists(slotId, taskId);
        if(subslot){
            console.log('subslotAlreadyExists');

            const subslots = subslotsChangeSize(subslot);
            if (subslots){ //there is more than one subslot in slot
                let subslotElement = document.getElementById('subslot-container-'+subslot.id);
                const height = parseInt(subslotElement.dataset.height) + 40;
                subslotElement.dataset.height = height;
                subslotElement.style = 'height: '+height+'px';
                dispatch('subslotsChangeSize', {
                                subslots: subslots
                            });    
            }                
        }else{
            const slotIndex = $timesheetStore.Slots.findIndex(slot => slot.id == slotId);
            let startDate = new Date($timesheetStore.Slots[slotIndex].hour);

            dispatch('subslotAdded', {
                slot_id: slotId,
                task_id: taskId,
                start_date: formatDate(startDate),
                end_date: formatDate(subSeconds(addMinutes(startDate, 59),-59))
            });
        }
        
    };

    const handleSubslotChangeSize = (e) => {
        dispatch('subslotChangeSize', {
                subslots: subslotsChangeSize(e.detail)
            });        
    };

    /* MISC FUNCTIONS */
    const subslotAlreadyExists = (slotId, taskId) => {
        const slotIndex = $timesheetStore.Slots.findIndex(slot => slot.id == slotId);
        const subslotIndex = $timesheetStore.Slots[slotIndex].Subslots.findIndex(t => t.task_id == taskId);

        let subslot = $timesheetStore.Slots[slotIndex].Subslots[subslotIndex];
        return (subslot ? subslot : false);
    };

    const subslotsChangeSize = (subslot) => {
        console.log('subslotsChangeSize');
        const slotId = subslot.slot_id;
        const slotIndex = $timesheetStore.Slots.findIndex(slot => slot.id == slotId);
        const subslots = $timesheetStore.Slots[slotIndex].Subslots;

        if (subslots.length === 1) return;
        
        console.log('modifying subslot height');

        let totalHeight = 0;
        subslots.forEach(function(tsubslot) {
            const height = (() => {
                return tsubslot.id == subslot.id ? parseInt(subslot.height) : parseInt(tsubslot.height)
            })();
            totalHeight += parseInt(height);
        });

        //Calculate minutes for each subslot
        let oSubslots = [];
        let startDate = new Date($timesheetStore.Slots[slotIndex].hour);
        subslots.forEach(function(tsubslot) {
            const height = (() => {
                return tsubslot.id == subslot.id ? parseInt(subslot.height) : parseInt(tsubslot.height)
            })();

            const minutes = 60 * (height / totalHeight);
            let endDate = addMinutes(startDate, minutes);

            oSubslots.push({
                slot_id: slotId,
                id: tsubslot.id,
                start_date: formatDate(startDate),
                end_date: formatDate(subSeconds(endDate,1)),
            });

            startDate = endDate;
        });

        debugger;
        return oSubslots;
    };

    const addMinutes = (date, minutes) => {
        return new Date(date.getTime() + minutes*60000);
    };

    const subSeconds = (date, seconds) => {
        return new Date(date.getTime() - seconds*1000);
    };

    const formatDate = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        let month = date.getMonth()+1;
        let day = date.getDate();

        month = month < 10 ? '0'+month : month;
        day = day < 10 ? '0'+day : day;
        minutes = minutes < 10 ? '0'+minutes : minutes;
        hours = hours < 10 ? '0'+hours : hours;
        seconds = seconds < 10 ? '0'+seconds : seconds;

        let strTime = hours + ':' + minutes + ':' + seconds;
        return date.getFullYear() + "-" + month + "-" + day + "T" + strTime;
    };

    const subslotsCalculateSize = (subslots) => {
        if(!subslots || subslots.length < 1) return subslots;
        let first = true, prevSubslot;
        let totalHeight = 0;
        subslots.forEach(subslot => {
            subslot.percentage = subslotCalculatePercentage(subslot);
        });
        
        subslots.sort(({percentage:a}, {percentage:b}) => a-b).forEach(subslot => {
            if(first){
                subslot.height = minSubslotHeight;
                first = false;
            }else{
                const subslotDiff = subslot.percentage / prevSubslot.percentage;
                subslot.height = prevSubslot.height * subslotDiff;
            }
            totalHeight += subslot.height;
            prevSubslot = subslot;
        });

        if(totalHeight > maxSlotHeight){
            let heightDiff = totalHeight - maxSlotHeight;
            subslots.sort(({percentage:a}, {percentage:b}) => a-b).forEach(subslot => {
                const heightToSubtract = heightDiff * subslot.percentage / 100;
                subslot.height -= heightToSubtract;
            });
        }

        return subslots;
    };

    const subslotCalculatePercentage = (subslot) => { 
        return Math.round(((new Date(subslot.end_date) - new Date(subslot.start_date) % 86400000) % 3600000) / 60000) * 100 / 60 ;
    };

</script>


<style>
	.slot {
        display: grid;
        grid-template-columns: 20% 80%;
        text-align: left;
        min-height: 40px;
        border-bottom: 0.12em rgb(224, 224, 224) solid;
        width:100%;
	}


    .hour{
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

<div>
    <div class="slot" id="slot-{slotId}" data-slotId="{slotId}" data-startdate={slotStartDate} ondragover="return false;" on:drop={event => handleSubslotAdded(event,slotId)}>
        <div class="hour" data-slotId="{slotId}"><h6 data-slotId="{slotId}"><strong>{slotHour}</strong></h6></div>
        <div class="subslots" id="subslots-of-slot-{slotId}" data-slotId="{slotId}">
            {#each subslots as subslot}
                <div class="slot-subslot" data-slotId="{slotId}">
                    <Subslot on:subslotChangeSize={(e) => handleSubslotChangeSize(e)} on:removeSubslotTimesheet 
                        subslotName={subslot.task_name} project="{subslot.project}" subslotId="{subslot.id}" slotId="{slotId}" 
                        taskId="{subslot.task_id}" taskColor="{subslot.taskColor}}"
                        subslotStartDate={subslot.start_date} subslotEndDate={subslot.end_date} subslotHeight="{subslot.height || minSubslotHeight}" />
                </div>
            {/each}
        </div>
    </div>
</div>

