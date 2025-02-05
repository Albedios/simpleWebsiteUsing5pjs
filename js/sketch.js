const sketch = p => {
  let shapes = [];
  const maxShapes = 15;  // Maximum number of shapes
  let hue = 0;
  let textAnimator;

  class Shape {
    constructor(x, y) {
        this.init(x, y);
        this.alpha = 0;  // Start transparent
    }

    init(x, y) {
        this.x = x || p.width / 2;
        this.y = y || p.height / 2;
        this.targetSize = p.random(50, 150);
        this.size = 0;  // Start with size 0
        this.numVertices = p.floor(p.random(3, 8));
        this.rotation = p.random(p.TWO_PI);
        this.rotationSpeed = p.random(-0.02, 0.02);
        this.hueOffset = p.random(360);
    }


    update() {
        this.rotation += this.rotationSpeed;
        
        // Fade in effect
        if (this.alpha < 1) {
            this.alpha = p.min(this.alpha + 0.05, 1);
        }
        
        // Grow to target size
        if (this.size < this.targetSize) {
            this.size = p.lerp(this.size, this.targetSize, 0.1);
        }
    }

    draw() {
        p.push();
        p.translate(this.x, this.y);
        p.rotate(this.rotation);
        
        // Dynamic color based on position and time
        let currentHue = (hue + this.hueOffset) % 360;
        let saturation = p.map(p.dist(this.x, this.y, p.width/2, p.height/2), 0, p.width/2, 100, 50);
        let brightness = p.map(p.sin(p.frameCount * 0.02), -1, 1, 50, 100);
        
        p.stroke(currentHue, saturation, brightness, this.alpha);
        p.strokeWeight(2);
        p.noFill();
        
        // Draw polygon
        p.beginShape();
        for (let i = 0; i < this.numVertices; i++) {
            let angle = p.map(i, 0, this.numVertices, 0, p.TWO_PI);
            let x = p.cos(angle) * this.size;
            let y = p.sin(angle) * this.size;
            p.vertex(x, y);
        }
        p.endShape(p.CLOSE);
        p.pop();
    }
}

  p.setup = function() {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.parent('sketch-holder');
    p.colorMode(p.HSB, 360, 100, 100, 1);
    
    // Create initial shape at center
    shapes.push(new Shape(p.width/2, p.height/2));
    
    // Initialize text animator with p5 instance
    textAnimator = new TextAnimator(p);
  };

  p.mousePressed = function() {
    // Create new shape at mouse position
    shapes.push(new Shape(p.mouseX, p.mouseY));
    
    // Remove oldest shape if we exceed maxShapes
    if (shapes.length > maxShapes) {
      shapes.shift();
    }
  };

  p.draw = function() {
    // Semi-transparent background for trail effect
    p.background(0, 0, 0, 0.1);
    
    // Update and draw shapes
    shapes.forEach(shape => {
      shape.update();
      shape.draw();
    });
    
    // Update text animations
    if (textAnimator) {
      textAnimator.update();
      textAnimator.draw();
      textAnimator.addMouseText();
    }
    
    // Slowly change base hue
    hue = (hue + 0.5) % 360;
  };

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    // Reset each shape to new window center
    shapes.forEach(shape => shape.init(p.width/2, p.height/2));
  };
};

// Create p5 instance
new p5(sketch);
