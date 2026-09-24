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

export type CollectibleKind = 'family'|'ribbon'|'trophy'|'star'|'whistle'|'heart'|'broken-heart'|'diploma'|'phone'|'suitcase'|'boat'|'camera'|'love'

export type GoalKind = 'home'|'ribbon-gate'|'podium'|'plane'|'gym-door'|'bat-signal'|'graduation'|'message'|'paris-heart'|'milan-arch'|'dock'|'cliff-arch'|'sunset-heart'

export type AvatarStyle = 'baby'|'gymnast'|'champion'|'tiger'|'catwoman'

export type LifeMemory = {
  id: string
  title: string
  caption: string
  photoKeys: string[]
  collectible: CollectibleKind
}

export type LifeLevel = {
  id: string
  order: number
  title: string
  subtitle: string
  year: string
  theme: LifeLevelTheme
  avatarStage: 'baby' | 'teen' | 'young-adult' | 'adult'
  avatarStyle: AvatarStyle
  worldLabel: string
  backgroundUrl: string
  backgroundCredit: string
  goalKind: GoalKind
  memories: LifeMemory[]
  obstacleCount: number
}

export const lifeLevels: LifeLevel[] = [
  {
    id: 'baby',
    order: 1,
    title: 'Player One Arrives',
    subtitle: '25 September 1999 · Mutuelleville, Tunis · the family immediately suspects genius',
    year: '1999',
    theme: 'tunis-baby',
    avatarStage: 'baby',
    avatarStyle: 'baby',
    worldLabel: 'MUTUELLEVILLE // TUNIS',
    backgroundUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Architecturetn%2004.JPG',
    backgroundCredit: 'Wikimedia Commons · Mutuelleville, Tunis',
    goalKind: 'home',
    obstacleCount: 3,
    memories: [
      {
        id: 'family',
        title: 'The Family Already Knew',
        caption: '25 September 1999. She arrives in Mutuelleville, Tunis. Mum, Dad, her older brother and sister look at the newest family member and reach the only reasonable conclusion: this one is going to be dangerously clever.',
        photoKeys: ['herChildhood1', 'herChildhood2'],
        collectible: 'family',
      },
    ],
  },
  {
    id: 'gymnast',
    order: 2,
    title: 'Rhythm Unlocked',
    subtitle: 'Ribbon, hoop, balance and a ridiculous amount of discipline',
    year: 'CHILDHOOD',
    theme: 'gymnastics',
    avatarStage: 'teen',
    avatarStyle: 'gymnast',
    worldLabel: 'GYMNASTICS HALL',
    backgroundUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Gymnastics%20room.webp',
    backgroundCredit: 'Wikimedia Commons · gymnastics training hall · CC0',
    goalKind: 'ribbon-gate',
    obstacleCount: 4,
    memories: [
      {
        id: 'first-gym',
        title: 'Ribbon. Hoop. Repeat.',
        caption: 'Training stops being a hobby and becomes part of who she is: ribbon work, hoops, balance, repetition and the very unfair ability to make difficult routines look effortless.',
        photoKeys: ['herTeen1'],
        collectible: 'ribbon',
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
    avatarStyle: 'champion',
    worldLabel: 'CHAMPIONSHIP ARENA',
    backgroundUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Yul%20Moldauer%20%E2%80%93%20Podium%20%E2%80%93%202026%20U.S.%20National%20Gymnastics%20Championships%2001.jpg',
    backgroundCredit: 'Wikimedia Commons · championship podium',
    goalKind: 'podium',
    obstacleCount: 5,
    memories: [
      {
        id: 'tunisian-champion',
        title: 'Tunisian Champion',
        caption: 'The Tunisian title arrives first. Podium unlocked. Confidence level: entirely justified.',
        photoKeys: ['herTeen1'],
        collectible: 'trophy',
      },
      {
        id: 'african-champion',
        title: 'African Champion',
        caption: 'Apparently being champion of Tunisia was merely the tutorial. Next stop: African champion.',
        photoKeys: ['herTeen1'],
        collectible: 'trophy',
      },
      {
        id: 'world-champion',
        title: 'World Champion',
        caption: 'Then comes the world stage. Another title, another trophy, and at this point the trophy shelf is filing a formal complaint.',
        photoKeys: ['herTeen1'],
        collectible: 'trophy',
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
    avatarStyle: 'tiger',
    worldLabel: 'UNITED STATES',
    backgroundUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/UCLA%20Campus%20on%20lawn.JPG',
    backgroundCredit: 'Wikimedia Commons · UCLA campus',
    goalKind: 'plane',
    obstacleCount: 5,
    memories: [
      {
        id: 'usa-year',
        title: 'She Kicks Ass Abroad',
        caption: 'A year in the USA: new country, new school, new people. She treats culture shock like another event she intends to win.',
        photoKeys: ['herAdult1'],
        collectible: 'star',
      },
      {
        id: 'military',
        title: 'Bonus Mission: Military Stuff',
        caption: 'And because normal exchange-year stories were apparently too easy, the side quests somehow include military-style drills and obstacle-course energy.',
        photoKeys: ['herAdult1'],
        collectible: 'star',
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
    avatarStyle: 'tiger',
    worldLabel: 'HER GYMNASTICS CLUB',
    backgroundUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Gymnastics%20practice%20facility.jpg',
    backgroundCredit: 'Wikimedia Commons · gymnastics practice facility · CC0',
    goalKind: 'gym-door',
    obstacleCount: 4,
    memories: [
      {
        id: 'club',
        title: 'She Builds Her Own Club',
        caption: 'Back in Tunisia she builds a gymnastics club and starts coaching young girls — turning years of discipline into something she can pass on.',
        photoKeys: ['herAdult1'],
        collectible: 'whistle',
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
    avatarStyle: 'catwoman',
    worldLabel: 'ROMANTIC COMEDY BOSS LEVEL',
    backgroundUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Architecturetn%2006.JPG',
    backgroundCredit: 'Wikimedia Commons · Tunis',
    goalKind: 'bat-signal',
    obstacleCount: 5,
    memories: [
      {
        id: 'meet',
        title: 'First Encounter',
        caption: 'Batman enters the plot. Dates happen. Chemistry is detected. Against all statistical expectations, things are going suspiciously well.',
        photoKeys: ['couple1'],
        collectible: 'heart',
      },
      {
        id: 'breakup',
        title: 'Then She Dumps Batman',
        caption: 'Then she breaks up with Batman. A bold tactical choice. Historians call it controversial. Batman calls it a temporary software bug. The appeal remains open.',
        photoKeys: ['couple1'],
        collectible: 'broken-heart',
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
    avatarStyle: 'catwoman',
    worldLabel: 'PARIS // WITH HER BEST FRIEND',
    backgroundUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Eiffel%20Tower%20during%20day%2001.jpg',
    backgroundCredit: 'Wikimedia Commons · Paris',
    goalKind: 'graduation',
    obstacleCount: 4,
    memories: [
      {
        id: 'graduation',
        title: 'Graduation Unlocked',
        caption: 'She graduates. Achievement unlocked: officially educated enough to ignore everyone’s advice professionally.',
        photoKeys: ['herAdult1'],
        collectible: 'diploma',
      },
      {
        id: 'paris-life',
        title: 'Paris Life',
        caption: 'Then Paris: a new city, a new home, and life with her best girl friend. The map gets bigger again.',
        photoKeys: ['herAdult1'],
        collectible: 'suitcase',
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
    avatarStyle: 'catwoman',
    worldLabel: 'PARIS // MIDNIGHT',
    backgroundUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Eiffel%20Tower%20at%20night.jpg',
    backgroundCredit: 'Wikimedia Commons · Paris at night',
    goalKind: 'message',
    obstacleCount: 3,
    memories: [
      {
        id: 'message',
        title: 'One Birthday Message',
        caption: '25 September 2025. One birthday message arrives from someone she definitely, absolutely, completely forgot about. The city lights up anyway. Round two begins.',
        photoKeys: ['couple1'],
        collectible: 'phone',
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
    avatarStyle: 'catwoman',
    worldLabel: 'PARIS // ROUND TWO',
    backgroundUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Eiffel%20Tower%20by%20night.jpg',
    backgroundCredit: 'Wikimedia Commons · Paris by night',
    goalKind: 'paris-heart',
    obstacleCount: 4,
    memories: [
      {
        id: 'union',
        title: 'The First Reunion',
        caption: 'December in Paris. First reunion. Very romantic, slightly chaotic, occasionally stupid — which turns out to be a pretty accurate preview of us.',
        photoKeys: ['couple1', 'couple2'],
        collectible: 'heart',
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
    avatarStyle: 'catwoman',
    worldLabel: 'MILANO',
    backgroundUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Milan%20Cathedral%20from%20Piazza%20del%20Duomo.jpg',
    backgroundCredit: 'Wikimedia Commons · Milano Duomo',
    goalKind: 'milan-arch',
    obstacleCount: 4,
    memories: [
      {
        id: 'milan-trip',
        title: 'First Trip',
        caption: 'Milan: our first trip together. Beautiful city, dangerous amount of confidence, and the beginning of a travel archive full of inside jokes.',
        photoKeys: ['couple1', 'couple2'],
        collectible: 'suitcase',
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
    avatarStyle: 'catwoman',
    worldLabel: 'LAGO DI COMO',
    backgroundUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lake%20Como%20view.jpg',
    backgroundCredit: 'Wikimedia Commons · Lake Como',
    goalKind: 'dock',
    obstacleCount: 4,
    memories: [
      {
        id: 'como-trip',
        title: 'Lake Como',
        caption: 'Lake Como: mountains, water, boats and two people behaving as if northern Italy had been constructed exclusively for their photos.',
        photoKeys: ['couple2'],
        collectible: 'boat',
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
    avatarStyle: 'catwoman',
    worldLabel: 'ÉTRETAT // FRANCE',
    backgroundUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cliffs%20of%20%C3%89tretat.jpg',
    backgroundCredit: 'Wikimedia Commons · Étretat cliffs',
    goalKind: 'cliff-arch',
    obstacleCount: 5,
    memories: [
      {
        id: 'etretat-trip',
        title: 'Étretat',
        caption: 'Étretat: wind, cliffs, France and scenery dramatic enough to match the relationship’s preferred production value.',
        photoKeys: ['couple2'],
        collectible: 'camera',
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
    avatarStyle: 'catwoman',
    worldLabel: 'MALLORCA',
    backgroundUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sunset%20mallorca.JPG',
    backgroundCredit: 'Wikimedia Commons · Mallorca sunset · public domain',
    goalKind: 'sunset-heart',
    obstacleCount: 4,
    memories: [
      {
        id: 'love-you',
        title: 'I Love You',
        caption: 'Mallorca. Somewhere between sea, sun and the trip, she says “I love you” for the first time. No checkpoint needed. Permanently unlocked.',
        photoKeys: ['finalPhoto'],
        collectible: 'love',
      },
    ],
  },
]
