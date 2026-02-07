class Collision {
    static checkRectCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    static checkCircleCollision(circle1, circle2) {
        const dx = circle1.x - circle2.x;
        const dy = circle1.y - circle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < circle1.radius + circle2.radius;
    }

    static checkRectCircleCollision(rect, circle) {
        const closestX = Utils.clamp(circle.x, rect.x, rect.x + rect.width);
        const closestY = Utils.clamp(circle.y, rect.y, rect.y + rect.height);
        const dx = circle.x - closestX;
        const dy = circle.y - closestY;
        return (dx * dx + dy * dy) < (circle.radius * circle.radius);
    }

    static checkBulletEnemy(bullet, enemy) {
        return this.checkRectCollision(bullet, enemy);
    }

    static checkPlayerEnemy(player, enemy) {
        return this.checkRectCollision(player, enemy);
    }

    static checkPlayerBullet(player, bullet) {
        return this.checkRectCollision(player, bullet);
    }
}