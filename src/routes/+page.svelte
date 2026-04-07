<script lang="ts">
	import { enhance } from '$app/forms';
	import { Loader, CircleCheck, CircleAlert, SendHorizontal, Mail } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { fly } from 'svelte/transition';
	import RichTextEditor from '$lib/RichTextEditor.svelte';
	import { toast } from 'svelte-sonner';

	let { form } = $props();

	let value = $state('');
	let loading = $state(false);
	let visible = $state(false);
	let errorVisible = $state(false);

	function onsubmit() {
		loading = true;
	}

	$effect(() => {
		if (form?.success) {
			toast.success('Email sent successfully.');
			loading = false;
			visible = true;
			const timer = setTimeout(() => (visible = false), 5000);
			return () => clearTimeout(timer);
		}
		if (form?.error) {
			loading = false;
			toast.error('Failed to send email.');
			errorVisible = true;
			const timer = setTimeout(() => (errorVisible = false), 5000);
			return () => clearTimeout(timer);
		}
	});

	// $effect(() => {
	// 	if (form?.success) {
	// 		toast.success(form?.message || 'Email sent successfully.');
	// 	}
	// 	if (!form?.success) {
	// 		toast.error(form?.message || 'Failed to send email.');
	// 	}
	// });
</script>

<svelte:head>
	<title>Compose Message | Professional Email</title>
</svelte:head>

<main class="container flex max-w-3xl items-center justify-self-center py-10">
	<Card.Root class="w-full shadow-xl">
		<Card.Header class="space-y-1">
			<div class="flex items-center gap-2">
				<Mail class="h-6 w-6 text-primary" />
				<Card.Title class="text-2xl">New Message</Card.Title>
			</div>
			<Card.Description>
				Send a professional email to your recipients. All fields are required.
			</Card.Description>
		</Card.Header>

		<Card.Content>
			<form method="POST" use:enhance {onsubmit} class="space-y-6">
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div class="space-y-2">
						<Label for="name">Recipient Name</Label>
						<Input id="name" name="name" placeholder="John Doe" required />
					</div>
					<div class="space-y-2">
						<Label for="email">Recipient Email</Label>
						<Input id="email" name="email" type="email" placeholder="john@example.com" required />
					</div>
				</div>

				<div class="space-y-2">
					<Label for="subject">Subject Line</Label>
					<Input id="subject" name="subject" placeholder="Project Update Regarding..." required />
				</div>

				<div class="space-y-2">
					<Label>Message Body</Label>
					<div
						class="min-h-[200px] rounded-md border border-input bg-background transition-colors focus-within:ring-1 focus-within:ring-ring"
					>
						<RichTextEditor bind:value />
					</div>
					<input type="hidden" name="message" bind:value />
				</div>

				<Button type="submit" disabled={loading} class="w-full transition-all active:scale-95">
					{#if loading}
						<Loader class="mr-2 h-4 w-4 animate-spin" />
						Sending...
					{:else}
						<SendHorizontal class="mr-2 h-4 w-4" />
						Send Email
					{/if}
				</Button>
			</form>
		</Card.Content>
	</Card.Root>
</main>

<div class="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
	{#if visible}
		<div
			transition:fly={{ x: 100, duration: 300 }}
			class="flex items-center gap-3 rounded-lg bg-primary p-4 text-primary-foreground shadow-2xl"
		>
			<CircleCheck class="h-5 w-5" />
			<p class="text-sm font-medium">{form?.message || 'Email sent successfully!'}</p>
		</div>
	{/if}

	{#if errorVisible}
		<div
			transition:fly={{ x: 100, duration: 300 }}
			class="text-destructive-foreground flex items-center gap-3 rounded-lg bg-destructive p-4 shadow-2xl"
		>
			<CircleAlert class="h-5 w-5" />
			<p class="text-sm font-medium">{form?.message || 'Failed to send email.'}</p>
		</div>
	{/if}
</div>
