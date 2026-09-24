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

export type CollectibleKind = 'family'|'ribbon'|'hoop'|'ball'|'clubs'|'trophy'|'star'|'whistle'|'heart'|'broken-heart'|'diploma'|'graduation-cap'|'greece'|'friend'|'phone'|'suitcase'|'boat'|'camera'|'love'

export type GoalKind = 'home'|'ribbon-gate'|'podium'|'plane'|'gym-door'|'bat-signal'|'graduation'|'message'|'paris-heart'|'milan-arch'|'dock'|'cliff-arch'|'sunset-heart'

export type AvatarStyle = 'baby'|'gymnast'|'champion'|'tiger'|'catwoman'|'black-dress'|'boat'

export type LifeMemory = {
  id: string
  title: string
  caption: string
  photoKeys: string[]
  collectible: CollectibleKind
}

export type LifeMilestone = { x: number; text: string }

export type LifeLevel = {
  id: string
  order: number
  title: string
  subtitle: string
  mode: 'platform' | 'cinematic'
  milestones: LifeMilestone[]
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

const localBackground = (file: string) => `${import.meta.env.BASE_URL}backgrounds/${file}`

export const lifeLevels: LifeLevel[] = [
  {
    id: 'baby',
    mode: 'cinematic',
    milestones: [],
    order: 1,
    title: 'Player One Arrives',
    subtitle: '25 September 1999 · Mutuelleville, Tunis · the family immediately suspects genius',
    year: '1999',
    theme: 'tunis-baby',
    avatarStage: 'baby',
    avatarStyle: 'baby',
    worldLabel: 'MUTUELLEVILLE // TUNIS',
    backgroundUrl: localBackground('baby.jpg'),
    backgroundCredit: '',
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
    mode: 'platform',
    milestones: [
      { x: 250, text: 'Ribbon unlocked' },
      { x: 500, text: 'Hoop unlocked' },
      { x: 745, text: 'Ball unlocked' },
      { x: 955, text: 'Clubs unlocked' },
      { x: 1180, text: 'Tunisian Champion' },
      { x: 1390, text: 'African Champion' },
      { x: 1570, text: 'World Champion' },
    ],
    order: 2,
    title: 'From Rhythm to Champion',
    subtitle: 'First she masters the apparatus. Then she starts collecting titles.',
    year: 'GYMNASTICS ERA',
    theme: 'gymnastics',
    avatarStage: 'teen',
    avatarStyle: 'gymnast',
    worldLabel: 'RHYTHMIC GYMNASTICS // APPARATUS → TITLES',
    backgroundUrl: localBackground('gymnastics.png'),
    backgroundCredit: '',
    goalKind: 'podium',
    obstacleCount: 5,
    memories: [
      {
        id: 'ribbon',
        title: 'Ribbon Unlocked',
        caption: 'The first apparatus becomes part of her rhythm: control, timing and precision.',
        photoKeys: ['herTeen1'],
        collectible: 'ribbon',
      },
      {
        id: 'hoop',
        title: 'Hoop Unlocked',
        caption: 'Next comes the hoop — throws, catches and movement without losing the rhythm.',
        photoKeys: ['herTeen1'],
        collectible: 'hoop',
      },
      {
        id: 'ball',
        title: 'Ball Unlocked',
        caption: 'Then the ball: balance, fluidity and control.',
        photoKeys: ['herTeen1'],
        collectible: 'ball',
      },
      {
        id: 'clubs',
        title: 'Clubs Unlocked',
        caption: 'The clubs complete the apparatus progression. Training mode is officially serious now.',
        photoKeys: ['herTeen1'],
        collectible: 'clubs',
      },
      {
        id: 'tunisian-champion',
        title: 'Tunisian Champion',
        caption: 'After mastering the apparatus, the first major title arrives: champion of Tunisia.',
        photoKeys: ['herTeen1'],
        collectible: 'trophy',
      },
      {
        id: 'african-champion',
        title: 'African Champion',
        caption: 'The national stage was only the beginning. Amouna becomes African champion.',
        photoKeys: ['herTeen1'],
        collectible: 'trophy',
      },
      {
        id: 'world-champion',
        title: 'World Champion',
        caption: 'Then comes the world stage. The training journey ends with the biggest title.',
        photoKeys: ['herTeen1'],
        collectible: 'trophy',
      },
    ],
  },
  {
    id: 'usa',
    mode: 'platform',
    milestones: [
      { x: 380, text: 'Exchange year begins' },
      { x: 900, text: 'USA mode: adapted' },
      { x: 1280, text: 'Military side quest unlocked' },
    ],
    order: 3,
    title: 'America DLC',
    subtitle: 'One year in the USA',
    year: 'USA',
    theme: 'usa',
    avatarStage: 'young-adult',
    avatarStyle: 'black-dress',
    worldLabel: 'UNITED STATES',
    backgroundUrl: localBackground('usa.png'),
    backgroundCredit: '',
    goalKind: 'plane',
    obstacleCount: 0,
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
    mode: 'platform',
    milestones: [
      { x: 420, text: 'Back in Tunisia' },
      { x: 900, text: 'Club created' },
      { x: 1320, text: 'Coach mode: ON' },
    ],
    order: 4,
    title: 'Coach Mode',
    subtitle: 'Back in Tunisia',
    year: 'TUNISIA',
    theme: 'coach',
    avatarStage: 'young-adult',
    avatarStyle: 'tiger',
    worldLabel: 'HER GYMNASTICS CLUB',
    backgroundUrl: localBackground('coach.png'),
    backgroundCredit: '',
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
      {
        id: 'greece-team',
        title: 'She Took the Team to Greece',
        caption: 'Coach mode goes international: she takes the team to Greece and turns the club into another chapter of the adventure.',
        photoKeys: ['herAdult1'],
        collectible: 'greece',
      },
    ],
  },
  {
    id: 'meet-breakup',
    mode: 'platform',
    milestones: [
      { x: 420, text: 'Batman enters the plot' },
      { x: 780, text: 'Chemistry detected' },
      { x: 1110, text: 'Breakup detected' },
      { x: 1390, text: 'Batman filed an appeal' },
    ],
    order: 5,
    title: 'A Wild Batman Appears',
    subtitle: 'She meets Rayan',
    year: 'US // ROUND ONE',
    theme: 'meet-breakup',
    avatarStage: 'young-adult',
    avatarStyle: 'catwoman',
    worldLabel: 'ROMANTIC COMEDY BOSS LEVEL',
    backgroundUrl: localBackground('meet-breakup.png'),
    backgroundCredit: '',
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
    mode: 'platform',
    milestones: [
      { x: 460, text: 'Graduated' },
      { x: 900, text: 'Paris unlocked' },
      { x: 1320, text: 'New city · new chapter' },
    ],
    order: 6,
    title: 'Paris Chapter',
    subtitle: 'Graduation and a new city',
    year: 'PARIS',
    theme: 'paris',
    avatarStage: 'adult',
    avatarStyle: 'catwoman',
    worldLabel: 'PARIS // WITH HER BEST FRIEND',
    backgroundUrl: localBackground('paris.png'),
    backgroundCredit: '',
    goalKind: 'graduation',
    obstacleCount: 4,
    memories: [
      {
        id: 'graduation',
        title: 'Graduation Unlocked',
        caption: 'She graduates. Achievement unlocked: officially educated enough to ignore everyone’s advice professionally.',
        photoKeys: ['herAdult1'],
        collectible: 'graduation-cap',
      },
      {
        id: 'paris-life',
        title: 'Paris Life',
        caption: 'Then Paris: a new city, a new home, and life with her best girl friend. The map gets bigger again.',
        photoKeys: ['herAdult1'],
        collectible: 'friend',
      },
    ],
  },
  {
    id: 'birthday-reunion',
    mode: 'cinematic',
    milestones: [],
    order: 7,
    title: 'The Message',
    subtitle: '25 September 2025',
    year: '25.09.2025',
    theme: 'birthday-reunion',
    avatarStage: 'adult',
    avatarStyle: 'catwoman',
    worldLabel: 'PARIS // MIDNIGHT',
    backgroundUrl: localBackground('birthday-reunion.jpg'),
    backgroundCredit: '',
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
    mode: 'platform',
    milestones: [
      { x: 560, text: 'December 2025' },
      { x: 980, text: 'Round two begins' },
      { x: 1360, text: 'No refunds' },
    ],
    order: 8,
    title: 'Paris Reunion',
    subtitle: 'December 2025',
    year: 'DEC 2025',
    theme: 'paris-romance',
    avatarStage: 'adult',
    avatarStyle: 'catwoman',
    worldLabel: 'PARIS // ROUND TWO',
    backgroundUrl: localBackground('paris-romance.png'),
    backgroundCredit: '',
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
    mode: 'platform',
    milestones: [
      { x: 520, text: 'First trip together' },
      { x: 1120, text: 'Milano unlocked' },
    ],
    order: 9,
    title: 'Milan',
    subtitle: 'First trip together',
    year: 'TRIP 01',
    theme: 'milan',
    avatarStage: 'adult',
    avatarStyle: 'catwoman',
    worldLabel: 'MILANO',
    backgroundUrl: localBackground('milan.png'),
    backgroundCredit: '',
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
    mode: 'platform',
    milestones: [
      { x: 520, text: 'Lake Como' },
      { x: 1120, text: 'Cinematic scenery unlocked' },
    ],
    order: 10,
    title: 'Lake Como',
    subtitle: 'A suspiciously cinematic level',
    year: 'TRIP 02',
    theme: 'como',
    avatarStage: 'adult',
    avatarStyle: 'catwoman',
    worldLabel: 'LAGO DI COMO',
    backgroundUrl: localBackground('como.png'),
    backgroundCredit: '',
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
    mode: 'platform',
    milestones: [
      { x: 520, text: 'Étretat' },
      { x: 1120, text: 'Wind level: aggressive' },
    ],
    order: 11,
    title: 'Étretat',
    subtitle: 'Cliffs, wind and France',
    year: 'TRIP 03',
    theme: 'etretat',
    avatarStage: 'adult',
    avatarStyle: 'boat',
    worldLabel: 'ÉTRETAT // FRANCE',
    backgroundUrl: localBackground('etretat.png'),
    backgroundCredit: '',
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
    mode: 'platform',
    milestones: [
      { x: 520, text: 'Mallorca' },
      { x: 1120, text: 'Something important is coming...' },
    ],
    order: 12,
    title: 'Mallorca',
    subtitle: 'The words finally arrive',
    year: 'TRIP 04',
    theme: 'mallorca',
    avatarStage: 'adult',
    avatarStyle: 'boat',
    worldLabel: 'MALLORCA',
    backgroundUrl: localBackground('mallorca.png'),
    backgroundCredit: '',
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
