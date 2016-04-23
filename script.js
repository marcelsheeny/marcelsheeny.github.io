var SPEED = 100;
var WIDTH = 30;
var HEIGTH = 30;


//Drawing Class
function Rendering ()
{
	this.canvas = document.getElementById("myCanvas");
	this.ctx = this.canvas.getContext("2d");
	this.width = this.ctx.canvas.width;
	this.height = this.ctx.canvas.height;
	this.game = new Game(WIDTH,HEIGTH);
	this.sizeCellX = this.width/(this.game.width);
	this.sizeCellY = this.height/(this.game.height);
}

function doKeyDown(evt) {
	switch (evt.keyCode)
	{
		case 38:  /* Up arrow was pressed */
			var dirr = 1;
		break;
		case 40:  /* Down arrow was pressed */
			var dirr = 2;
		break;
		case 37:  /* Left arrow was pressed */
			var dirr = 3;
		break;
		case 39:  /* Right arrow was pressed */
			var dirr = 4;
		break;
	}
	rendering.game.snake.move(dirr);
}

Rendering.prototype = 
{
	constructor:Rendering,
	draw:function()
	{
		this.clear();
		this.game.clear();
		this.game.update();
		for (var i = 0; i < this.game.width; i++)
		{
			for (var j = 0; j < this.game.height; j++)
			{
				if (this.game.map.get(i,j) == 2)
				{
					this.drawCell(i,j,"#FFFF00");
				}
				else if (this.game.map.get(i,j) == 1)
				{
					this.drawCell(i,j,"#FF0000");
				}
				else if (this.game.map.get(i,j) == 3)
				{
					this.drawCell(i,j,"#00FF00");
				}
			}
		}
		this.game.map.printMatrix();
		console.log();
		
	},
	clear:function()
	{
		this.ctx.fillStyle = "#FFFFFF";
		this.ctx.fillRect(0,0,this.width,this.height);
	},
	drawCell:function(i,j, color)
	{
		this.ctx.fillStyle = color;
		this.ctx.fillRect(i*this.sizeCellX,j*this.sizeCellY,this.sizeCellX,this.sizeCellY);
	}
}

//Game Class
function Game(width,height)
{
	this.width = width;
	this.height = height;
	this.init();
}

Game.prototype = 
{
	constructor:Game,
	clear:function()
	{
		this.map = new Matrix(this.width,this.height);
	},
	init:function()
	{
		this.map = new Matrix(this.width,this.height);
		this.snake = new Snake(this.width,this.height);
		this.map.set(this.snake.childs[0].x,this.snake.childs[0].y,1);
		this.gold = new Gold(this.width,this.height);
	},
	update:function()
	{
		this.checkDeath();
		this.snake.update();
		for (var i = this.snake.childs.length-1; i >= 0; i--)
		{
			this.map.set(this.snake.childs[i].x,this.snake.childs[i].y,1);
		}
		this.map.set(this.gold.x,this.gold.y,2);
		this.ateGold();
	},
	ateGold:function()
	{
		if (this.snake.childs[0].x == this.gold.x && this.snake.childs[0].y == this.gold.y)
		{
			var lastChild = this.snake.childs[this.snake.childs.length-1];
			if (this.snake.currDirection == 1)
			{
				this.snake.childs.push
				(
					new SnakeChild(lastChild.x, lastChild.y-1, lastChild.x, lastChild.y)
				);
			}
			else if (this.snake.currDirection == 2)
			{
				this.snake.childs.push
				(
					new SnakeChild( lastChild.x, lastChild.y+1, lastChild.x, lastChild.y)
				);
			}
			else if (this.snake.currDirection == 3)
			{
				this.snake.childs.push
				(
					new SnakeChild( lastChild.x-1, lastChild.y, lastChild.x, lastChild.y)
				);
			}
			else if (this.snake.currDirection == 4)
			{
				this.snake.childs.push
				(
					new SnakeChild( lastChild.x+1, lastChild.y, lastChild.x, lastChild.y)
				);
			}
			this.gold.newLocation();
		}
	},
	checkDeath:function()
	{
		if (this.snake.childs[0].x < 0 || this.snake.childs[0].x >= this.width ||
		    this.snake.childs[0].y < 0 || this.snake.childs[0].y >= this.height)
		{
			this.reset();
		}
		for (var i = 1; i < this.snake.childs.length; i++)
		{
			if (this.snake.childs[0].x == this.snake.childs[i].x &&
				this.snake.childs[0].y == this.snake.childs[i].y)
			{
				this.reset();
			}
		}
	},
	reset:function()
	{
		this.init();
	}
}

//Matrix Class
function Matrix(rows,cols)
{
	this.r = rows;
	this.c = cols;
	this.m = math.zeros(this.r, this.c);
}

Matrix.prototype = {
    constructor: Matrix,
	set:function(rows,cols,value)
	{
		this.m.subset(math.index(rows, cols),value);  
	},
	get:function(rows,cols)
	{
		return this.m.subset(math.index(rows, cols));    
	},
	printMatrix()
	{
		var m = "";
		for (var i = 0; i < this.width; i++)
		{
			for (var j = 0; j < this.height; j++)
			{
				m += (this.get(i,j)+"\t");
			}
			m += ("\n");
		}
		console.log(m);
	}
	
}


function SnakeChild (xx,yy,prevxx,prevyy)
{
	this.x = xx;
	this.y = yy;
	this.prevx = prevxx;
	this.prevy = prevyy;
}

function Snake (width,height)
{
	this.currDirection = 4; //1 -> up, 2 -> down, 3 -> left, 4->right
	var x = width/2-1;
	var y = height/2-1;
	this.childs = [new SnakeChild(x,y,-1,-1), new SnakeChild(x-1,y,x,y), new SnakeChild(x-2,y,x-1,y), new SnakeChild(x-3,y,x-2,y)];
}

Snake.prototype = {
	constructor: Snake,
	move:function (dirr)
	{
		if ((this.currDirection == 4 && dirr != 3) ||
		    (this.currDirection == 3 && dirr != 4) ||
			(this.currDirection == 1 && dirr != 2) ||
			(this.currDirection == 2 && dirr != 1) )
		{
			this.currDirection = dirr;
		}
	},
	update:function()
	{
		this.childs[0].prevx = this.childs[0].x;
		this.childs[0].prevy = this.childs[0].y;
		if(this.currDirection == 1)
		{
			this.childs[0].y--;
		}
		else if (this.currDirection == 2)
		{
			this.childs[0].y++;
		}
		else if (this.currDirection == 3)
		{
			this.childs[0].x--;
		}
		else if (this.currDirection == 4)
		{
			this.childs[0].x++;
		}
		for (var i = 1; i < this.childs.length; i++)
		{
			this.childs[i].prevx = this.childs[i].x;
			this.childs[i].prevy = this.childs[i].y;
			this.childs[i].x = this.childs[i-1].prevx;
			this.childs[i].y = this.childs[i-1].prevy;
		}
	}
}

function Gold (width,height)
{
	this.w = width;
	this.h = height
	this.x;
	this.y;
	this.newLocation();
}

Gold.prototype = 
{
	constructor:Gold,
	newLocation:function()
	{
		this.x = Math.floor((Math.random() * this.w));
		this.y = Math.floor((Math.random() * this.h));
	}
}

var rendering;

function init()
{
	rendering = new Rendering();
	window.addEventListener('keydown',doKeyDown,true);
	draw();
}

function draw()
{
	rendering.draw();
}

setInterval(draw,SPEED);