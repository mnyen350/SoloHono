import Game from "./Game";

class GameGraphics {

    // tiles will be 16x16
    static get TileSize() { return 16; }

    _canvas;
    _gl;
    _program;

    get gl() { return this._gl; }
    get width() { return this._canvas.width; }
    get height() { return this._canvas.height; }
    get m4() { return window.m4; } // from webgl script
    get canvas() { return this._canvas; }

    constructor() {
        const canvas = document.getElementById("myCanvas");
        canvas.width = GameGraphics.TileSize * Game.Width;
        canvas.height = GameGraphics.TileSize * Game.Height;

        //console.log('Set canvas dimensions to ' + canvas.width + ' ' + canvas.height);

        this._canvas = canvas;
        this._gl = canvas.getContext("webgl");
    }

    async load() {
        if (!this.m4) {
            throw new Error("WebGL m4 not present on window object");
        }

        const gl = this.gl;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        const simple_fs = await this.createShaderFromUrl(gl, "/webgl/simple_fs.txt", gl.FRAGMENT_SHADER);
        const simple_vs = await this.createShaderFromUrl(gl, "/webgl/simple_vs.txt", gl.VERTEX_SHADER);

        this._program = this.createUseProgram(gl, simple_vs, simple_fs);
    }

    async createShaderFromUrl(gl, url, type) {
        const res = await fetch(url);
        const src = await res.text();
        return this.createShader(gl, src, type);
    }

    createShader(gl, sourceCode, type) {
        //
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLShader
        // Compiles either a shader of type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
        //
        const shader = gl.createShader(type);
        gl.shaderSource(shader, sourceCode);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const info = gl.getShaderInfoLog(shader);
            throw new Error(`Could not compile WebGL program. \n\n${info}`);
        }
        return shader;
    }

    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        return canvas;
    }

    createUseProgram(gl, vertexShader, fragmentShader) {
        //
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/useProgram
        //
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Error linking program:', gl.getProgramInfoLog(program));
            return;
        }
        gl.useProgram(program);
        return program;
    }

    async changeImageHue(image, rotation) {
        //
        // https://maximmcnair.com/p/webgl-hue
        //
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        const gl = canvas.getContext('webgl');

        // Shader source
        const hue_vs = await this.createShaderFromUrl(gl, "/webgl/hue_vs.txt", gl.VERTEX_SHADER);
        const hue_fs = await this.createShaderFromUrl(gl, "/webgl/hue_fs.txt", gl.FRAGMENT_SHADER);

        // Link program
        const program = this.createUseProgram(gl, hue_vs, hue_fs);

        // Set up vertices
        const vertices = new Float32Array([-1, -1, 0, 0,
            1, -1, 1, 0, -1, 1, 0, 1,
            1, 1, 1, 1,
        ]);

        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const aPosition = gl.getAttribLocation(program, 'a_position');
        const aTexCoord = gl.getAttribLocation(program, 'a_texCoord');
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 16, 0);
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 16, 8);
        gl.enableVertexAttribArray(aTexCoord);

        // Set up texture
        this.texturize(gl, image);

        // Uniforms
        const uImage = gl.getUniformLocation(program, 'u_image');
        const uHue = gl.getUniformLocation(program, 'u_hue');
        gl.uniform1i(uImage, 0);

        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const hueValue = rotation;
        gl.uniform1f(uHue, hueValue);

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        const result = document.createElement('img');
        result.src = canvas.toDataURL("image/png");
        return result;
    }

    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function() {
                resolve(img);
            }
            img.onerror = function(err) {
                reject(err);
            }
            img.src = src; // start the loading
        });
    }

    texturize(gl, image) {

        if (!gl.__textureCache)
            gl.__textureCache = {};

        // if image is an Image then turn it into a WebGL Texture
        if (image instanceof Image) {
            if (image.src && gl.__textureCache && gl.__textureCache[image.src])
                return gl.__textureCache[image.src];

            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            // update the cache with this texture for the given image
            if (image.src) {
                gl.__textureCache[image.src] = texture;
                console.log('cached texture', image.src);
            }

            return texture;
        }

        // Possibly already a texture?
        return image;
    }

    async drawCanvas(canvas, dstX, dstY, w, h) {
        const image = await this.loadImage(canvas.toDataURL("image/png"));
        return this.drawImage(image, dstX, dstY, w, h);
    }

    drawImage(image, dstX, dstY, w, h) {
        const m4 = this.m4;
        const gl = this.gl;
        const program = this._program;

        //
        // https://webglfundamentals.org/webgl/lessons/webgl-2d-drawimage.html
        //

        // turn it into a gl texture
        const tex = this.texturize(gl, image);

        gl.bindTexture(gl.TEXTURE_2D, tex);

        // Create a buffer.
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Put a unit quad in the buffer
        const positions = [
            0, 0,
            0, 1,
            1, 0,
            1, 0,
            0, 1,
            1, 1,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        // Create a buffer for texture coords
        const texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

        // Put texcoords in the buffer
        const texcoords = [
            0, 0,
            0, 1,
            1, 0,
            1, 0,
            0, 1,
            1, 1,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

        // look up where the vertex data needs to go.
        const positionLocation = gl.getAttribLocation(program, "a_position");
        const texcoordLocation = gl.getAttribLocation(program, "a_texcoord");

        // lookup uniforms
        const matrixLocation = gl.getUniformLocation(program, "u_matrix");
        //var textureMatrixLocation = gl.getUniformLocation(program, "u_textureMatrix");
        const textureLocation = gl.getUniformLocation(program, "u_texture");

        // Setup the attributes to pull data from our buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.enableVertexAttribArray(texcoordLocation);
        gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

        // this matrix will convert from pixels to clip space
        let matrix = m4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);

        // this matrix will translate our quad to dstX, dstY
        matrix = m4.translate(matrix, dstX, dstY, 0);

        // this matrix will scale our 1 unit quad
        // from 1 unit to texWidth, texHeight units
        matrix = m4.scale(matrix, w, h, 1);

        // Set the matrix.
        gl.uniformMatrix4fv(matrixLocation, false, matrix);

        // Tell the shader to get the texture from texture unit 0
        gl.uniform1i(textureLocation, 0);

        // draw the quad (2 triangles, 6 vertices)
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}

export default GameGraphics;