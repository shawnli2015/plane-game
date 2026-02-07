class Background {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.stars = [];
        this.speed = 2;
        this.initStars();
    }

    initStars() {
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Utils.random(0, this.canvasWidth),
                y: Utils.random(0, this.canvasHeight),
                size: Utils.random(1, 3),
                speed: Utils.random(0.5, 2)
            });
        }
    }

    update() {
        this.stars.forEach(star => {
            star.x -= star.speed * this.speed;
            if (star.x < 0) {
                star.x = this.canvasWidth;
                star.y = Utils.random(0, this.canvasHeight);
            }
        });
    }

    draw(ctx) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        this.stars.forEach(star => {
            ctx.fillStyle = `rgba(255, 255, 255, ${Utils.random(0.5, 1)})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}