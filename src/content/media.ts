const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

export const media = {
  photos: {
    rayanFace: asset('assets/photos/rayan-face.jpg'),

    chapter1Baby1: asset('assets/photos/chapter-01-baby-1.jpg'),
    chapter1Baby2: asset('assets/photos/chapter-01-baby-2.jpg'),

    chapter2Ribbon: asset('assets/photos/chapter-02-ribbon.jpg'),
    chapter2Hoop: asset('assets/photos/chapter-02-hoop.jpg'),
    chapter2Ball: asset('assets/photos/chapter-02-ball.jpg'),
    chapter2Clubs: asset('assets/photos/chapter-02-clubs.jpg'),
    chapter2TunisianChampion: asset('assets/photos/chapter-02-tunisian-champion.jpg'),
    chapter2AfricanChampion: asset('assets/photos/chapter-02-african-champion.jpg'),
    chapter2WorldChampion: asset('assets/photos/chapter-02-world-champion.jpg'),

    chapter3USA: asset('assets/photos/chapter-03-usa.jpg'),
    chapter3Military: asset('assets/photos/chapter-03-military.jpg'),

    chapter4Club: asset('assets/photos/chapter-04-club.jpg'),
    chapter4Greece: asset('assets/photos/chapter-04-greece.jpg'),

    chapter5Meet: asset('assets/photos/chapter-05-meet.jpg'),
    chapter5Breakup: asset('assets/photos/chapter-05-breakup.jpg'),

    chapter6Graduation: asset('assets/photos/chapter-06-graduation.jpg'),
    chapter6BestFriend: asset('assets/photos/chapter-06-best-friend.jpg'),

    chapter7Message: asset('assets/photos/chapter-07-message.jpg'),

    chapter8Paris1: asset('assets/photos/chapter-08-paris-1.jpg'),
    chapter8Paris2: asset('assets/photos/chapter-08-paris-2.jpg'),
    chapter8Paris3: asset('assets/photos/chapter-08-paris-3.jpg'),

    chapter9Milan1: asset('assets/photos/chapter-09-milan-1.jpg'),
    chapter9Milan2: asset('assets/photos/chapter-09-milan-2.jpg'),
    chapter9Milan3: asset('assets/photos/chapter-09-milan-3.jpg'),

    chapter10Como1: asset('assets/photos/chapter-10-como-1.jpg'),
    chapter10Como2: asset('assets/photos/chapter-10-como-2.jpg'),
    chapter10Como3: asset('assets/photos/chapter-10-como-3.jpg'),

    chapter11Etretat1: asset('assets/photos/chapter-11-etretat-1.jpg'),
    chapter11Etretat2: asset('assets/photos/chapter-11-etretat-2.jpg'),
    chapter11Etretat3: asset('assets/photos/chapter-11-etretat-3.jpg'),

    chapter12Mallorca1: asset('assets/photos/chapter-12-mallorca-1.jpg'),
    chapter12Mallorca2: asset('assets/photos/chapter-12-mallorca-2.jpg'),
    chapter12Mallorca3: asset('assets/photos/chapter-12-mallorca-3.jpg'),

    finalPhoto: asset('assets/photos/final-photo.jpg'),
  },
  audio: {
    theme: 'https://opengameart.org/sites/default/files/Relaxing_0.mp3', // CC0: Calm Loop by wipics (OpenGameArt)
  },
}

export type PhotoKey = keyof typeof media.photos
