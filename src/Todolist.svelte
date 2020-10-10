<script>
	import Task from "./Task.svelte";	
	import CreateTask from "./CreateTask.svelte";	
	import RemoveTask from "./RemoveTask.svelte";
    import Button from "smelte/src/components/Button";
    import ContentLoader from 'svelte-content-loader';   
	import { fade } from 'svelte/transition';

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
		//createTasksTAPI(event.detail.taskName);
		todolistStore.addTask(event.detail.taskName);
	};


	const handleTaskChanged = (event) =>{
		let newTask = new Object();
		
        newTask.name = event.detail.taskName;
        newTask.id = event.detail.taskId;
		newTask.description = event.detail.description;
		newTask.color = event.detail.taskColor;
		newTask.status = event.detail.taskStatus;
		newTask.projectId = event.detail.taskProjectId;

		todolistStore.updateTask(newTask);
		//updateTaskTAPI(newTask);
	};
	

	const handleTaskRemoved = (event) =>{
		//deleteTasksTAPI(event.detail.taskId);
		todolistStore.removeTask(event.detail.taskId);
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

</script>
<div id="todolist-container" class="todolist-container">
	<div class="title">
		<h5>Things to do</h5>
		{#await $todolistStore}
			<div class="loader" />
		{:then oTasks}
			{#if showInactives}
				<Button color='gray' text  small icon='visibility_off' on:click="{() => showInactives = !showInactives}"/>
			{:else}
				<Button color='gray' text  small icon='visibility' on:click="{() => showInactives = !showInactives}"/>
			{/if}
		{/await}			


	</div>
	<div class="createTask">
		<CreateTask on:taskAdded="{handleTaskAdded}" />
	</div>
	<div id="todolist-tasks" class="tasks">
		<div class="todolist-task">
			{#await projectsMenu}
				<div/>
			{:then projectsMenu}	
				{#await $todolistStore}
					<div class="preloader">
						<ContentLoader>
							<rect x="0" y="30" rx="30" ry="30" width="10" height="10" />
							<rect x="70" y="25" rx="3" ry="3" width=310 height="20" />
						</ContentLoader>
					</div>
				{:then tasks}
					{#each tasks as task}
						{#if task.status < 3}
							<Task taskId={task.id} taskName={task.name} taskProject={task.project} taskStatus={task.status} taskDescription={task.description}
								on:taskDragStart={handleTaskDragStart} on:taskDragEnd={handleTaskDragEnd} on:taskChanged={handleTaskChanged} projects="{projectsMenu}" />
						{/if}
					{/each}
				{:catch error}
					<p style="color: red">{error.message}</p>
				{/await}
			{:catch error}
				<p style="color: red">{error.message}</p>
			{/await}			
		</div>
	</div>
	{#if showInactives}
		<div class="tasks" transition:fade="{{delay: 150, duration: 500}}">
			<div class="todolist-task-inactive">
				{#await projectsMenu}
					<div/>
				{:then projectsMenu}
					{#await $todolistStore}
						<div class="preloader">
							<ContentLoader>
								<rect x="0" y="30" rx="30" ry="30" width="10" height="10" />
								<rect x="70" y="25" rx="3" ry="3" width=310 height="20" />
							</ContentLoader>
						</div>
					{:then tasks}
						{#each tasks as task}
								{#if task.status > 2}
									<Task taskId={task.id} 
										taskName={task.name} taskProject={task.project} taskStatus={task.status} taskDescription={task.description}
										on:taskChanged={handleTaskChanged} projects="{projectsMenu}" />
								{/if}
						{/each}
					{:catch error}
						<p style="color: red">{error.message}</p>
					{/await}
				{/await}
			</div>
		</div>
	{:else}
		{#if showRemoveTask}
			<div class="removeTask"><RemoveTask on:taskRemoved={handleTaskRemoved} /></div>
		{/if}
	{/if}
</div>



<style>
	.preloader{
        display: grid;
        align-items: center;
        justify-items: center;
		background-color: white;
		height: 90px;
    }
	.title{
        display: flex;
        justify-content: center;
        align-items: center;		
		height: 90px;
		gap: 5px;
	}


	.todolist-task{
		height: 100%;
	}

	.todolist-task-inactive{
		height: 100%;
		background-color: lightgray;
	}

	.todolist-container{
		box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
		background-color: white;
	}

	@media (min-width: 640px) {

	}

	.loader {
        border: 2px solid #f3f3f3;
        border-radius: 50%;
        border-top: 2px solid gray;
        width: 20px;
        height: 20px;
        -webkit-animation: spin 2s linear infinite; /* Safari */
        animation: spin 2s linear infinite;
        margin-left: 5px;
    }

    /* Safari */
    @-webkit-keyframes spin {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
    }

    @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
    }
</style>