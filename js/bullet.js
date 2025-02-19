// js/bullet.js

// プレイヤー弾クラス
class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 4;
    this.height = 10;
    this.speed = 7;
  }

  update() {
    // 上方向に進む
    this.y -= this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = "yellow";
    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
  }
}

// 敵弾クラスを追加
class EnemyBullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 4;
    this.height = 10;
    this.speed = 5;
  }

  update() {
    // 下方向に進む
    this.y += this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = "pink";
    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
  }
}
