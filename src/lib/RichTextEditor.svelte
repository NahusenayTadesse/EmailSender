<!-- QuillEditor.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import 'quill/dist/quill.snow.css';

	/* -------------------------------------------------
	 * Public props
	 * ------------------------------------------------- */

	let { value = $bindable(), placeholder = 'Start writing...' } = $props();

	let container: HTMLDivElement;

	/* -------------------------------------------------
	 * Toolbar definition
	 * ------------------------------------------------- */
	const toolbar = [
		[{ header: [1, 2, 3, false] }],
		['bold', 'italic', 'underline', 'strike'],
		[{ list: 'ordered' }, { list: 'bullet' }],
		['link', 'blockquote', 'clean']
	];

	/* -------------------------------------------------
	 * Lifecycle
	 * ------------------------------------------------- */
	onMount(async () => {
		const { default: Quill } = await import('quill');

		let quill = new Quill(container, {
			theme: 'snow',
			placeholder,
			modules: { toolbar }
		});

		// --- load initial value ---
		if (value) {
			quill.clipboard.dangerouslyPasteHTML(value, 'silent');
		}

		// --- two-way binding ---
		quill.on('text-change', () => {
			value = quill.root.innerHTML;
		});

		// --- cleanup ---
		return () => {
			quill = null;
		};
	});
</script>

<div bind:this={container}></div>

<style>
	/* keep the editor from collapsing */
	div {
		height: auto;
		min-height: 150px;
	}
</style>
