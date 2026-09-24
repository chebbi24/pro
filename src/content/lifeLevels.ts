export type LifeLevelTheme =
  | 'tunis-baby'
  | 'gymnastics'
  | 'champion'
  | 'usa'
  | 'coach'
  | 'meet-breakup'
  | 'paris'
  | 'birthday-reunion'
  | 'paris-romance'
  | 'milan'
  | 'como'
  | 'etretat'
  | 'mallorca'

export type LifeMemory = {
  id: string
  title: string
  caption: string
  photoKeys: string[]
}

export type LifeLevel = {
  id: string
  order: number
  title: string
  subtitle: string
  year: string
  theme: LifeLevelTheme
  avatarStage: 'baby' | 'teen' | 'young-adult' | 'adult'
  worldLabel: string
  memories: LifeMemory[]
  obstacleCount: number
}

export const lifeLevels: LifeLevel[] = [
  {
    id: 'baby',
    order: 1,
    title: 'Player One Arrives',
    subtitle: '25 September 1999 · Mutuelleville, Tunis',
    year: '1999',
    theme: 'tunis-baby',
    avatarStage: 'baby',
    worldLabel: 'MUTUELLEVILLE // TUNIS',
    obstacleCount: 3,
    memories: [
      {
        id: 'family',
        title: 'The Family Already Knew',
        caption: 'She arrives with Mum, Dad, her older brother and sister already convinced this tiny player is going to be trouble — the genius kind.',
        photoKeys: ['herChildhood1', 'herChildhood2'],
      },
    ],
  },
  {
    id: 'gymnast',
    order: 2,
    title: 'Rhythm Unlocked',
    subtitle: 'She discovers rhythmic gymnastics',
    year: 'CHILDHOOD',
    theme: 'gymnastics',
    avatarStage: 'teen',
    worldLabel: 'GYMNASTICS HALL',
    obstacleCount: 4,
    memories: [
      {
        id: 'first-gym',
        title: 'Ribbon. Hoop. Repeat.',
        caption: 'What starts as training quickly becomes discipline, obsession, grace and an unreasonable ability to make difficult things look easy.',
        photoKeys: ['herTeen1'],
      },
    ],
  },
  {
    id: 'champion',
    order: 3,
    title: 'Champion Mode',
    subtitle: 'Tunisia → Africa → The world',
    year: 'COMPETITION ERA',
    theme: 'champion',
    avatarStage: 'teen',
    worldLabel: 'CHAMPIONSHIP ARENA',
    obstacleCount: 5,
    memories: [
      {
        id: 'tunisian-champion',
        title: 'Tunisian Champion',
        caption: 'First podium unlocked.',
        photoKeys: ['herTeen1'],
      },
      {
        id: 'african-champion',
        title: 'African Champion',
        caption: 'Apparently national trophies were not enough.',
        photoKeys: ['herTeen1'],
      },
      {
        id: 'world-champion',
        title: 'World Champion',
        caption: 'The trophy shelf is now officially getting ridiculous.',
        photoKeys: ['herTeen1'],
      },
    ],
  },
  {
    id: 'usa',
    order: 4,
    title: 'America DLC',
    subtitle: 'One year in the USA',
    year: 'USA',
    theme: 'usa',
    avatarStage: 'young-adult',
    worldLabel: 'UNITED STATES',
    obstacleCount: 5,
    memories: [
      {
        id: 'usa-year',
        title: 'She Kicks Ass Abroad',
        caption: 'New country, new people, new challenges. Naturally she adapts immediately.',
        photoKeys: ['herAdult1'],
      },
      {
        id: 'military',
        title: 'Bonus Mission: Military Stuff',
        caption: 'For reasons that will absolutely need photographic evidence later, the side quest somehow includes military-style training.',
        photoKeys: ['herAdult1'],
      },
    ],
  },
  {
    id: 'coach',
    order: 5,
    title: 'Coach Mode',
    subtitle: 'Back in Tunisia',
    year: 'TUNISIA',
    theme: 'coach',
    avatarStage: 'young-adult',
    worldLabel: 'HER GYMNASTICS CLUB',
    obstacleCount: 4,
    memories: [
      {
        id: 'club',
        title: 'She Builds Her Own Club',
        caption: 'From athlete to coach: she starts teaching the next generation of young gymnasts.',
        photoKeys: ['herAdult1'],
      },
    ],
  },
  {
    id: 'meet-breakup',
    order: 6,
    title: 'A Wild Batman Appears',
    subtitle: 'She meets Rayan',
    year: 'US // ROUND ONE',
    theme: 'meet-breakup',
    avatarStage: 'young-adult',
    worldLabel: 'ROMANTIC COMEDY BOSS LEVEL',
    obstacleCount: 5,
    memories: [
      {
        id: 'meet',
        title: 'First Encounter',
        caption: 'We meet. We go out. Things are suspiciously promising.',
        photoKeys: ['couple1'],
      },
      {
        id: 'breakup',
        title: 'Then She Dumps Batman',
        caption: 'A historically questionable strategic decision. The judges remain divided. Batman files an appeal.',
        photoKeys: ['couple1'],
      },
    ],
  },
  {
    id: 'paris',
    order: 7,
    title: 'Paris Chapter',
    subtitle: 'Graduation and a new city',
    year: 'PARIS',
    theme: 'paris',
    avatarStage: 'adult',
    worldLabel: 'PARIS // WITH HER BEST FRIEND',
    obstacleCount: 4,
    memories: [
      {
        id: 'graduation',
        title: 'Graduation Unlocked',
        caption: 'One era closes. Another starts.',
        photoKeys: ['herAdult1'],
      },
      {
        id: 'paris-life',
        title: 'Paris Life',
        caption: 'She moves to Paris with her best friend and starts a new chapter.',
        photoKeys: ['herAdult1'],
      },
    ],
  },
  {
    id: 'birthday-reunion',
    order: 8,
    title: 'The Message',
    subtitle: '25 September 2025',
    year: '25.09.2025',
    theme: 'birthday-reunion',
    avatarStage: 'adult',
    worldLabel: 'PARIS // MIDNIGHT',
    obstacleCount: 3,
    memories: [
      {
        id: 'message',
        title: 'One Birthday Message',
        caption: 'One night, on her birthday, a message arrives. Her world gets a little brighter. The story restarts.',
        photoKeys: ['couple1'],
      },
    ],
  },
  {
    id: 'paris-romance',
    order: 9,
    title: 'Paris Reunion',
    subtitle: 'December 2025',
    year: 'DEC 2025',
    theme: 'paris-romance',
    avatarStage: 'adult',
    worldLabel: 'PARIS // ROUND TWO',
    obstacleCount: 4,
    memories: [
      {
        id: 'union',
        title: 'The First Reunion',
        caption: 'Romantic. Chaotic. Slightly ridiculous. Exactly us.',
        photoKeys: ['couple1', 'couple2'],
      },
    ],
  },
  {
    id: 'milan',
    order: 10,
    title: 'Milan',
    subtitle: 'First trip together',
    year: 'TRIP 01',
    theme: 'milan',
    avatarStage: 'adult',
    worldLabel: 'MILANO',
    obstacleCount: 4,
    memories: [
      {
        id: 'milan-trip',
        title: 'First Trip',
        caption: 'New city, first real trip together, and enough material for several inside jokes.',
        photoKeys: ['couple1', 'couple2'],
      },
    ],
  },
  {
    id: 'como',
    order: 11,
    title: 'Lake Como',
    subtitle: 'A suspiciously cinematic level',
    year: 'TRIP 02',
    theme: 'como',
    avatarStage: 'adult',
    worldLabel: 'LAGO DI COMO',
    obstacleCount: 4,
    memories: [
      {
        id: 'como-trip',
        title: 'Lake Como',
        caption: 'Mountains, water, romance, and two people acting like the scenery was made specifically for them.',
        photoKeys: ['couple2'],
      },
    ],
  },
  {
    id: 'etretat',
    order: 12,
    title: 'Étretat',
    subtitle: 'Cliffs, wind and France',
    year: 'TRIP 03',
    theme: 'etretat',
    avatarStage: 'adult',
    worldLabel: 'ÉTRETAT // FRANCE',
    obstacleCount: 5,
    memories: [
      {
        id: 'etretat-trip',
        title: 'Étretat',
        caption: 'A level with dramatic cliffs because apparently normal backgrounds were no longer enough.',
        photoKeys: ['couple2'],
      },
    ],
  },
  {
    id: 'mallorca',
    order: 13,
    title: 'Mallorca',
    subtitle: 'The words finally arrive',
    year: 'TRIP 04',
    theme: 'mallorca',
    avatarStage: 'adult',
    worldLabel: 'MALLORCA',
    obstacleCount: 4,
    memories: [
      {
        id: 'love-you',
        title: 'I Love You',
        caption: 'Somewhere in Mallorca, she says it for the first time. Achievement permanently unlocked.',
        photoKeys: ['finalPhoto'],
      },
    ],
  },
]
