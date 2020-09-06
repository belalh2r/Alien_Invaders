const name=document.querySelector('.name');
const level=document.querySelector('.level');
const score=document.querySelector('.score');
const message=document.querySelector('.message');
const container=document.querySelector('.container');
const startBtn=document.querySelector('.startBtn');
const ship=document.querySelector('.ship');
const fire=document.querySelector('.fire');
const containerDim=container.getBoundingClientRect();
//class

class Player{
	constructor(name){
		this.name=name;
        this.level=1;
        this.score=0;
        this.fire=false;
        this.speed=5;
        this.gameOver=false;
        this.startGame=false;
    }
        shoot(){
            fire.classList.remove('hide');
            this.fire=true;    
            fire.X=ship.offsetLeft+(ship.offsetWidth/2.3);
            fire.Y=ship.offsetTop-15;
            fire.style.left=fire.X+"px";
            fire.style.top=fire.Y+"px";
    }
}
class Alien{
    constructor(speed){
        this.speed=speed,
        this.x;
        this.y;
        this.color;
    }
    color(){
        return "#"+Math.random().toString(16).substr(-6);
    }

}
//object
const keyV={ 
}
const player=new Player(name);
const alien=new Alien(5);
//event Listener

document.addEventListener('keydown',function(e){
    const key=e.keyCode;
    if(key===32){
        if((!player.fire)&&player.startGame){
            player.shoot();
            fire.classList.remove('none');
        }

    }else if(key===37){
        keyV.left=true;
    }else if(key===39){
        keyV.right=true;
    }
})

document.addEventListener('keyup',function(e){
    const key=e.keyCode;
     if(key===37){
        keyV.left=false;
    }else if(key===39){
        keyV.right=false;
    }
})
startBtn.addEventListener('click',startGame);


//function
function init(){
    startBtn.classList.remove('hide');
    startBtn.textContent="Restart New Game";
    player.gameOver=true; 
    player.level=1; 
    player.startGame=false;
}

function gameOver(){
    init()
    clearAliens();
}
function nextLevel(){
    player.level++;
    alien.speed+=1;
    clearAliens();
    if(player.level===4){
        winGame();
    }else{
      startGame();
    }
}
function winGame(){
    message.textContent="you won";
    init()
}
function startGame(){
    startBtn.classList.add('hide');
    player.startGame=true;
    player.gameOver=false;
    alien.x=Math.floor(containerDim.left)+20;
    alien.y=100;
    player.score=0;
    level.textContent=player.level;
    score.textContent=player.score;
    setupAliens(player.level*4);
    requestAnimationFrame(update);
}

function isCollide(a, b) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height) < (bRect.top)) ||
        (aRect.top > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width) < bRect.left) ||
        (aRect.left > (bRect.left + bRect.width))
    );
}

function setupAliens(num){
    let lastCol=containerDim.width;
    let tmpWidth=100;
    for(let i=0;i<num;i++){
        if(alien.x>(lastCol)){
            alien.x=Math.floor(containerDim.left)+20;
             alien.y+=80;
        }
        alienMaker(alien,tmpWidth);
        alien.x+=tmpWidth+20;
    }
}
function alienMaker(alien,tmpWidth){
   if(alien.y>containerDim.height-250)return 0;
   let div=document.createElement('div');
   div.classList.add('alien');
   div.style.width=tmpWidth+"px";
   div.style.backgroundColor=alien.color();
   //left eye
   let eye1=document.createElement('span');
   eye1.classList.add('eye');
   eye1.style.left=10+"px";
   div.appendChild(eye1);
    //left eye
    let eye2=document.createElement('span');
    eye2.classList.add('eye');
    eye2.style.right=10+"px";
    div.appendChild(eye2);
    //mouth
    let mouth=document.createElement('span');
    mouth.classList.add('mouth');
    div.appendChild(mouth);

   div.x=Math.floor(alien.x);
   div.y=Math.floor(alien.y);
   div.style.left=div.x+"px";
   div.style.top=div.y+"px";
   div.directionMove=1;
   container.appendChild(div);
}
function clearAliens(){
    let tmpAliens=document.querySelectorAll('.alien');
    tmpAliens.forEach(function(tmpAlien){
        tmpAlien.parentNode.removeChild(tmpAlien);
    })

}
function update(){
    if(!player.gameOver){ 
        let tmpShipPos=ship.offsetLeft;
        let tmpAlien=document.querySelectorAll('.alien');
        if(tmpAlien.length===0){
                nextLevel()
        }
        for(let i=tmpAlien.length-1;i>=0;i--){
            let el=tmpAlien[i];
            if(el.offsetLeft<containerDim.left||el.offsetLeft+el.offsetWidth>containerDim.right){
                el.y+=40;
                el.directionMove*=-1;
            }
            el.x+=(alien.speed*el.directionMove);
            el.style.left=el.x+'px';
            el.style.top=el.y+'px'; 
            if(isCollide(el,fire)){
                player.score++;
                player.fire=false;
                score.textContent=player.score;
                fire.classList.add('none');
                el.remove();
            }
             if(el.offsetTop+el.offsetWidth-40>=ship.offsetTop){
                gameOver();
            }       
        }
        if(player.fire){
            if(fire.Y>0){
                fire.Y-=15;
                fire.style.top=fire.Y+'px';
            }else{
                player.fire=false;
                fire.classList.add('hide');
                fire.Y=containerDim.height+100;
            }
        }
        if(keyV.left&&tmpShipPos>containerDim.left){
                    tmpShipPos-=player.speed;
        }
        if(keyV.right&&(tmpShipPos+ship.offsetWidth)<containerDim.right){
            tmpShipPos+=player.speed;
        }
        ship.style.left=tmpShipPos+"px";
        requestAnimationFrame(update);
    }
}