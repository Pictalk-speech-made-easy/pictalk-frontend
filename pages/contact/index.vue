1<template>
  <div>
    <section class="section">
      <div class="container">
        <b-image
          class="contact"
          lazy
          :srcset="require('@/assets/Contact_compressed.png').srcSet"
          alt="Rocket carrying non-verbal people"
        ></b-image>
        <br />
        <h1 class="title is-size-3-mobile">Contact me</h1>
        <h2 class="subtitle is-size-5-mobile has-text-justified">
          If you have any
          <strong>suggestions</strong> for the website you can contact me at the
          following email adress :
          <a href="mailto:alexandros.sidiras@laposte.net"
            >alexandros.sidiras@laposte.net</a
          >. We are open to any of your ideas, so as to deliver the best
          experience :)
        </h2>
        <br />
        <h1 class="title is-size-3-mobile">Bug repport & Questions</h1>
        <h2 class="subtitle is-size-5-mobile has-text-justified">
          If you encounter any
          <strong>bugs</strong> or have <strong>propositions</strong> to improve
          the code of the website you can submit those to this github page :
          <a href="https://github.com/Ratatinator97/PicTalk-Frontend"
            >https://github.com/Ratatinator97/PicTalk-Frontend</a
          >
        </h2>
      </div>
    </section>
  </div>
</template>
<style scoped>
.bug {
  max-width: 100%;
  height: auto;
  margin-left: auto;
  margin-right: auto;

  display: block;
}
.contact {
  width: 70%;
}
</style>
