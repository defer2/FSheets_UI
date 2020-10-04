<script>
	import { TextField } from "smelte";
	export let API_SETTINGS_URL;

	let api_timesheets_url;
    let api_projects_url;
    let api_tasks_url;
    let api_clarityppm_url;
    let ppm_url;
    let ppm_username;
	let ppm_password;
	
	async function getSettingsTAPI(){ 
		let url = API_SETTINGS_URL+'/view';  
		const api_old = API_SETTINGS_URL;

		const settings = await fetch(url)
			.then(response => response)
			.then(data => data.json())
			.then(settings => {
				settings[0].API_SETTINGS_URL = api_old;
				return settings;
			})
			.catch(error => console.log('error', error));

		return settings[0];
	}

	async function updateSettingsTAPI(){ 
        let url = API_SETTINGS_URL;        
   
		const settingsJSON = {
			API_TIMESHEETS_URL: api_timesheets_url,
			API_PROJECTS_URL: api_projects_url,
			API_TASKS_URL: api_tasks_url,
			API_CLARITYPPM_URL: api_clarityppm_url,
			PPM_URL: ppm_url,
			PPM_USERNAME: ppm_username,
			PPM_PASSWORD: ppm_password
		};

		var requestOptions = {
			method: 'PUT',
			redirect: 'follow',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},  
			body: JSON.stringify(settingsJSON)
		};

        const settings = await fetch(url, requestOptions)
            .then(response => response)
            .catch(error => console.log('error', error));

        return settings[0];
	}


	let settings =  getSettingsTAPI();

	settings.then( settings => {
		api_timesheets_url = settings.API_TIMESHEETS_URL;
		api_projects_url = settings.API_PROJECTS_URL;
		api_tasks_url = settings.API_TASKS_URL;
		api_clarityppm_url = settings.API_CLARITYPPM_URL;
		ppm_url = settings.PPM_URL;
		ppm_username = settings.PPM_USERNAME;
		ppm_password = settings.PPM_PASSWORD;
	});

</script>
	
	<content>	
		<div class="settings-container">
			<div class="settings-header">
				<div class="title"><h5>Settings</h5></div>
			</div>
			<div id="settings-list" class="settings-list">
				{#await settings}
					<div />
				{:then settings}
						<TextField on:blur={updateSettingsTAPI} label="api_tasks_url" bind:value="{api_tasks_url}" style="background-color:white;" />
						<TextField on:blur={updateSettingsTAPI} label="api_timesheets_url" bind:value={api_timesheets_url} style="background-color:white;"  />
						<TextField on:blur={updateSettingsTAPI} label="api_projects_url" bind:value={api_projects_url} style="background-color:white;" />
						<TextField on:blur={updateSettingsTAPI} label="api_clarityppm_url" bind:value={api_clarityppm_url} style="background-color:white;"  />
						<TextField on:blur={updateSettingsTAPI} label="ppm_url" bind:value={ppm_url} style="background-color:white;" />
						<TextField on:blur={updateSettingsTAPI} label="ppm_username" bind:value={ppm_username} style="background-color:white;" />
						<TextField on:blur={updateSettingsTAPI} label="ppm_password" bind:value={ppm_password} style="background-color:white;" />
				{/await} 
			</div>
		</div>
	</content>

<style>
	.settings-container{
		box-shadow: 2px 2px 8px  rgba(0,0,0,0.1);
        background-color: white;
    }

	.settings-header {
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

	.settings-list{
		height: 100%;
		width: 90%;
		background-color: white;
		margin: auto;
		padding-bottom: 20px;
	}
</style>