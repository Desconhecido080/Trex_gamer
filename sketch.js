//Variáveis
var trex, trexCorrendo, trexmorto;
var chao, chaoImg, chaoInvisivel;
var canvas;
var gravidade = 1.5; //y positivo é para baixo
var forcaPulo = -18; //y é para cima
var nuvem, nuvemImg;
var ob1, obs2, ob3, ob4, ob5, ob6;

var grupoCacto;
var grupoNuvens;

var somPulo, somDeath, somPonto;

var gameOver, gameOverImg;
var restart, restartImg;

var play = 1;
var end = 0;
var gameState = play;

//carregar animações
function preload() {
  trexCorrendo = loadAnimation("t1.png", "t3.png", "t4.png");
  trexmorto = loadAnimation('trex_collided.png');

  chaoImg = loadImage('ground2.png');
  nuvemImg = loadImage('cloud.png');

  ob1 = loadImage('obstacle1.png');
  ob2 = loadImage('obstacle2.png');
  ob3 = loadImage('obstacle3.png');
  ob4 = loadImage('obstacle4.png');
  ob5 = loadImage('obstacle5.png');
  ob6 = loadImage('obstacle6.png');

  restartImg = loadImage('restart.png');
  gameOverImg = loadImage('gameOver.png');

  somPulo = loadSound('jump.mp3');
  somDeath = loadSound('die.mp3');
  somPonto = loadSound('checkpoint.mp3');

}

function setup() {
  if (isMobileDevice()) {
    canvas = createCanvas(windowWidth, 400);
  }
  else {
    canvas = createCanvas(600, 200); //larg, alt
    canvas.center();
  }

  trex = createSprite(50, 150, 20, 50);
  trex.addAnimation("correndo", trexCorrendo);
  trex.addAnimation('meteoro', trexmorto)
  //adicione dimensão ao trex
  trex.scale = 0.5;

  //crie um sprite ground (solo)
  chao = createSprite(300, 170, 600, 20); //x, y,larg, alt
  chao.addImage("chao", chaoImg);

  chaoInvisivel = createSprite(60, 230)
  chaoInvisivel.visible = false

  gameOver = createSprite(width / 2, 100);
  gameOver.addImage(gameOverImg)
  gameOver.scale = 0.5

  restart = createSprite(width / 2, 150);
  restart.addImage(restartImg);
  restart.scale = 0.5

  grupoCacto = createGroup()
  grupoNuvens = createGroup()

  score = 0;
  //console.log(score)

  trex.setCollider('circle', 0, 0);
  //trex.debug = true;

}

function draw() {// desenhar
  background(180); //fundo



  //desenha os sprite
  //frameRate(50);
  //console.log(frameCount)

  if (gameState === play) {
    chao.velocityX = -(6 + score / 1000);

    trex.changeAnimation("correndo");


    score += 1;

    if (score > 0 && score % 100 === 0) {
      somPonto.play();
    }

    if (chao.x < 0) { //verifica se saiu da tela esquerda
      chao.x = chao.width / 2;
    }

    var noChao = trex.collide(chaoInvisivel)


    if ((touches.length > 0 || keyDown("space")) && noChao) { // E
      trex.velocityY = forcaPulo;
      somPulo.play();
      touches = [];
    }

    trex.velocityY += gravidade;

    gerarNuvens();
    gerarObstaculos();

    if (grupoCacto.isTouching(trex)) {
      gameState = end;
      somDeath.play();
    }

    gameOver.visible = false;
    restart.visible = false;

  }
  else if (gameState === end) {
    trex.velocityY = 0;
    chao.velocityX = 0;
    grupoNuvens.setVelocityXEach(0);
    grupoCacto.setVelocityXEach(0);

    grupoNuvens.setLifetimeEach(-1);
    grupoCacto.setLifetimeEach(-1,);

    if (mousePressedOver(restart) || touches.length > 0) {
      reset();
      touches = [];
    }

    gameOver.visible = true;
    restart.visible = true;

    trex.changeAnimation('meteoro');


  }




  trex.collide(chaoInvisivel);

  drawSprites();

  fill('black');
  text("Pontos:" + score, width - 150, 30);

}

//gera um resultado igual a zero somente quando o frameCount é múltiplo de 60
//como 0, 60, 120, 180 etc..

function reset() {
  gameState = play;
  gameOver.visible = false;
  restart.visible = false;

  score = 0;


  grupoCacto.destroyEach();
  grupoNuvens.destroyEach();
}

//criando a função
function gerarNuvens() {
  if (frameCount % 80 === 0) {
    nuvem = createSprite(width + 50, 50, 40, 10);
    nuvem.addImage('nuvem', nuvemImg)
    nuvem.velocityX = -3;
    nuvem.y = Math.round(random(30, 100))
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;

    nuvem.lifetime = width + 50;

    grupoNuvens.add(nuvem);
  }

}

function gerarObstaculos() {

  var intervaloBase = 60;
  if (score > 500) {
    intervaloBase = 30;
  }

  if (frameCount % intervaloBase === 0) {
    var cacto = createSprite(width + 50, 160, 10, 40);
    cacto.velocityX = -(6 + score / 1000);

    var rand = Math.round(random(1, 6));
    //console.log(rand);
    switch (rand) {
      case 1: cacto.addImage(ob1);
        //cacto.scale = 0.8
        break;
      case 2: cacto.addImage(ob2);
        break;
      case 3: cacto.addImage(ob3);
        break;
      case 4: cacto.addImage(ob4);
        break;
      case 5: cacto.addImage(ob5);
        break;
      case 6: cacto.addImage(ob6);
        break;
    }
    cacto.scale = 0.6;
    cacto.lifetime = width + 50;
    grupoCacto.add(cacto);
    cacto.setCollider('circle', 0, 0);
    //cacto.debug = true;

  }
}


function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

