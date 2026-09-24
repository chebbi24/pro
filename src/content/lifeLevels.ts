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
    title: 'Amouna',
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
        photoKeys: ['chapter1Baby1', 'chapter1Baby2'],
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
        photoKeys: ['chapter2Ribbon'],
        collectible: 'ribbon',
      },
      {
        id: 'hoop',
        title: 'Hoop Unlocked',
        caption: 'Next comes the hoop — throws, catches and movement without losing the rhythm.',
        photoKeys: ['chapter2Hoop'],
        collectible: 'hoop',
      },
      {
        id: 'ball',
        title: 'Ball Unlocked',
        caption: 'Then the ball: balance, fluidity and control.',
        photoKeys: ['chapter2Ball'],
        collectible: 'ball',
      },
      {
        id: 'clubs',
        title: 'Clubs Unlocked',
        caption: 'The clubs complete the apparatus progression. Training mode is officially serious now.',
        photoKeys: ['chapter2Clubs'],
        collectible: 'clubs',
      },
      {
        id: 'tunisian-champion',
        title: 'Tunisian Champion',
        caption: 'After mastering the apparatus, the first major title arrives: champion of Tunisia.',
        photoKeys: ['chapter2TunisianChampion'],
        collectible: 'trophy',
      },
      {
        id: 'african-champion',
        title: 'African Champion',
        caption: 'The national stage was only the beginning. Amouna becomes African champion.',
        photoKeys: ['chapter2AfricanChampion'],
        collectible: 'trophy',
      },
      {
        id: 'world-champion',
        title: 'World Champion',
        caption: 'Then comes the world stage. The training journey ends with the biggest title.',
        photoKeys: ['chapter2WorldChampion'],
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
    title: 'Amerika chikabika',
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
        title: 'Tnik fel gwerra',
        caption: 'A year in the USA: new country, new school, new people. She treats culture shock like another event she intends to win.',
        photoKeys: ['chapter3USA'],
        collectible: 'star',
      },
      {
        id: 'military',
        title: 'Bonus Mission: Amouna mon general',
        caption: 'And because normal exchange-year stories were apparently too easy, the side quests somehow include military-style drills and obstacle-course energy.',
        photoKeys: ['chapter3Military'],
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
        photoKeys: ['chapter4Club'],
        collectible: 'whistle',
      },
      {
        id: 'greece-team',
        title: 'She Took the Team to Greece',
        caption: 'Coach mode goes international: she takes the team to Greece and turns the club into another chapter of the adventure.',
        photoKeys: ['chapter4Greece'],
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
      { x: 1390, text: 'Batman kalem mou7ami' },
    ],
    order: 5,
    title: 'A Wild Batman Appears',
    subtitle: 'She meets him',
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
        photoKeys: ['chapter5Meet'],
        collectible: 'heart',
      },
      {
        id: 'breakup',
        title: 'Then She Dumps Batman',
        caption: 'Then she breaks up with Batman. A bold tactical choice. Historians call it controversial. Batman calls it a temporary software bug. The appeal remains open.',
        photoKeys: ['chapter5Breakup'],
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
    worldLabel: 'PARIS // WITH RAHOUMA',
    backgroundUrl: localBackground('paris.png'),
    backgroundCredit: '',
    goalKind: 'graduation',
    obstacleCount: 4,
    memories: [
      {
        id: 'graduation',
        title: 'Graduation Unlocked',
        caption: 'She graduates. Achievement unlocked: officially educated enough to ignore everyone’s advice professionally.',
        photoKeys: ['chapter6Graduation'],
        collectible: 'graduation-cap',
      },
      {
        id: 'paris-life',
        title: 'Paris Life',
        caption: 'Then Paris: a new city, a new home, and life with her RAHOUMA. The map gets bigger again.',
        photoKeys: ['chapter6BestFriend'],
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
        photoKeys: ['chapter7Message'],
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
        photoKeys: ['chapter8Paris1'],
        collectible: 'heart',
      },
      {
        id: 'paris-together',
        title: 'Paris Together',
        caption: 'A second Paris memory from the reunion — the city becomes part of the story instead of just the background.',
        photoKeys: ['chapter8Paris2'],
        collectible: 'camera',
      },
      {
        id: 'paris-night',
        title: 'Paris After Dark',
        caption: 'One more night in Paris — walking the city together with round two fully underway.',
        photoKeys: ['chapter8Paris3'],
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
        photoKeys: ['chapter9Milan1'],
        collectible: 'suitcase',
      },
      {
        id: 'milan-memory',
        title: 'Milano Memory',
        caption: 'Another moment from Milan — one more photo from the trip that started their travel archive together.',
        photoKeys: ['chapter9Milan2'],
        collectible: 'camera',
      },
      {
        id: 'milan-together',
        title: 'Milan Together',
        caption: 'A third Milan moment — another stop, another photo, and more of the trip becoming part of their shared story.',
        photoKeys: ['chapter9Milan3'],
        collectible: 'heart',
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
    avatarStyle: 'boat',
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
        photoKeys: ['chapter10Como1'],
        collectible: 'boat',
      },
      {
        id: 'como-water',
        title: 'Out on the Water',
        caption: 'Another memory from Lake Como — the two of them out on the water with the mountains around them.',
        photoKeys: ['chapter10Como2'],
        collectible: 'camera',
      },
      {
        id: 'como-together',
        title: 'Lake Como Together',
        caption: 'A third Lake Como memory — still on the water, still surrounded by impossible scenery, still together.',
        photoKeys: ['chapter10Como3'],
        collectible: 'heart',
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
    avatarStyle: 'catwoman',
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
        photoKeys: ['chapter11Etretat1'],
        collectible: 'camera',
      },
      {
        id: 'etretat-cliffs',
        title: 'Cliffside Together',
        caption: 'A second memory from Étretat — the cliffs, the sea and the two of them taking in the view together.',
        photoKeys: ['chapter11Etretat2'],
        collectible: 'heart',
      },
      {
        id: 'etretat-walk',
        title: 'Along the Coast',
        caption: 'One more Étretat memory — walking the coast together with the cliffs and sea beside them.',
        photoKeys: ['chapter11Etretat3'],
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
        id: 'mallorca-sunset',
        title: 'Mallorca',
        caption: 'One more Mallorca memory before the final moment.',
        photoKeys: ['chapter12Mallorca1'],
        collectible: 'camera',
      },
      {
        id: 'mallorca-day',
        title: 'Mallorca Together',
        caption: 'Another Mallorca memory before the final moment — one more piece of the trip they get to keep.',
        photoKeys: ['chapter12Mallorca2'],
        collectible: 'camera',
      },
      {
        id: 'love-you',
        title: 'I Love You',
        caption: 'Mallorca. Somewhere between sea, sun and the trip(fi zok lpiscine), she says “I love you” for the first time. No checkpoint needed. Permanently unlocked.',
        photoKeys: ['chapter12Mallorca3'],
        collectible: 'love',
      },
    ],
  },
]
