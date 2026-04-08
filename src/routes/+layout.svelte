<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
	import { Toaster } from 'svelte-sonner';
</script>

<Toaster position="bottom-right" richColors closeButton />

<svelte:head><link rel="icon" href="/logo.webp" /></svelte:head>
{@render children()}
