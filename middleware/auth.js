export default function (context) {
  if (!context.store.getters.isAuthenticated) {
    console.log('Middleware: Auth: Redirecting...');
    context.redirect('/');
  }
}
