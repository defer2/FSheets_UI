<script>
	import Timesheet from "./Timesheet.svelte";
	import Projects from "./Projects.svelte";
	import Todolist from "./Todolist.svelte";	
	import Header from "./Header.svelte";	
	import TimesheetsExtendedView from "./TimesheetsExtendedView.svelte";
	import Settings from "./Settings.svelte";

	export let configuration;

	let showHome = true;
	let showProjects = false;
	let showExtendedView = false;
	let showSettings = false;

	async function getSettingsTAPI(){ 
		const api_old = configuration.API_SETTINGS_URL;
        let url = configuration.API_SETTINGS_URL+'/view';        
   
		const settings = await fetch(url)
            .then(response => response)
			.then(data => data.json())
			.then(settings => {
				settings[0].API_SETTINGS_URL = api_old;
				console.log(settings);
				return settings;
            })
            .catch(error => console.log('error', error));

        return settings[0];
	}

	const handleMenu = (event) =>{
		showProjects = event.detail.showProjects;
		showHome = event.detail.showHome;
		showExtendedView = event.detail.showExtendedView;
		showSettings = event.detail.showSettings;
	};

	configuration = getSettingsTAPI();

</script>

<svelte:head>
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
</svelte:head>



{#await configuration}
	<div/>
{:then configuration}
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
		{:else if showSettings}
		<content>	
			<section id='settings'>
				<Settings {...configuration}/>
			</section>
		</content>
		{/if}
	</main>
	<footer></footer>
{/await}


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