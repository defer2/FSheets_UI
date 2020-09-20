<script>
	import Timesheet from "./Timesheet.svelte";
	import Todolist from "./Todolist.svelte";	
	import Header from "./Header.svelte";	
</script>

<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

<header><Header/></header>
<navbar></navbar>
<main>
		<aside></aside>
		<content>
			<section id='timesheet'><Timesheet/></section>
			<section id='todolist'><Todolist/></section>
		</content>
</main>
<footer></footer>




<style>

	:global(body) { 
		background-color: rgb(243, 240, 240);
	}
	content {
		display: grid;
		grid-template-columns: 55% 43%;
		grid-column-gap: 50px;
		margin: auto;
		width: 92%;
		padding-top: 50px;
		margin-bottom: 50px;
	}

	@media (min-width: 640px) {
		content {
			max-width: none;
		}
	}
</style>