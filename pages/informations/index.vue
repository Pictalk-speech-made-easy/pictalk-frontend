<template>
  <div class="container">
    <section class="section">
      <h1 class="title is-size-2 is-size-2-mobile">
        {{ $t("Informations") }}
      </h1>
      <h2 class="title is-size-3 is-size-3-mobile">{{ $t("Team") }}</h2>
      <div class="columns is-multiline is-mobile is-centered">
        <div class="column">
          <b-image
            style="aspect-ratio: 16/9; max-width: 15vw"
            class="img-centered column"
            lazy
            src="https://avatars0.githubusercontent.com/u/45072484?s=460&u=319a46de82b5b32ade7afb1807dec076bd6a925f&v=4"
            alt="help center people wearing headsets"
            rounded
          ></b-image>
          <h5 class="centered is-size-5 is-size-5-mobile">Alex</h5>
          <div class="centered">{{ $t("AlexInfos") }}</div>
        </div>
        <div class="column">
          <b-image
            style="aspect-ratio: 16/9; max-width: 15vw"
            class="img-centered column"
            lazy
            src="https://avatars.githubusercontent.com/u/52712038?v=4"
            alt="help center people wearing headsets"
            rounded
          ></b-image>
          <h5 class="centered is-size-5 is-size-5-mobile">Adri</h5>
          <div class="centered">{{ $t("AdriInfos") }}</div>
        </div>
        <div class="column">
          <b-image
            style="aspect-ratio: 16/9; max-width: 15vw"
            class="img-centered column"
            lazy
            src="https://avatars.githubusercontent.com/u/91186350?s=400&u=fae6e777f5af5cbfe99c2a73d11ca2fae53e49fb&v=4"
            alt="help center people wearing headsets"
            rounded
          ></b-image>
          <h5 class="centered is-size-5 is-size-5-mobile">Clement</h5>
          <div class="centered">{{ $t("ClementInfos") }}</div>
        </div>
        <div class="column">
          <b-image
            style="aspect-ratio: 16/9; max-width: 15vw"
            class="img-centered column"
            lazy
            src="https://avatars.githubusercontent.com/u/91621093?v=4"
            alt="help center people wearing headsets"
            rounded
          ></b-image>
          <h5 class="centered is-size-5 is-size-5-mobile">Guillemine</h5>
          <div class="centered">{{ $t("GuillemineInfos") }}</div>
        </div>
      </div>
    </section>
    <section class="section">
      <h2 class="title is-size-3 is-size-3-mobile">{{ $t("Partners") }}</h2>
      <b-carousel-list
        v-model="test"
        :data="items"
        :items-to-show="3"
        autoplay
        repeat
      >
        <template #item="list">
          <div class="">
            <b-image
              style="aspect-ratio: 16/9; max-width: 20vw"
              class="center column"
              lazy
              :src="list.image"
              :placeholder="
                require('@/assets/Contact_compressed.png').placeholder
              "
              alt="help center people wearing headsets"
              rounded
            ></b-image>
            <p class="title is-4">{{ list.title }}</p>
            <p class="title is-6">{{ list.description }}</p>
          </div>
        </template>
      </b-carousel-list>
    </section>
    <section class="section">
      <h2 class="title is-size-3 is-size-3-mobile">
        {{ $t("HowContribute") }}
      </h2>
      <section class="section">
        <h5 class="title is-size-5 is-size-5-mobile">
          {{ $t("AreDevelopper") }}
        </h5>
        <div class="columns">
          <b-image
            lazy
            alt="two people lifting the earth"
            :srcset="require('@/assets/webdev.png').srcSet"
            :placeholder="require('@/assets/webdev.png').placeholder"
            style="width: 50%; margin-left: 10%; aspect-ratio: 16/9"
            class="column"
          ></b-image>
          <div class="column">
            {{ $t("AreDevelopperText") }} <br />
            <br />Github:
            <a
              href="https://github.com/Pictalk-speech-made-easy/pictalk-frontend"
            >
              https://github.com/Pictalk-speech-made-easy/pictalk-frontend</a
            >
          </div>
        </div>
      </section>
      <section class="section">
        <h5 class="title is-size-5 is-size-5-mobile">
          {{ $t("AreHealthPro") }}
        </h5>
        <div class="columns">
          <b-image
            lazy
            class="column"
            alt="two people lifting the earth"
            :srcset="require('@/assets/healthpro.png').srcSet"
            :placeholder="require('@/assets/healthpro.png').placeholder"
            style="width: 80%; margin-left: 10%; aspect-ratio: 16/9"
          ></b-image>
          <div class="column">{{ $t("AreHealthProText") }}</div>
        </div>
      </section>
      <section class="section">
        <h5 class="title is-size-5 is-size-5-mobile">
          {{ $t("AreParticular") }}
        </h5>
        <div class="columns">
          <b-image
            lazy
            class="column"
            alt="two people lifting the earth"
            :srcset="require('@/assets/individual.png').srcSet"
            :placeholder="require('@/assets/individual.png').placeholder"
            style="width: 80%; margin-left: 10%; aspect-ratio: 16/9"
          ></b-image>
          <div class="column">{{ $t("AreParticularText") }}</div>
        </div>
      </section>
    </section>
  </div>
</template>
<script>
export default {
  data() {
    return {
      test: 0,
      items: [
        {
          title: "Fondation INSA Lyon",
          description:
            "La fondation INSA Lyon, à travers le Coups de pouce passions a fourni une aide de 1000€",
          image:
            "https://best.insa-lyon.org/sites/best.insa-lyon.org/files/fondateurs/insa_lyon_foundation.png",
        },
        {
          title: "Digital Ocean",
          description:
            "Hébergeur de notre serveur, Digital Ocean à subventionné à hauteur de 250€ nos coûts de fonctionnement informatiques",
          image:
            "https://www.vectorlogo.zone/logos/digitalocean/digitalocean-ar21.png",
        },
        {
          title: "Adapei 69",
          image:
            "https://espacecolab.adapei69.fr/wp-content/uploads/2020/09/LOGO-ADAPEI_couleur-768x249.jpg",
          description:
            "L'adapei 69 nous aide à améliorer et tester notre application. Nous bénéficions de leurs précieux conseils et expertise.",
        },
        {
          title: "ARASAAC",
          image:
            "https://aulaabierta.arasaac.org/wp-content/uploads/2020/03/logo_ARASAAC_texto_negro_fondo_transparente.png",
          description:
            "L'association espagnole ARASAAC nous fournit gratuitement leur base de pictogrammes. Sans leur Pictogrammes, Pictalk ne serait pas le même aujourd'hui.",
        },
        {
          title: "Slide 5",
          image: "https://buefy.org/static/img/placeholder-1280x960.png",
          rating: 5,
        },
        {
          title: "Slide 6",
          image: "https://buefy.org/static/img/placeholder-1280x960.png",
          rating: 4,
        },
        {
          title: "Slide 7",
          image: "https://buefy.org/static/img/placeholder-1280x960.png",
          rating: 2.7,
        },
        {
          title: "Slide 8",
          image: "https://buefy.org/static/img/placeholder-1280x960.png",
          rating: 1.5,
        },
      ],
    };
  },
  methods: {
    info(value) {
      this.test = value;
    },
  },
};
</script>
<style scoped>
.centered {
  text-align: center;
}
.img-centered {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
