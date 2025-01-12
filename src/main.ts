import "./style.css";

//setting up the multiple canvases
const gridCanvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
const gridCtx = gridCanvas.getContext("2d") as CanvasRenderingContext2D;

const selectCanvas = document.getElementById(
  "selectCanvas"
) as HTMLCanvasElement;
const selectCtx = selectCanvas.getContext("2d") as CanvasRenderingContext2D;

//defining the textures to use
const imageUrls = [
  "/tile1.png",
  "/tile2.png",
  "/tile3.png",
  "/tile4.png",
  "/tile5.png",
  "/tile6.png",
  "/tile7.png",
  "/tile8.png",
];

//defining the size of the main grid
const numTiles = 32;
const tileSize = gridCanvas.width / numTiles;

//defining the size of the select grid
const numSelectables = imageUrls.length;
const selectHeight = selectCanvas.height / numSelectables;

//A image pool array using index
const images: HTMLImageElement[] = [];
imageUrls.forEach((url) => {
  const img = new Image();
  img.src = url;
  images.push(img);
});

//creating the tilemap nested array
let tilemap: number[][] = new Array(numTiles);

for (let i = 0; i < numTiles; i++) {
  let row = new Array(numTiles);
  for (let j = 0; j < numTiles; j++) {
    row[j] = 0;
  }
  tilemap[i] = row;
}

//track the selected tile
let currentTile = 0;

//preload the img url before drawing
function preloadImages(urls: string[], callback: () => void) {
  let loadedCount = 0;

  urls.forEach((url, index) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      loadedCount++;
      images[index] = img;
      if (loadedCount === urls.length) {
        callback();
      }
    };
  });
}

//draw the initial canvases
preloadImages(imageUrls, () => {
  redrawTilemap();
  drawSelectCanvas();
});

//Function that draws a texture to a specific canvas ctx
function drawTexture(
  row: number,
  col: number,
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  cellSize: number
) {
  image.onload = () => {
    ctx.drawImage(image, row * cellSize, col * cellSize, width, height);
  };
  ctx.drawImage(image, row * cellSize, col * cellSize, width, height);
}

// ----- Interacting with the main tilemap -----

function redrawTilemap() {
  gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
  for (let i = 0; i < numTiles; i++) {
    for (let j = 0; j < numTiles; j++) {
      drawTexture(
        i,
        j,
        gridCtx,
        images[tilemap[i][j]],
        gridCanvas.width / numTiles,
        gridCanvas.height / numTiles,
        tileSize
      );
    }
  }
}

// gridCanvas.addEventListener("click", (e) => {
//   const coordX: number = Math.trunc(e.offsetX / tileSize);
//   const coordY: number = Math.trunc(e.offsetY / tileSize);

//   tilemap[coordX][coordY] = currentTile;
//   redrawTilemap();
// });

// ----- Interacting with the selectable tilemap -----

// Loop through the selectable tiles and draw textures in each cell
function drawSelectCanvas() {
  for (let i = 0; i < numSelectables; i++) {
    const selectableImage = new Image();
    selectableImage.src = imageUrls[i];
    drawTexture(
      0,
      i,
      selectCtx,
      selectableImage,
      selectCanvas.width,
      selectHeight,
      64
    );
  }
}

selectCanvas.addEventListener("click", (e) => {
  const coordY = Math.trunc(e.offsetY / selectHeight);
  currentTile = coordY;
});

let drawing = false;
gridCanvas.addEventListener("mousedown", () => {
  drawing = true;
});

gridCanvas.addEventListener("mouseup", () => {
  drawing = false;
});

gridCanvas.addEventListener("mousemove", (e) => {
  if(drawing){
    drawAtCoord(e)
  }
});

function drawAtCoord(e: MouseEvent) {
  const coordX: number = Math.trunc(e.offsetX / tileSize);
  const coordY: number = Math.trunc(e.offsetY / tileSize);

  tilemap[coordX][coordY] = currentTile;
  redrawTilemap();
}
