<script lang="ts">
	import {
		Loader,
		CircleCheck,
		CircleAlert,
		SendHorizontal,
		Mail,
		Eye,
		EyeClosed
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import RichTextEditor from '$lib/RichTextEditor.svelte';
	import { toast } from 'svelte-sonner';

	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	const { form, errors, delayed, enhance, allErrors, message } = superForm(data.form);

	$effect(() => {
		if ($message) {
			if ($message.type === 'error') {
				toast.error($message.text);
				$form.message = '';
			} else {
				toast.success($message.text);
			}
		}
	});

	let password = $state(false);
	let passwordText = $state('');
	let type = $state(false);

	let EyePass = $derived(type ? Eye : EyeClosed);

	function togglePassword(passwordText: string) {
		if (passwordText === 'CrossRiverPassword@123') {
			password = true;
			toast.success('Password Correct');
		} else {
			toast.error('Incorrect Password');
		}
	}
</script>

<svelte:head>
	<title>Compose Message | Professional Email</title>
</svelte:head>

<main
	class="container flex h-screen max-w-3xl items-center justify-center justify-self-center py-10"
>
	<Card.Root class=" min-h-96 w-full shadow-xl">
		<Card.Header class="space-y-1">
			<Card.Description>
				<img src="/logoMain.webp" alt="logo" class="jusfity-self-center h-1/2 w-1/2 rounded-lg" />
				<div class="my-4 flex items-center gap-2">
					<Mail class="h-6 w-6 text-primary" />
					<Card.Title class="text-2xl">New Message</Card.Title>
				</div>
				{#if password}
					Send a professional email to your recipients. All fields are required.
				{:else}
					Enter you password and hit enter to Send professional emails.
				{/if}
			</Card.Description>
		</Card.Header>

		<Card.Content>
			{#if !password}
				<div class="relative">
					<Input
						id="password"
						bind:value={passwordText}
						name="password"
						type={type ? 'text' : 'password'}
						onchange={() => togglePassword(passwordText)}
						placeholder="Enter password"
					/>
					<button
						class="absolute top-1/2 right-2 -translate-y-1/2 text-primary"
						onclick={() => (type = !type)}><EyePass class="h-4 w-4 text-primary" /></button
					>
				</div>
			{/if}
			{#if password}
				<form method="POST" use:enhance class="space-y-6">
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div class="space-y-2">
							<Label for="name">Recipient Name</Label>
							<Input
								id="name"
								bind:value={$form.name}
								name="name"
								placeholder="John Doe"
								required
							/>
							{#if $errors.name}
								<p class="text-sm text-red-600">{$errors?.name}</p>
							{/if}
						</div>
						<div class="space-y-2">
							<Label for="email">Recipient Email</Label>
							<Input
								id="email"
								name="email"
								bind:value={$form.email}
								type="email"
								placeholder="john@example.com"
								required
							/>
							{#if $errors.email}
								<p class="text-sm text-red-600">{$errors?.email}</p>
							{/if}
						</div>
					</div>

					<div class="space-y-2">
						<Label for="subject">Subject Line</Label>
						<Input
							id="subject"
							bind:value={$form.subject}
							name="subject"
							placeholder="Project Update Regarding..."
							required
						/>
						{#if $errors.subject}
							<p class="text-sm text-red-600">{$errors?.subject}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label>Message Body</Label>
						<div
							class="min-h-[200px] rounded-md border border-input bg-background transition-colors focus-within:ring-1 focus-within:ring-ring"
						>
							<RichTextEditor bind:value={$form.message} />
						</div>
						<input type="hidden" name="message" bind:value={$form.message} />
					</div>

					<Button type="submit" disabled={$delayed} class="w-full transition-all hover:scale-105">
						{#if $delayed}
							<Loader class="mr-2 h-4 w-4 animate-spin" />
							Sending...
						{:else}
							<SendHorizontal class="mr-2 h-4 w-4" />
							Send Email
						{/if}
					</Button>
				</form>
			{/if}
		</Card.Content>
	</Card.Root>
</main>
