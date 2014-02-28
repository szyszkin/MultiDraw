//draw.js
tool.maxDistance = 50;

// Returns an object specifying a semi-random color
// The color will always have a red value of 0
// and will be semi-transparent (the alpha value)
function randomColor() {
    
    return {
        red: Math.random(),
        green: Math.random(),
        blue: Math.random(),
        alpha: 1
    };
}
var path;
var userColor = randomColor();
path = new Path();

function onMouseDown(event) {
	drawSPath(event.point.x,event.point.y,userColor);
	emitSPath(event.point.x,event.point.y,userColor);
}

// While the user drags the mouse, points are added to the path
// at the position of the mouse:
function onMouseDrag(event) {
	drawPath(event.point.x,event.point.y);
	emitPath(event.point.x,event.point.y);
}

// When the mouse is released, we simplify the path:
function onMouseUp(event) {
	path.simplify(10);
	path.fullySelected = false;
}
 
function drawPath( x,y ) {
    path.add(new Point(x,y));
	view.draw();
} 
function drawSPath( x,y,color ) 
{
	if (path) {
		path.selected = false;
	}
    path = new Path({
		strokeColor: color,
		fullySelected: false
	});
} 
function emitSPath(x,y,color) {
    var sessionId = io.socket.sessionid;
	var data = {
        x: x,
		y: y,
		color:color
    };
	
    io.emit( 'drawSPath', data, sessionId )

}
 
// This function sends the data for a circle to the server
// so that the server can broadcast it to every other user
function emitPath(x,y) {
    // Each Socket.IO connection has a unique session id
    var sessionId = io.socket.sessionid;
	var data = {
        x: x,
		y: y
    };
    // send a 'drawCircle' event with data and sessionId to the server
    io.emit( 'drawPath', data, sessionId )
}





// Listen for 'drawCircle' events
// created by other users
io.on( 'drawPath', function( data )
{
    drawPath(data.x,data.y);   
})

io.on( 'drawSPath', function( data )
{
    drawSPath(data.x,data.y,data.color);
    
})