export type VignetteStyle = 'polaroid' | 'film' | 'evidence'

export type Chapter = {
  id: string
  year: string
  title: string
  subtitle: string
  body: string
  quote?: string
  images: string[]
  style: VignetteStyle
  heartId?: string
}

export const story = {
  entry: {
    eyebrow: 'GOTHAM // PRIVATE FREQUENCY',
    title: 'One message. One recipient.',
    note: 'Best experienced with sound.',
    button: 'ENTER EXPERIENCE',
  },
  encounter: {
    lines: [
      { speaker: 'Batman', text: "I've been looking for you." },
      { speaker: 'Catwoman', text: 'That sounds slightly concerning.' },
      { speaker: 'Batman', text: 'Depends. Are you seeing someone?' },
    ],
    yes: [
      { speaker: 'Batman', text: 'Good answer.' },
      { speaker: 'Catwoman', text: 'Why?' },
      { speaker: 'Batman', text: "You'll see." },
    ],
    no: [
      'Interesting. Try that again.',
      "I'm pretty sure that's not canon.",
      'Alternative timeline detected. Restoring correct universe...',
    ],
  },
  access: {
    system: 'WAYNE SYSTEMS',
    title: 'IDENTITY VERIFICATION REQUIRED',
    question: 'Who is the mysterious man?',
    acceptedNames: ['rayan', 'rayane'],
    wrong: ['Access denied.', 'Catwoman, you know this one.', "Hint: he's annoyingly handsome."],
    success: 'IDENTITY CONFIRMED',
  },
  reveal: {
    line: 'Surprise.',
    next: "Come on. There's somewhere I want to take you.",
  },
  drive: {
    destination: 'DESTINATION: THE BEGINNING',
  },
  splitPath: {
    lead: 'For years, two stories were happening separately.',
    left: 'HER STORY',
    right: 'HIS STORY',
    convergence: 'PLAYER TWO HAS ENTERED THE GAME',
    date: 'XX / XX / XXXX',
  },
  chapters: [
    {
      id: 'beginning',
      year: '2000',
      title: 'The Beginning',
      subtitle: 'A very important person enters the world.',
      body: 'Replace this with the story of her birthday, where she was born, and the first tiny details you love knowing about her.',
      quote: 'Every great story has a first frame.',
      images: ['herChildhood1'],
      style: 'polaroid',
      heartId: 'heart-1',
    },
    {
      id: 'little-her',
      year: '2006',
      title: 'Little Her',
      subtitle: 'Before the city knew her name.',
      body: 'Add a childhood memory here: a habit, a family story, a favorite place, or something that still feels exactly like her today.',
      quote: 'Some things never really change — thankfully.',
      images: ['herChildhood1', 'herChildhood2'],
      style: 'film',
    },
    {
      id: 'spark',
      year: '2012',
      title: 'Finding Her Spark',
      subtitle: 'The personality starts becoming impossible to miss.',
      body: 'Use this chapter for school years, hobbies, friendships, passions, or the first signs of the woman she would become.',
      images: ['herTeen1'],
      style: 'evidence',
      heartId: 'heart-2',
    },
    {
      id: 'bigger-world',
      year: '2017',
      title: 'A Bigger World',
      subtitle: 'New places. Bigger plans.',
      body: 'Put teenage or early-adult milestones here: travel, university dreams, first big decisions, or moments that changed her direction.',
      images: ['herTeen1', 'herAdult1'],
      style: 'polaroid',
    },
    {
      id: 'becoming',
      year: '2021',
      title: 'Becoming Herself',
      subtitle: 'Not a final version. Just a stronger one.',
      body: 'Describe the version of her you admire here — what she built, survived, learned, or decided for herself.',
      quote: 'Main character energy, long before I showed up.',
      images: ['herAdult1'],
      style: 'film',
      heartId: 'heart-3',
    },
    {
      id: 'before-us',
      year: 'BEFORE US',
      title: 'Before Us',
      subtitle: 'Two stories, still separate.',
      body: 'This chapter becomes the split-path sequence below. Replace this note with what life felt like before your paths crossed.',
      images: ['herAdult1'],
      style: 'evidence',
    },
    {
      id: 'player-two',
      year: 'XX / XX / XXXX',
      title: 'Player Two Has Entered the Game',
      subtitle: 'And suddenly the plot gets suspiciously better.',
      body: 'Tell the story of how you met. Keep the real details here: where, what you noticed first, and the part she probably remembers differently.',
      images: ['couple1'],
      style: 'polaroid',
      heartId: 'heart-4',
    },
    {
      id: 'our-story',
      year: 'US',
      title: 'Our Story So Far',
      subtitle: 'Trips, chaos, jokes, arguments, victories.',
      body: 'Use this chapter for your favorite relationship memories. Add more chapters if you want each trip or major moment to get its own stop.',
      images: ['couple1', 'couple2'],
      style: 'film',
    },
    {
      id: 'today',
      year: 'TODAY',
      title: 'Today',
      subtitle: 'The level we are standing in right now.',
      body: 'This is the final stop before the rooftop. Replace this with what this birthday means to you and what you hope she feels today.',
      images: ['finalPhoto'],
      style: 'evidence',
      heartId: 'heart-5',
    },
  ] as Chapter[],
  rooftop: {
    line: 'And somehow, every road led here.',
  },
  birthday: {
    title: 'Happy Birthday, Catwoman.',
    message:
      "Somewhere between all the chaos, late nights, ridiculous conversations and the moments I wish I could replay forever, you became my favorite part of the story. This little world is only a tiny version of how special you are to me. Happy birthday — and here's to everything still waiting for us.",
  },
  gift: {
    intro: "But this isn't the end of the level.",
    acquired: 'LEGENDARY ITEM ACQUIRED',
    title: '🎁 Mystery Birthday Surprise',
    rarity: '❤️❤️❤️❤️❤️',
    player: 'Catwoman',
    companion: 'Rayan',
    reveal: 'Your real surprise goes here. Replace this text in src/content/story.ts.',
  },
  finale: {
    lines: ['HAPPY BIRTHDAY', 'CATWOMAN', 'PLAYER 2 FOREVER'],
    credits: ['A GAME BY RAYAN', 'STARRING CATWOMAN', 'BASED ON A TRUE STORY', 'TO BE CONTINUED...'],
    continueQuestion: 'CONTINUE?',
    continueAnswer: "Good. I was hoping you'd say that. ❤️",
  },
}
