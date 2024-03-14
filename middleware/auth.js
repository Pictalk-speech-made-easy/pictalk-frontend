export default function (context) {
  if (!context.$keycloak.authenticated) {
    context.redirect('/');
  }
}
