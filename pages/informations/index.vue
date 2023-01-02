<template>
  <div class="container">
    <section class="section">
      <h1 class="title is-size-2 is-size-2-mobile">
        {{ $t("Informations") }}
      </h1>
      <h2 class="title is-size-3 is-size-3-mobile">{{ $t("Team") }}</h2>

      <div class="columns is-multiline is-mobile is-centered">
        <div class="column is-6-mobile is-6-tablette profile">
          <a
            href="https://www.linkedin.com/in/alexandros-sidiras-galante/"
            target="blank"
          >
            <img
              class="subcard-img fit-img portrait"
              loading="lazy"
              src="https://avatars0.githubusercontent.com/u/45072484"
              alt="Photo of Alexandros"
            />
          </a>
          <h5 class="centered is-size-5 is-size-5-mobile"><b>Alex</b></h5>
          <div class="centered">{{ $t("AlexInfos") }}</div>
        </div>

        <div class="column is-6-mobile is-6-tablette profile">
          <a
            href="https://www.linkedin.com/in/adrianos-sidiras-galante-0a0779221/"
            target="blank"
          >
            <img
              class="subcard-img fit-img portrait"
              loading="lazy"
              src="https://avatars.githubusercontent.com/u/52712038"
              alt="Photo of Adri"
            />
          </a>
          <h5 class="centered is-size-5 is-size-5-mobile"><b>Adri</b></h5>
          <div class="centered">{{ $t("AdriInfos") }}</div>
        </div>

        <div class="column is-6-mobile is-6-tablette profile">
          <a href="https://www.linkedin.com/in/clement-baroudi/" target="blank">
            <img
              class="subcard-img fit-img portrait"
              loading="lazy"
              src="https://avatars.githubusercontent.com/u/91186350"
              alt="Photo of Clement"
            />
          </a>
          <h5 class="centered is-size-5 is-size-5-mobile"><b>Clement</b></h5>
          <div class="centered">{{ $t("ClementInfos") }}</div>
        </div>

        <div class="column is-6-mobile is-6-tablette profile">
          <a
            href="https://www.linkedin.com/in/guillemine-allavena-7ab385226/"
            target="blank"
          >
            <img
              class="subcard-img fit-img portrait"
              loading="lazy"
              src="https://avatars.githubusercontent.com/u/91621093"
              alt="Photo of Guillemine"
            />
          </a>
          <h5 class="centered is-size-5 is-size-5-mobile"><b>Guillemine</b></h5>
          <div class="centered">{{ $t("GuillemineInfos") }}</div>
        </div>

        <div class="column is-6-mobile is-6-tablette profile">
          <a
            href="https://www.linkedin.com/in/armand-prioreschi/"
            target="blank"
          >
            <img
              class="subcard-img fit-img portrait"
              loading="lazy"
              src="https://media.licdn.com/dms/image/C4E03AQHDp97wzqJgfw/profile-displayphoto-shrink_200_200/0/1605956157273?e=1676505600&v=beta&t=uP13MeHuR8KARIyKzd35fWGZjpzd2cf2x3JnMDFxCJM"
              alt="Photo of Armand"
            />
          </a>
          <h5 class="centered is-size-5 is-size-5-mobile"><b>Armand</b></h5>
          <div class="centered">{{ $t("ArmandInfos") }}</div>
        </div>

        <div class="column is-6-mobile is-6-tablette profile">
          <a
            href="https://ch4rlin3chamois32.wixsite.com/monportfolio"
            target="blank"
          >
            <img
              class="subcard-img fit-img portrait"
              loading="lazy"
              src="https://static.wixstatic.com/media/1609b5_8c53848b4b6445b5889a4e6c6c398b4a~mv2.jpg/v1/crop/x_0,y_385,w_1532,h_1574/fill/w_366,h_376,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/PSX_20220223_190243_edited.jpg"
              alt="Photo of Charline"
            />
          </a>
          <h5 class="centered is-size-5 is-size-5-mobile"><b>Charline</b></h5>
          <div class="centered">{{ $t("CharlineInfos") }}</div>
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
                  class="subcard-img fit-img partner-logo"
                  loading="lazy"
                  :srcset="list.image"
                  alt="logo of our partner"
              /></a>
              <h5 class="centered is-size-5 is-size-5-mobile">
                <b>{{ list.title }}</b>
              </h5>
              <div class="centered is-size-6 subcard-text">
                {{ list.description }}
              </div>
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
          <div
            class="subcard-img bigger placeholder"
            :style="`background-image: url(${
              require('@/assets/webdev.png').placeholder
            })`"
          >
            <img
              loading="lazy"
              alt="two people lifting the earth"
              :srcset="require('@/assets/webdev.png').srcSet"
              :placeholder="require('@/assets/webdev.png').placeholder"
              class="subcard-img bigger"
            />
          </div>
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
          <div
            class="subcard-img bigger placeholder"
            :style="`background-image: url(${
              require('@/assets/healthpro.png').placeholder
            })`"
          >
            <img
              loading="lazy"
              alt="two people lifting the earth"
              :srcset="require('@/assets/healthpro.png').srcSet"
              class="subcard-img bigger"
            />
          </div>
          <div class="subcard-text margin-text is-size-5">
            {{ $t("AreHealthProText") }} <br />
            {{ $t("AreHealthProTextContributionGuide") }}
            <a href="https://drive.home.asidiras.dev/s/tewn5968JxY9WaJ">
              https://drive.home.asidiras.dev/s/tewn5968JxY9WaJ</a
            >
          </div>
        </div>
      </div>
      <h5 class="title is-size-5 is-size-5-mobile">
        {{ $t("AreParticular") }}
      </h5>
      <div class="card">
        <div class="subcard subcard-row">
          <div
            class="subcard-img bigger placeholder"
            :style="`background-image: url(${
              require('@/assets/individual.png').placeholder
            })`"
          >
            <img
              loading="lazy"
              alt="two people lifting the earth"
              :srcset="require('@/assets/individual.png').srcSet"
              class="subcard-img bigger"
            />
          </div>
          <div class="subcard-text margin-text is-size-5">
            {{ $t("AreParticularText") }}
            {{ $t("CanTranslateText") }}
            <br />
            <br />
            Weblate:
            <a
              href="https://translate.home.asidiras.dev/projects/pictalk/frontend/"
              >https://translate.home.asidiras.dev</a
            >
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
          image: require("@/assets/InsaFondation.png").srcSet,
          placeholder: require("@/assets/InsaFondation.png").placeholder,
          url: "https://fondation.insa-lyon.fr/",
        },
        {
          title: "Digital Ocean",
          description: this.$t("DigitalOceanSponsoring"),
          image: require("@/assets/DigitalOcean.png").srcSet,
          placeholder: require("@/assets/DigitalOcean.png").placeholder,
          url: "https://www.digitalocean.com/",
        },
        {
          title: "Adapei 69",
          image: require("@/assets/ADAPEI.png").srcSet,
          placeholder: require("@/assets/ADAPEI.png").placeholder,
          description: this.$t("Adapei69Sponsoring"),
          url: "https://www.adapei69.fr/",
        },
        {
          title: "ARASAAC",
          image: require("@/assets/logo-ARASAAC.png").srcSet,
          placeholder: require("@/assets/logo-ARASAAC.png").placeholder,
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

a {
  color: #ee0000;
}

.img-centered {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.section {
  padding: 1em;
  padding-top: 0rem;
  padding-bottom: 3rem;
}

.subcard {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex-basis: auto;
  padding: 0.75;
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
  background-color: #edf1f5;
}

.subcard-img {
  border-radius: 12px;
  aspect-ratio: 1 / 1;
  max-height: 20vh;
  object-fit: cover;
}

.portrait {
  border-radius: 50%;
  margin-bottom: 00.5em;
}

.partner-logo {
  aspect-ratio: 3 / 2;
  height: 125px;
}

.fit-img {
  object-fit: contain;
}

.bigger {
  min-height: 30vmin;
}

.placeholder {
  background-size: cover;
  background-position: center;
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
