<script>
	import Button from "smelte/src/components/Button";
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher();
	
	function onDrop(event) {
        event.preventDefault();

        dispatch('taskRemoved', {
            task_id: event.dataTransfer.getData('text')
		});
    }
</script>



<div class="container" ondragover="return false;"  on:drop={event => onDrop(event)}>
	<div class="btnRemove py-2"><Button color="error" icon="delete" small /></div>
</div>

<style>

	.container{
		text-align: left;
		height: 50px;
	}

	.btnRemove{
		padding-top:7px;
		width: 10px;
		height: 10px;
		margin: auto;
	}



</style>