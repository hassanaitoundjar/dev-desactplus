export default defineNuxtRouteMiddleware(async (to, from) => {
  const config = useRuntimeConfig();

  try {
    const response = await $fetch<{ maintenance: boolean }>(`${config.public.apiBaseUrl}/store/status`);

    if (response.maintenance) {
      if (to.path !== '/maintenance') {
        return navigateTo('/maintenance');
      }
    } else {
      if (to.path === '/maintenance') {
        return navigateTo('/');
      }
    }
  } catch (error) {
    // If the backend is completely down, fail silently or fallback to maintenance
    // We'll let it pass so the site doesn't completely break due to a temporary API hiccup,
    // or you could uncomment below to strictly force offline mode on API failure:
    // return navigateTo('/maintenance');
  }
});
