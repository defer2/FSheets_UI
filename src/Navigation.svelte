<script>
  import NavigationDrawer from 'smelte/src/components/NavigationDrawer';
  import List from 'smelte/src/components/List';
  import ListItem from 'smelte/src/components/List/ListItem.svelte';
  import breakpoint from 'smelte/src/breakpoints';
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher();

  export let API_TIMESHEETS_URL;

  export let showNavMobile;
  export let showNav;
  export let right;
  export let elevation;
  export let persistent;
      
  const handleShowHome = () => {
    dispatch('handleMenu', {
      showHome: true,
      showProjects: false,
      showExtendedView: false,
      showSettings: false
    }); 
  };

  const handleShowProjects = () => {
    dispatch('handleMenu', {
      showHome: false,
      showProjects: true,
      showExtendedView: false,
      showSettings: false

    }); 
  };


  const handleShowSettings = () => {
    dispatch('handleMenu', {
      showHome: false,
      showProjects: false,
      showExtendedView: false,
      showSettings: true

    }); 
  };

  const handleShowExtendedView = () => {
    dispatch('handleMenu', {
      showHome: false,
      showProjects: false,
      showExtendedView: true,
      showSettings: false
    }); 
  };

  const menuSettings = [
    { text: 'Projects', to: handleShowProjects },
    { text: 'Parameters', to: handleShowSettings },

  ];

  const menuHome = [
    { text: 'Home', to: handleShowHome },
    { text: 'Extended view', to: handleShowExtendedView }
  ];

  const menuProfile = [
    { text: 'Picture', to: 'handleProjectSettings' },
    { text: 'Workshift', to: 'handleWorkshiftSettings' },
    { text: 'Calendars', to: 'handleProjectSettings' }
  ];    

  if(!API_TIMESHEETS_URL)
    menuSettings = [
      { text: 'Parameters', to: handleShowSettings }
    ];

</script>

<NavigationDrawer bind:showDesktop={showNav} bind:showMobile={showNavMobile} right={right} persistent={persistent}
  elevation={elevation} breakpoint={breakpoint}>
  <h5 class="p-5 text-gray-900">Links</h5>
  {#if API_TIMESHEETS_URL}
    <List items={menuHome}>
      <span slot="item" let:item={item} class="cursor-pointer">
        <a href="#" on:click="{item.to}">
          <ListItem {...item} dense navigation />
        </a>
      </span>
    </List>
    <hr>
    <h5 class="p-5 text-gray-900">Profile</h5>
    <List items={menuProfile}>
      <span slot="item" let:item={item} class="cursor-pointer">
        <a href="#" on:click="{item.to}">
          <ListItem {...item} dense navigation />
        </a>
      </span>
    </List>
    <hr>
    <h5 class="p-5 text-gray-900">Settings</h5>
  {/if}
  <List items={menuSettings}>
    <span slot="item" let:item={item} class="cursor-pointer">
      <a href="#" on:click="{item.to}">
        <ListItem {...item} dense navigation />
      </a>
    </span>
  </List>
  <!-- <hr> -->
</NavigationDrawer>