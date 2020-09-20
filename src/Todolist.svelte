<script>
	import Task from "./Task.svelte";	
	import CreateTask from "./CreateTask.svelte";	
	import RemoveTask from "./RemoveTask.svelte";


	let showRemoveTask = false;

	/*HANDLE Functions*/
	const handleTaskDragStart = () => {showRemoveTask=true;};
	const handleTaskDragEnd = () => {showRemoveTask=false;};
	

	function getRandomColor() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

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


	async function getProjectsTAPI(projectId) {
        let url = 'http://localhost:5010/view';        
        
        const res = await fetch(url);
		const projects = await res.json();

		if (res.ok) {
			return projects;
		} else {
			throw new Error(project);
		}
	}
	
	async function getTasksTAPI() {
		let url = 'http://localhost:5011/view';

		const tasks = await fetch(url)
		.then(response => response)
		.then(data => {
			return data.json();
		})
		.catch(error => console.log('error', error));

		for(let i = 0; i< tasks.length; i++){
			const projectId = tasks[i].project_id;
			let url = 'http://localhost:5010/view';        
			const parameterProjectId = projectId;
			
			url = url+'/'+parameterProjectId;

			const project = await fetch(url)
				.then(response => response)
				.then(data => {
					return data.json();
				}).catch(error => console.log('error', error));

			tasks[i].project = project[0];
		}

		return tasks;
	}

	async function createTasksTAPI(taskName) {
		let url = 'http://localhost:5011/create?name='+taskName;

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
		let url = 'http://localhost:5011/delete/'+taskId;

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
		let url = 'http://localhost:5011/update/'+task.id;
		let parameterName='name='+task.name;
		let parameterStatus='status='+task.status;
		let parameterDescription='description='+task.description;
		let parameterProjectId='project_id='+task.projectId;

		url = url+'?'+parameterName+'&'+parameterStatus+'&'+parameterDescription; //+'&'+parameterProjectId;

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

	let tasks = getTasksTAPI();
</script>


<link
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
  rel="stylesheet"
/>

<div id="todolist-container" class="todolist-container">
	<div class="title"><h5>Things to do</h5></div>
	<div class="createTask"><CreateTask on:taskAdded="{handleTaskAdded}" /></div>
	<div id="todolist-tasks" class="tasks">
		<div class="todolist-task">
			{#await tasks}
			<div/>
			{:then oTasks}
				{#each oTasks as oTask}
					<Task taskId={oTask.id} taskName={oTask.name} taskProject={oTask.project} taskStatus={oTask.status} taskDescription={oTask.description}
						on:taskDragStart={handleTaskDragStart} on:taskDragEnd={handleTaskDragEnd} on:taskChanged={handleTaskChanged} />
				{/each}
			{:catch error}
				<p style="color: red">{error.message}</p>
			{/await}			
		</div>
	</div>
	{#if showRemoveTask}
		<div class="removeTask"><RemoveTask on:taskRemoved={handleTaskRemoved} /></div>
	{/if}
</div>

<style>
	.title{
        display: flex;
        justify-content: center;
        align-items: center;		
        height: 90px;
	}


	.todolist-task{
		height: 100%;
	}


	.todolist-container{
		box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
		background-color: white;
		margin: auto;
	}

	@media (min-width: 640px) {

	}
</style>