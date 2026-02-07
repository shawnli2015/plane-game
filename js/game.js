class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 1280;
        this.canvas.height = 720;

        this.score = 0;
        this.lives = 3;
        this.gameState = 'start';
        this.keys = {};

        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.background = null;
        this.boss = null;

        this.enemySpawnTimer = 0;
        this.enemySpawnInterval = 60;

        this.segmentTimer = 0;
        this.segmentInterval = 300;
        this.segmentCount = 0;
        this.maxSegments = 5;

        this.isShooting = false;
        this.shootHoldTimer = 0;
        this.shootHoldThreshold = 30;
        this.autoShootTimer = 0;
        this.autoShootInterval = 10;

        this.init();
    }

    init() {
        this.background = new Background(this.canvas.width, this.canvas.height);
        this.setupEventListeners();
        this.updateUI();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space' && this.gameState === 'playing') {
                if (!this.isShooting) {
                    this.isShooting = true;
                    this.shootHoldTimer = 0;
                    this.shoot();
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            if (e.code === 'Space') {
                this.isShooting = false;
                this.shootHoldTimer = 0;
                this.autoShootTimer = 0;
            }
        });

        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restartGame();
        });

        this.setupTouchControls();
    }

    setupTouchControls() {
        const touchMoveArea = document.getElementById('touchMoveArea');
        const joystickHandle = document.getElementById('joystickHandle');
        const touchShootBtn = document.getElementById('touchShootBtn');

        let touchStartX = 0;
        let touchStartY = 0;
        let isTouching = false;

        touchMoveArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            isTouching = true;
        });

        touchMoveArea.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!isTouching || !this.player) return;

            const touch = e.touches[0];
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;

            const maxDistance = 50;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            let clampedDeltaX = deltaX;
            let clampedDeltaY = deltaY;

            if (distance > maxDistance) {
                const angle = Math.atan2(deltaY, deltaX);
                clampedDeltaX = Math.cos(angle) * maxDistance;
                clampedDeltaY = Math.sin(angle) * maxDistance;
            }

            this.player.touchX = clampedDeltaX / maxDistance;
            this.player.touchY = clampedDeltaY / maxDistance;

            joystickHandle.style.transform = `translate(${clampedDeltaX}px, ${clampedDeltaY}px)`;
        });

        touchMoveArea.addEventListener('touchend', (e) => {
            e.preventDefault();
            isTouching = false;
            if (this.player) {
                this.player.touchX = 0;
                this.player.touchY = 0;
            }
            joystickHandle.style.transform = 'translate(0px, 0px)';
        });

        touchMoveArea.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            isTouching = false;
            if (this.player) {
                this.player.touchX = 0;
                this.player.touchY = 0;
            }
            joystickHandle.style.transform = 'translate(0px, 0px)';
        });

        touchShootBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.gameState === 'playing' && !this.isShooting) {
                this.isShooting = true;
                this.shootHoldTimer = 0;
                this.shoot();
            }
        });

        touchShootBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.isShooting = false;
            this.shootHoldTimer = 0;
            this.autoShootTimer = 0;
        });

        touchShootBtn.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            this.isShooting = false;
            this.shootHoldTimer = 0;
            this.autoShootTimer = 0;
        });
    }

    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.lives = 3;
        this.player = new Player(this.canvas.width, this.canvas.height);
        this.enemies = [];
        this.bullets = [];
        this.boss = null;
        this.enemySpawnTimer = 0;
        this.segmentTimer = 0;
        this.segmentCount = 0;
        this.updateUI();
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
        this.gameLoop();
    }

    restartGame() {
        this.startGame();
    }

    shoot() {
        if (this.player && this.player.active) {
            this.bullets.push(this.player.shoot());
        }
    }

    spawnEnemy() {
        this.enemies.push(new Enemy(this.canvas.width, this.canvas.height));
    }

    spawnBoss() {
        this.boss = new Boss(this.canvas.width, this.canvas.height);
    }

    update() {
        if (this.gameState !== 'playing') return;

        this.background.update();
        this.player.update(this.keys);

        if (this.isShooting) {
            this.shootHoldTimer++;
            if (this.shootHoldTimer >= this.shootHoldThreshold) {
                this.autoShootTimer++;
                if (this.autoShootTimer >= this.autoShootInterval) {
                    this.shoot();
                    this.autoShootTimer = 0;
                }
            }
        }

        if (!this.boss) {
            this.enemySpawnTimer++;
            if (this.enemySpawnTimer >= this.enemySpawnInterval) {
                this.spawnEnemy();
                this.enemySpawnTimer = 0;
            }

            this.segmentTimer++;
            if (this.segmentTimer >= this.segmentInterval) {
                this.segmentTimer = 0;
                this.segmentCount++;
                
                if (this.segmentCount >= this.maxSegments) {
                    this.spawnBoss();
                    this.segmentCount = 0;
                }
            }
        } else {
            const bossBullet = this.boss.shoot();
            if (bossBullet) {
                this.bullets.push(bossBullet);
            }
            this.boss.update();
            
            if (!this.boss.active) {
                this.boss = null;
                this.segmentCount = 0;
                this.segmentTimer = 0;
            }
        }

        this.bullets.forEach(bullet => bullet.update(this.canvas.width));
        this.enemies.forEach(enemy => enemy.update());

        this.bullets = this.bullets.filter(bullet => bullet.active);
        this.enemies = this.enemies.filter(enemy => enemy.active);

        this.checkCollisions();

        if (this.player.lives <= 0) {
            this.gameOver();
        }

        this.updateUI();
    }

    checkCollisions() {
        this.bullets.forEach(bullet => {
            if (!bullet.active) return;

            if (bullet.isPlayerBullet) {
                this.enemies.forEach(enemy => {
                    if (!enemy.active) return;

                    if (Collision.checkBulletEnemy(bullet, enemy)) {
                        bullet.active = false;
                        const points = enemy.takeDamage();
                        if (points > 0) {
                            this.score += points;
                        }
                    }
                });

                if (this.boss && this.boss.active) {
                    if (Collision.checkBulletEnemy(bullet, this.boss)) {
                        bullet.active = false;
                        const points = this.boss.takeDamage(1);
                        if (points > 0) {
                            this.score += points;
                        }
                    }
                }
            } else {
                if (Collision.checkPlayerEnemy(this.player, bullet)) {
                    bullet.active = false;
                    const gameOver = this.player.takeDamage();
                    if (gameOver) {
                        this.player.active = false;
                    }
                }
            }
        });

        this.enemies.forEach(enemy => {
            if (!enemy.active) return;

            if (Collision.checkPlayerEnemy(this.player, enemy)) {
                enemy.active = false;
                const gameOver = this.player.takeDamage();
                if (gameOver) {
                    this.player.active = false;
                }
            }
        });

        if (this.boss && this.boss.active) {
            if (Collision.checkPlayerEnemy(this.player, this.boss)) {
                const gameOver = this.player.takeDamage();
                if (gameOver) {
                    this.player.active = false;
                }
            }
        }
    }

    draw() {
        this.background.draw(this.ctx);

        if (this.gameState === 'playing' || this.gameState === 'gameover') {
            if (this.player && this.player.active) {
                this.player.draw(this.ctx);
            }

            this.bullets.forEach(bullet => bullet.draw(this.ctx));
            this.enemies.forEach(enemy => enemy.draw(this.ctx));

            if (this.boss && this.boss.active) {
                this.boss.draw(this.ctx);
            }
        }
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.player ? this.player.lives : this.lives;
        document.getElementById('progress').textContent = `${this.segmentCount}/${this.maxSegments}`;
    }

    gameOver() {
        this.gameState = 'gameover';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }

    gameLoop() {
        if (this.gameState === 'playing') {
            this.update();
            this.draw();
            requestAnimationFrame(() => this.gameLoop());
        }
    }
}

const game = new Game();