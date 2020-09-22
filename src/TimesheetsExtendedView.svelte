<script>
	import Header from "./Header.svelte";	
	import Navigation from "./Navigation.svelte";
	import TimesheetExtended from "./TimesheetExtended.svelte";

	let showNav;
	const handleShowNavigationDrawer = (event) =>{
		showNav = event.detail.showNav;
	};

	let showHome = true;
	let showProjects = false;

	const handleMenu = (event) =>{
		showProjects = event.detail.showProjects;
		showHome = event.detail.showHome;
	};
	
	function dateToShortFormat(anotherDate){
        const dd = String(anotherDate.getDate()).padStart(2, '0');
        const mm = String(anotherDate.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = anotherDate.getFullYear();

        return  `${yyyy}-${mm}-${dd}`;
	}
	
    function Last5Days () {
        let result = [];
        for (let i=daysCounter; i<daysCounter+5; i++) {
            let d = new Date();
            d.setDate(d.getDate() - i);
            result.push( dateToShortFormat(d) )
		}
        return result;
	}   
	let daysCounter = 0;
    let aLast5Days = Last5Days();
</script>

<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

<header>
	<Header on:showNavigationDrawer={handleShowNavigationDrawer} />
</header>
<navbar></navbar>
<main>
	<aside>
		{#if showNav}
			<Navigation on:handleMenu={handleMenu} showNav={true} showNavMobile={true} elevation="{true}" persistent="{false}" right="{true}" ></Navigation>   
		{/if}
	</aside>
	<content>
		
		<TimesheetExtended date={aLast5Days[4]} />
		<TimesheetExtended date={aLast5Days[3]} extendedView={true}/>
		<TimesheetExtended date={aLast5Days[2]} extendedView={true}/>
		<TimesheetExtended date={aLast5Days[1]} extendedView={true}/>
		<TimesheetExtended date={aLast5Days[0]} extendedView={true}/>



	</content>
</main>
<footer></footer>




<style>

	:global(body) { 
		background-color: rgb(243, 240, 240);
	}
	content {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
		grid-column-gap: 2px;
		padding-top: 50px;
	}

	header {
		margin-bottom: 50px;
	}



	@media (min-width: 640px) {
		content {
			max-width: none;
		}
	}
</style>