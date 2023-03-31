<template>
<div class="container">
  <div class="title">{{$t('Tutorials')}}</div>
  <div class="columns is-multiline">
  <div class="card column is-one-third">
    <div class="card-image">
      <a href="https://youtu.be/leiYJHOp4QQ">
      <b-image loading="lazy"
        custom-class="image-container subcard-img bigger"
        alt="Presentation image of the youtube video for the basics of pictalk"
        :srcset="require('@/assets/TutorialBasics.png').srcSet"
        :placeholder="require('@/assets/TutorialBasics.png').placeholder"
      />
      <img class="video-icon" :srcset="require('@/assets/video.png').srcSet">
      </a>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48">
            <b-image loading="lazy"
              
              :srcset="require('@/assets/small_logo.png').srcSet"
              :placeholder="require('@/assets/small_logo.png').placeholder"
            />
            
          </figure>
        </div>
        <div class="media-content">
          <p class="title is-4">{{$t('TutorialsBasics')}}</p>
        </div>
      </div>
      <div class="content">
        {{$t('TutorialsBasicsText')}}
      </div>
    </div>
  </div>
  <div class="card column is-one-third">
    <div class="card-image">
      <a href="https://youtu.be/DO9Dyzjt0Y4">
      <b-image loading="lazy"
        custom-class="subcard-img bigger image-container"
        alt="Presentation image of the youtube video for the basics of pictalk"
        :srcset="require('@/assets/TutorialCreation.png').srcSet"
        :placeholder="require('@/assets/TutorialCreation.png').placeholder"
      />
      <img class="video-icon" :srcset="require('@/assets/video.png').srcSet">
      </a>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48">
            <b-image loading="lazy"
              :srcset="require('@/assets/small_logo.png').srcSet"
              :placeholder="require('@/assets/small_logo.png').placeholder"
            />
          </figure>
        </div>
        <div class="media-content">
          <p class="title is-4">{{$t('TutorialsCreation')}}</p>
        </div>
      </div>
      <div class="content">
        {{$t('TutorialsCreationText')}}
      </div>
    </div>
  </div>
  <div class="card column is-one-third">
    <div class="card-image">
      <a href="https://youtu.be/PcB-28gygjY">
      <b-image loading="lazy"
        custom-class="subcard-img bigger image-container"
        alt="Presentation image of the youtube video for the basics of pictalk"
        :srcset="require('@/assets/TutorialOrganizing.png').srcSet"
        :placeholder="require('@/assets/TutorialOrganizing.png').placeholder"
      />
      <img class="video-icon" :srcset="require('@/assets/video.png').srcSet">
      </a>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48">
            <b-image loading="lazy"
              :srcset="require('@/assets/small_logo.png').srcSet"
              :placeholder="require('@/assets/small_logo.png').placeholder"
            />
          </figure>
        </div>
        <div class="media-content">
          <p class="title is-4">{{$t('TutorialsOrganizing')}}</p>
        </div>
      </div>
      <div class="content">
        {{$t('TutorialsOrganizingText')}}
      </div>
    </div>
  </div>
  <div class="card column is-one-third">
    <div class="card-image">
      <a href="https://youtu.be/iDvX3BWYadc">
      <b-image loading="lazy"
        custom-class="subcard-img bigger image-container"
        alt="Presentation image of the youtube video for the basics of pictalk"
        :srcset="require('@/assets/TutorialSharing.png').srcSet"
        :placeholder="require('@/assets/TutorialSharing.png').placeholder"
      />
      <img class="video-icon" :srcset="require('@/assets/video.png').srcSet">
      </a>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48">
            <b-image loading="lazy"
              :srcset="require('@/assets/small_logo.png').srcSet"
              :placeholder="require('@/assets/small_logo.png').placeholder"
            />
          </figure>
        </div>
        <div class="media-content">
          <p class="title is-4">{{$t('TutorialsSharing')}}</p>
        </div>
      </div>
      <div class="content">
        {{$t('TutorialsSharingText')}}
      </div>
    </div>
  </div>
  </div>
  </div>
</template>
<style scoped>
.subcard-img {
  border-radius: 12px;
}

.bigger {
  min-height: 30vmin;
}
.image-container {
  position: relative;
  display: inline-block;
}

.image-container img {
  display: block;
}
.video-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  width: 50px;
  opacity: 0.8;
}
.video-icon:hover {
  opacity: 1;
}
</style>