const DEFAULT_BALL_COLOR = 'blue';

function Ball(size, xCord, yCord, xSpeed, ySpeed){
  this.y = yCord;
  this.x = xCord;
  this.size = size;
  this.xSpeed = xSpeed;
  this.ySpeed =ySpeed;
  this.ballType = 'square'

  this.init = function(){
    this.ballElement = document.createElement('div')
    this.antImg = document.createElement('img')
    this.antImg.setAttribute('src', './images/ant_2.gif')
    this.antImg.setAttribute('width', '100%')
    this.antImg.setAttribute('height', '100%')
    this.antImg.setAttribute('alt', 'ant gif')
    this.antImg.setAttribute('class', 'bugImg')
    this.ballElement.style.height = this.size + 'px';
    this.ballElement.style.width = this.size + 'px';
    this.ballElement.style.display = 'inline-block';
    this.ballElement.style.position = 'absolute';
    this.ballElement.style.left = this.x + 'px';
    this.ballElement.style.top = this.y + 'px';
    this.ballElement.style.transform = 'rotate(180deg)'
    this.ballElement.setAttribute('class', 'bug')

    this.ballElement.appendChild(this.antImg)

    return this;
  }

  this.setXSpeed = function(xSpeed){
    this.xSpeed = xSpeed
  }

  this.getXSpeed = function(){
    return this.xSpeed;
  }

  this.setYSpeed = function(ySpeed){
    this.ySpeed = ySpeed
  }

  this.getYSpeed = function(){
    return this.ySpeed;
  }

  this.createCircle = function(){
    this.ballElement.style.borderRadius = '50%';
    this.ballType = 'circle'
  }

  this.getBallType = function(){
    return this.ballType;
  }

  this.getElement = function(){
    return this.ballElement;
  }

  this.setSize = function(size){
    this.ballElement.style.width = size + 'px';
    this.ballElement.style.height = size + 'px';
    this.width = size;
    this.height = size;
  }

  this.getSize = function(){
    return this.size;
  }

  this.getElement = function(){
    return this.ballElement;
  }

  this.getPosition = function(){
    return {x : this.x, y : this.y};
  }

  this.setPosition = function(pos){
    this.x = pos.x;
    this.y = pos.y;
  }

  this.move = function(){
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }

  this.draw = function(){
    this.ballElement.style.left = this.x + 'px';
    this.ballElement.style.top = this.y + 'px';
  }

  this.checkCollision= function(otherBoxCord){
    if(this.getPosition() == otherBoxCord.getPosition()){
      return true;
    }
    return false;
  }
}
