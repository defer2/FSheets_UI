<script>
    import Slot from "./Slot.svelte";	
    import Button from "smelte/src/components/Button";

    const resourceName = 'fernando.defalco'
    let date=dateToShortFormat(getTodayDate());
    let timesheetToday = getTimesheetTAPI(date);
    
    let daysCounter = 0;
    let past = false;
    let tooPast = false;
    let timesheetTitle;
    let timesheetSubtitle;
    let timesheetColor;
    let ppm_synced = false;
    setTimesheetDaySettings(date);


    /* API functions*/

    async function createTimesheetTAPI(date) {
		let url = 'http://192.168.0.50:5012/timesheets';
        const dateParameter = 'date='+date;

        url = url+'?'+dateParameter;
		var requestOptions = {
			method: 'POST',
			redirect: 'follow'
		};

		const res = await fetch(url, requestOptions)
		.then(response => response)
		.then(result => result)
		.catch(error => console.log('error', error));
	}

    async function getTimesheetTAPI(date){ 
        let url = 'http://192.168.0.50:5012/timesheets/dates';        
        const dateParameter = 'date='+date;
        
        url = url+'?'+dateParameter;
        let timesheet = await fetch(url)
            .then(response => response)
            .then(data => data.json())
            .then(timesheet => {  
                return timesheet;
            })
            .catch(error => console.log('error', error));


        if(timesheet.length == 0){
            await createTimesheetTAPI(date);
            
            timesheet = await fetch(url)
            .then(response => response)
            .then(data => data.json())
            .then(timesheet => {
                return timesheet;
            })
            .catch(error => console.log('error', error));
        }

        let Slots = timesheet[0].Slots;

        for(let i = 0; i < Slots.length ; i++){
            let subslots = Slots[i].Subslots;

            for(let j = 0; j < subslots.length; j++){
                let subslot = subslots[j];

                const taskId = subslot.task_id;
                let url = 'http://192.168.0.50:5011/view/project';        
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
		const url = 'http://192.168.0.50:5012/subslots/'+subslotId;

		var requestOptions = {
			method: 'DELETE',
			redirect: 'follow'
		};

		const res = await fetch(url, requestOptions)
            .then(response => response)
            .then(result => result)
            .catch(error => console.log('error', error));

        if(res.ok) ppm_synced = false;

        timesheetToday = getTimesheetTAPI(date);
        timesheetToday = timesheetToday
	}	

    async function createSubslotTAPI(slotId, taskId, taskName) {
        let url = 'http://192.168.0.50:5012/subslots/quick';
        
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

        if(res.ok) ppm_synced = false;

        timesheetToday = getTimesheetTAPI(date);
        timesheetToday = timesheetToday
    }    

    async function updateSubslotTAPI(subslotId, slotId, startDate, endDate) {
        let url = 'http://192.168.0.50:5012/subslots';
        
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
        
        if(res.ok) ppm_synced = false;

        timesheetToday = getTimesheetTAPI(date);
        timesheetToday = timesheetToday
    }

    async function handleSubmitTimesheet(){
        timesheetToday.then(async (result) => {
            let url = 'http://192.168.0.50:5013/timesheet';
            result[0].resource_name = resourceName;

            var requestOptions = {
                method: 'POST',
                redirect: 'follow',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },  
                body: JSON.stringify(result[0])
            };

        	const res = await fetch(url, requestOptions)
            .catch(error => console.log('error', error));

            if(res.ok) ppm_synced = true;
        })
    }

    /* HANDLE functions*/

	const handleSubslotDragStart = () => {showRemoveSubslot=true;};
    const handleSubslotDragEnd = () => {showRemoveSubslot=false;};
    
    const handleSubslotAdded = (event) =>{
        createSubslotTAPI(event.detail.slotId, event.detail.taskId, event.detail.subslotName);
    };

    const handleSubslotChangeSize = (event) =>{
        event.detail.subslots.forEach((subslot) => {
            updateSubslotTAPI(subslot.id, subslot.slotId, subslot.startDate, subslot.endDate);
        });
    };

    const handleSubslotRemoved = (event) => {
        deleteSubslotTAPI(event.detail.subslotId);
    }

    const handleYesterdayButton = (e) => {
        daysCounter=daysCounter+1;
        let oneDate = new Date();
        oneDate.setDate(oneDate.getDate() - daysCounter);
        
        date = dateToShortFormat(oneDate);
        timesheetToday = getTimesheetTAPI(dateToShortFormat(oneDate))
        timesheetToday = timesheetToday

        setTimesheetDaySettings(dateToShortFormat(oneDate));
    }

    const handleTomorrowButton = (e) => {
        daysCounter=daysCounter-1;
        let oneDate = new Date();
        oneDate.setDate(oneDate.getDate() - daysCounter);
        
        date = dateToShortFormat(oneDate);
        timesheetToday = getTimesheetTAPI(dateToShortFormat(oneDate))
        timesheetToday = timesheetToday
        
        setTimesheetDaySettings(dateToShortFormat(oneDate));
    }

    const handleTodayButton = (e) => {
        const date=dateToShortFormat(getTodayDate());
        timesheetToday = getTimesheetTAPI(date);
        
        setTimesheetDaySettings(dateToShortFormat(oneDate));
    }

    /* MISC functions */

    
    function dateToShortFormat(anotherDate){
        const dd = String(anotherDate.getDate()).padStart(2, '0');
        const mm = String(anotherDate.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = anotherDate.getFullYear();

        return  `${yyyy}-${mm}-${dd}`;
    }
    
    function getTodayDate(){
        return new Date();
    }

    function getYesterdayDate(){
        const yesterday = new Date();
        return yesterday.setDate(yesterday.getDate() - 1);
    }

    function setTimesheetDaySettings(dDate){
        const myDate = new Date(dDate.replace( /(\d{4})-(\d{2})-(\d{2})/, "$1/$2/$3"));
        const today = new Date();
        const yesterday = new Date(getYesterdayDate());
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        timesheetSubtitle = days[myDate.getDay()];

        if(myDate.getDate() === today.getDate()){
            timesheetTitle = 'Today';
            past = false;
            tooPast = false;
        }else if(myDate.getDate() === yesterday.getDate()){
            timesheetTitle = 'Yesterday';
            past = true;
            tooPast = false;
        }else{
            tooPast = true;
            const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(myDate);
            const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(myDate);
            const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(myDate);
            timesheetTitle = `${da} ${mo}, ${ye}`;
        }

        (myDate.getDay() == 6 || myDate.getDay() == 0) ? timesheetColor = 'rgb(236, 236, 236)' : timesheetColor = 'white';
    }

</script>


    <div class="container">
        <div class="timesheet-header" style='background-color:{timesheetColor};'>
            <div class="ayer">
                <Button on:click={(e) => handleYesterdayButton(e)} icon="chevron_left" text light />               
            </div>
            <div class="titlebox">
                    <div class="sendButton">
                        {#await timesheetToday}
                            <Button on:click={() => handleSubmitTimesheet()} icon="cloud_upload" light flat text color='gray'/>
                        {:then timesheetToday}
                            {#if timesheetToday[0].ppm_synced == 1 && timesheetToday[0].ppm_last_sync || ppm_synced}
                                <Button on:click={() => handleSubmitTimesheet()} icon="cloud_upload" light flat text color='success'/>
                            {:else if timesheetToday[0].ppm_synced == 1 && !timesheetToday[0].ppm_last_sync}
                                <Button on:click={() => handleSubmitTimesheet()} icon="cloud_upload" light flat text color='alert'/>
                            {:else}
                                <Button on:click={() => handleSubmitTimesheet()} icon="cloud_upload" light flat text color='gray'/>
                            {/if}
                        {:catch error}
                            <Button on:click={() => handleSubmitTimesheet()} icon="cloud_upload" light flat text color='gray'/>
                        {/await}	

                        </div>
                    <div class="titleWrapper">
                        <div class="title">
                            <h5>{timesheetTitle}</h5>
                        </div>
                        <div class="subtitle-2 subtitle">
                            {timesheetSubtitle}
                        </div>
                    </div>
            </div>
            {#if past}
                {#if tooPast}
                    <div class="manana">
                        <Button on:click={(e) => handleTomorrowButton(e)} icon="chevron_right" text light />               
                    </div>
                    <div class="hoy">
                        <Button on:click={(e) => handleTodayButton(e)} icon="last_page" text light />
                    </div>
                {:else}
                    <div class="manana" >
                        <Button on:click={(e) => handleTomorrowButton(e)} icon="chevron_right" text light />               
                    </div>
                    <div class="hoy">
                        <Button on:click={() => {return false}} icon="last_page" flat text light color=gray/>
                    </div>
                {/if}
            {:else}
                <div class="manana">
                    <Button on:click={() => {return false}} icon="chevron_right" flat text light color=gray />               
                </div>
                <div class="hoy">
                    <Button on:click={() => {return false}} icon="last_page" flat text light color=gray/>
                </div>
            {/if}
        </div>
        <div class="slots">

        {#await timesheetToday}
            <div/>
        {:then timesheetToday}
            {#each timesheetToday[0].Slots as slot}
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
    }

	.timesheet-header {
        display: grid;
        grid-template-columns: 20% 60% 10% 10%;
		border-radius: 2px;
        height: 90px;
        align-items: center;
        justify-items: center;
	}

    .slots{
        background-color:white;
    }

    .ayer {
        display: flex;
        justify-content: center;
        align-items: center;    
        height: 100%;
    }

    .manana {
        display: flex;
        justify-content: center;
        align-items: center;    
        height: 100%;
    }
    .hoy {
        display: flex;
        justify-content: center;
        align-items: center;   
        height: 100%;
    }
	.titlebox {
        margin-top: 20px;
    }

    
    .titleWrapper{
        display: grid;
        grid-template-rows: 2;
        padding:10px 0px 20px 0px;
        grid-column: 2;
        grid-row: 1;
        justify-self: start;
        align-self: flex-start;
    }

    .title{
        /* padding:10px 0px 20px 0px; */
        grid-column: 2;
        grid-row: 1;
        justify-self: center;
        align-self: center;
        float: left;


    }

    .sendButton{
        grid-column: 1 / 2;
        grid-row: 1;
        align-self: top;
        justify-self: right;
        float: left;

    }

    .subtitle{
        color:gray;
        text-transform:lowercase;
        grid-column: 2;
        grid-row: 2 ;
        align-self: flex-end;
        justify-self: center;
    }

</style>