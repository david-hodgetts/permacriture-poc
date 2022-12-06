import type { ParamMatcher } from '@sveltejs/kit';
 

// route matching param cf -> https://kit.svelte.dev/docs/advanced-routing#matching
export const match: ParamMatcher = (param) => {
  return /^\d+$/.test(param);
}