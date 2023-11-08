const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 50,
    height: 50,
    color: 'blue'
};


// Define a speed for the player's movement
const playerSpeed = 10;

function handleKeyDown(event) {
    switch(event.key) {
        case 'ArrowLeft': // left arrow
            player.x -= playerSpeed;
            // Keep player within canvas bounds
            if (player.x < 0) {
                player.x = 0;
            }
            break;
        case 'ArrowRight': // right arrow
            player.x += playerSpeed;
            // Keep player within canvas bounds
            if (player.x + player.width > canvas.width) {
                player.x = canvas.width - player.width;
            }
            break;
        case 'ArrowUp': // up arrow
            player.y -= playerSpeed;
            // Keep player within canvas bounds
            if (player.y < 0) {
                player.y = 0;
            }
            break;
        case 'ArrowDown': // down arrow
            player.y += playerSpeed;
            // Keep player within canvas bounds
            if (player.y + player.height > canvas.height) {
                player.y = canvas.height - player.height;
            }
            break;
    }
}


// Add event listener for keydown
window.addEventListener('keydown', handleKeyDown);

// The rest of your code remains unchanged


const enemies = [];
const enemySpeed = 1;
const spawnRate = 1500; // 적이 나타나는 시간 간격 (밀리초)

let gameRunning = true;

function spawnEnemy() {
    const size = Math.random() * (50 - 20) + 20; // 적의 크기를 무작위로 설정
    const x = Math.random() * (canvas.width - size);
    const y = -size;
    enemies.push({ x, y, width: size, height: size, color: 'red' });
}

function movePlayer(event) {
    const rect = canvas.getBoundingClientRect();
    player.x = event.clientX - rect.left - player.width / 2;
    player.y = event.clientY - rect.top - player.height / 2;
}

function moveEnemies() {
    for (const enemy of enemies) {
        enemy.y += enemySpeed;
    }
}

function checkCollisions() {
    for (const enemy of enemies) {
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            gameRunning = false;
        }
    }
}

function gameLoop() {
    if (!gameRunning) {
        ctx.font = '48px serif';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveEnemies();
    checkCollisions();

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw enemies
    for (const enemy of enemies) {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }

    requestAnimationFrame(gameLoop);
}
function moveEnemies() {
    for (const enemy of enemies) {
        // 플레이어 위치와 적 위치 사이의 차이 계산
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;

        // 차이를 이용하여 거리 계산
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 거리가 0이 아닐 경우에만 적을 이동시킴 (0으로 나누는 것을 방지)
        if (distance > 0) {
            // 정규화된 방향 벡터를 계산
            const vx = (dx / distance) * enemySpeed;
            const vy = (dy / distance) * enemySpeed;

            // 적 위치 업데이트
            enemy.x += vx;
            enemy.y += vy;
        }
    }
}


// Event listeners
canvas.addEventListener('click', movePlayer);

// Start game loop
requestAnimationFrame(gameLoop);

// Spawn enemies
setInterval(spawnEnemy, spawnRate);
