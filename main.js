const canvas = document.getElementById('canvas');

const ctx = canvas.getContext('2d');

function createPiece(type)
{
    if (type === 'I') {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    } else if (type === 'L') {
        return [
            [0, 2, 0],
            [0, 2, 0],
            [0, 2, 2],
        ];
    } else if (type === 'J') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [3, 3, 0],
        ];
    } else if (type === 'O') {
        return [
            [4, 4],
            [4, 4],
        ];
    } else if (type === 'Z') {
        return [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'T') {
        return [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0],
        ];
    }
};
let myArena = createMatrix(12,20);
function createMatrix(width,height)
{
	const matrix = [];
	for(let i=0;i<height;i++)
		matrix.push(new Array(width).fill(0));
	return matrix;
};



function makePiece()
{
	const pieces = "ILJOZST";
	player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
	player.offset.y = 0;
    player.offset.x = 0;
    if (collideWall(myArena, player)) {
        myArena.forEach(row => row.fill(0));
        player.score = 0;
        myScore();
    }
}

ctx.scale(20,20);
function draw()
{
	//ctx.clearRect(0,0,300,500);
	ctx.fillStyle="#000";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	drawShape(myArena,{x:0,y:0});
	drawShape(player.matrix,player.offset);
};


function updateScore()
{
	player.score+=10;
};


function playerRotate(dir) {
    const offset = player.offset.x;
    let pos = 1;
    rotate(player.matrix, dir);
    while (collideWall(myArena, player)) {
        player.offset.x += pos;
        pos = -(pos + (pos> 0 ? 1 : -1));
        if (pos > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.offset.x = offset;
            return;
        }
    }
}
function lastRowFull(myArena,loc)
{
	for(let i=0;i<12;i++)
	{
		if(myArena[loc][i]===0 )
		{
			return false;
		}	
	}
	return true;
}
function clearLastRow(myAren)
{
	for(let i=0;i<=19;i++)
	{
		if(lastRowFull(myArena,i))
		{
			var newArena = [];
			var topRow=[];
			for(let i=0;i<12;i++)
				topRow.push(0);
			newArena.push(topRow);
			for(let j=0;j<i;j++)
				newArena.push(myArena[j]);
			for(let j=i+1;j<=19;j++)
			{
				newArena.push(myArena[j]);
			}
			//drawShape(newArena,{x:0,y:0});
			updateScore();
			myArena= newArena;
		}
	}
}



function rotate(matrix,dir)
{
	for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }

    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

function merge(myArena,player)
{
	player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                myArena[y + player.offset.y][x + player.offset.x] = value;
            }
        });
    });
	//console.table(myArena);
};

function collideWall(myArena,player)
{
	for(let i=0;i<player.matrix.length;i++)
	{
		for(j=0;j<player.matrix[i].length;j++)
		{
			if(player.matrix[i][j]!==0 && 
				(myArena[i+player.offset.y]&&
				myArena[i+player.offset.y][j+player.offset.x])!==0)
				return true;
		}
	}
	return false;
};

function playerMove(dir)
{
	player.offset.x+=dir;
	if(collideWall(myArena,player))
	{
		player.offset.x-=dir;
	}
}

function playerDrop()
{
	player.offset.y++;
	if(collideWall(myArena,player))
	{
		player.offset.y--;
		merge(myArena,player);
		makePiece();
		clearLastRow(myArena);
		myScore();
	}
	updateTime=0;
}
function drawShape(matrix,offset)
{
	for(let i=0;i<matrix.length;i++)
	{
		for(let j=0;j<matrix[i].length;j++)
		{
			if(matrix[i][j]!==0)
			{
				ctx.fillStyle=pieceColour[matrix[i][j]];
				ctx.fillRect(j+offset.x,i+offset.y,1,1);
			}	

		}
	}
};

let updateTime=0;
let currentTime=0;
function update(time=0)
{
	
	let differTime=time-currentTime;
	
	//console.log(differTime);
	updateTime+=differTime;
	if(updateTime>1000)
	{
		playerDrop();
	}
	currentTime=time;
	draw();
	requestAnimationFrame(update);
}
document.addEventListener('keydown',(event)=>{
	//console.log(event);
	event.isTrusted=false;
	if(event.keyCode===40)
	{
		playerDrop();
	}
	else if(event.keyCode===37)
	{
		playerMove(-1);
	}
	else if(event.keyCode===39)
	{
		playerMove(1);
	}
	else if(event.keyCode===87 || event.keyCode===38)
	{
		playerRotate(player.matrix,1);
	}
	else if(event.keyCode===81)
		playerRotate(player.matrix,-1);
});

function myScore() {
    document.getElementById('score').innerText = player.score;
}


const pieceColour = 
[	null,
	"rgb(0,240,240)",
	"rgb(0,0,240)",
	"rgb(240,160,0)",
	"rgb(240,240,0)",
	"rgb(0,240,0)",
	"rgb(240,0,160)",
	"rgb(240,0,0)",
]



const player = {
	offset:{x:0,y:0},
	matrix:null,
	score:0
};

makePiece();
myScore();
update();

//console.table(myArena);
