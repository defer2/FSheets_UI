<script>
    import Checkbox from "smelte/src/components/Checkbox";
    import TextField from "smelte/src/components/Textfield";
    import Button from "smelte/src/components/Button";
    import { createEventDispatcher } from 'svelte'
    import { watchResize } from "svelte-watch-resize";

    export let subslotName;
    export let subslotId;
    export let projectColor;
    export let slotId;
    export let subslotStartDate;
    export let subslotEndDate;

    let resizable = false;
    let setInitialSizes = false;

    subslotStartDate = new Date(subslotStartDate);
    subslotEndDate= new Date(subslotEndDate);
    let diffDates = subslotEndDate - subslotStartDate;    
    let subslotMinutes =  Math.round(((diffDates % 86400000) % 3600000) / 60000); 
    let percSubslot = subslotMinutes / 60;
    let subslotHeight = 120 * percSubslot;

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
    
        dispatch('removesubslotTimesheetForSlot', {
            subslotId: subslotId,
            slotId: slotId
        });
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


    const handleResizeOption = (event) => {
        resizable = !resizable;
    };


    const handleResize = (node) => {
        if(!setInitialSizes){
            setInitialSizes = true;
            subslotHeight = node.clientHeight;
        }else{
            node.setAttribute('data-height',node.clientHeight);
            let slots = Array.from(document.getElementById('slot-'+slotId).getElementsByClassName("subslot-container"));
            
            let totalHeight = 0;
            slots.forEach(function(subslot) {
                totalHeight += parseInt(subslot.getAttribute('data-height'));
            });

            let oSubslots = new Array();
            let slotStartDate = document.getElementById('slot-'+slotId).getAttribute('data-startdate');
            let startDate = new Date(slotStartDate);
            slots.forEach(function(subslot) {
                let height = parseInt(subslot.getAttribute('data-height'));
                let minutes = 60 * height / totalHeight;
                let endDate = addMinutes(startDate, minutes);

                let oSubslot = {
                    percentage: height / totalHeight,
                    id: subslotId,
                    startDate: formatDate(startDate),
                    endDate: formatDate(subSeconds(endDate,1)),
                    minutes: minutes
                }; 

                startDate = endDate;
                oSubslots.push(oSubslot);
            });
            console.log(oSubslots);
        }
    };
</script>

<style>

    .subslot-container{
        display: grid;
        grid-template-columns: 84% 14% 2%;
        position: relative;
        border-top: 0.1em rgb(224, 224, 224) dashed;
        min-height: 40px;
        max-height: 120px;
        margin-top: -0.1em; 
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

<div style="height: {subslotHeight}px;" id={'subslot-container-'+subslotId+'-'+slotId} class="{resizable === true ? 'subslot-container resize': 'subslot-container'}" data-height="{subslotHeight}"
    on:mouseover="{handleResizeOption}" on:mouseout="{handleResizeOption}" use:watchResize={handleResize}>

    <!-- Tarea -->   
    <div id="subslot-{subslotId}" class="subslot" data-name="{subslotName}" 
            data-id="{subslotId}" data-color="{projectColor}" data-slotId="{slotId}" draggable="true" 
            on:dragstart={onDragStart} on:dragend={onDragEnd}>
            
            <!-- Texto -->
            <div ondrop="return false;" style='background-color:white'>
                {subslotName}
            </div>
    </div>

     <!-- Propiedades -->
     <div class="subslotControls" id="subslotControls-subslot-{subslotId}">
            <div class="deleteButton">
                <Button id="btn-del-subslot-{slotId}-{subslotId}" data-subslotId="{subslotId}" data-slotId={slotId} on:click="{removesubslotTimesheet}" color='gray' text small icon='delete'/>
            </div>
    </div>

     <!-- Color -->
    <div style="background-color:{projectColor};" id="project-subslot-{subslotId}" >
    </div>
</div>

