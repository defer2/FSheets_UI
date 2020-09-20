<script>
	import Button from "smelte/src/components/Button";
	import Menu from 'smelte/src/components/Menu';
	import List from 'smelte/src/components/List';

  let open = true;
	let selected = "";

  const items = [
		{ value: 1, text: 'Proyectos' }
	];
</script>

<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

<div class="main-header">
	<div class="title" />
	<div class="options">
		<Menu bind:open {items} bind:value={selected}>
			<div slot="activator">
				<Button on:click={() => open = !open} icon="settings" flat small color="none" />
			</div>
		</Menu>
	</div>
</div>	




<style>
	.main-header{
		display: grid;
		grid-template-columns: 2% 98%;
		align-items: center;
		height: 50px;
		background-color: rgb(94, 90, 90);
		width: 100%;
	}

	.options{
		align-items: center;
	}

</style>