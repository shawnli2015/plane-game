class Player {
    constructor(canvasWidth, canvasHeight) {
        this.width = 60;
        this.height = 40;
        this.x = 50;
        this.y = canvasHeight / 2 - this.height / 2;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.speed = 5;
        this.lives = 3;
        this.active = true;
        this.invincible = false;
        this.invincibleTimer = 0;
        this.color = '#4a90e2';
        this.touchX = 0;
        this.touchY = 0;
    }

    update(keys) {
        if (keys['ArrowUp'] || keys['KeyW']) {
            this.y -= this.speed;
        }
        if (keys['ArrowDown'] || keys['KeyS']) {
            this.y += this.speed;
        }
        if (keys['ArrowLeft'] || keys['KeyA']) {
            this.x -= this.speed;
        }
        if (keys['ArrowRight'] || keys['KeyD']) {
            this.x += this.speed;
        }

        if (this.touchX !== 0) {
            this.x += this.touchX * this.speed;
            this.touchX = 0;
        }
        if (this.touchY !== 0) {
            this.y += this.touchY * this.speed;
            this.touchY = 0;
        }

        this.x = Utils.clamp(this.x, 0, this.canvasWidth - this.width);
        this.y = Utils.clamp(this.y, 0, this.canvasHeight - this.height);

        if (this.invincible) {
            this.invincibleTimer--;
            if (this.invincibleTimer <= 0) {
                this.invincible = false;
            }
        }
    }

    draw(ctx) {
        if (this.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
            return;
        }

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width, this.y + this.height / 2);
        ctx.lineTo(this.x, this.y);
        ctx.lineTo(this.x + 10, this.y + this.height / 2);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#6ab0ff';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ff4444';
        ctx.fillRect(this.x + this.width - 15, this.y + this.height / 2 - 3, 15, 6);
    }

    shoot() {
        return new Bullet(
            this.x + this.width,
            this.y + this.height / 2 - 3,
            8,
            true
        );
    }

    takeDamage() {
        if (this.invincible) {
            return false;
        }
        this.lives--;
        this.invincible = true;
        this.invincibleTimer = 120;
        return this.lives <= 0;
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