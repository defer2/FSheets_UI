<script>
    import TextField from "smelte/src/components/Textfield";
    import Button from "smelte/src/components/Button";
    import { createEventDispatcher } from 'svelte';
    import {HsvPicker} from 'svelte-color-picker';

    export let projectId;
    export let projectName;
    export let projectStatus;
    export let projectColor;

    let projectEditable = false;
    let colorPicker = false;
    let colorPicked = "";
    
    const dispatch = createEventDispatcher();


    const rgbToHex = (rgb) => {
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);

        return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
    };



    const handleShowColorPicker = (e) => {
        colorPicker = !colorPicker;
    }

    const handleProjectEditable = (e) => {
        projectEditable = !projectEditable;

        try{
            let buttonId=e.target.id;
            let txtId=buttonId.replace('btn-edit-','txt-');

            setTimeout(function() {
                let txtField = document.getElementById(txtId);
                if(txtField)
                    txtField.focus();
            }, 200);
        }catch(err){

        }
    };

    const getRandomColor = () => {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    const handleProjectChanged = (e) => {
        dispatch('projectChanged', {
            projectId: document.getElementById(e.target.id).getAttribute('data-id'),
            projectName: e.target.value,
            projectColor: document.getElementById(e.target.id).getAttribute('data-color'),
            projectStatus: document.getElementById(e.target.id).getAttribute('data-status')      
        });
    };


    const handleProjectDone = (e) => {
        projectStatus == 2 ? projectStatus = 1 : projectStatus = 2
        try{
            let checkboxId=e.target.id;
            let txtId = checkboxId.replace('btn-inactive-','');
            let divParent = document.getElementById(txtId);

            divParent.setAttribute('data-status',projectStatus);

            dispatch('projectChanged', {
                projectId: divParent.getAttribute('data-id'),
                projectName: divParent.getAttribute('data-name'),
                projectColor: divParent.getAttribute('data-color'),
                projectStatus: projectStatus
            });
        }catch(error){
            console.log('error', error);
        }
    };

    const handleEnter = (evt) => {
        evt.target.addEventListener('keyup',(e)=>{
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.target.blur();
            }
        });
    };

    const colorCallback = (rgba)  => {
        colorPicked = rgba.detail;
    };

    const handleGetColorPicked = (e) => {
        projectColor = rgbToHex(`rgba(${colorPicked.r},${colorPicked.g},${colorPicked.b},${colorPicked.a})`);

        dispatch('projectColorChanged', {
            projectId: projectId,
            projectColor: projectColor
        });
    }

    projectColor ? projectColor : getRandomColor();
</script>

<div class="project-container">
    <!-- Project -->
    <div id="project-{projectId}" class="project"
            data-id="{projectId}" data-status={projectStatus}
            data-color="{projectColor}" data-name="{projectName}" >
            <!-- Texto -->
        {#if projectStatus==2}
            {#if projectEditable}
                <TextField id="txt-project-{projectId}" style='text-decoration:line-through;background-color:white;'
                    on:focus={handleEnter} size="60" on:blur="{handleProjectChanged}" on:blur="{handleProjectEditable}"
                    value={projectName} data-name="{projectName}" data-id="{projectId}" data-status={projectStatus} data-color="{projectColor}"/>
            {:else}
                <div ondrop="return false;" class='textfield' style='text-decoration:line-through;color:gray;background-color:white'>
                    {projectName}
                </div>
            {/if}
        {:else}
            {#if projectEditable}
                <TextField id="txt-project-{projectId}" style='background-color:white;' 
                    on:focus={handleEnter} size="60" on:blur="{handleProjectChanged}" on:blur="{handleProjectEditable}"
                    value={projectName} data-name="{projectName}" data-id="{projectId}" data-status={projectStatus} data-color="{projectColor}"/>
            {:else}
                <div ondrop="return false;" style='background-color:white'>
                    {projectName}
                </div>
            {/if}
        {/if}
    </div>

     <!-- Controls -->
     <div class="projectControls" id="projectControls">
        <div class="editButton">
            <Button id="btn-edit-project-{projectId}" class="editButton" color='gray' text  small icon='edit'
                on:click="{handleProjectEditable}" />
        </div>
        <div class="inactivateButton">
            <Button id="btn-inactive-project-{projectId}" color='gray' text  small icon='delete'
                    on:click="{handleProjectDone}" />
        </div>
    </div>

    <!-- Color -->
    <div style="background-color:{projectColor};" class="projectColor" id="color-{projectId}" 
        on:click="{handleShowColorPicker}"/>
</div>
{#if colorPicker}
    <div id="colorPicker" class="colorPicker" data-projectId="{projectId}">
        <div on:mouseup="{handleGetColorPicked}">
                <HsvPicker on:colorChange={colorCallback} />
        </div>
        <div />
    </div>
{/if}



<style>

    .project-container{
        display: grid;
        grid-template-columns: 80% 19% 1%;
        position: relative;
        border-top: 0.1em rgb(224, 224, 224) dashed;
        height: 60px;
    }

    .projectControls{
        display: grid;
        grid-template-columns: 1fr 1fr;
        justify-content: center;
        align-items: center;
    }

    .editButton{
        display: flex;
        align-items: center;
    }

    .inactivateButton{
        display: flex;
        align-items: center;
    }

    .colorpickerButton{
        display: flex;
        align-items: center;
    }

    .project{
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .colorPicker{
        display: grid;
        grid-template-columns: 74% 26%;
        justify-items: center;
        align-items: center;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .projectColor{
        margin-left: 2px;
        width: 3px;
    }

</style>