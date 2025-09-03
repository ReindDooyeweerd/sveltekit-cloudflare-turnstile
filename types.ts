export interface TurnstileComponent {
	reset: () => void;
}

export interface TurnstileValidationResult {
	success: boolean;
	'error-codes'?: string[];
	challenge_ts?: string;
	hostname?: string;
	action?: string;
	cdata?: string;
}

export interface TurnstileValidationOptions {
	token: string;
	secretKey: string;
	remoteip?: string;
}

export interface TurnstileInstance {
	render: (container: string | HTMLElement, options: TurnstileOptions) => string;
	reset: (widgetId?: string) => void;
	remove: (widgetId: string) => void;
	getResponse: (widgetId?: string) => string | undefined;
	isExpired: (widgetId?: string) => boolean;
}

export interface TurnstileOptions {
	sitekey: string;
	callback?: (token: string) => void;
	'error-callback'?: (errorCode?: string) => void;
	'expired-callback'?: () => void;
	'timeout-callback'?: () => void;
	theme?: 'light' | 'dark' | 'auto';
	size?: 'normal' | 'compact';
	tabindex?: number;
	'response-field'?: boolean;
	'response-field-name'?: string;
	retry?: 'auto' | 'never';
	'retry-interval'?: number;
	'refresh-expired'?: 'auto' | 'manual' | 'never';
	language?: string;
	execution?: 'render' | 'execute';
	appearance?: 'always' | 'execute' | 'interaction-only';
}

export interface TurnstileProps {
	sitekey: string;
	onSuccess?: (token: string) => void;
	onError?: (errorCode: string) => void;
	onExpired?: () => void;
	onTimeout?: () => void;
	theme?: 'light' | 'dark' | 'auto';
	size?: 'normal' | 'compact';
}

declare global {
	interface Window {
		turnstile?: TurnstileInstance;
	}
}
