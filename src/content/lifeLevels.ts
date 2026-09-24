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
    subtitle: '25 September 1999 · Mutuelleville, Tunis · the family immediately suspects genius',
    year: '1999',
    theme: 'tunis-baby',
    avatarStage: 'baby',
    worldLabel: 'MUTUELLEVILLE // TUNIS',
    obstacleCount: 3,
    memories: [
      {
        id: 'family',
        title: 'The Family Already Knew',
        caption: '25 September 1999. She arrives in Mutuelleville, Tunis. Mum, Dad, her older brother and sister look at the newest family member and reach the only reasonable conclusion: this one is going to be dangerously clever.',
        photoKeys: ['herChildhood1', 'herChildhood2'],
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
    worldLabel: 'GYMNASTICS HALL',
    obstacleCount: 4,
    memories: [
      {
        id: 'first-gym',
        title: 'Ribbon. Hoop. Repeat.',
        caption: 'Training stops being a hobby and becomes part of who she is: ribbon work, hoops, balance, repetition and the very unfair ability to make difficult routines look effortless.',
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
        caption: 'The Tunisian title arrives first. Podium unlocked. Confidence level: entirely justified.',
        photoKeys: ['herTeen1'],
      },
      {
        id: 'african-champion',
        title: 'African Champion',
        caption: 'Apparently being champion of Tunisia was merely the tutorial. Next stop: African champion.',
        photoKeys: ['herTeen1'],
      },
      {
        id: 'world-champion',
        title: 'World Champion',
        caption: 'Then comes the world stage. Another title, another trophy, and at this point the trophy shelf is filing a formal complaint.',
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
        caption: 'A year in the USA: new country, new school, new people. She treats culture shock like another event she intends to win.',
        photoKeys: ['herAdult1'],
      },
      {
        id: 'military',
        title: 'Bonus Mission: Military Stuff',
        caption: 'And because normal exchange-year stories were apparently too easy, the side quests somehow include military-style drills and obstacle-course energy.',
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
        caption: 'Back in Tunisia she builds a gymnastics club and starts coaching young girls — turning years of discipline into something she can pass on.',
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
        caption: 'Batman enters the plot. Dates happen. Chemistry is detected. Against all statistical expectations, things are going suspiciously well.',
        photoKeys: ['couple1'],
      },
      {
        id: 'breakup',
        title: 'Then She Dumps Batman',
        caption: 'Then she breaks up with Batman. A bold tactical choice. Historians call it controversial. Batman calls it a temporary software bug. The appeal remains open.',
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
        caption: 'She graduates. Achievement unlocked: officially educated enough to ignore everyone’s advice professionally.',
        photoKeys: ['herAdult1'],
      },
      {
        id: 'paris-life',
        title: 'Paris Life',
        caption: 'Then Paris: a new city, a new home, and life with her best girl friend. The map gets bigger again.',
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
        caption: '25 September 2025. One birthday message arrives from someone she definitely, absolutely, completely forgot about. The city lights up anyway. Round two begins.',
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
        caption: 'December in Paris. First reunion. Very romantic, slightly chaotic, occasionally stupid — which turns out to be a pretty accurate preview of us.',
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
        caption: 'Milan: our first trip together. Beautiful city, dangerous amount of confidence, and the beginning of a travel archive full of inside jokes.',
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
        caption: 'Lake Como: mountains, water, boats and two people behaving as if northern Italy had been constructed exclusively for their photos.',
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
        caption: 'Étretat: wind, cliffs, France and scenery dramatic enough to match the relationship’s preferred production value.',
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
        caption: 'Mallorca. Somewhere between sea, sun and the trip, she says “I love you” for the first time. No checkpoint needed. Permanently unlocked.',
        photoKeys: ['finalPhoto'],
      },
    ],
  },
]
