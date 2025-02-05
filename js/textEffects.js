class TextAnimator {
    constructor(p5Instance) {
        this.p = p5Instance;
        this.floatingTexts = [];
        this.words = ['Create', 'Design', 'Explore', 'Imagine'];
        this.currentWord = 0;
        this.letterSpacing = 20;
        this.baseY = this.p.height / 2;
    }

    addFloatingText(text, x, y) {
        this.floatingTexts.push({
            text,
            x,
            y,
            originalY: y,
            angle: 0
        });
    }

    update() {
        // Update floating text positions
        for (let text of this.floatingTexts) {
            text.angle += 0.02;
            text.y = text.originalY + this.p.sin(text.angle) * 30;
        }

        // Word morphing effect
        if (this.p.frameCount % 120 === 0) {  // Change word every 120 frames
            this.currentWord = (this.currentWord + 1) % this.words.length;
            document.querySelector('.main-title').textContent = this.words[this.currentWord];
        }
    }

    draw() {
        this.p.push();
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.textSize(20);
        this.p.fill(255, 200);
        
        // Draw floating texts
        for (let t of this.floatingTexts) {
            this.p.text(t.text, t.x, t.y);
        }
        this.p.pop();
    }

    // Add interactive text that follows mouse with delay
    addMouseText() {
        if (this.p.frameCount % 30 === 0) {  // Add new text every 30 frames
            const text = this.p.random(['✧', '⋆', '⋅']);
            this.addFloatingText(
                text,
                this.p.mouseX + this.p.random(-50, 50),
                this.p.mouseY + this.p.random(-50, 50)
            );
            
            // Remove old texts to prevent too many objects
            if (this.floatingTexts.length > 20) {
                this.floatingTexts.shift();
            }
        }
    }
}
