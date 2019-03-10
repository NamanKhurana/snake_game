$(document).ready(function(){

    //DEFINE VARS
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");

    var w = canvas.width;
    var h = canvas.height;
    
    var cw = 15;
    var d = "right";
    var food;
    var score;
    var color = "green"
    var speed = 90;
    var gamePaused = false;
    //SNAKE ARRAY
    var snake_array;
    
    //INITIALISER
    function init()
    {  d = "right"
       create_snake();
       create_food();
       score = 0;

       if(typeof game_loop != "undefined") clearInterval(game_loop);

       game_loop = setInterval(paint,speed);
       
    }

    init();
    
    //CREATE SNAKE FUNCTION
    function create_snake()
    {
        var length = 5;

        snake_array = [];

        for(var i = length-1 ; i>=0 ;i--)
        {
            snake_array.push({x:i,y:0})
        }
    }

    //CREATE FOOD
    function create_food()
     {
        food = {
            x:Math.round(Math.random()*(w-cw)/cw),
            y:Math.round(Math.random()*(h-cw)/cw)
        }
     }

     //PAINT SNAKE
     function paint()
     {
         //Paint the canvas
         ctx.fillStyle = "black";
         ctx.fillRect(0,0,w,h);
         ctx.strokeStyle = "white";
         ctx.strokeRect(0,0,w,h);

         var nx = snake_array[0].x;
         var ny = snake_array[0].y;

         if(d == "right") nx++
         else if(d == "left") nx--
         else if(d == "up") ny--
         else if(d == "down") ny++;

         //COLLIDE CODE
         if(nx == -1 || nx == w/cw || ny==-1 || ny == h/cw || check_collision(nx,ny,snake_array))
         {
            // init()
             //INSERT FINAL SCORE
             $("#final_score").html(score)
             //SHOW OVERLAY
             $("#overlay").fadeIn(300)
             return
         }
         
         if(nx == food.x && ny == food.y)
         {
             var tail = {x:nx,y:ny}
             score++

             //CREATE FOOD
             create_food()
         }
         else
         {
             var tail = snake_array.pop()
             tail.x = nx;
             tail.y = ny;
         }

         snake_array.unshift(tail)

         for(var i = 0;i<snake_array.length;i++)
         {
             var c = snake_array[i]
             paint_cell(c.x,c.y)
         }
         
         //Paint Cell
         paint_cell(food.x,food.y)

         //Check Score
         checkscore(score)

         //DISPLAY CURRENT SCORE
         $("#score").html("Your Score: " + score)
     }

     function paint_cell(x,y)
     {
         ctx.fillStyle = color
         ctx.fillRect(x*cw,y*cw,cw,cw)
         ctx.strokeStyle = "white"
         ctx.strokeRect(x*cw,y*cw,cw,cw)
     }

     function check_collision(x,y,array)
     {
         for(var i = 0;i<array.length;i++)
         {
             if(array[i.x == x && array[i].y == y])
             return true
         }
         
         return false
     }

     function checkscore(score)
     {
        if(localStorage.getItem("highscore") === null)
        {
            //IF HIGHSCORE IS NOT THERE
            localStorage.setItem("highscore",score)
        }
        else
        {
            //IF HIGHSCORE IS THERE
            if(score > localStorage.getItem("highscore"))
            {
                localStorage.setItem("highscore",score)
            }
        }

        $("#high_score").html("High Score: " + localStorage.highscore)
     }

     function pauseGame() {
        if (!gamePaused) {
          clearInterval(game_loop);
          gamePaused = true;
        } else if (gamePaused) {
          game_loop = setInterval(paint,speed);
          gamePaused = false;
        }
      }


     $(document).keydown(function(e){
         var key = e.which;
         if(key == '37' && d!='right') d = "left"
         else if(key == '38' && d!='down') d = "up"
         else if(key == '39' && d!='left') d = "right"
         else if(key == '40' && d!='up') d = "down"
         else if (key == "80") pauseGame()
     })
})

function resetScore()
{
    localStorage.highscore = 0
    //DISPLAY HIGH SCORE
   document.getElementById("high_score").innerHTML = "High Score: 0" 
}