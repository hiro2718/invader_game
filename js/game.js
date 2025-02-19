// js/game.js

let canvas, ctx;
let player;
let enemies = [];
let bullets = [];        // プレイヤーの弾
let enemyBullets = [];   // 敵/ボスの弾

let keyState = {};

let score = 0;           // スコア
let gameOver = false;    // ゲームオーバーフラグ
let wave = 1;            // ウェーブ（ステージ）番号

// ボスを格納する配列（または単一オブジェクトでも可）
let boss = null;         // ボスがいないときは null

// ウェーブごとの設定
const ENEMY_ROW_COUNT_BASE = 3;   // 基本行数
const ENEMY_COLUMN_COUNT_BASE = 6; // 基本列数
const ENEMY_SPACING = 50;

// ゲーム初期化
function initGame() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  // プレイヤー生成（残機を設定）
  player = new Player(canvas.width / 2, canvas.height - 50);

  // スコアや状態をリセット
  score = 0;
  wave = 1;
  gameOver = false;

  // 初期ウェーブの敵を生成
  createWave();

  // キーイベント
  window.addEventListener("keydown", (e) => {
    keyState[e.code] = true;
  });
  window.addEventListener("keyup", (e) => {
    keyState[e.code] = false;
  });
}

// ウェーブに応じて敵とボスを配置
function createWave() {
  enemies = [];
  enemyBullets = [];
  boss = null;

  // 通常敵を配置
  // ウェーブが上がると行数や列数、速度などを増やす例
  const rowCount = ENEMY_ROW_COUNT_BASE + (wave - 1);      // ウェーブごとに行数増加
  const columnCount = ENEMY_COLUMN_COUNT_BASE;             // 列数は固定
  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < columnCount; col++) {
      const x = 50 + col * ENEMY_SPACING;
      const y = 50 + row * ENEMY_SPACING;
      // ウェーブが上がるほど敵の速度を上げる
      const speed = 1 + Math.floor((wave - 1) / 2);
      enemies.push(new Enemy(x, y, speed));
    }
  }

  // 例: 3の倍数のウェーブでボス出現
  if (wave % 3 === 0) {
    boss = new Boss(canvas.width / 2, 100);
  }
}

function gameLoop() {
  update();
  draw();
  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

function update() {
  if (gameOver) return;

  // プレイヤー操作
  if (keyState["ArrowLeft"]) {
    player.move(-1);
  } else if (keyState["ArrowRight"]) {
    player.move(1);
  }
  // スペースキーで弾発射
  if (keyState["Space"]) {
    player.shoot(bullets);
  }

  // プレイヤー弾更新
  bullets.forEach((bullet, index) => {
    bullet.update();
    if (bullet.y < 0) {
      bullets.splice(index, 1);
    }
  });

  // 敵の移動・弾発射
  enemies.forEach((enemy) => {
    enemy.update();

    // ランダム発射例: 1%くらいの確率
    if (Math.random() < 0.01) {
      enemy.shoot(enemyBullets);
    }
  });

  // ボスが存在する場合、ボスの移動・弾発射
  if (boss) {
    boss.update();
    // ボスの弾発射（もう少し高頻度でもOK）
    if (Math.random() < 0.02) {
      boss.shoot(enemyBullets);
    }
  }

  // 敵弾更新
  enemyBullets.forEach((bullet, index) => {
    bullet.update();
    if (bullet.y > canvas.height) {
      enemyBullets.splice(index, 1);
    }
  });

  // プレイヤー弾と敵の衝突判定
  for (let i = enemies.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (checkCollision(enemies[i], bullets[j])) {
        score += 100;
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        break;
      }
    }
  }

  // プレイヤー弾とボスの衝突判定
  if (boss) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (checkCollision(boss, bullets[j])) {
        boss.hp--;   // ボスの耐久度を減らす
        bullets.splice(j, 1);
        // HPが0以下ならボス撃破
        if (boss.hp <= 0) {
          score += 1000; // ボス撃破ボーナス
          boss = null;
          break;
        }
      }
    }
  }

  // 敵弾とプレイヤーの衝突判定
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    if (checkCollision(player, enemyBullets[i])) {
      enemyBullets.splice(i, 1);
      player.lives--;   // ライフを減らす
      // ライフがなくなったらゲームオーバー
      if (player.lives <= 0) {
        gameOver = true;
      }
      // 被弾した際、プレイヤー位置を初期化するなど
      player.x = canvas.width / 2;
      break;
    }
  }

  // 全ての敵が倒され、ボスもいなければウェーブクリア
  if (enemies.length === 0 && !boss) {
    wave++;
    createWave();
  }
}

function checkCollision(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // スコアやウェーブ、残機表示
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText(`SCORE: ${score}`, 10, 30);
  ctx.fillText(`WAVE: ${wave}`, 10, 60);
  ctx.fillText(`LIVES: ${player.lives}`, 10, 90);

  // プレイヤー描画
  player.draw(ctx);

  // 敵描画
  enemies.forEach((enemy) => {
    enemy.draw(ctx);
  });

  // ボス描画
  if (boss) {
    boss.draw(ctx);
  }

  // プレイヤー弾描画
  bullets.forEach((bullet) => {
    bullet.draw(ctx);
  });

  // 敵弾描画
  enemyBullets.forEach((bullet) => {
    bullet.draw(ctx);
  });

  // ゲームオーバー表示
  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2 - 100, canvas.height / 2);
  }
}

// 他ファイルからも呼び出せるようにエクスポートする場合は以下を追加
// export { initGame, gameLoop };
