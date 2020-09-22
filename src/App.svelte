<script>
	import Timesheet from "./Timesheet.svelte";
	import Projects from "./Projects.svelte";
	import Todolist from "./Todolist.svelte";	
	import Header from "./Header.svelte";	
	import Navigation from "./Navigation.svelte";

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
		{#if showProjects}
			<section id='projects'>
				<Projects/>
			</section>
		{/if}
		{#if showHome}
			<section id='todolist'>
				<Todolist/>
			</section>
			<section id='timesheet' style='margin-right:40px'>
				<Timesheet/>
			</section>
		{/if}

	</content>
</main>
<footer></footer>




<style>

	:global(body) { 
		background-color: rgb(243, 240, 240);
	}
	content {
		display: grid;
		grid-template-columns: 43% 57%;
		grid-column-gap: 50px;
		margin: auto;
		width: 92%;
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