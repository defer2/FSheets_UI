import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

// import {config} from 'dotenv';
import replace from '@rollup/plugin-replace';


const smelte = require("smelte/rollup-plugin-smelte");

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;
	
	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('bundle.css');
			}		
		}),
		replace({
			// stringify the object       
			__app: JSON.stringify({
			  env: {
				isProd: production,
				API_TASKS_URL: process.env.API_TASKS_URL,
				API_TIMESHEETS_URL: process.env.API_TIMESHEETS_URL,
				API_CLARITYPPM_URL: process.env.API_CLARITYPPM_URL,
				API_PROJECTS_URL: process.env.API_PROJECTS_URL
			  }
			}),
		  }),
		
		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),

		// smelte CSS
		smelte({
			purge: production,
			output: "public/global.css", // it defaults to static/global.css which is probably what you expect in Sapper
			postcss: [], // Your PostCSS plugins
			whitelist: [], // Array of classnames whitelisted from purging
			whitelistPatterns: [], // Same as above, but list of regexes
			tailwind: {
			  theme: {
				extend: {
				  spacing: {
					72: "18rem",
					84: "21rem",
					96: "24rem"
				  }
				},
				colors: {
					primary: "#264653",
					secondary: "#E9C46A",
					error: "#E84855",
					success: "#2A9D8F",
					alert: "#F4A261",
					blue: "#CFCFEA",
					dark: "#1F0322",
					white: "#ffffff"
				}
			  }, // Extend Tailwind theme
			  colors: {
				primary: "#264653",
				secondary: "#E9C46A",
				error: "#E84855",
				success: "#2A9D8F",
				alert: "#F4A261",
				blue: "#CFCFEA",
				dark: "#1F0322",
				white: "#ffffff"
			  }, // Object of colors to generate a palette from, and then all the utility classes
			  darkMode: false,
			}, // Any other props will be applied on top of default Smelte tailwind.config.js
		  }),
	],
	watch: {
		clearScreen: false
	}
};
