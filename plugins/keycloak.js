import Keycloak from 'keycloak-js'

export default async ({ app, $config }, inject) => {
  const keycloak = new Keycloak({
    url: $config.keycloak.url,
    realm: $config.keycloak.realm,
    clientId: $config.keycloak.clientId
  })
  inject('keycloak', keycloak)
  console.log('keycloak', keycloak)
  await keycloak.init({ flow: 'implicit', onLoad: 'check-sso', enableLogging: true, /* silentCheckSsoRedirectUri: `${location.origin}/kc_auth/silent-check-sso.html` */ })
}
