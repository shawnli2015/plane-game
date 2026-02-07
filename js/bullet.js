class Bullet {
    constructor(x, y, speed, isPlayerBullet = true) {
        this.x = x;
        this.y = y;
        this.width = 15;
        this.height = 6;
        this.speed = speed;
        this.isPlayerBullet = isPlayerBullet;
        this.active = true;
    }

    update(canvasWidth) {
        if (this.isPlayerBullet) {
            this.x += this.speed;
            if (this.x > canvasWidth) {
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
        if (this.isPlayerBullet) {
            ctx.fillStyle = '#00ff00';
        } else {
            ctx.fillStyle = '#ff0000';
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.shadowBlur = 10;
        ctx.shadowColor = this.isPlayerBullet ? '#00ff00' : '#ff0000';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0;
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