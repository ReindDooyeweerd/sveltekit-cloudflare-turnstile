<script lang="ts">
	import type { TurnstileProps } from './types.js';

	let {
		sitekey,
		onSuccess,
		onError,
		onExpired,
		onTimeout,
		theme = 'auto',
		size = 'normal'
	}: TurnstileProps = $props();

	let containerElement: HTMLDivElement;
	let widgetId: string | null = null;

	// Global script loading state
	let scriptLoadPromise: Promise<void> | null = null;

	function loadScript(): Promise<void> {
		// Return existing promise if script is already loading
		if (scriptLoadPromise) {
			return scriptLoadPromise;
		}

		// If script is already loaded, return resolved promise
		if (window.turnstile) {
			return Promise.resolve();
		}

		// Check if script tag already exists
		const existingScript = document.querySelector('script[src*="turnstile"]');
		if (existingScript) {
			scriptLoadPromise = new Promise((resolve) => {
				const checkInterval = setInterval(() => {
					if (window.turnstile) {
						clearInterval(checkInterval);
						resolve();
					}
				}, 100);
			});
			return scriptLoadPromise;
		}

		// Create new script loading promise
		scriptLoadPromise = new Promise((resolve, reject) => {
			const script = document.createElement('script');
			script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
			script.async = true;
			script.defer = true;

			script.onload = () => {
				if (window.turnstile) {
					resolve();
				} else {
					const checkInterval = setInterval(() => {
						if (window.turnstile) {
							clearInterval(checkInterval);
							resolve();
						}
					}, 100);
				}
			};

			script.onerror = () => reject(new Error('Failed to load Turnstile script'));

			document.head.appendChild(script);
		});

		return scriptLoadPromise;
	}

	function initWidget(element: HTMLElement) {
		loadScript()
			.then(() => {
				if (!window.turnstile) {
					console.error('Turnstile: API not available after script load');
					onError?.('api-unavailable');
					return;
				}

				try {
					widgetId = window.turnstile.render(element, {
						sitekey,
						callback: onSuccess,
						'error-callback': onError
							? (errorCode?: string) => onError(errorCode || 'challenge-failed')
							: undefined,
						'expired-callback': onExpired,
						'timeout-callback': onTimeout,
						theme,
						size
					});
				} catch (renderError) {
					console.error('Turnstile render failed:', renderError);
					onError?.('render-failed');
				}
			})
			.catch((error) => {
				console.error('Turnstile script loading failed:', error);
				onError?.('script-load-failed');
			});

		return () => {
			if (widgetId && window.turnstile) {
				try {
					window.turnstile.remove(widgetId);
				} catch (error) {
					console.warn('Failed to remove Turnstile widget:', error);
				}
				widgetId = null;
			}
		};
	}

	export function reset() {
		if (typeof window === 'undefined') {
			console.warn('Turnstile: Cannot reset in server environment');
			return;
		}

		if (!widgetId) {
			console.warn('Turnstile: No widget to reset');
			return;
		}

		if (!window.turnstile) {
			console.error('Turnstile: API not available');
			onError?.('api-unavailable');
			return;
		}

		try {
			window.turnstile.reset(widgetId);
		} catch (error) {
			console.error('Turnstile reset failed:', error);
			onError?.('reset-failed');
		}
	}
</script>

<div bind:this={containerElement} {@attach initWidget}></div>
