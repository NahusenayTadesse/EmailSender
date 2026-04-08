import { z } from 'zod/v4';

export const schema = z.object({
	name: z.string('Name is required'),
	email: z.email('Email is required'),
	subject: z.string('Subject is required'),
	message: z.string('Message is required').nonempty('Message is required')
});
