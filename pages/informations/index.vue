<template>
  <div class="container">
    <section class="section">
      <h1 class="title is-size-2 is-size-2-mobile">
        {{ $t("Informations") }}
      </h1>
      <h2 class="title is-size-3 is-size-3-mobile">{{ $t("Team") }}</h2>
 

      <div class="columns is-multiline is-mobile is-centered">
        <div class="column is-6-mobile is-6-tablette profile">
          <img
            class="subcard-img fit-img portrait"
            loading="lazy"
            src="https://avatars0.githubusercontent.com/u/45072484?s=460&u=319a46de82b5b32ade7afb1807dec076bd6a925f&v=4"
            alt="Photo of Alexandros"
          ></img>
          <h5 class="centered is-size-5 is-size-5-mobile"><b>Alex</b></h5>
          <div class="centered">{{ $t("AlexInfos") }}</div>
        </div>

        <div class="column is-6-mobile is-6-tablette profile">
          <img
            class="subcard-img fit-img portrait"
            loading="lazy"
            src="https://avatars.githubusercontent.com/u/52712038?v=4"
            alt="Photo of Adri"
          ></img>
          <h5 class="centered is-size-5 is-size-5-mobile"><b>Adri</b></h5>
          <div class="centered">{{ $t("AdriInfos") }}</div>
        </div>

        <div class="column is-6-mobile is-6-tablette profile">
          <img
            class="subcard-img fit-img portrait"
            loading="lazy"
            src="https://avatars.githubusercontent.com/u/91186350?s=400&u=fae6e777f5af5cbfe99c2a73d11ca2fae53e49fb&v=4"
            alt="Photo of Clement"
          ></img>
          <h5 class="centered is-size-5 is-size-5-mobile"><b>Clement</b></h5>
          <div class="centered">{{ $t("ClementInfos") }}</div>
        </div>

        <div class="column is-6-mobile is-6-tablette profile">
          <img
            class="subcard-img fit-img portrait"
            loading="lazy"
            src="https://avatars.githubusercontent.com/u/91621093?v=4"
            alt="Photo of Guillemine"
          ></img>
          <h5 class="centered is-size-5 is-size-5-mobile"><b>Guillemine</b></h5>
          <div class="centered is-size-5">{{ $t("GuillemineInfos") }}</div>
        </div>

      </div>


    </section>
    <section class="section">
      <h2 class="title is-size-3 is-size-3-mobile">{{ $t("Partners") }}</h2>
      <b-carousel-list
        v-model="test"
        :data="items"
        :items-to-show="1.5"
        :breakpoints="breakpoints"
        autoplay
        repeat
        class="card partners"
      >
        <template #item="list">
          <div class="">
            <div class="column subcard">
              <a :href="list.url">
              <img
                class="subcard-img fit-img"
                loading="lazy"
                :src="list.image"
              :placeholder="
                require('@/assets/Contact_compressed.png').placeholder
              "
                alt="logo of our partner"
              ></img></a>
              <h5 class="centered is-size-5 is-size-5-mobile">
                <b>{{ list.title }}</b>
              </h5>
              <div class="centered is-size-6 subcard-text">{{ list.description }}</div>
            </div>
          </div>
        </template>
      </b-carousel-list>
    </section>
    <section class="section">
      <h2 class="title is-size-3 is-size-3-mobile">
        {{ $t("HowContribute") }}
      </h2>
      <h5 class="title is-size-5 is-size-5-mobile">
        {{ $t("AreDevelopper") }}
      </h5>
      <div class="card">
        <div class="subcard subcard-row">
          <img
            loading="lazy"
            alt="two people lifting the earth"
            :srcset="require('@/assets/webdev.png').srcSet"
            :placeholder="require('@/assets/webdev.png').placeholder"
            class="subcard-img bigger"
          ></img>
          <div class="subcard-text margin-text is-size-5">
            {{ $t("AreDevelopperText") }} <br />
            <br />Github:
            <a
              href="https://github.com/Pictalk-speech-made-easy/pictalk-frontend"
            >
              https://github.com/Pictalk-speech-made-easy/pictalk-frontend</a
            >
          </div>
        </div>
      </div>
      <h5 class="title is-size-5 is-size-5-mobile">
        {{ $t("AreHealthPro") }}
      </h5>
      <div class="card">
        <div class="subcard subcard-row">
          <img
            loading="lazy"
            alt="two people lifting the earth"
            :srcset="require('@/assets/healthpro.png').srcSet"
          :placeholder="require('@/assets/healthpro.png').placeholder"
            class="subcard-img bigger"
          ></img>
          <div class="subcard-text margin-text is-size-5">
            {{ $t("AreHealthProText") }}
          </div>
        </div>
      </div>
      <h5 class="title is-size-5 is-size-5-mobile">
        {{ $t("AreParticular") }}
      </h5>
      <div class="card">
        <div class="subcard subcard-row">
          <img
            loading="lazy"
            alt="two people lifting the earth"
            :srcset="require('@/assets/individual.png').srcSet"
            :placeholder="require('@/assets/individual.png').placeholder"
            class="subcard-img bigger"
          ></img>
          <div class="subcard-text margin-text is-size-5">
            {{ $t("AreParticularText") }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      breakpoints: {
        768: {
          hasGrayscale: false,
          itemsToShow: 2.5,
        },
        1216: {
          hasGrayscale: false,
          itemsToShow: 4,
        },
      },
      test: 0,
      items: [
        {
          title: "Fondation INSA Lyon",
          description: this.$t("INSALyonSponsoring"),
          image:
            "https://best.insa-lyon.org/sites/best.insa-lyon.org/files/fondateurs/insa_lyon_foundation.png",
          url: "https://fondation.insa-lyon.fr/",
        },
        {
          title: "Digital Ocean",
          description: this.$t("DigitalOceanSponsoring"),
          image:
            "https://www.vectorlogo.zone/logos/digitalocean/digitalocean-ar21.png",
          url: "https://www.digitalocean.com/",
        },
        {
          title: "Adapei 69",
          image:
            "https://espacecolab.adapei69.fr/wp-content/uploads/2020/09/LOGO-ADAPEI_couleur-768x249.jpg",
          description: this.$t("Adapei69Sponsoring"),
          url: "https://www.adapei69.fr/",
        },
        {
          title: "ARASAAC",
          image:
            "https://aulaabierta.arasaac.org/wp-content/uploads/2020/03/logo_ARASAAC_texto_negro_fondo_transparente.png",
          description: this.$t("ARASAACSponsoring"),
          url: "https://arasaac.org/",
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
.section {
  padding: 6vw;
  padding-top: 0rem;
  padding-bottom: 3rem;
}
.subcard {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex-basis: auto;
  padding: 1em;
}
.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.subcard-row {
  flex-direction: row;
}
.card {
  margin: 2vw;
  border-radius: 12px;
}
.subcard-img {
  border-radius: 12px;
  aspect-ratio: 1 / 1;
  max-height: 20vh;
  object-fit: cover;
}
.portrait {
  border-radius: 100px;
  margin-bottom: 00.5em;
}
.fit-img {
  object-fit: contain;
}
.bigger {
  max-height: 30vmin;
  min-height: 200px;
}
.centered {
  text-align: center;
}
.subcard-text {
  margin: 0.4em 0 0em 0;
}
.margin-text {
  margin: 0 1.5vmin 0 3vmin;
}
.partners {
  margin: 0%;
}
@media screen and (max-width: 768px) {
  .subcard-row {
    flex-direction: column;
  }
}
.portrait:hover {
  animation: zoom 250ms;
  animation-fill-mode: forwards;
}
@keyframes zoom {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.12);
  }
}
</style>
