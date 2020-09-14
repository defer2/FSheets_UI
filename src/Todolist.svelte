<script>
	import Task from "./Task.svelte";	
	import CreateTask from "./CreateTask.svelte";	
	import RemoveTask from "./RemoveTask.svelte";


	let showRemoveTask = false;
	/********************************** DATA KITCHEN */
    let task1 = new Object();
    let task2 = new Object();
    let task3 = new Object();
    
    task1.id="1";
    task1.name="TASK #1";
    task1.color="#a5d5d3";
    
    task2.id="2";
    task2.name="TASK #2";
    task2.color="#c5d5d3";
    
    task3.id="3";
    task3.name="TASK #3";
    task3.color="#e5d5d3";


	
	let tasks = new Array();
	tasks.push(task1);
	tasks.push(task2);
	tasks.push(task3);

	var lastId=3;

	/********************************** DATA KITCHEN */


	
	function getRandomColor() {
		
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	const handleTaskAdded = (event) =>{
		let newTask = new Object();
		newTask.id = lastId + 1;
		newTask.name = event.detail.taskName;		
		newTask.color = getRandomColor();
		tasks.push(newTask);
		tasks = tasks;
		lastId++;
	};

	const handleTaskDragStart = () => {showRemoveTask=true;};
	const handleTaskDragEnd = () => {showRemoveTask=false;};

	function handleTaskChanged(event) {
        let newTask = new Object();
        newTask.name = event.detail.taskName;
        newTask.id = event.detail.taskId;
        newTask.color = event.detail.taskColor;

        const index = tasks.findIndex(task => task.id === newTask.id);
        if (index > -1) {
            tasks.splice(index, 1);
        }

		tasks.push(newTask);
		tasks = tasks;
		tasks.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)); 
	}
	
	function handleTaskRemoved(event) {
        let newTask = new Object();
		newTask.id = event.detail.taskId;
		tasks=tasks.filter((x)=>x.id != newTask.id );
		console.log("Remove Task "+newTask.id );
		showRemoveTask=false;
    }


</script>
<link
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
  rel="stylesheet"
/>


<div id="todolist-container" class="todolist-container">
	<div class="title"><h5>Things to do</h5></div>
	<div class="createTask"><CreateTask on:taskAdded="{handleTaskAdded}" /></div>
	<div id="todolist-tasks" class="tasks">
		{#each tasks as task}
			<div class="todolist-task">
				<Task taskId={task.id} taskName={task.name} isTodoList={true} projectColor={task.color}
				on:taskDragStart={handleTaskDragStart} on:taskDragEnd={handleTaskDragEnd} on:taskChanged={handleTaskChanged} />
				
			</div>
		{/each}
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

		margin: auto;
	}

	@media (min-width: 640px) {

	}
</style>