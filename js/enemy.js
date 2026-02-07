class Enemy {
    constructor(canvasWidth, canvasHeight) {
        this.width = 50;
        this.height = 40;
        this.x = canvasWidth;
        this.y = Utils.random(0, canvasHeight - this.height);
        this.speed = Utils.random(2, 4);
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.active = true;
        this.health = 1;
        this.score = 10;
        this.color = '#ff4444';
        this.isPortraitMode = false;
    }

    setPortraitMode(isPortrait) {
        this.isPortraitMode = isPortrait;
        if (isPortrait) {
            this.width = 40;
            this.height = 50;
            this.x = Utils.random(0, this.canvasWidth - this.width);
            this.y = -this.height;
        } else {
            this.width = 50;
            this.height = 40;
            this.x = this.canvasWidth;
            this.y = Utils.random(0, this.canvasHeight - this.height);
        }
    }

    update() {
        if (this.isPortraitMode) {
            this.y += this.speed;
            if (this.y > this.canvasHeight) {
                this.active = false;
            }
        } else {
            this.x -= this.speed;
            if (this.x + this.width < 0) {
                this.active = false;
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.lineTo(this.x + this.width - 10, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ff6666';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 8, 0, Math.PI * 2);
        ctx.fill();
    }

    takeDamage() {
        this.health--;
        if (this.health <= 0) {
            this.active = false;
            return this.score;
        }
        return 0;
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}