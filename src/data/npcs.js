// NPC definitions. Each NPC has a sprite, fixed position, and dialog branches.
// A dialog branch's `when` is evaluated against the game state; the first
// matching branch (top to bottom) plays.
//
// `onEnd` runs when the dialog ends; it receives the game object and can:
//   - set flags:    game.flags['x'] = true
//   - give items:   game.give('carrot', 1)
//   - take items:   game.take('invitations', 1)
//   - trigger:      game.trigger('event_name')

export const NPCS = {
  hazel: {
    sprite: 'hazel',
    map: 'hazels-burrow',
    x: 3, y: 3,
    dir: 'down',
    name: 'Grandma Hazel',
    dialog: [
      {
        when: (s) => !s.flags.intro_done,
        lines: [
          'Good morning, sleepyhead.',
          "Mayor Burrows came by. He needs your help.",
          'Off you go now. The Festival is tonight!',
        ],
        onEnd: (g) => { g.flags.intro_done = true; },
      },
      {
        when: (s) => !s.flags.festival_ready,
        lines: [
          'Mind those errands, dear.',
          "And don't dawdle near the forest path.",
        ],
      },
      {
        when: (s) => true,
        lines: [
          'You make me proud, little one.',
          'Hurry to the Festival.',
        ],
      },
    ],
  },

  mayor: {
    sprite: 'mayor',
    map: 'mayors-hall',
    x: 5, y: 3,
    dir: 'down',
    name: 'Mayor Burrows',
    dialog: [
      {
        when: (s) => !s.flags.mayor_quest_started,
        lines: [
          'Noddy! Just the bunny.',
          'The Harvest Festival is tonight!',
          "I haven't sent the invitations yet — terrible me!",
          'Take these. Deliver to Pip, Old Thump,',
          'and Mrs. Mossfoot. Hurry, hurry!',
        ],
        onEnd: (g) => {
          g.flags.mayor_quest_started = true;
          g.give('invitations', 1);
        },
      },
      {
        when: (s) => !(s.flags.invited_pip && s.flags.invited_thump && s.flags.invited_mossfoot),
        lines: [
          'Pip, Old Thump, and Mrs. Mossfoot.',
          "Quickly now! The carrots won't unveil themselves.",
        ],
      },
      {
        when: (s) => !s.flags.festival_ready,
        lines: [
          'All delivered? Splendid!',
          'I shall see you at the square — bring everyone!',
          'The Elder Carrot awaits.',
        ],
        onEnd: (g) => { g.flags.festival_ready = true; },
      },
      {
        when: (s) => true,
        lines: [
          'To the square, Noddy! At once!',
        ],
      },
    ],
  },

  pip: {
    sprite: 'pip',
    map: 'pips-shop',
    x: 5, y: 4,
    dir: 'down',
    name: 'Pip',
    dialog: [
      {
        when: (s) => !s.flags.mayor_quest_started,
        lines: [
          'Welcome to the shop, Noddy!',
          "Carrot pies are half-off if you're nice.",
        ],
      },
      {
        when: (s) => !s.flags.invited_pip && s.inv.invitations > 0,
        lines: [
          'Oh! An invitation from the Mayor?',
          "I'll bring my prize-winning pies tonight.",
          'Tell him thanks!',
        ],
        onEnd: (g) => { g.flags.invited_pip = true; },
      },
      {
        when: (s) => !s.flags.invited_pip,
        lines: [
          "Ooh, you smell like flour. Did Pip — wait, that's me.",
        ],
      },
      {
        when: (s) => true,
        lines: [
          "See you at the Festival, Noddy! I'll bring extra pies.",
        ],
      },
    ],
  },

  oldthump: {
    sprite: 'oldthump',
    map: 'old-thump-farm',
    x: 5, y: 4,
    dir: 'down',
    name: 'Old Thump',
    dialog: [
      {
        when: (s) => !s.flags.mayor_quest_started,
        lines: [
          'Hmph. Mind your business, kid.',
          "I've got carrots to count.",
        ],
      },
      {
        when: (s) => !s.flags.invited_thump && s.inv.invitations > 0,
        lines: [
          'A Festival invitation? From Burrows?',
          'Eh. Fine. I will come.',
          'But listen, kid — somebody raided my patch.',
          'Last night. Big tracks. Bigger than rabbit.',
          'Tell the Mayor.',
        ],
        onEnd: (g) => {
          g.flags.invited_thump = true;
          g.flags.thump_quest_started = true; // reveals pawprints
        },
      },
      {
        when: (s) => !s.flags.invited_thump,
        lines: [
          'Hmph. What.',
        ],
      },
      {
        when: (s) => true,
        lines: [
          "Watch yourself out there, kid. Tracks don't lie.",
        ],
      },
    ],
  },

  mossfoot: {
    sprite: 'mossfoot',
    map: 'mossfoot-house',
    x: 5, y: 4,
    dir: 'down',
    name: 'Mrs. Mossfoot',
    dialog: [
      {
        when: (s) => !s.flags.bunny_quest_started && s.inv.invitations > 0,
        lines: [
          "Noddy! Oh, you're here. Have you seen my baby?",
          'She slipped out before sunrise. I — I —',
          'An invitation? I cannot come without her.',
          'She loves the windmill. Could you check?',
          'Please, Noddy.',
        ],
        onEnd: (g) => {
          g.flags.bunny_quest_started = true;
          g.flags.invited_mossfoot = true;
        },
      },
      {
        when: (s) => s.flags.bunny_quest_started && !s.flags.has_baby,
        lines: [
          'The windmill, Noddy. She loves the windmill.',
          'Hurry, please.',
        ],
      },
      {
        when: (s) => s.flags.has_baby && !s.flags.bunny_returned,
        lines: [
          'Oh — oh thank you, Noddy!',
          'My baby! My sweet little —',
          'Here, take this carrot. From the patch.',
          "I'll be at the Festival. Promise.",
        ],
        onEnd: (g) => {
          g.flags.bunny_returned = true;
          g.flags.has_baby = false; // baby goes home
          g.give('carrot', 1);
        },
      },
      {
        when: (s) => !s.flags.mayor_quest_started,
        lines: [
          'Have you seen my baby?',
          'No? Never mind. I worry too much.',
        ],
      },
      {
        when: (s) => true,
        lines: [
          'Bless you, Noddy. See you at the Festival.',
        ],
      },
    ],
  },

  baby: {
    sprite: 'baby',
    map: 'windmill',
    x: 6, y: 5,
    dir: 'down',
    name: 'Baby Bunny',
    hideWhen: (s) => s.flags.has_baby || s.flags.bunny_returned,
    dialog: [
      {
        when: (s) => !s.flags.has_baby,
        lines: [
          '(A tiny bunny is curled behind a sack of grain.)',
          '(She blinks at you and snuggles in.)',
          '(You scoop her up. Gently.)',
        ],
        onEnd: (g) => { g.flags.has_baby = true; },
      },
    ],
  },

  bramble: {
    sprite: 'bramble',
    map: 'lodi',
    x: 12, y: 10,
    dir: 'down',
    name: 'Bramble',
    dialog: [
      {
        when: (s) => !s.flags.thump_quest_started,
        lines: [
          "Bet you can't even ask Pip for a pie.",
          'Hmph. Festival is for babies anyway.',
        ],
      },
      {
        when: (s) => !s.flags.festival_ready,
        lines: [
          'Did you hear? Old Thump says wolves.',
          'Wolves! In Lodi!',
          "Mom says it's just a fox. But still.",
        ],
      },
      {
        when: (s) => true,
        lines: [
          "I'll race you to the square, slowpoke.",
        ],
      },
    ],
  },

  // Lore NPCs and signs — interactOnly NPCs without sprites are talked to
  // when the player faces them and presses A.
  shrine: {
    sprite: null,
    map: 'lodi',
    x: 21, y: 7,
    dir: 'down',
    name: 'Carrot Shrine',
    interactOnly: true,
    dialog: [
      {
        when: (s) => true,
        lines: [
          '(A weathered stone. A faded carrot is carved into it.)',
          '(Beneath it, almost worn away: WHISPERING ROOTS.)',
        ],
      },
    ],
  },
  forestSign: {
    sprite: null,
    map: 'lodi',
    x: 13, y: 1,
    dir: 'down',
    name: 'Forest Sign',
    interactOnly: true,
    dialog: [
      {
        when: (s) => !s.flags.festival_done,
        lines: [
          '(A wooden sign at the forest path.)',
          'FOREST. Do not enter alone.',
        ],
      },
      {
        when: (s) => true,
        lines: [
          '(The path leads into the trees.)',
          '(Tracks press into the soft ground.)',
        ],
      },
    ],
  },
  pawTrack: {
    sprite: 'pawprint_marker',
    map: 'lodi',
    x: 18, y: 13,
    dir: 'down',
    name: 'Paw Tracks',
    showWhen: (s) => s.flags.thump_quest_started,
    dialog: [
      {
        when: (s) => true,
        lines: [
          '(Big paw prints. Pressed deep.)',
          '(Wolf-sized.)',
        ],
      },
    ],
  },
};
