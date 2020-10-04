<script>
  	import * as Smelte from 'smelte'


	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher();
	let longpress = 1000;
	let projectName;
	let projectColor = getRandomColor();

	function getRandomColor(){
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
	}
	
	const addProject = () => {	
        const projectElement = document.getElementById('txtProjectname');

        dispatch('projectAdded', {
			projectName: projectName,
			projectColor: projectColor
		});

		projectElement.value = '';
		projectElement.placeholder = 'add a new project';
	};

	const checkIfEnter = (evt) => {
		let delay;

		evt.target.addEventListener('keydown',(e)=>{
			if (e.key === 'Enter' || e.keyCode === 13) {
				addProject();
			}else if (e.key === 'Backspace' || e.key === 'Delete' || e.keyCode === 46 || e.keyCode === 8) {
				delay = setTimeout(deleteWholeWord, longpress);

				function deleteWholeWord(){
					let str=evt.target.value;
					let lastIndex = str.lastIndexOf(" ")+2;
					str = str.substring(0, lastIndex);
					evt.target.value=str;
				}
			}
		});

		evt.target.addEventListener('keyup',(e)=>{
			clearTimeout(delay);
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
		<Smelte.TextField id='txtProjectname' bind:value={projectName} on:focus={checkIfEnter} type="text" minlength="4" max="50" placeholder="add a new project" size="10" style='background-color:white;'/>
	</div>
	<div class="btnAdd py-2">
		<Smelte.Button id="btn-create-project" icon="add" small on:click="{addProject}"/>
	</div>
</div>

