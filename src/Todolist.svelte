<script>
	import Task from "./Task.svelte";	
	import CreateTask from "./CreateTask.svelte";	
	import RemoveTask from "./RemoveTask.svelte";
    import Button from "smelte/src/components/Button";


	let showRemoveTask = false;
	let projectsMenu = [];
	let projects;
	let showInactives = false;
	/*HANDLE Functions*/
	const handleTaskDragStart = () => {showRemoveTask=true;};
	const handleTaskDragEnd = () => {showRemoveTask=false;};
	

	const handleTaskAdded = (event) =>{
		createTasksTAPI(event.detail.taskName);
	};


	const handleTaskChanged = (event) =>{
		let newTask = new Object();
		
        newTask.name = event.detail.taskName;
        newTask.id = event.detail.taskId;
		newTask.description = event.detail.description;
		newTask.color = event.detail.description;
		newTask.status = event.detail.taskStatus;
		newTask.projectId = event.detail.taskProjectId;

		updateTaskTAPI(newTask);
	};
	

	const handleTaskRemoved = (event) =>{
		deleteTasksTAPI(event.detail.taskId);
		showRemoveTask=false;
	};



	/*API Functions*/
	async function getProjectsTAPI() {
		let url = 'http://192.168.0.50:5010/view';

		const projects = await fetch(url)
		.then(response => response)
		.then(data => {
			return data.json();
		})
		.catch(error => console.log('error', error));

		return projects;
	}
	
	async function getTasksTAPI() {
		let url = 'http://192.168.0.50:5011/view';

		const tasks = await fetch(url)
		.then(response => response)
		.then(data => {
			return data.json();
		})
		.catch(error => console.log('error', error));

		for(let i = 0; i< tasks.length; i++){
			const projectId = tasks[i].project_id;
			let url = 'http://192.168.0.50:5010/view';        
			const parameterProjectId = projectId;
			
			url = url+'/'+parameterProjectId;

			const project = await fetch(url)
				.then(response => response)
				.then(data => {
					return data.json();
				}).catch(error => console.log('error', error));

			tasks[i].project = project[0];
		}

		projects = await getProjectsTAPI();
		projectsMenu = [];

		Array.from(projects).map(project => {
			projectsMenu.push({
				value: project.id,
				text: project.name,
				color: project.color
			})
		})

		return tasks;
	}

	async function createTasksTAPI(taskName) {
		let url = 'http://192.168.0.50:5011/create?name='+taskName;

		var requestOptions = {
			method: 'POST',
			redirect: 'follow'
		};

		const res = await fetch(url, requestOptions)
		.then(response => response)
		.then(result => result)
		.catch(error => console.log('error', error));

		tasks = getTasksTAPI();
	}

	async function deleteTasksTAPI(taskId) {
		let url = 'http://192.168.0.50:5011/delete/'+taskId;

		var requestOptions = {
			method: 'DELETE',
			redirect: 'follow'
		};

		const res = await fetch(url, requestOptions)
		.then(response => response)
		.then(result => result)
		.catch(error => console.log('error', error));

		tasks = getTasksTAPI();
	}	
	
	async function updateTaskTAPI(task) {
		let url = 'http://192.168.0.50:5011/update/'+task.id;
		let parameterName='name='+task.name;
		let parameterStatus='status='+task.status;
		let parameterDescription='description='+task.description;
		let parameterProjectId='project_id='+task.projectId;

		url = url+'?'+parameterName+'&'+parameterStatus+'&'+parameterDescription+'&'+parameterProjectId;

		var requestOptions = {
			method: 'PUT',
			redirect: 'follow',
		};

		const res = await fetch(url, requestOptions)
		.then(response => response)
		.then(result => result)
		.catch(error => console.log('error', error));

		tasks = getTasksTAPI();
	}



	/*MISC Functions*/


	let tasks = getTasksTAPI();
</script>


<link
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
  rel="stylesheet"
/>

<div id="todolist-container" class="todolist-container">
	<div class="title">
		<h5>Things to do</h5>
		{#if showInactives}
			<Button color='gray' text  small icon='visibility_off' on:click="{() => showInactives = !showInactives}"/>
		{:else}
			<Button color='gray' text  small icon='visibility' on:click="{() => showInactives = !showInactives}"/>
		{/if}

	</div>
	<div class="createTask"><CreateTask on:taskAdded="{handleTaskAdded}" /></div>
	<div id="todolist-tasks" class="tasks">
		<div class="todolist-task">
			{#await tasks}
			<div/>
			{:then oTasks}
				{#each oTasks as oTask}
					{#if oTask.status < 3}
						<Task taskId={oTask.id} taskName={oTask.name} taskProject={oTask.project} taskStatus={oTask.status} taskDescription={oTask.description}
							on:taskDragStart={handleTaskDragStart} on:taskDragEnd={handleTaskDragEnd} on:taskChanged={handleTaskChanged} projects="{projectsMenu}" />
					{/if}
				{/each}
			{:catch error}
				<p style="color: red">{error.message}</p>
			{/await}			
		</div>
	</div>
	{#if showInactives}
		<div class="tasks">
			<div class="todolist-task-inactive">
				{#await tasks}
				<div/>
				{:then oTasks}
					{#each oTasks as oTask}
						{#if oTask.status > 2}
							<Task taskId={oTask.id} taskName={oTask.name} taskProject={oTask.project} taskStatus={oTask.status} taskDescription={oTask.description}
								on:taskChanged={handleTaskChanged} projects="{projectsMenu}" />
						{/if}
					{/each}
				{:catch error}
					<p style="color: red">{error.message}</p>
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
</style>