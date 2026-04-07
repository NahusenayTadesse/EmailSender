import type { Actions } from './$types';
import nodemailer from 'nodemailer';
import { HOST, PORT, USER, PASSWORD } from '$env/static/private';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const email = formData.get('email') as string;
		const name = formData.get('name') as string;
		const subject = formData.get('subject') as string;
		const replyMessage = formData.get('message') as string;

		// Basic validation
		if (!subject || !email || !name || !replyMessage) {
			return fail(400, { success: false, message: 'Missing required fields.' });
		}
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
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #bd261b; text-align: center; margin-bottom: 20px; padding-bottom:20px;">
        <img src="https://crossriveradvisors.com/wp-content/uploads/2026/04/Frame-113.jpg" alt="Cross River Advisors Logo" style="width: 200px; height: 200px;" />
        </div>

        <p>Hi ${name},</p>

        <div style="background-color: #f4f8fb; padding: 15px; margin: 20px 0;">
        ${replyMessage}
        </div>

        <br>
        <p>Best regards,<br><strong style="color: #bd261b;">Cross River Advisors Team</strong></p>
        <p style="text-align: center;"> &copy; ${currentYear} <a href="https://crossriveradvisors.com" style="color: #bd261b; text-decoration: none;">
Cross River Advisors</a> All Rights Reserved </p>
      </div>
    `;

		try {
			await transporter.sendMail({
				from: `"Cross River Advisors" <${USER}>`,
				to: email,
				subject: subject,
				html: htmlContent
			});

			return {
				success: true,
				message: 'Email sent successfully.'
			};
		} catch (error) {
			console.error('Error processing message:', error);

			return fail(400, {
				success: false,
				message: 'An unexpected error occurred. Please try again later.'
			});
		}
	}
};
