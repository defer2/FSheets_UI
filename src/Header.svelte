<script>
	import Button from "smelte/src/components/Button";
	import Menu from 'smelte/src/components/Menu';
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher();
	

	let showNav = false;

	const showNavigationDrawer = () => {
		showNav = !showNav

		dispatch('showNavigationDrawer', {
			showNav: showNav
		}); 
	};
	   

  const items = [
		{ value: 1, text: 'Proyectos' }
	];
</script>

<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

<div class="main-header">
	<div class="title" />
	<div class="options">
		<Button on:click={showNavigationDrawer} icon="menu" flat small color="none" />
	</div>
</div>	


<style>
	.main-header{
		display: grid;
		grid-template-columns: 97% 2%;
		align-items: center;
		height: 63px;
		background-color: rgb(94, 90, 90);
		width: 100%;
		overflow: hidden;
		position: fixed;
		top: 0;
	}

	.options{
		align-items: center;
	}

</style>