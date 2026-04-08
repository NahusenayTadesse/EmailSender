import type { Actions } from './$types';
import nodemailer from 'nodemailer';
import { schema } from './schema';
import { superValidate, message as ServerMessage } from 'sveltekit-superforms/server';
import { zod4 } from 'sveltekit-superforms/adapters';

import { HOST, PORT, USER, PASSWORD } from '$env/static/private';

export const load = async () => {
	const form = await superValidate(zod4(schema));

	return { form };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(schema));

		if (!form.valid) {
			return ServerMessage(
				form,
				{ type: 'error', text: 'Please Check for Errors' },
				{ status: 400 }
			);
		}

		const { name, email, subject, message } = form.data;

		const transporter = nodemailer.createTransport({
			host: HOST,
			port: PORT,
			secure: true,
			auth: {
				user: USER,
				pass: PASSWORD
			}
		});
		const currentYear = new Date().getFullYear();

		const htmlContent = `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #444; line-height: 1.8; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">

    <div style="background-color: #ffffff; text-align: center; padding: 40px 20px; border-bottom: 4px solid #bd261b;">
      <img src="https://crossriveradvisors.com/wp-content/uploads/2026/04/Frame-113.jpg" alt="Cross River Advisors" style="width: 120px; height: auto; display: block; margin: 0 auto;" />
    </div>

    <div style="padding: 40px 30px; background-color: #ffffff;">
      <h2 style="color: #333; font-size: 18px; margin-top: 0;">Hi ${name},</h2>

      <div style="color: #555; font-size: 16px;">
        ${message}
      </div>

      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="margin: 0; font-size: 15px;">Best regards,</p>
        <p style="margin: 5px 0 0 0; font-weight: bold; color: #bd261b; font-size: 16px;">Cross River Advisors Team</p>
      </div>
    </div>

    <div style="background-color: #f9f9f9; padding: 30px; text-align: center; font-size: 12px; color: #999;">
      <p style="margin: 0 0 10px 0;">
        &copy; ${currentYear} <a href="https://crossriveradvisors.com" style="color: #bd261b; text-decoration: none; font-weight: bold;">Cross River Advisors</a>. All Rights Reserved.
      </p>

    </div>
  </div>
`;
		try {
			await transporter.sendMail({
				from: `"Cross River Advisors" <${USER}>`,
				to: email,
				subject: subject,
				html: htmlContent
			});

			return ServerMessage(form, {
				type: 'success',
				text: 'Email sent successfully.'
			});
		} catch (error) {
			console.error('Error processing message:', error);

			return ServerMessage(
				form,
				{
					type: 'error',
					text: 'An unexpected error occurred. Please try again later. ' + error?.message
				},
				{ status: 500 }
			);
		}
	}
};
