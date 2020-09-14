<script>
	import Task from "./Task.svelte";	
	import RemoveTask from "./RemoveTask.svelte";	
    import Slot from "./Slot.svelte";	
    import Button from "smelte/src/components/Button";

    
    /********************************** DATA KITCHEN */
    let tasks_hour1 = new Array();
    let tasks_hour2 = new Array();
    let tasks_hour3 = new Array();
    
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

    tasks_hour1.push(task1);
    tasks_hour1.push(task2);
    tasks_hour1.push(task3);
    
   
    tasks_hour3.push(task3);
    tasks_hour3.push(task1);

    let slots = new Array();
    let slot1 = new Object();
    let slot2 = new Object();
    let slot3 = new Object();

    slot1.hour="1";
    slot1.tasks=tasks_hour1;

    slot2.hour="2";
    slot2.tasks=tasks_hour2;

    slot3.hour="3";
    slot3.tasks=tasks_hour3;

    slots.push(slot1);
    slots.push(slot2);
    slots.push(slot3);
    /********************************** DATA KITCHEN */
    /********************************** FUNCTIONS */
    let showRemoveTask = false;

	const handleTaskDragStart = () => {showRemoveTask=true;};
    const handleTaskDragEnd = () => {showRemoveTask=false;};
    
    function handleTaskAdded(event) {
        let newTask = new Object();
        newTask.name = event.detail.taskName;
        newTask.id = event.detail.taskId;
        newTask.color = event.detail.taskColor;
        let slotHour = event.detail.slotId;

        let targetSlot = new Object;
        for(let i=0;i<slots.length;i++){
            if(slots[i].hour == slotHour)
                targetSlot = slots[i];
        }

        const index = slots.findIndex(slot => slot.hour === slotHour);
        if (index > -1) {
            slots.splice(index, 1);
        }

        if(!targetSlot.tasks) targetSlot.tasks = new Array();
        targetSlot.tasks.push(newTask);
        slots.push(targetSlot);

        slots = slots;
        slots.sort((a,b) => (a.hour > b.hour) ? 1 : ((b.hour > a.hour) ? -1 : 0)); 
    }

    function handleTaskRemoved(event) {
        let taskId = event.detail.taskId;
        let slotId = event.detail.slotId;

        let targetSlot = new Object;
        for(let i=0;i<slots.length;i++){
            if(slots[i].hour == slotId)
                targetSlot = slots[i];
        }

        const index = targetSlot.tasks.findIndex(task => task.id === taskId);
        if (index > -1) {
            targetSlot.tasks.splice(index, 1);
        }

        slots = slots;
        slots.sort((a,b) => (a.hour > b.hour) ? 1 : ((b.hour > a.hour) ? -1 : 0)); 
    }
	</script>


    <div class="container">
        <div class="timesheet-header">
            <div class="semana">
                <Button icon="first_page" text light flat/>
            </div>
            <div class="ayer">
                <Button icon="chevron_left" text/>               
            </div>
            <div class="title"><h5>Today</h5></div>
        </div>
        <div class="slots">
            {#each slots as slot}
            <Slot hour="{slot.hour}" tasks={slot.tasks} 
            on:taskAdded={handleTaskAdded} on:taskDragStart={handleTaskDragStart} on:taskDragEnd={handleTaskDragEnd} on:removeTaskTimesheet={handleTaskRemoved}/>
            {/each}
        </div>
    </div>

<style>

    .container{
		box-shadow: 2px 2px 8px  rgba(0,0,0,0.1);
    }

	.timesheet-header {
        display: grid;
        grid-template-columns: 10% 10% 80%;
		border-radius: 2px;

        text-align: center;
        background: #fff;
        height: 90px;
        align-items: center;
	}

    .slots{
        overflow-y: scroll;
        height: 600px;
    }

    .ayer {
        display: flex;
        justify-content: center;
        align-items: center;    
        height: 100%;
    }
    .semana {
        display: flex;
        justify-content: center;
        align-items: center;   
        height: 100%;
    }
	.title {
        padding: 16px;
	}

</style>