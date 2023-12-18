export class SoundHelper {
  static isIpadOS() {
    console.log(navigator.userAgent)
    return navigator.userAgent.includes('iPad');
  }

  static playSound(soundFilePath) {
    if (this.isIpadOS()) return;
    let audio = new Audio(require(`~/assets/sounds/${soundFilePath}`).default);
    audio.play();
  }

  static playNotification() {
    this.playSound('notification.mp3');
  }

  static playAccountCreation() {
    this.playSound('account-creation.mp3');
  }

  static playPictogramDelete() {
    this.playSound('delete.mp3');
  }

  static playError() {
    this.playSound('error.mp3');
  }

  static playSentenceCopy() {
    this.playSound('copy.mp3');
  }

  static playSentenceReturn() {
    this.playSound('pictobar-return.mp3');
  }

  static playSentenceErase() {
    this.playSound('pictobar-erase.mp3');
  }

  static playPictogramCreate() {
    this.playSound('creation.mp3');
  }
}
