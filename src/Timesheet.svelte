<script>

    import Slot from "./Slot.svelte";	
    import Button from "smelte/src/components/Button";
    import ContentLoader from 'svelte-content-loader';

    import { timesheetStore } from "./stores.js";
    import { todolistStore } from "./stores.js";
    
	export let API_TIMESHEETS_URL;
	export let API_CLARITYPPM_URL;	
    export let PPM_USERNAME;	

    let daysCounter = 0;
    let past = false;
    let tooPast = false;
    let timesheetTitle;
    let timesheetSubtitle;
    let timesheetColor;


    let date=dateToShortFormat(getTodayDate());
    setTimesheetDaySettings(date);
    getTimesheetTAPI(date)
  

   
    /* HANDLE functions*/

	const handleSubslotDragStart = () => {showRemoveSubslot=true;};
    const handleSubslotDragEnd = () => {showRemoveSubslot=false;};
    
    const handleSubslotAdded = (event) =>{
        let subslot = Object.assign({}, $todolistStore.filter(obj => { return obj.id == event.detail.task_id})[0]);
        subslot.slot_id = event.detail.slot_id;
        subslot.task_id = subslot.id;
        subslot.task_name = subslot.name;
        subslot.id = null;
        subslot.start_date = event.detail.start_date;
        subslot.end_date = event.detail.end_date;

        timesheetStore.addSubslot(subslot);
    };

    const handleSubslotChangeSize = (event) =>{
        event.detail.subslots.forEach((tsubslot) => {
            const slotIndex = $timesheetStore.Slots.findIndex(slot => slot.id == tsubslot.slot_id);
            const subslotIndex = $timesheetStore.Slots[slotIndex].Subslots.findIndex(t => t.id == tsubslot.id);

            let subslot = Object.assign($timesheetStore.Slots[slotIndex].Subslots[subslotIndex]);

            subslot.start_date = tsubslot.start_date;
            subslot.end_date = tsubslot.end_date;

            timesheetStore.updateSubslot(subslot);
        });
    };

    const handleSubslotRemoved = (event) => {
        const slotIndex = $timesheetStore.Slots.findIndex(slot => slot.id == event.detail.slot_id);
        const subslotIndex = $timesheetStore.Slots[slotIndex].Subslots.findIndex(subslot => subslot.id == event.detail.id);

        let subslot = $timesheetStore.Slots[slotIndex].Subslots[subslotIndex];
        timesheetStore.removeSubslot(subslot);
    }

    const handleYesterdayButton = () => {
        daysCounter=daysCounter+1;
        let oneDate = new Date();
        oneDate.setDate(oneDate.getDate() - daysCounter);
        
        date = dateToShortFormat(oneDate);
        getTimesheetTAPI(dateToShortFormat(oneDate))
        setTimesheetDaySettings(dateToShortFormat(oneDate));
    }

    const handleTomorrowButton = () => {
        daysCounter=daysCounter-1;
        let oneDate = new Date();
        oneDate.setDate(oneDate.getDate() - daysCounter);
        
        date = dateToShortFormat(oneDate);
        getTimesheetTAPI(dateToShortFormat(oneDate))
        setTimesheetDaySettings(dateToShortFormat(oneDate));
    }

    const handleTodayButton = () => {
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

      /* API functions*/
    async function getTimesheetTAPI(date){ 
        let url = API_TIMESHEETS_URL+'/timesheets/dates';        
        const dateParameter = 'date='+date;
        url = url+'?'+dateParameter;

        let timesheet = fetch(url)
        .then(response => response)
        .then(data => data.json())
        .then(timesheet => {
            timesheetStore.setFromFrontend(timesheet);
            return timesheet;
        })
        .catch(error => console.log('error', error));

        return timesheet;
    }

    async function submitTimesheet(){
        let url = API_CLARITYPPM_URL+'/timesheet';        
        let timesheet = Object.assign({resource_name: PPM_USERNAME},$timesheetStore)

        var requestOptions = {
            method: 'POST',
            redirect: 'follow',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },  
            body: JSON.stringify(timesheet)
        };

        $timesheetStore.ppm_syncing = true;
        fetch(url, requestOptions)
        .then(response => {
            $timesheetStore.ppm_syncing = false;
            $timesheetStore.ppm_synced = 2;
            return response;
        })
        .catch((e) => {
            $timesheetStore.ppm_sync_error = true;
            $timesheetStore.ppm_syncing = false;
        });
    }


</script>
    <div class="container">
        <div class="timesheet-header" style='background-color:{timesheetColor};'>
            <div class="ayer">
                <Button on:click={(e) => handleYesterdayButton(e)} icon="chevron_left" text light />               
            </div>
            <div class="titlebox">
                <div class="sendButton">
                    {#if !$timesheetStore.ppm_syncing && $timesheetStore.ppm_sync_error}
                        <Button on:click={() => submitTimesheet()} icon="cloud_upload" light flat text color='error'/>
                    {:else if !$timesheetStore.ppm_syncing && $timesheetStore.ppm_synced == 2}
                        <Button on:click={() => submitTimesheet()} icon="cloud_upload" light flat text color='success'/>
                    {:else if !$timesheetStore.ppm_syncing && $timesheetStore.ppm_synced == 1 && !$timesheetStore.ppm_sync_error}
                        <Button on:click={() => submitTimesheet()} icon="cloud_upload" light flat text color='alert'/>
                    {:else if $timesheetStore.ppm_syncing}
                        <div class="loader" />
                    {:else}
                        <Button on:click={() => submitTimesheet()} icon="cloud_upload" light flat text color='gray'/>
                    {/if}
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

        {#await $timesheetStore}
            <div class="preloader">
                <ContentLoader>
                    <rect x="0" y="30" rx="30" ry="30" width="10" height="10" />
                    <rect x="70" y="25" rx="3" ry="3" width=310 height="20" />
                </ContentLoader>
            </div>
        {:then timesheetStore}
            <div class="slots">
                {#if timesheetStore && timesheetStore.Slots}
                    {#each timesheetStore.Slots as slot}
                        {#if new Date(slot.hour).getHours() > 8 && new Date(slot.hour).getHours() < 19}
                            <Slot slotId="{slot.id}" hour="{slot.hour}" subslots={slot.Subslots}
                                on:subslotDragStart={() => handleSubslotDragStart()} on:subslotDragEnd={() => handleSubslotDragEnd()}
                                on:subslotAdded={(e) => handleSubslotAdded(e)}
                                on:subslotChangeSize={(e) => handleSubslotChangeSize(e)} 
                                on:removeSubslotTimesheet={(e) => handleSubslotRemoved(e)}/> 
                        {/if}
                    {/each}
                {/if}
            </div>
        {:catch error}
            <p style="color: red">{error.message}</p>
        {/await}	
		
  
    </div>

<style>

    .preloader{
        display: grid;
        align-items: center;
        justify-items: center;
		background-color: white;
		height: 90px;
    }
    .container{
        box-shadow: 2px 2px 8px  rgba(0,0,0,0.1);
        width: 100%;
		overflow: hidden;
    }

	.timesheet-header {
        display: grid;
        grid-template-columns: 20% 60% 10% 10%;
		border-radius: 2px;
        height: 100px;
        align-items: center;
        justify-items: center;
	}

    .slots{
        width: 100%;
		overflow-y: scroll;
		padding-right: 17px; /* Increase/decrease this value for cross-browser compatibility */
		box-sizing: content-box; /* So the width will be 100% + 17px */        background-color:white;
        max-height: calc(100vh - 230px);
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

    .loader {
        border: 2px solid #f3f3f3;
        border-radius: 50%;
        border-top: 2px solid gray;
        width: 20px;
        height: 20px;
        -webkit-animation: spin 2s linear infinite; /* Safari */
        animation: spin 2s linear infinite;
        margin-top: 18px;
        margin-right: 15px;
    }

    /* Safari */
    @-webkit-keyframes spin {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
    }

    @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
    }
</style>