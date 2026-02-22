import { redirect } from '@sveltejs/kit';

export function load() {
  // We sturen iedereen die op / binnenkomt direct naar /admin
  // De statuscode 307 staat voor een tijdelijke redirect
  throw redirect(307, '/admin');
}
