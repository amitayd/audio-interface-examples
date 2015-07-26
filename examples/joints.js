
labelZ = createWidget('joints', {
  width: '50%',
  height: '50%',
  top: '0%',
  left: '0%',
   minDistance: Math.pow(0.5, 2) + Math.pow(0.5,2),
  // x: 0.5,
  // y: 0.5,
  joints: [
    // {x: 0, y: 0},
    {x: 0.25, y: 0.25},
    {x: 0.75, y: 0.25},
    {x: 0.25, y: 0.75},
    {x: 0.75, y: 0.75}
  ]
});