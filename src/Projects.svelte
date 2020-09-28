<script>
    import CreateProject from "./CreateProject.svelte";
    import Project from "./Project.svelte";

    const handleProjectAdded = (event) =>{
		createProjectTAPI(event.detail.projectName, event.detail.projectColor);
	};


	const handleProjectChanged = (event) =>{
		let newProject = new Object();
		
        newProject.name = event.detail.projectName;
        newProject.id = event.detail.projectId;
		newProject.color = event.detail.projectColor;
		newProject.status = event.detail.projectStatus;
		newProject.ppm_project_id = event.detail.projectPPMId;

		updateProjectTAPI(newProject);
    };

    const handleProjectColorChanged = (event) =>{
		let newProject = new Object();
        
        newProject.name = '';
		newProject.status = '';
        newProject.id = event.detail.projectId;
		newProject.color = event.detail.projectColor;
		newProject.ppm_project_id = '';

		updateProjectTAPI(newProject);
    };
    

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

	async function createProjectTAPI(projectName, projectColor) {
        let url = 'http://192.168.0.50:5010/create';
        
        let parameterName='name='+projectName;
		let parameterColor='color='+projectColor.replace('#','%23');

		url = url+'?'+parameterName+'&'+parameterColor; 

		var requestOptions = {
			method: 'POST',
			redirect: 'follow'
		};

		const res = await fetch(url, requestOptions)
		.then(response => response)
		.then(result => result)
		.catch(error => console.log('error', error));

		projects = getProjectsTAPI();
    }
    
    async function updateProjectTAPI(project) {
		let url = 'http://192.168.0.50:5010/update/'+project.id;
		let parameterName='name='+project.name;
		let parameterStatus='status='+project.status;
		let parameterColor='color='+project.color.replace('#','%23');
		let parameterPPMId='ppm_project_id='+project.ppm_project_id;

		url = url+'?'+parameterName+'&'+parameterStatus+'&'+parameterColor+'&'+parameterPPMId; 

		var requestOptions = {
			method: 'PUT',
			redirect: 'follow',
		};

		const res = await fetch(url, requestOptions)
		.then(response => response)
		.then(result => result)
		.catch(error => console.log('error', error));

		projects = getProjectsTAPI();
	}

	let projects = getProjectsTAPI();
</script>


    <div class="project-container">
        <div class="project-header">
            <div class="title"><h5>Projects</h5></div>
        </div>
        <div class="createProject"><CreateProject on:projectAdded="{handleProjectAdded}" />
                <div id="projects-list" class="projects-list">
                    {#await projects}
                    <div/>
                    {:then oProjects}
                        {#each oProjects as oProject}
                            <Project projectId={oProject.id} projectName={oProject.name} projectStatus={oProject.status} projectPPMId={oProject.ppm_project_id} 
                                projectColor={oProject.color} on:projectChanged="{handleProjectChanged}" on:projectColorChanged="{handleProjectColorChanged}" />
                        {/each}
                    {:catch error}
                        <p style="color: red">{error.message}</p>
                    {/await}			
                </div>
            </div>  
        </div>


<style>

    .project-container{
		box-shadow: 2px 2px 8px  rgba(0,0,0,0.1);
        background-color: white;
    }

	.project-header {
        display: grid;
		border-radius: 2px;
        background: #fff;
        height: 90px;
        align-items: center;
        justify-items: center;
	}

  
    
    .title{
        display: flex;
        justify-content: center;
        align-items: center;		
        height: 90px;
	}

	.projects-list{
		height: 100%;
	}



</style>