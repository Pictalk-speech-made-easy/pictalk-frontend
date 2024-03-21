export default function (context) {
  if (!context.$keycloak.authenticated && (context.route.path.includes("/pictalk") || context.route.path.includes("/account"))) {
    context.redirect("/");
  }
}
