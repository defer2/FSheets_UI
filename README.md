#Introduction


F! Timesheets is a tool for easily track your *to do* tasks and the time that you spent in each task, also it has an integration with CA Clarity PPM to submit the data and keep your Clarity timesheets up to date.

##Considerations

F! Timesheets is written in python and sveltejs. It has six components:

- UI
- Timesheets MS
- Tasks MS
- Projects MS
- ClarityPPMIntegration MS
- Settings MS

#Installation


#### Create directory structure
```bash
mkdir -p sheets/ui
mkdir -p sheets/timesheets
mkdir -p sheets/tasks
mkdir -p sheets/projects
mkdir -p sheets/clarityppm
mkdir -p sheets/settings
```
#### Download the microservices from GitHub

```bash
cd sheets

https://github.com/defer2/FSheets_UI.git ui
https://github.com/defer2/FSheets_TimesheetsMS.git timesheets
https://github.com/defer2/FSheets_TasksMS.git tasks
https://github.com/defer2/FSheets_ProjectsMS.git projects
https://github.com/defer2/FSheets_ClarityPPMIntegrationMS.git clarityppm
https://github.com/defer2/FSheets_SettingsMS.git settings
```

#### Modify settings files
###### sheets/ui/conf/configuration.js
```javascript
export default{
	"API_SETTINGS_URL":	"http://<Settings MS host>:<Settings MS port>"
}
```

###### sheets/tasks/conf/config.ini
```ini
[PPM]
USERNAME = ‘<ppm_username>’
PASSWORD =  ‘<ppm_password>’
URL = 'http://<ppm_host>:<ppm_port?/ppm/rest/v1/'

[FTIMESHEETS]
API_PROJECTS_URL = http://<Projects MS host>:<Settings MS port>
API_TASKS_URL = http://<Tasks MS host>:<Settings MS port>
API_TIMESHEETS_URL = http://<Timesheets MS host>:<Settings MS port>
API_CLARITYPPM_URL = http://<ClarityPPMIntegration MS host>:<Settings MS port>
```

###### sheets/clarityppm/conf/config.ini
```ini
[PPM]
USERNAME = ‘<ppm_username>’
PASSWORD =  ‘<ppm_password>’
URL = 'http://<ppm_host>:<ppm_port?/ppm/rest/v1/'

[FTIMESHEETS]
API_PROJECTS_URL = http://<Projects MS host>:<Settings MS port>
API_TASKS_URL = http://<Tasks MS host>:<Settings MS port>
API_TIMESHEETS_URL = http://<Timesheets MS host>:<Settings MS port>
API_CLARITYPPM_URL = http://<ClarityPPMIntegration MS host>:<Settings MS port>
```

#### Configure settings database
###### Rename database
```bash
mv sheets/settings/database/rename_to_settings.db sheets/settings/database/settings.db
```

###### Configure settings parameters
```sql
UPDATE 
	settings
SET
	api_tasks_url = ‘http://<Tasks MS host>:<Settings MS port>’,
	api_timesheets_url = ‘http://<Timesheets MS host>:<Settings MS port>’ ,
	api_clarityppm_url = ‘http://<ClarityPPMIntegration MS host>:<Settings MS port>’,
	ppm_url = ‘<ppm_url>’,
	ppm_username = ‘<ppm_username>’,
	ppm_password = ‘<ppm_password>’;
```

#### Configure start script

###### sheets/settings/bin/startSheets.sh
```bash
#!/bin/zsh

export UI_HOME=/absolute/path/to/sheets/ui
export TIMESHEETS_HOME=/absolute/path/to/sheets/timesheets
export TASKS_HOME=/absolute/path/to/sheets/tasks
export PROJECTS_HOME=/absolute/path/to/sheets/projects
export CLARITYPPM_HOME=/absolute/path/to/sheets/clarityppm
export SETTINGS_HOME=/absolute/path/to/sheets/settings

export UI_PORT=<UI port>
export TIMESHEETS_PORT=<Timesheets MS port>
export TASKS_PORT=<Tasks MS port>
export PROJECTS_PORT=<Projects MS port>
export CLARITYPPM_PORT=<ClarityPPMIntegration MS port>
export SETTINGS_PORT=<Settings MS port>


docker run --name fsheets_ui -p ${UI_PORT}:5000 -v ${UI_HOME}/conf:/srv/fsheets_ui/conf -d fernandod/fsheets_ui
docker run --name fsheets_timesheets -p ${TIMESHEETS_PORT}:80 -v ${ TIMESHEETS_HOME }/database:/srv/flask_app/database -d fernandod/fsheets_timesheets
docker run --name fsheets_tasks -p ${TASKS_PORT}:80 -v ${TASKS_HOME }/conf:/srv/flash_app/conf -v ${TASKS_HOME}/database:/srv/flask_app/database -d fernandod/fsheets_tasks
docker run --name fsheets_projects -p ${PROJECTS_PORT}:80 -v ${PROJECTS_HOME }/database:/srv/flask_app/database -d fernandod/fsheets_projects
docker run --name fsheets_clarityppm -p ${CLARITYPPM_PORT}:80 -v ${CLARITYPPM_HOME}/conf:/srv/flash_app/conf -d fernandod/fsheets_clarityppm
docker run --name fsheets_settings -p ${SETTINGS_PORT}:80 -v ${SETTINGS_HOME}/database:/srv/flask_app/database -d fsheets_settings
```

#Run
```bash
cd sheets/settings/bin
./startSheets.sh
```

#Usage

Your application is ready~! 🚀 go to **http://localhost:5015**
