<script>
	import Subslot from "./Subslot.svelte";	
    import Slot from "./Slot.svelte";	
    import Button from "smelte/src/components/Button";

    let date='2020-09-03';
    let showRemoveSubslot = false;
    let timesheetToday = getTimesheetTAPI(date);
    
    /* API functions*/

    async function getTimesheetTAPI(date){ 
        let url = 'http://localhost:5012/timesheets';        
        const dateParameter = 'date='+date;
        
        url = url+'?'+dateParameter;
        const timesheet = await fetch(url)
            .then(response => response)
            .then(data => {
                return data.json();
            })
            .catch(error => console.log('error', error));

        let Slots = timesheet[0].Slots;

        for(let i = 0; i < Slots.length ; i++){
            let subslots = Slots[i].Subslots;

            for(let j = 0; j < subslots.length; j++){
                let subslot = subslots[j];

                const taskId = subslot.task_id;
                let url = 'http://localhost:5011/view/project';        
                const parameterTaskId = taskId;
                
                url = url+'/'+parameterTaskId;

                const project = await fetch(url)
                    .then(response => response)
                    .then(data => {
                        return data.json();
                    }).catch(error => console.log('error', error));

                subslot.project = project;
            }
        }

        return timesheet;
    }
  
    async function deleteSubslotTAPI(subslotId) {
		const url = 'http://localhost:5012/subslots/'+subslotId;

		var requestOptions = {
			method: 'DELETE',
			redirect: 'follow'
		};

		await fetch(url, requestOptions)
            .then(response => response)
            .then(result => result)
            .catch(error => console.log('error', error));

        timesheetToday = getTimesheetTAPI(date);
	}	

    async function createSubslotTAPI(slotId, taskId, taskName) {
        let url = 'http://localhost:5012/subslots/quick';
        
        const parameterSlotId='slot_id='+slotId;
		const parameterTaskId='task_id='+taskId;
        const parameterTaskName='task_name='+taskName;

		url = url+'?'+parameterSlotId+'&'+parameterTaskId+'&'+parameterTaskName; //+'&'+parameterProjectId;

		var requestOptions = {
			method: 'POST',
			redirect: 'follow'
		};

		const res = await fetch(url, requestOptions)
		.then(response => response)
		.then(result => result)
		.catch(error => console.log('error', error));

        timesheetToday = getTimesheetTAPI(date);
    }    
    
    async function updateSubslotTAPI(subslotId, slotId, startDate, endDate) {
        let url = 'http://localhost:5012/subslots';
        
        const parameterSubslotId='/'+subslotId;
        const parameterSlotId='slot_id='+slotId;
		const parameterStartDate='start_date='+startDate;
        const parameterEndDate='end_date='+endDate;
        const parameterOperation='operation=change_dates';

        url += parameterSubslotId+'?'+parameterSlotId+'&'+parameterStartDate+'&'+parameterEndDate+'&'+parameterOperation; 
        
		var requestOptions = {
			method: 'PUT',
			redirect: 'follow'
		};

		const res = await fetch(url, requestOptions)
		.then(response => response)
		.then(result => result)
		.catch(error => console.log('error', error));

        timesheetToday = getTimesheetTAPI(date);
    }

    /* HANDLE functions*/

	const handleSubslotDragStart = () => {showRemoveSubslot=true;};
    const handleSubslotDragEnd = () => {showRemoveSubslot=false;};
    
    const handleSubslotAdded = (event) =>{
        createSubslotTAPI(event.detail.slotId, event.detail.taskId, event.detail.subslotName);
    };

    const handleSubslotChangeSize = (event) =>{
        event.detail.subslots.forEach((subslot) => {
            console.log(subslot);
            updateSubslotTAPI(subslot.id, subslot.slotId, subslot.startDate, subslot.endDate);
        });
    };

    const handleSubslotRemoved = (event) => {
        deleteSubslotTAPI(event.detail.subslotId);
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

        {#await timesheetToday}
            <div/>
        {:then oTimesheet}
            {#each oTimesheet[0].Slots as slot}
                {#if new Date(slot.hour).getHours() > 8 && new Date(slot.hour).getHours() < 19}
                    <Slot slotId="{slot.id}" hour="{slot.hour}" subslots={slot.Subslots}
                        on:subslotAdded={handleSubslotAdded} on:subslotDragStart={handleSubslotDragStart} on:subslotsChangeSize={handleSubslotChangeSize}
                        on:subslotDragEnd={handleSubslotDragEnd} on:removeSubslotTimesheet={handleSubslotRemoved}/> 
                {/if}
            {/each}
        {:catch error}
            <p style="color: red">{error.message}</p>
        {/await}	
		
  
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