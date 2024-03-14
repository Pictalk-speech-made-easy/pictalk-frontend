export default function (context) {
  context.store.dispatch("initAuth", context.$keycloak);
}
