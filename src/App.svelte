<script>
	import Timesheet from "./Timesheet.svelte";
	import Projects from "./Projects.svelte";
	import Todolist from "./Todolist.svelte";	
	import Header from "./Header.svelte";	
	import TimesheetsExtendedView from "./TimesheetsExtendedView.svelte";
import Button from "smelte/src/components/Button/Button.svelte";

	export let configuration;

	let showHome = true;
	let showProjects = false;
	let showExtendedView = false;

	const handleMenu = (event) =>{
		showProjects = event.detail.showProjects;
		showHome = event.detail.showHome;
		showExtendedView = event.detail.showExtendedView;
	};
</script>

<svelte:head>
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
</svelte:head>

<header>
	<Header on:handleMenu={handleMenu} />
</header>
<main>
	{#if showProjects}
		<content>
			<section id='projects'>
				<Projects {...configuration}/>
			</section>
		</content>
	{:else if showHome}
		<content>
			<section id='todolist'>
				<Todolist {...configuration}/>
			</section>
			<section id='timesheet' style='margin-right:40px'>
				<Timesheet {...configuration}/>
			</section>
		</content>
	{:else if showExtendedView}
		<section id='timesheet' style='margin-right:40px'>
			<TimesheetsExtendedView {...configuration}/>
		</section>
	{/if}
</main>
<footer></footer>

<style>
	:global(body) { 
		background-color: #f3f0f0;
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