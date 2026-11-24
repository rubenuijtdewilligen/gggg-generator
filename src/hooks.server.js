import { createAdminPb } from '$lib/server/pocketbase';

export async function handle({ event, resolve }) {
  event.locals.pb = await createAdminPb();
  return resolve(event);
}
