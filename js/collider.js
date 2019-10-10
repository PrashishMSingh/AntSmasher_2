const INTERVAL_SPEED = 40;
const MAIN_CONTAINER_WIDTH = 300;
const MAIN_CONTAINER_HEIGHT = 300;

function BallController(ballCount, parentClass){
  this.ballList = []
  this.xSpeed = 2;
  this.ySpeed = 2;
  this.DEFAULT_BALL_SIZE = 20;
  this.ballCount = ballCount
  this.DEFAULT_X_POSITION = 0;
  this.DEFAULT_Y_POSITION = 0;
  this.bugHitCount = 0;
  this.parentElement = document.getElementsByClassName(parentClass)[0];

  this.ballsXPositionList = []
  this.ballsYPositionList = []

  this.setDefaultParentStyle = function(){
      this.parentElement.style.position = 'relative';
      this.parentElement.style.height =MAIN_CONTAINER_HEIGHT + 'px';
      this.parentElement.style.width =MAIN_CONTAINER_WIDTH + 'px';
      this.parentElement.style.border = '#dcdcdc solid 2px';
      return this
  }

  this.getElement = function(){
    return this.parentElement
  }

  this.create = function(){
    for(var i = 0; i< this.ballCount; i++){
      var xPos = Math.floor(Math.random() * MAIN_CONTAINER_WIDTH) - 1;
      var yPos = (Math.floor(Math.random() * MAIN_CONTAINER_WIDTH) + 1);
      var ball = new Ball(this.DEFAULT_BALL_SIZE, xPos, yPos, this.xSpeed, this.ySpeed).init();
      this.parentElement.appendChild(ball.getElement())
      this.ballList.push(ball)
    }
  }

  this.removeBug = function(bug){
    console.log("bug.className : ", bug.className)
    if(bug.className === 'bugImg'){
      this.bugHitCount++
      var parentElement = bug.parentElement
      this.ballList = this.ballList.filter(singleBug => parentElement !== singleBug.getElement())
      this.parentElement.removeChild(parentElement)
    }
  }

  this.update = function(){
    var updateInterval = setInterval((function(){
      if(this.bugHitCount !== ballCount){
        this.parentElement.style.border = '#dcdcdc solid 2px';
        // for every element in list
        for(var i = 0 ; i<this.ballList.length; i++ ){
          var ballPos = this.ballList[i].getPosition()
          // check if the ball has colided in the left and right border

          // collided to right border
          if(ballPos.x >= MAIN_CONTAINER_WIDTH - this.DEFAULT_BALL_SIZE){
            this.ballList[i].setXSpeed(-(this.xSpeed))
            this.parentElement.style.borderRight = '2px solid red';
            this.ballList[i].getElement().style.transform = 'rotate(270deg)'
          }

          // collided to left border
          else if(ballPos.x < 0){
            this.ballList[i].setXSpeed(Math.abs(this.xSpeed))
            this.ballList[i].getElement().style.transform = 'rotate(90deg)'
            this.parentElement.style.borderLeft = '2px solid red';
          }

          // check if the ball has colided in the bottom border
          var y = ballPos.y;
          if(ballPos.y >= MAIN_CONTAINER_HEIGHT - this.DEFAULT_BALL_SIZE){

            this.ballList[i].setYSpeed(-(this.ySpeed))
            this.ballList[i].getElement().style.transform = 'rotate(0deg)'
            this.parentElement.style.borderBottom = '2px solid red';
          }

          if(ballPos.y < 0 ){
            this.ballList[i].setYSpeed(Math.abs(this.ySpeed))
            this.ballList[i].getElement().style.transform = 'rotate(180deg)'
            this.parentElement.style.borderTop = '2px solid red';
          }

          var collisionOutput = this.checkCollision(i)


          // check which ball had collision and from where
          if(collisionOutput){
            var collidedBall = collisionOutput.collidedBall
            var collisionPlace = collisionOutput.collisionPlace

            switch(collisionPlace){
              case 'right':
                collidedBall.setXSpeed(-collidedBall.xSpeed)
                this.ballList[i].setXSpeed(Math.abs(this.ballList[i].xSpeed))
                collidedBall.getElement().style.transform = 'rotate(270deg)'
                this.ballList[i].getElement().style.transform = 'rotate(90deg)'
                break

              case 'left':
                this.ballList[i].setXSpeed(-(this.ballList[i].xSpeed))
                collidedBall.setXSpeed(Math.abs(collidedBall.xSpeed))
                collidedBall.getElement().style.transform = 'rotate(90deg)'
                this.ballList[i].getElement().style.transform = 'rotate(270deg)'
                break

              case 'top':
                this.ballList[i].setYSpeed(-(this.ballList[i].ySpeed))
                collidedBall.setYSpeed(Math.abs(collidedBall.ySpeed))
                collidedBall.getElement().style.transform = 'rotate(180deg)'
                this.ballList[i].getElement().style.transform = 'rotate(0deg)'
                break

              case 'bottom':
                collidedBall.setYSpeed(-collidedBall.ySpeed)
                this.ballList[i].setYSpeed(Math.abs(this.ballList[i].ySpeed))
                collidedBall.getElement().style.transform = 'rotate(0deg)'
                this.ballList[i].getElement().style.transform = 'rotate(180deg)'
                break
            }

          this.ballList[i].move()
          this.ballList[i].draw()
          collidedBall.move()
          collidedBall.draw()

          collidedBall.getElement().style.backgroundColor = 'red'
          this.ballList[i].getElement().style.backgroundColor = 'black'
        }
          this.ballList[i].move()
          this.ballList[i].draw()
        }
      }
      else{
        console.log("Won")
        var finishWrapper = document.getElementsByClassName('gameOverWrapper')[0]
        finishWrapper.style.display = 'inline-block'

        var scoreValue = document.getElementsByClassName('score-value')[0]
        scoreValue.innerHTML = this.bugHitCount

        var playAgainBtn = document.getElementsByClassName('nextBtn')[0]
        playAgainBtn.onclick = (function(){
          console.log('here')
          finishWrapper.style.display = 'none'
          this.create()
          this.update()
          this.bugHitCount = 0
        }).bind(this)
        clearInterval(updateInterval)
      }

    }).bind(this), INTERVAL_SPEED)
  }


  this.checkCollision = function(index){
    var ball = this.ballList[index]
    for(var i = 0; i<this.ballList.length; i++){
      if(i !== index){
        var leftCollision = ball.x <= (this.ballList[i].x + this.ballList[i].size)
        var rightCollision = (ball.x + ball.size) >= this.ballList[i].x
        var bottomCollision = (ball.y + ball.size) >= this.ballList[i].y
        var topCollision = ball.y <= (this.ballList[i].y + this.ballList[i].size)
        var collisionPlace = ''

        if(ball.getBallType() === 'square'){
          if(leftCollision && rightCollision && topCollision && bottomCollision){
            var minDiff = this.DEFAULT_BALL_SIZE

            var leftDiff = ball.x - this.ballList[i].x - this.ballList[i].size
            var rightDiff = (ball.x + ball.size) - this.ballList[i].x
            var bottomDiff = (ball.y + ball.size) - this.ballList[i].y
            var topDiff = ball.y - (this.ballList[i].y + this.ballList[i].size)

            if( leftDiff < minDiff){
              minDiff = leftDiff
              collisionPlace = 'left'
            }

            if(rightDiff < minDiff){
              collisionPlace = 'right'
              minDiff = rightDiff
            }

            if(bottomDiff < minDiff){
              collisionPlace = 'bottom'
              minDiff = bottomDiff

            }
            if(topDiff < minDiff){
              collisionPlace = 'top'
              minDiff = topDiff
            }

            return {
              collidedBall : this.ballList[i],
              collisionPlace: collisionPlace
            }
          }
        }
      }
    }
  }
}

var controller = new BallController(20, 'main-container')
controller.setDefaultParentStyle()
controller.getElement().onclick = function(e){
  controller.removeBug(e.target)
}
controller.create()
controller.update()
