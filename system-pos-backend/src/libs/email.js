import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { EMAIL_USER, EMAIL_PASS } from '../config.js';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: EMAIL_USER,
		pass: EMAIL_PASS,
	},
});

export const sendMail = async (templateName, userEmail, subject, replacements) => {
	const templatePath = path.resolve('src', 'templates', `${templateName}.html`);
	let template = fs.readFileSync(templatePath, 'utf8');

	for (const [key, value] of Object.entries(replacements)) {
		const regex = new RegExp(`{{${key}}}`, 'g');
		template = template.replace(regex, value);
	}

	const mailOptions = {
		from: EMAIL_USER,
		to: userEmail,
		subject: subject,
		html: template,
	};

	await transporter.sendMail(mailOptions);
};
