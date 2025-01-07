let img;
let tileSize = 20; // Base tile size, will randomize later
let offsetX = 0;
let offsetY = 0;
let imgWidth, imgHeight;
let imageLoaded = false; // Flag to track if the image has loaded

// Define two teal colors for the gradient map (dark to light teal)
let gradientStart, gradientEnd;

function setup() {
  createCanvas(400, 400);
  noLoop(); // Stops automatic looping
  
  // Define the start and end colors for the teal gradient
  gradientStart = color(0, 12, 12); // Dark teal
  gradientEnd = color(0, 280, 280); // Light teal
}

function preload() {
  img = loadImage('images/Bao.png', () => {
    imageLoaded = true; // Set the flag to true when image is loaded
    imgWidth = img.width;
    imgHeight = img.height;

    // Resize canvas to match image's width and height without distortion
    resizeCanvas(imgWidth, imgHeight); // Dynamically adjust canvas size to the image size
    console.log('Image Loaded:', imgWidth, imgHeight);
  }, (error) => {
    console.error('Error loading image:', error);
  });
}

function draw() {
  // Clear the canvas with a black background
  background(0);  // This sets the entire background to black
  
  // If the image is loaded, apply the mosaic effect
  if (imageLoaded) {
    applyMosaicEffect();
  } else {
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Loading...", width / 2, height / 2);  // Show "Loading..." message until the image is loaded
  }
}

function mouseMoved() {
  redraw(); // Redraw the canvas when the mouse moves
}

function applyMosaicEffect() {
  // Update the offsets to make the tiles move dynamically with mouse position
  offsetX = map(mouseX, 0, width, -1,1);
  offsetY = map(mouseY, 0, height, -1,1);

  // Loop over the canvas with steps of random tileSize
  for (let x = 0; x < width; x += random(15,16)) {  // Random horizontal spacing
    for (let y = 0; y < height; y += random(15,16)) {  // Random vertical spacing
      // Random size for each tile
      let size = random(10,12.5);  // Random size between 10 and 40

      // Adjust x, y positions for tiling in a way that matches the image size
      let imgX = map(x, 0, width, 0, img.width);  // Map canvas x to image x
      let imgY = map(y, 0, height, 0, img.height); // Map canvas y to image y

      // Sample the color from the image at the center of each tile
      let c = img.get(imgX, imgY); // Get the color from the image

      // Apply a random effect to the sampled color (for animation)
      let animSpeed = .01; // Speed of animation
      let r = red(c) + map(mouseX, 0, width, -animSpeed, animSpeed);
      let g = green(c) + map(mouseY, 0, height, -animSpeed, animSpeed);
      let b = blue(c) + map(mouseX + mouseY, 0, width + height, -animSpeed, animSpeed);

      // Constrain values to make sure they stay within the 0-255 range
      r = constrain(r, 0, 255);
      g = constrain(g, 0, 255);
      b = constrain(b, 0, 255);

      // Create the gradient effect based on the color values (mapping to the teal gradient)
      let colorMapped = lerpColor(gradientStart, gradientEnd, map(r, 0, 255, 0, 1));

      // Set the fill color based on the mapped value
      fill(colorMapped);
      noStroke(); // Remove border around tiles

      // Apply glow effect by setting shadow properties
      drawingContext.shadowBlur = 25; // Increased blur amount for a stronger glow effect
      drawingContext.shadowColor = color(r, g, b, 10); // Set the shadow color and opacity for the glow effect
      drawingContext.shadowOffsetX = 0; // No horizontal offset for the shadow
      drawingContext.shadowOffsetY = 0; // No vertical offset for the shadow

      // Draw the animated ellipse with the glow effect
      ellipse(x + offsetX, y + offsetY, size, size); // This forms the animated mosaic ellipses
    }
  }

  // Reset shadow properties to avoid affecting other elements
  drawingContext.shadowBlur = 0;
  drawingContext.shadowColor = color(0, 0, 0, 0); // Reset shadow color
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;
}