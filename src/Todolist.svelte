<script>
	import Task from "./Task.svelte";	
	import CreateTask from "./CreateTask.svelte";	
	import RemoveTask from "./RemoveTask.svelte";
    import Button from "smelte/src/components/Button";
	import { todolistStore } from "./stores.js";


	export let API_PROJECTS_URL;
	export let API_TASKS_URL;
		
	let showRemoveTask = false;
	let projectsMenu = [];
	let showInactives = false;
	 
	getTasksTAPI();
	getProjectsTAPI();

	/*HANDLE Functions*/
	const handleTaskDragStart = () => {showRemoveTask=true;};
	const handleTaskDragEnd = () => {showRemoveTask=false;};
	

	const handleTaskAdded = (event) =>{
		todolistStore.addTask({name: event.detail.name});
	};


	const handleTaskChanged = (event) =>{
		let task = event.detail;

		todolistStore.updateTask(task);
	};
	

	const handleTaskRemoved = (event) =>{
		let task = Object.assign({}, $todolistStore.filter(obj => { return obj.id == event.detail.task_id})[0]);
		todolistStore.removeTask(task);
		showRemoveTask=false;
	};


	/*API Functions*/
	async function getProjectsTAPI() {
		let url = API_PROJECTS_URL+'/view';

		fetch(url)
			.then(response => response.json())
			.then(data => {
				projectsMenu = [];

				Array.from(data).map(project => {
						projectsMenu.push({
							value: project.id,
							text: project.name,
							color: project.color
						})
					});
				
				projectsMenu = projectsMenu;
			})
			.catch(error => console.log('error', error));		
	}
	
	async function getTasksTAPI() {
		let url = API_TASKS_URL+'/view';

		let tasks = fetch(url)
		.then(response => response)
		.then(data => data.json())
		.then(tasks => {
			todolistStore.setFromFrontend(tasks);
			return tasks;
		})
		.catch(error => console.log('error', error));

		return tasks;
	}

	let count;
	let index;
	let offset;
	let progress;
	let top = 0.1;
	let threshold = 0.5;
	let bottom = 0.9;

</script>

	<div id="todolist-container" class="todolist-container ">
		<div class="title">
			<h5>Things to do</h5>
			{#if showInactives}
				<Button color='gray' text  small icon='visibility_off' on:click="{() => showInactives = !showInactives}"/>
			{:else}
				<Button color='gray' text  small icon='visibility' on:click="{() => showInactives = !showInactives}"/>
			{/if}
		</div>
		
		<div class="createTask">
			<CreateTask on:taskAdded="{handleTaskAdded}" />
		</div>

		{#if showInactives}
			<div class="todolist-task-inactive">
				{#await projectsMenu}
					<div/>
				{:then projectsMenu}
					{#each $todolistStore as task}
						{#if task.status > 2}
							<Task taskId={task.id} 
								taskName={task.name} taskProject={task.project} taskStatus={task.status} taskDescription={task.description}
								on:taskChanged={handleTaskChanged} projects="{projectsMenu}" />
						{/if}
					{/each}
				{/await}
			</div>			
		{:else}
			<div id="todolist-tasks" class="todolist-task scroll-hide">
				{#await projectsMenu}
					<div/>
				{:then projectsMenu}		
					{#each $todolistStore as task}
						{#if task.status < 3}
							<Task taskId={task.id} taskName={task.name} taskProject={task.project} taskStatus={task.status} taskDescription={task.description}
								on:taskDragStart={handleTaskDragStart} on:taskDragEnd={handleTaskDragEnd} on:taskChanged={handleTaskChanged} projects="{projectsMenu}" />
						{/if}
					{/each}
				{:catch error}
					<p style="color: red">{error.message}</p>
				{/await}			
			</div>
			{#if showRemoveTask}
				<div class="removeTask"><RemoveTask on:taskRemoved={handleTaskRemoved} /></div>
			{/if}
		{/if}
	</div>








<style>

	.title{
        display: flex;
        justify-content: center;
        align-items: center;		
		height: 90px;
		gap: 5px;
	}


	.todolist-task{
		width: 100%;
		overflow-y: scroll;
		padding-right: 17px; /* Increase/decrease this value for cross-browser compatibility */
		box-sizing: content-box; /* So the width will be 100% + 17px */
		max-height: calc(100vh - 310px);
	}

	.todolist-task-inactive{
		background-color: lightgray;
		width: 100%;
		overflow-y: scroll;
		padding-right: 17px; /* Increase/decrease this value for cross-browser compatibility */
		box-sizing: content-box; /* So the width will be 100% + 17px */
		max-height: calc(100vh - 310px);
	}

	.todolist-container{
		box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
		background-color: white;
		width: 100%;
		overflow: hidden;
	}



	@media (min-width: 640px) {

	}


 
</style>