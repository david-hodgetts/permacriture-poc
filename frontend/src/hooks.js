/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // disables ssr
  return resolve(event, {ssr: false});
}
