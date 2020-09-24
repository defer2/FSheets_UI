<script>
    import Slot from "./Slot.svelte";	
    import SlotExtended from "./SlotExtended.svelte";

    let extendedView = false;
    export let timesheetToday;
    export let timesheetColor;
    export let lastTimesheetDate;

    timesheetToday.date === lastTimesheetDate ? extendedView = true : extendedView = false;
    let timesheetTitle = timesheetToday.date;
    let timesheetSubtitle;

    setTimesheetDaySettings(timesheetToday.date);
  

    /* HANDLE functions*/
    const handleSubslotChangeSize = (event) =>{
        event.detail.subslots.forEach((subslot) => {
            updateSubslotTAPI(subslot.id, subslot.slotId, subslot.startDate, subslot.endDate);
        });
    };

    const handleSubslotRemoved = (event) => {
        deleteSubslotTAPI(event.detail.subslotId);
    }

    function getYesterdayDate(){
        const yesterday = new Date();
        return yesterday.setDate(yesterday.getDate() - 1);
    }

    /* MISC functions */
    function setTimesheetDaySettings(dDate){
        const myDate = new Date(dDate.replace( /(\d{4})-(\d{2})-(\d{2})/, "$1/$2/$3"));
        const today = new Date();
        const yesterday = new Date(getYesterdayDate());
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        timesheetSubtitle = days[myDate.getDay()];

        if(myDate.getDate() === today.getDate()){
            timesheetTitle = 'Today';
        }else if(myDate.getDate() === yesterday.getDate()){
            timesheetTitle = 'Yesterday';
        }else{
            const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(myDate);
            const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(myDate);
            const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(myDate);
            timesheetTitle = `${da} ${mo}, ${ye}`;
        }

        (myDate.getDay() == 6 || myDate.getDay() == 0) ? timesheetColor = 'rgb(236, 236, 236)' : timesheetColor = 'white';
    }

  
</script>

    <div class="container" >
        <div class="timesheet-header" style='background-color:{timesheetColor};'>
            <div class="title" style='grid-column-start:span 2;'>
                <h5>{timesheetTitle}</h5>
                <center><span class="subtitle-2" style="color:gray;text-transform:lowercase;">{timesheetSubtitle}</span></center>
            </div>   
        </div>
        <div class="slots">
            {#await timesheetToday}
                <div/>
            {:then oTimesheet}
                {#each oTimesheet.Slots as slot}
                    {#if new Date(slot.hour).getHours() > 8 && new Date(slot.hour).getHours() < 19}
                        {#if extendedView}
                            <Slot slotId="{slot.id}" hour="{slot.hour}" subslots={slot.Subslots}
                        on:subslotsChangeSize={handleSubslotChangeSize} on:removeSubslotTimesheet={handleSubslotRemoved}/> 
                        {:else}
                            <SlotExtended slotId="{slot.id}" hour="{slot.hour}" subslots={slot.Subslots}
                            on:subslotsChangeSize={handleSubslotChangeSize} on:removeSubslotTimesheet={handleSubslotRemoved}/>   
                        {/if}
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
        grid-template-columns: 20% 80%;
        align-items: center;
		justify-items: center;
		border-radius: 2px;
        height: 90px;
	}

	.title {
        padding: 16px;
    }
    

    .slots{
        background-color:white;
    }

</style>