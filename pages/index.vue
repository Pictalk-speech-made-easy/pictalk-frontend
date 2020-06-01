<template>
  <div>
    <div class="container">
      <figure class="image image is-2by1">
        <img src="~assets/pictalk.png" />
        <b-button class="signup-button" type="is-primary" inverted>Sign Up to Pic'Talk !</b-button>
      </figure>
    </div>
    <br />
    <br />
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">What is Pic'Talk ?</h1>
        </div>
      </div>
    </section>
    <br />
    <div class="container">
      <div class="notification is-size-5">
        Pic'Talk is all about
        <strong>pictograms</strong>
        . It's purpose is to make the life of
        <strong>speech-disabled</strong> persons
        <strong>easier</strong>.
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
.signup-button {
  position: absolute;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>