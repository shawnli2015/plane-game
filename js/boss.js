class Boss {
    constructor(canvasWidth, canvasHeight) {
        this.width = 120;
        this.height = 80;
        this.x = canvasWidth;
        this.y = canvasHeight / 2 - this.height / 2;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.speed = 1;
        this.active = true;
        this.health = 100;
        this.maxHealth = 100;
        this.score = 500;
        this.color = '#ff00ff';
        this.moveDirection = 1;
        this.horizontalDirection = -1;
        this.shootTimer = 0;
        this.shootInterval = 60;
        this.enteredScreen = false;
        this.minX = this.canvasWidth - this.width - 200;
        this.maxX = this.canvasWidth - this.width - 50;
        this.isPortraitMode = false;
    }

    setPortraitMode(isPortrait) {
        this.isPortraitMode = isPortrait;
        if (isPortrait) {
            this.width = 80;
            this.height = 120;
            this.x = this.canvasWidth / 2 - this.width / 2;
            this.y = -this.height;
            this.minY = 50;
            this.maxY = this.canvasHeight - this.height - 50;
            this.minX = 50;
            this.maxX = this.canvasWidth - this.width - 50;
        } else {
            this.width = 120;
            this.height = 80;
            this.x = this.canvasWidth;
            this.y = this.canvasHeight / 2 - this.height / 2;
            this.minX = this.canvasWidth - this.width - 200;
            this.maxX = this.canvasWidth - this.width - 50;
        }
    }

    update() {
        if (this.isPortraitMode) {
            if (!this.enteredScreen) {
                this.y += this.speed;
                if (this.y >= this.maxY) {
                    this.enteredScreen = true;
                }
            } else {
                this.x += this.speed * this.horizontalDirection;
                
                if (this.x <= this.minX) {
                    this.horizontalDirection = 1;
                } else if (this.x >= this.maxX) {
                    this.horizontalDirection = -1;
                }
            }
        } else {
            if (!this.enteredScreen) {
                this.x -= this.speed;
                if (this.x <= this.maxX) {
                    this.enteredScreen = true;
                }
            } else {
                this.x += this.speed * this.horizontalDirection;
                
                if (this.x <= this.minX) {
                    this.horizontalDirection = 1;
                } else if (this.x >= this.maxX) {
                    this.horizontalDirection = -1;
                }

                this.y += this.speed * this.moveDirection * 0.5;
                
                if (this.y <= 50) {
                    this.moveDirection = 1;
                } else if (this.y >= this.canvasHeight - this.height - 50) {
                    this.moveDirection = -1;
                }
            }
        }

        this.shootTimer++;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.lineTo(this.x + this.width - 20, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ff66ff';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 20, 0, Math.PI * 2);
        ctx.fill();

        this.drawHealthBar(ctx);
    }

    drawHealthBar(ctx) {
        const barWidth = this.width;
        const barHeight = 8;
        const barX = this.x;
        const barY = this.y - 15;
        const healthPercent = this.health / this.maxHealth;

        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }

    shoot() {
        if (this.shootTimer >= this.shootInterval) {
            this.shootTimer = 0;
            if (this.isPortraitMode) {
                return new Bullet(
                    this.x + this.width / 2 - 3,
                    this.y + this.height,
                    5,
                    false
                );
            } else {
                return new Bullet(
                    this.x,
                    this.y + this.height / 2 - 3,
                    5,
                    false
                );
            }
        }
        return null;
    }

    takeDamage(damage) {
        this.health -= damage;
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