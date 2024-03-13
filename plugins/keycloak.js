import Keycloak from 'keycloak-js'

export default async ({ app, $config }, inject) => {
  const keycloak = new Keycloak({
    url: $config.keycloakUrl,
    realm: $config.keycloakRealm,
    clientId: $config.keycloakClientId
  })
  inject('keycloak', keycloak)
  await keycloak.init({ flow: 'implicit', onLoad: 'check-sso' })
}
