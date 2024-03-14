export default function (context) {
  if (!context.$keycloak.authenticated && context.route.path.includes("/pictalk")) {
    context.redirect("/");
  }
}
