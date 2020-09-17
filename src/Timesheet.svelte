<script>
	import Subslot from "./Subslot.svelte";	
    import Slot from "./Slot.svelte";	
    import Button from "smelte/src/components/Button";

    let date='2020-09-03';


	async function getTasksTAPI() {
		let url = 'http://localhost:5011/view';
	
	}


    async function getTimesheetTAPI(date){ 
        let tempTimesheet;

        let url = 'http://localhost:5012/timesheets';        
        let dateParameter = 'date='+date;
        
        url = url+'?'+dateParameter;

        const res = await fetch(url);
		const text = await res.json();

		if (res.ok) {
            console.log(text);
			return text;
		} else {
			throw new Error(text);
		}
    }
  
    async function deleteSubslotTAPI(subslotId) {
		let url = 'http://localhost:5012/subslots/'+subslotId;

		var requestOptions = {
			method: 'DELETE',
			redirect: 'follow'
		};

		const res = await fetch(url, requestOptions)
		.then(response => response)
		.then(result => console.log(result))
		.catch(error => console.log('error', error));

        timesheetToday = getTimesheetTAPI(date);
	}	

    /********************************** DATA KITCHEN */
    /********************************** FUNCTIONS */
    let showRemoveSubslot = false;

	const handleSubslotDragStart = () => {showRemoveSubslot=true;};
    const handleSubslotDragEnd = () => {showRemoveSubslot=false;};
    
    function handleSubslotAdded(event) {
        let newSubslot = new Object();
        newSubslot.id = event.detail.subslotId;
        newSubslot.name = event.detail.subslotName;
        let slotId = event.detail.slotId;



        createSubslotTAPI(slotId,newSubslot.id,newSubslot.name);
    }

    function handleSubslotRemoved(event) {
        let subslotId = event.detail.subslotId;
        deleteSubslotTAPI(subslotId);
    }

    async function createSubslotTAPI(slotId, subslotId, subslotName) {
        let url = 'http://localhost:5012/subslots/quick';
        
        let parameterSlotId='slot_id='+slotId;
		let parameterSubslotId='task_id='+subslotId;
		let parameterSubslotName='task_name='+subslotName;

		url = url+'?'+parameterSlotId+'&'+parameterSubslotId+'&'+parameterSubslotName; //+'&'+parameterProjectId;

		var requestOptions = {
			method: 'POST',
			redirect: 'follow'
		};

		const res = await fetch(url, requestOptions)
		.then(response => response)
		.then(result => console.log(result))
		.catch(error => console.log('error', error));

        timesheetToday = getTimesheetTAPI(date);
    }
    
	let timesheetToday = getTimesheetTAPI(date);

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
                        on:subslotAdded={handleSubslotAdded} on:subslotDragStart={handleSubslotDragStart} on:subslotDragEnd={handleSubslotDragEnd} on:removeSubslotTimesheet={handleSubslotRemoved}/> 
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