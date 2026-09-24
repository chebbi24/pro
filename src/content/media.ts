const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

export const media = {
  photos: {
    rayanFace: asset('assets/photos/rayan-face.jpg'),

    chapter1Baby1: asset('assets/photos/baby.jpg'),
    chapter1Baby2: asset('assets/photos/baby-2.jpg'),

    chapter2TunisianChampion: asset('assets/photos/tunisian-champ.jpg'),
    chapter2AfricanChampion: asset('assets/photos/African_champ.jpg'),
    chapter2WorldChampion: asset('assets/photos/world-champ.jpg'),

    chapter3Military: asset('assets/photos/military.jpg'),

    chapter4Club: asset('assets/photos/club.jpg'),
    chapter4Greece: asset('assets/photos/greece.jpg'),

    chapter5Meet: asset('assets/photos/meet.JPG'),
    chapter5Breakup: asset('assets/photos/breakup.JPG'),

    chapter6Graduation: asset('assets/photos/graduation.jpg'),
    chapter6BestFriend: asset('assets/photos/bestfriend.jpg'),

    chapter7Message: asset('assets/photos/paris-r1.jpg'),

    chapter8Paris1: asset('assets/photos/paris-r1.jpg'),
    chapter8Paris2: asset('assets/photos/paris-r2.jpg'),
    chapter8Paris3: asset('assets/photos/paris-r3.jpg'),

    chapter9Milan1: asset('assets/photos/milan-1.jpg'),
    chapter9Milan2: asset('assets/photos/milan-2.jpg'),
    chapter9Milan3: asset('assets/photos/milan-3.jpg'),

    chapter10Como1: asset('assets/photos/como-1.jpg'),
    chapter10Como2: asset('assets/photos/como-2.jpg'),
    chapter10Como3: asset('assets/photos/como-3.JPG'),

    chapter11Etretat1: asset('assets/photos/etretat-1.jpg'),
    chapter11Etretat2: asset('assets/photos/etretat-2.JPG'),
    chapter11Etretat3: asset('assets/photos/etretat-3.JPG'),

    chapter12Mallorca1: asset('assets/photos/mallorca-1.JPG'),
    chapter12Mallorca2: asset('assets/photos/mallorca-2.JPG'),
    chapter12Mallorca3: asset('assets/photos/mallorca-3.JPG'),

    finalPhoto: asset('assets/photos/mallorca-3.JPG'),
  },
  audio: {
    theme: 'https://opengameart.org/sites/default/files/Relaxing_0.mp3', // CC0: Calm Loop by wipics (OpenGameArt)
  },
}

export type PhotoKey = keyof typeof media.photos
