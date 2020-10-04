<script>
	import Button from "smelte/src/components/Button";
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher();
	import Navigation from "./Navigation.svelte";

	let showNav = false;
	let menuProjectTimer;
	

	const handleMenu = (event) =>{
		dispatch('handleMenu', {
			showProjects: event.detail.showProjects,
			showHome: event.detail.showHome,
			showExtendedView: event.detail.showExtendedView,
			showSettings: event.detail.showSettings,
		}); 
	};
	
	const handleNavOpen = (e) => {
        clearTimeout(menuProjectTimer);
        menuProjectTimer = null;
        showNav = true;
    };

    const handleNavClose = (e) => {
        const timeout = 550;
        const closeMenu = () =>{
            showNav = false;
        };
        menuProjectTimer = setTimeout(closeMenu, timeout);
    };
</script>

<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

<div class="main-header">
	<div class="title" />
	<div class="options">
		<Button on:click={() => showNav = !showNav} icon="menu" flat small color="none" />
	</div>
</div>	
<aside on:mouseout={handleNavClose} on:mouseover={handleNavOpen}>
	{#if showNav}
		<Navigation on:handleMenu={handleMenu} showNav={true} showNavMobile={true} elevation="{true}" persistent="{false}" right="{true}" ></Navigation>   
	{/if}
</aside>


<style>
	.main-header{
		display: grid;
		grid-template-columns: 97% 2%;
		align-items: center;
		height: 63px;
		background-color: rgb(117, 117, 117);
		box-shadow: 0px 0px 4px 0px  rgba(0,0,0,0.2);
		/* background-color: rgb(94, 90, 90); */
		width: 100%;
		overflow: hidden;
		position: fixed;
		top: 0;
	}
	
	.options{
		align-items: center;
	}

</style>