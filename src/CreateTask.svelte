<script>
	import Button from "smelte/src/components/Button";
	import TextField from "smelte/src/components/Textfield/TextField.svelte";

	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher();
	let eventKeyUp=false;

	const addTask = () => {	
        const taskElement = document.getElementById('txtTaskname');
        const taskName = taskElement.value;

        dispatch('taskAdded', {
            taskName: taskName
		});
	};

	const checkIfEnter = (evt) => {
		if(!eventKeyUp){
			evt.target.addEventListener('keydown',(e)=>{
				if (e.key === 'Enter' || e.keyCode === 13) {
					document.getElementById('btn-create-task').click();
				}else if (e.key === 'Backspace' || e.key === 'Delete' || e.keyCode === 46 || e.keyCode === 8) {
                    let str=evt.target.value;
                    let lastIndex = str.lastIndexOf(" ")+1;
                    str = str.substring(0, lastIndex);
                    evt.target.value=str;
                }
			});
			eventKeyUp=true;
		}
	};
	
	


</script>
<style>

	.container{
		display: grid;
		grid-template-columns: 90% 10%;
		align-items: center;
	}

	.btnAdd{
		padding-top:7px;
		margin-right: 20px;
		width: 10px;
	}

	.textfield{
		margin-left: 40px;
		width: 450px;
	}


</style>

<div class="container">
	<div class="textfield">
		<TextField id='txtTaskname' on:focus={checkIfEnter} type="text" minlength="4" max="50" placeholder="add a new task" size="10" style='background-color:white;'/>
	</div>
	<div class="btnAdd py-2">
		<Button id="btn-create-task" icon="add" small on:click="{addTask}"/>
	</div>
</div>

