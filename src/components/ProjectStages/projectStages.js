const homeProject = {
  title: 'Featured project',
  stages: [
    {
      id: 'sketch',
      label: 'Sketch',
      icon: 'sketch',
      description: 'Early ideas take shape through quick sketches, references, and exploration.',
      placeholder: 'Sketch designs and ideas go here',
      video: '/assets/Home/sketch_Freeform_Sketches.mp4',
      videoLabel: 'Screen recording of freeform sketches taking shape'
    },
    {
      id: 'screen',
      label: 'Screen',
      icon: 'screen',
      description: 'The chosen direction becomes a clear, considered digital experience.',
      placeholder: 'Screen designs go here'
    },
    {
      id: 'motion',
      label: 'Motion',
      icon: 'motion',
      description: 'Interaction and motion bring the finished experience to life.',
      placeholder: 'Motion or interactive work goes here',
      // A preview of the Lab: swap the video for whichever recording you want.
      video: '/assets/Home/demo_GalleryCard.mp4',
      videoLabel: 'Screen recording of a gallery card in use',
      link: { href: '/lab', label: 'Open the Lab' },
      // Lab cards tucked behind the tile's left edge. They pop out when this
      // stage is active. Any image works; these are real Lab pieces.
      peek: [
        { title: 'Floating nav', image: '/assets/Lab/PhotosByAlexNav/home_cover.png' },
        { title: 'Gallery cards', image: '/assets/Lab/GalleryCard/posters/2026-hamilton-fashion-week.jpg' },
        { title: 'Live events hover', image: '/assets/Lab/LiveEventsHover/home_guitar_lady.png' }
      ]
    }
  ]
};

export default homeProject;
