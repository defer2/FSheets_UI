<script>
    import Subslot from './Subslot.svelte'
    import { createEventDispatcher } from 'svelte'


    const dispatch = createEventDispatcher();

    export let hour;
    export let subslots;
    export let slotId;

    let slotStartDate = new Date(hour);
    hour = slotStartDate.getHours();
    const minSubslotHeight = 35;
    const maxSlotHeight = 160;

    /* HANDLE FUNCTIONS */
    const handleSubslotAdded = (event, slotId) => {
        event.preventDefault();
        if(!slotId) return;
            
        const draggingElement = document.getElementById(event.dataTransfer.getData('text'));
        //const targetElement = event.target; 
    
        const taskName = draggingElement.dataset.name;
        const taskId = draggingElement.dataset.id;
        const taskColor = draggingElement.dataset.color;

        let subslot = subslotAlreadyExists(slotId, taskId)[0];

        if(subslot){
            const height = parseInt(subslot.dataset.height)+40;
            subslot.dataset.height = height;
            subslot.style = 'height: '+height+'px';

            const subslots = subslotsChangeSize(slotId, subslot.dataset.subslotid);

            dispatch('subslotsChangeSize', {
                    subslots: subslots
                });        
        }else{
            dispatch('subslotAdded', {
                slotId: slotId,
                subslotName: taskName,
                taskId: taskId,
                taskColor: taskColor
            });
        }
        
    };

    const handleSubslotChangeSize = (e) => {
        dispatch('subslotsChangeSize', {
                subslots: subslotsChangeSize(e.detail.slotId, e.detail.subslotId)
            });        
    };

    /* MISC FUNCTIONS */

    const subslotAlreadyExists = (slotId, taskId) => {
        const subslots = Array.from(document.getElementById('slot-'+slotId).getElementsByClassName("subslot-container"));
        
        let subslot;
        if(subslots && subslots.length > 0){
            subslot = subslots.filter(subslot => subslot.dataset.taskid === taskId);
            return subslot;
        }
        return false;
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
        return date.getFullYear() + "-" + month + "-" + day + " " + strTime;
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

    const subslotsChangeSize = (slotId, subslotId) => {
        const subslots = Array.from(document.getElementById('slot-'+slotId).getElementsByClassName("subslot-container"));
        
        let totalHeight = 0;
        subslots.forEach(function(subslot) {
            totalHeight += parseInt(subslot.getAttribute('data-height'));
        });


        let oSubslots = new Array();
        let startDate = new Date(document.getElementById('slot-'+slotId).getAttribute('data-startdate'));
        subslots.forEach(function(subslot) {
            const height = parseInt(subslot.getAttribute('data-height'));
            const minutes = 60 * (height / totalHeight);
            let endDate = addMinutes(startDate, minutes);

            const oSubslot = {
                slotId: slotId,
                id: subslot.dataset.subslotid,
                startDate: formatDate(startDate),
                endDate: formatDate(subSeconds(endDate,1)),
                minutes: minutes,
                project: JSON.parse(subslot.dataset.project),
            }; 

            startDate = endDate;
            oSubslots.push(oSubslot);
        });


        return oSubslots;
    };

    const subslotCalculatePercentage = (subslot) => { 
        return Math.round(((new Date(subslot.end_date) - new Date(subslot.start_date) % 86400000) % 3600000) / 60000) * 100 / 60 ;
    };

    subslots = subslotsCalculateSize(subslots);  
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
        <div class="hour" data-slotId="{slotId}"><h6 data-slotId="{slotId}"><strong>{hour}</strong></h6></div>
        <div class="subslots" id="subslots-of-slot-{slotId}" data-slotId="{slotId}">
            {#each subslots as subslot}
                <div class="slot-subslot" data-slotId="{slotId}">
                    <Subslot on:subslotsChangeSize={handleSubslotChangeSize} on:removeSubslotTimesheet 
                        subslotName={subslot.task_name} project="{subslot.project}" subslotId="{subslot.id}" slotId="{slotId}" 
                        taskId="{subslot.task_id}"
                        subslotStartDate={subslot.start_date} subslotEndDate={subslot.end_date} subslotHeight="{subslot.height}" />
                </div>
            {/each}
    </div>
    </div>
</div>

