<script>
    import { onDestroy } from 'svelte'
    import { alertstore } from './alert.js'
    import * as Smelte from 'smelte'

    export let ms = 3000;
    let visible;
    let timeout;
    let color;
    let text;


    const onMessageChange = (message, ms) => {
      clearTimeout(timeout)
      if (!message) {
        visible = false;
      } else {
        visible = true;
        color = message.color;
        text = message.text;
        if (ms > 0) timeout = setTimeout(() => visible = false, ms)
      }
    }
    $: onMessageChange($alertstore, ms);
   
    onDestroy(()=> clearTimeout(timeout));
</script>
<div on:click={() => visible = false}>
    <Smelte.Snackbar
        noAction
        color={color}
        timeout={2000}
        bind:value={visible}>
        <div>{text}</div>
        <div slot="action" />
    </Smelte.Snackbar>
</div>

<style>

</style>

