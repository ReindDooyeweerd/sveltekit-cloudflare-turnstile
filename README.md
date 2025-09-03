
# Sveltekit Turnstile

A very simple way to add the CloudFlare Turnstile widget to your Sveltekit project. No dependencies, no endless config options. Uses the {@attach...} from Sveltekit.

 Usage:

    <script  lang="ts">
	    import { Turnstile } from  '$lib/turnstile/';
	    import  type { TurnstileComponent } from  '$lib/turnstile/';

		let  turnstileWidgetRef:  TurnstileComponent  |  null  =  null;
	</script>
	
	<Turnstile 
		bind:this={turnstileWidgetRef} 	
		sitekey="1x00000000000000000000AA"
		onSuccess={(token) =>  console.log('Token:', token)}
	/>

Rest of the docs will follow soon.
