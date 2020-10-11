<script>
  	import * as Smelte from 'smelte'
	import { createEventDispatcher } from 'svelte'
    import { alertstore } from './alert.js'


	const dispatch = createEventDispatcher();
	let taskName;

	const addTask = () => {	
        const taskElement = document.getElementById('txtTaskname');

		if(!taskName || (taskName && taskName.trim() == "")){
			alertstore.error('not without a name...');
			taskElement.focus();
		}else{

			dispatch('taskAdded', {
				name: taskName
			});


			taskName = null;
			taskElement.placeholder = 'add a new task';
			taskElement.focus();
		}
	};

	const checkIfEnter = (evt) => {
		evt.target.addEventListener('keydown',(e)=>{
			if (e.key === 'Enter' || e.keyCode === 13) {
				document.getElementById('btn-create-task').click();
			}else if (e.key === 'Backspace' || e.key === 'Delete' || e.keyCode === 46 || e.keyCode === 8) {
				delay = setTimeout(deleteWholeWord, 500);
				
				function deleteWholeWord(){
					let str=evt.target.value;
					let lastIndex = str.lastIndexOf(" ")+2;
					str = str.substring(0, lastIndex);
					evt.target.value=str;
				}
			}
		});

		evt.target.addEventListener('keyup',(e)=>{
			try{
				clearTimeout(delay);
			}catch(e){}

		});		
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
		width: 85%;
	}


</style>

<div class="container">
	<div class="textfield">
		<Smelte.TextField bind:value={taskName} id='txtTaskname' on:focus={checkIfEnter} type="text" minlength="4" max="50" placeholder="add a new task" size="10" style='background-color:white;'/>
	</div>
	<div class="btnAdd py-2">
		<Smelte.Button id="btn-create-task" icon="add" small on:click="{addTask}"/>
	</div>
</div>

