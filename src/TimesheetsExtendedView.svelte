<script>
	import TimesheetExtended from "./TimesheetExtended.svelte";
    import Button from "smelte/src/components/Button";

	async function getTimesheetsTAPI(startDate, endDate){ 
        let url = 'http://localhost:5012/timesheets/dates';        
        const startDateParamenter = 'start_date='+startDate;
        const endDateParamenter = 'end_date='+endDate;
        
		url = url+'?'+startDateParamenter+'&'+endDateParamenter;
		
        let timesheets = await fetch(url)
            .then(response => response)
            .then(data => {
                return data.json();
            })
            .catch(error => console.log('error', error));

		for(let k = 0; k < timesheets.length ; k++){
			let timesheet = timesheets[k];

			if(timesheet.length == 0){
				await createTimesheetTAPI(date);
				
				timesheet = await fetch(url)
				.then(response => response)
				.then(data => {
					return data.json();
				})
				.catch(error => console.log('error', error));
			}

			let Slots = timesheet.Slots;

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
		}

        return timesheets;
	}

	function getLastTimesheetDate(dDate) {
		let myDate = new Date(dDate.replace( /(\d{4})-(\d{2})-(\d{2})/, "$1/$2/$3"));
		myDate = new Date(myDate.setDate(myDate.getDate() + 1));

		return dateToShortFormat(myDate);
	}
	
	function calculateLastFiveDays(){
		let firstDate = new Date();
		let secondDate = new Date();

		const dayPlusFive = parseInt(dayCounter) + 5;

		let date1 = firstDate.setDate(firstDate.getDate() - dayCounter);
		let date2 = secondDate.setDate(secondDate.getDate() - dayPlusFive);

		const dates = {
			start_date: dateToShortFormat(new Date(date1)),
			end_date: dateToShortFormat(new Date(date2)),
		}

		return dates;
	}

	function handleGetPastTimesheets(){
		dayCounter = parseInt(dayCounter) + 5;
		const dates = calculateLastFiveDays();
		
		lastTimesheetDate = getLastTimesheetDate(dates.end_date);
		timesheets = getTimesheetsTAPI(dates.start_date, dates.end_date)
	}

	function handleGetNextTimesheets(){
		dayCounter = parseInt(dayCounter) - 5;
		const dates = calculateLastFiveDays();

		lastTimesheetDate = getLastTimesheetDate(dates.end_date);
		timesheets = getTimesheetsTAPI(dates.start_date, dates.end_date)
	}

	function dateToShortFormat(anotherDate){
        const dd = String(anotherDate.getDate()).padStart(2, '0');
        const mm = String(anotherDate.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = anotherDate.getFullYear();

        return  `${yyyy}-${mm}-${dd}`;
    }

	let dayCounter = 0;
	let dates = calculateLastFiveDays();

	let lastTimesheetDate = getLastTimesheetDate(dates.end_date);
	let timesheets = getTimesheetsTAPI(dates.start_date, dates.end_date);
	

</script>


	<content>	
		<Button on:click={() => handleGetPastTimesheets()} icon='chevron_left' text small></Button>
		{#await timesheets}
		<div/>
		{:then oTimesheets}
			{#each oTimesheets as timesheet}
				<TimesheetExtended timesheetToday={timesheet} {lastTimesheetDate} />
			{/each}
		{:catch error}
            <p style="color: red">{error.message}</p>
		{/await}
		{#if dayCounter > 0}
			<Button on:click={() => handleGetNextTimesheets()} icon='chevron_right' text small></Button>	
		{:else}
			<Button on:click={() => false} icon='chevron_right' color='gray' text small flat></Button>	
		{/if}
	</content>





<style>

	:global(body) { 
		background-color: rgb(243, 240, 240);
	}
	content {
		display: grid;
		grid-template-columns: 0.1fr 1fr 1fr 1fr 1fr 1fr 0.1fr;
		align-items: center;
		justify-items: center;
		grid-column-gap: 2px;
		padding-top: 50px;
		padding-left: 50px;
	}

	@media (min-width: 640px) {
		content {
			max-width: none;
		}
	}
</style>