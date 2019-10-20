// phina.js をグローバル領域に展開
phina.globalize();

const ASSETS_PREV = {
  image: {
    "s01": "./img/s_01_nazotoki-game.png",
    "s02": "./img/s_02_tamaruinarijinja-ni.png",
    "s03": "./img/s_03_binbougami.png",
    "s04": "./img/s_04_ga-yattekita.png",
    "s05": "./img/s_05_sankamuryou.png",
  }
}
const ASSETS_AFTER = {
  image: {
    "background": "./img/background.png",
    "binbougami": "./img/binbougami.png",
     // "perlin": "img/perlinNoise.png",//パーリンノイズ画像
  }
}

const messages = {
  'm1': '古より貧乏と呼ばれ続けた神さま「窮鬼（きゅうき）」',
  'm2': '兼ねてからの汚名を払い、幸せになるために「幸福、　',
  'm3': 'お金、ご利益」が貯まるといわれる田丸稲荷神社に　　',
  'm4': 'やってきた。　　　　　　　　　　　　　　　　　　　',
  'm5': '　',
  'm6': '図らずしも己の運命によって「貧しさ」という災厄を　',
  'm7': '振りまいてしまっていた窮鬼に、田丸稲荷神社のご祭神',
  'm8': '倉稲魂命（ウカノミタマ）は、三つのお題を貧乏神に　',
  'm9': '出した。　　　　　　　　　　　　　　　　　　　　　',
  'm10': '　',
  'm11': 'そのお題の答えこそ、窮鬼を貧乏神の運命から解き放つ',
  'm12': 'ものであるという。　　　　　　　　　　　　　　　　',
  'm13': '　',
  'm14': '非難の運命に飲み込まれながらも抜け出そうとする　　',
  'm15': '貧乏神の願いを叶えるため、共にお題を解き明かそう！',
};


const SCENE_01 = 2;
const SCENE_02 = 3;
const SCENE_03 = 4;
const SCENE_04 = 5;
const SCENE_05 = 6;
const SCENE_06 = 7;
const SCENE_07 = 10;
const SCENE_08 = 12;

var SCREEN_WIDTH = 640;
var SCREEN_HEIGHT = 480;

// MainScene クラスを定義
phina.define('MainScene', {
  superClass: 'DisplayScene',
  init: function(option) {
    this.superInit(option);

    this.messageAreaLayer = DisplayElement().addChildTo(this);
    this.messageLayer = DisplayElement().addChildTo(this);
    this.imageLayer = DisplayElement().addChildTo(this);
    this.stringLayer = DisplayElement().addChildTo(this);

    var makeSprite = function (layer, self, key) {
      sprite = Sprite(key).addChildTo(layer);
      sprite.x = self.gridX.center();
      sprite.y = self.gridY.center();
      sprite.width = SCREEN_WIDTH;
      sprite.height = SCREEN_HEIGHT;
      sprite.alpha = 0
      return sprite;
    }

    // 背景色
    this.backgroundColor = 'black';

    // update中の経過秒数計測用
    this.time = 0;

    // アセットローダー
    this.loader = phina.asset.AssetLoader();

    var self = this;
    // ロード後、処理
    this.loader.on('load', function() {
      // スプライト作成
      for (var key in ASSETS_AFTER.image) {
        self[key] = makeSprite(self.imageLayer, self, key);
      };
    });

    var rectPropertie = {
      x: this.gridX.center(),
      y: this.gridY.center(),
      width: SCREEN_WIDTH-10,
      height: SCREEN_HEIGHT-10,
      backgroundColor: 'white',
      fill: 'white',
      stroke: 'black',
      strokeWidth: 10,
    }
    this.messageAreaLayer.alpha = 0;
    this.messageArea = RectangleShape(rectPropertie).addChildTo(this.messageAreaLayer);

    var yPosition = 5;
    var fontSize = 24;
    for (var key in messages) {
      yPosition = yPosition + fontSize + 5;
      var labelPropertie = {
        text: messages[key],
        fontSize: fontSize,
        x: this.gridX.center(),
        y: yPosition,
        // x: this.gridX.center(),
        // y: this.gridY.center(),
        // width: SCREEN_WIDTH-10,
        // height: SCREEN_HEIGHT-10,
      }
      this[key] = Label(labelPropertie).addChildTo(this.messageLayer);
      this[key].alpha = 0;
    }

    // スプライト作成
    for (var key in ASSETS_PREV.image) {
      this[key] = makeSprite(this.stringLayer, this, key);
    };

    this.messageIndex = 1;
    this.previusTime = 0;
  },
  update: function (app) {
    this.time += app.deltaTime;
    calc_time = (this.time / 1000).toFixed(3)

    switch (Math.floor(calc_time)) {
      case SCENE_01:
        this.loader.load(ASSETS_AFTER);
        this.s01.tweener.fadeIn(500).play();
        break;
      case SCENE_02:
        this.s02.tweener.fadeIn(500).play();
        break;
      case SCENE_03:
        this.s03.tweener.fadeIn(500).play();
        break;
      case SCENE_04:
        this.s04.tweener.fadeIn(500).play();
        break;
      case SCENE_05:
        this.background.tweener.fadeIn(500).play();
        break;
      case SCENE_06:
        this.binbougami.tweener.fadeIn(3000).play();
        break;
      case SCENE_07:
        this.s05.tweener.fadeIn(100).play();
        break;
      case SCENE_08:
        this.messageAreaLayer.tweener.fadeIn(1000).play();
        this.imageLayer.alpha = 0.1;
        this.stringLayer.alpha = 0.1;
        break;
    }

    var messageStartTime = SCENE_08 + 1;

    math_calc_time = Math.floor(calc_time)
    if (math_calc_time > messageStartTime) {
      if (this.messageIndex <= Object.keys(messages).length) {
        if (math_calc_time > this.previusTime) {
          if ((math_calc_time - messageStartTime) % 2) {
            var key = "m" + (this.messageIndex);
            this[key].tweener.fadeIn(500).play();
            this.messageIndex = this.messageIndex + 1
          }
          this.previusTime = math_calc_time;
        }
      }
    }

  }
});

// メイン処理
phina.main(function() {
  // アプリケーション生成
  var app = GameApp({
    startLabel: 'main', // メインシーンから開始する
    fit: false,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    assets: ASSETS_PREV,
  });
  // アプリケーション実行
  app.run();
});



