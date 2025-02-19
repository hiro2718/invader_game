// js/player.js
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.speed = 5;

    // 残機（ライフ）
    this.lives = 3;

    // 弾のクールダウン
    this.cooldown = 0;
    this.cooldownMax = 10;

    // 画像を読み込む場合
    this.image = new Image();
    this.image.src = "../assets/player.png";
  }

  move(direction) {
    this.x += direction * this.speed;
    // 画面外には出ないようにクリップ
    if (this.x < this.width / 2) this.x = this.width / 2;
    if (this.x > 480 - this.width / 2) this.x = 480 - this.width / 2;
  }

  shoot(bullets) {
    if (this.cooldown === 0) {
      bullets.push(new Bullet(this.x, this.y - this.height / 2));
      this.cooldown = this.cooldownMax;
    }
    if (this.cooldown > 0) {
      this.cooldown--;
    }
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
