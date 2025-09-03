import type { TurnstileValidationOptions, TurnstileValidationResult } from './types.js';

/**
 * Validates a Turnstile token against Cloudflare's API
 * Should only be called from server-side code (SvelteKit actions, API routes, etc.)
 */
export async function validateTurnstile({
	token,
	secretKey,
	remoteip
}: TurnstileValidationOptions): Promise<TurnstileValidationResult> {
	const formData = new FormData();
	formData.append('secret', secretKey);
	formData.append('response', token);
	
	if (remoteip) {
		formData.append('remoteip', remoteip);
	}

	try {
		const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const result: TurnstileValidationResult = await response.json();
		return result;
	} catch (error) {
		console.error('Turnstile validation failed:', error);
		return {
			success: false,
			'error-codes': ['network-error']
		};
	}
}