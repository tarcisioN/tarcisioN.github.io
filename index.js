"use strict";

var canvas;
var gl;
var numTimesToSubdivide = 3;
var theta = 0.3;
var points = [];
var bufferId;

function init()
{
    canvas = document.getElementById("gl-canvas");
    
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl)
    {
        alert("WebGL is not available!");
    }
    
    //
    // Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    
    // Load shaders and initialize attribute buffers
    
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    // Load the data into the GPU
    
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, 8 * Math.pow(3, 6), gl.STATIC_DRAW );
    
    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    render();
}

function triangle(a, b, c)
{
    points.push(a, b, c);
}

function rotate2(p, angle)
{
    var x = p[0];
    var y = p[1];
    var d = Math.sqrt(x*x + y*y);
    var phi = d * angle;
    var xx = x * Math.cos(phi) + y * Math.sin(phi);
    var yy = -1.0 * x * Math.sin(phi) + y * Math.cos(phi);
    
    return [xx, yy];
}

function divideTriangle(a, b, c, count)
{
    a = rotate2(a, theta);
    b = rotate2(b, theta);
    c = rotate2(c, theta);
    
    if (count === 0)
    {
        triangle(a, b, c);
    }
    else
    {
        var ab = mix(a, b, 0.5);
        var ac = mix(a, c, 0.5);
        var bc = mix(b, c, 0.5);
        
        divideTriangle(a, ab, ac, count - 1);
        divideTriangle(c, ac, bc, count - 1);
        divideTriangle(b, bc, ab, count - 1);
    }
}

function render()
{
    var vertices = [vec2(-0.5, -0.5), vec2(0, 0.5), vec2(0.5, -0.5)];
    points = [];
    divideTriangle(vertices[0], vertices[1], vertices[2], numTimesToSubdivide);
    
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
    points = [];
}

window.onload = init;
