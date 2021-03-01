<template>
  <div>
    <footer class="footer">
      <div class="content has-text-centered">
        <p style="margin-bottom: 0px">
          <strong>PicTalk</strong> by
          <a href="https://website.asidiras.dev/">Alexandros SIDIRAS GALANTE</a>. The source code is licensed
          <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">GNU</a>.
          Also, if you need, take a look at the <nuxt-link to="/legal-infos/terms-of-use">terms of use</nuxt-link> and <nuxt-link to="/legal-infos/privacy-policy">the privacy policy</nuxt-link>.
          <b>PicTalk</b> is a project <b>backed</b> by: 
        </p>
        <b-image
      					lazy
      					:srcset="require('@/assets/FondationLogo.png').srcSet"
      					alt="Fondation INSA Lyon logo"
						class="changeOnViewport"
    		></b-image>
        Want to be a <b>backer</b> too ? Feel free to email <a href="mailto:alexandros.sidiras@laposte.net">me</a> !
      </div>
    </footer>
  </div>
</template>
<style scoped>
.changeOnViewport {
  width: 15vmin;
}
</style>