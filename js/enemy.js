// js/enemy.js

// 通常の敵
class Enemy {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.speed = speed || 1; // デフォルトは1
    this.moveRight = true;

    this.image = new Image();
    this.image.src = "../assets/enemy.png";
  }

  update() {
    // 横移動 → 端に着いたら方向転換＆少し下がる
    if (this.moveRight) {
      this.x += this.speed;
      if (this.x > 440) {
        this.moveRight = false;
        this.y += 10;
      }
    } else {
      this.x -= this.speed;
      if (this.x < 40) {
        this.moveRight = true;
        this.y += 10;
      }
    }
  }

  shoot(enemyBullets) {
    enemyBullets.push(new EnemyBullet(this.x, this.y + this.height / 2));
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
  }
}

// ボス用クラス
class Boss {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 80;
    this.height = 80;

    // 耐久度(HP)
    this.hp = 10;

    // ボスの移動用
    this.speed = 1;
    this.moveRight = true;

    // ボス用画像
    this.image = new Image();
    this.image.src = "./assets/boss.png";
  }

  update() {
    // 横移動だけのシンプル例
    if (this.moveRight) {
      this.x += this.speed;
      if (this.x > 400) {
        this.moveRight = false;
      }
    } else {
      this.x -= this.speed;
      if (this.x < 80) {
        this.moveRight = true;
      }
    }
  }

  shoot(enemyBullets) {
    // 弾を複数方向に撃つなど工夫も可能
    enemyBullets.push(new EnemyBullet(this.x, this.y + this.height / 2));
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );

    // ボスの HP バーを描画する例（任意）
    const barWidth = this.width;
    const barHeight = 6;
    ctx.fillStyle = "#555";
    ctx.fillRect(this.x - barWidth / 2, this.y - this.height / 2 - 10, barWidth, barHeight);

    const hpRatio = this.hp / 10;  // 最大HP=10の場合
    ctx.fillStyle = "lime";
    ctx.fillRect(
      this.x - barWidth / 2,
      this.y - this.height / 2 - 10,
      barWidth * hpRatio,
      barHeight
    );
  }
}

