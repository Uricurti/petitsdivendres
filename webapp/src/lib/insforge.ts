import { createClient } from '@insforge/sdk';

const insforgeUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || '';
const insforgeKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || '';

if (typeof window !== 'undefined' && (!insforgeUrl || !insforgeKey)) {
  console.warn('Insforge URL and Key are not set in environment variables.');
}

// Client for public operations (Realtime subscriptions)
export const insforge = createClient({
  baseUrl: insforgeUrl,
  anonKey: insforgeKey
});

// Admin Client to be used only in server components/API routes (bypasses RLS)
export const getAdminClient = () => {
  const adminKey = process.env.INSFORGE_SERVICE_ROLE_KEY || insforgeKey;
  return createClient({
    baseUrl: insforgeUrl,
    anonKey: adminKey
  });
};
