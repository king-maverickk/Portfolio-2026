// Everything on the Lab page, in order. Add a piece by adding an object.
//
// kind: 'live' runs the real component in the card (demo: a key in DEMOS in
//       demos.js); 'recording' plays a screen recording (video: file in
//       public/assets).
// draft: true marks a caption Claude wrote from your notes. Rewrite or approve.
// where: where the piece lives, shown as a tag. Leave empty to hide it.

const LAB_ITEMS = [
  {
    id: 'paper-sheet',
    title: 'Paper sheet',
    caption: 'Slides in and swings flat on a hinge, like paper slid across a desk. Click to send another.',
    kind: 'live',
    demo: 'paperSheet',
    where: 'How I’ll deliver',
    draft: true
  },
  {
    id: 'gallery-card',
    title: 'Gallery card',
    caption: 'A card for browsing a body of work, recorded in use.',
    kind: 'recording',
    video: '/assets/Home/demo_GalleryCard.mp4',
    where: '',
    draft: true
  },
  {
    id: 'hover-words',
    title: 'Hover words',
    caption: 'Each word lifts on its own, rising fast and settling slow, so a sweeping cursor leaves a wave.',
    kind: 'live',
    demo: 'hoverWords',
    where: 'About',
    draft: true
  },
  {
    id: 'stage-pills',
    title: 'Stage pills',
    caption: 'One highlight that slides to the stage you pick and stretches to fit it.',
    kind: 'live',
    demo: 'stagePills',
    where: 'Project stages',
    draft: true
  },
  {
    id: 'draggable',
    title: 'Draggable components',
    caption: 'Pieces of the page you can pick up and move around.',
    kind: 'recording',
    video: '/assets/Home/demo_draggable_components.mp4',
    where: 'Hamilton Creative Group',
    draft: true
  },
  {
    id: 'inline-images',
    title: 'Images in text',
    caption: 'Small pictures that sit inside a sentence, never wrap away from their word, and spin when you hover.',
    kind: 'live',
    demo: 'inlineImages',
    where: 'About',
    draft: true
  },
  {
    id: 'photo-first',
    title: 'Photo-first layout',
    caption: 'The photographs lead and the words sit inside them.',
    kind: 'recording',
    video: '/assets/Home/demo_photo_first_layout.mp4',
    where: 'Photos by Alex',
    draft: true
  },
  {
    id: 'headline-reveal',
    title: 'Headline reveal',
    caption: 'Words fly in from the sides and pop to full size in 150 ms.',
    kind: 'live',
    demo: 'headlineReveal',
    where: 'How I’ll deliver',
    draft: true
  },
  {
    id: 'live-events',
    title: 'Live events hover',
    caption: 'Hovering an event brings its details forward.',
    kind: 'recording',
    video: '/assets/Home/demo_live_events_hover_full.mp4',
    where: '',
    draft: true
  }
];

export default LAB_ITEMS;
