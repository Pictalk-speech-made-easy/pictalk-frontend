export default function (context) {
  if (process.client) {
    if (!context.store.getters.isAuthenticated) {
      context.redirect('/');
    }
  }
}
