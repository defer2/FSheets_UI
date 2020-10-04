import App from './App.svelte';
import config from '../conf/configuration.js'

const app = new App({
	target: document.body,
	props: {
		configuration: {
			...config
		}
	}
});

export default app;


