<script>
	import Timesheet from "./Timesheet.svelte";
	import Todolist from "./Todolist.svelte";	
</script>

<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />


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
	main {
		background-color: rgb(243, 240, 240);
	}
	content {
		display: grid;
		grid-template-columns: 55% 45%;
		grid-column-gap: 50px;
		margin: auto;
		width: 90%;
		padding-top: 100px;
	}

	@media (min-width: 640px) {
		content {
			max-width: none;
		}
	}
</style>