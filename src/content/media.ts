const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

export const media = {
  photos: {
    rayanFace: asset('assets/photos/rayan-face-placeholder.svg'),
    herChildhood1: asset('assets/photos/her-childhood-1.svg'),
    herChildhood2: asset('assets/photos/her-childhood-2.svg'),
    herTeen1: asset('assets/photos/her-teen-1.svg'),
    herAdult1: asset('assets/photos/her-adult-1.svg'),
    couple1: asset('assets/photos/couple-1.svg'),
    couple2: asset('assets/photos/couple-2.svg'),
    finalPhoto: asset('assets/photos/final-photo.svg'),
  },
  audio: {
    theme: 'https://opengameart.org/sites/default/files/Relaxing_0.mp3', // CC0: Calm Loop by wipics (OpenGameArt)
  },
}

export type PhotoKey = keyof typeof media.photos
