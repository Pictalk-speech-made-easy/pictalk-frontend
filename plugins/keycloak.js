import Keycloak from 'keycloak-js'

export default ({ app, $config }, inject) => {
  const keycloak = new Keycloak({
    url: $config.keycloak.url,
    realm: $config.keycloak.realm,
    clientId: $config.keycloak.clientId
  })
  inject('keycloak', keycloak)
  console.log('keycloak', keycloak)
  window.addEventListener("online", function () {
    initializeKeycloak(keycloak);
  });
  if (navigator.onLine) {
    initializeKeycloak(keycloak)
  }
}

function initializeKeycloak(keycloak) {
  keycloak.init({ flow: 'implicit', onLoad: 'check-sso', enableLogging: true, /* silentCheckSsoRedirectUri: `${location.origin}/kc_auth/silent-check-sso.html` */ })
  window.removeEventListener("online", initializeKeycloak);
}
