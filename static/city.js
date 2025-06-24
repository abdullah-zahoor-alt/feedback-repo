let citySketch = function (p) {
  if (typeof page === "undefined" || page !== "city") return;

  let illustrations = [];
  let row1Houses = [];
  let row2Houses = [];
  let row3Houses = [];
  let assets = {};
  let imageMap = {};
  let backgroundImg;
  let trackImg;

  // ⬇️ RESPONSIVE SIZES BASED ON SCREEN WIDTH
  let blockSize, smallBlockSize, spacingBetweenRows, bottomPadding;
  function setResponsiveSizes() {
  const baseW = 1366;
  const scaleFactor = Math.max(0.8, Math.min(1, p.windowWidth / baseW));


  blockSize = 70 * scaleFactor;
  smallBlockSize = 50 * scaleFactor;
  spacingBetweenRows = 7 * scaleFactor;
  bottomPadding = 100 * scaleFactor;
}

  p.preload = function () {
    backgroundImg = p.loadImage("/static/assets/background.PNG");
    trackImg = p.loadImage("/static/assets/t.jpg");
    loadCategory("house", 15);
    loadCategory("school", 3);
    loadCategory("car", 5);
    loadCategory("arrow", 14);
    loadCategory("flag", 6);
    loadCategory("cloud", 5);
    loadCategory("plan", 3);
    loadCategory("sun", 5);
  };

  p.setup = function () {
    setResponsiveSizes(); // 📱 update sizes before layout
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textFont("Arial");
    p.textSize(14);
    p.planeOffsetX = 0;

    fetch("/feedbacks")
      .then((res) => res.json())
      .then((data) => {
        illustrations = [];
        row1Houses = [];
        row2Houses = [];
        row3Houses = [];
        layoutIndex = 0;
        p.planeOffsetX = 0;

        let y = p.height - bottomPadding - blockSize;
        let yPositions = {
          car: y,
          house1: (y -= blockSize + spacingBetweenRows),
          house2: (y -= smallBlockSize * 1.0),
          house3: (y -= smallBlockSize * 0.6),
          cloud: (y -= smallBlockSize * 1.4 + spacingBetweenRows * 12),
          plane: (y -= smallBlockSize + spacingBetweenRows),
          mix: (y -= smallBlockSize + spacingBetweenRows),
          sun: (y -= smallBlockSize + spacingBetweenRows)
        };

        const houseImages = imageMap["house"];
        const schoolImages = imageMap["school"];
        const carImages = imageMap["car"];
        const treeImages = imageMap["arrow"];
        const flagImages = imageMap["flag"];
        const cloudImages = imageMap["cloud"];
        const planImages = imageMap["plan"];
        const sunImages = imageMap["sun"];

        for (let fb of data) {
          let sentence = fb.sentence || "";
          let type = layoutIndex % 11;
          let x = 0, y;

          switch (type) {
            case 0:
              y = yPositions.car;
              x = (layoutIndex * (smallBlockSize + 10)) % p.width;
              illustrations.push({
                img: assets[carImages[layoutIndex % carImages.length]],
                x,
                y,
                sentence,
                w: smallBlockSize * 0.9,
                h: smallBlockSize * 0.9,
                isCar: true,
                vx: -p.random(0.4, 1.2)
              });
              break;

            case 1:
              y = yPositions.house1;
              x = row1Houses.length * blockSize;
              row1Houses.push({
                img: assets[houseImages[layoutIndex % houseImages.length]],
                x,
                y,
                sentence,
                w: blockSize,
                h: blockSize
              });
              break;

            case 2:
              y = yPositions.house1;
              let treeImg = assets[treeImages[layoutIndex % treeImages.length]];
              illustrations.push({
                img: treeImg,
                x: blockSize * 4,
                baseX: blockSize * 4,
                y: y + (blockSize - smallBlockSize),
                sentence,
                w: smallBlockSize,
                h: smallBlockSize,
                isTree: true
              });
              break;

            case 3:
              y = yPositions.house1;
              let sx = p.width - (layoutIndex % 2) * (blockSize + smallBlockSize);
              illustrations.push({
                img: assets[flagImages[layoutIndex % flagImages.length]],
                x: sx - smallBlockSize,
                y: y + (blockSize - smallBlockSize * 1.2),
                sentence,
                w: smallBlockSize * 1.2,
                h: smallBlockSize * 1.2
              });
              illustrations.push({
                img: assets[schoolImages[layoutIndex % schoolImages.length]],
                x: sx,
                y,
                sentence,
                w: blockSize,
                h: blockSize
              });
              break;

            case 4:
              y = yPositions.house2;
              let house2X = row2Houses.length * smallBlockSize * 0.6;
              row2Houses.push({
                img: assets[houseImages[layoutIndex % houseImages.length]],
                x: house2X,
                y,
                sentence,
                w: smallBlockSize * 0.6,
                h: smallBlockSize * 2.2
              });
              break;

            case 5:
              y = yPositions.house2;
              let schoolX = row2Houses.length * smallBlockSize * 0.6;
              illustrations.push({
                img: assets[flagImages[layoutIndex % flagImages.length]],
                x: schoolX,
                y: y + (smallBlockSize / 4),
                sentence,
                w: smallBlockSize * 0.7,
                h: smallBlockSize * 1.3
              });
              illustrations.push({
                img: assets[schoolImages[layoutIndex % schoolImages.length]],
                x: schoolX + smallBlockSize * 0.7,
                y,
                sentence,
                w: smallBlockSize * 0.8,
                h: smallBlockSize * 1.4
              });
              break;

            case 6:
              y = yPositions.house3;
              let house3Width = smallBlockSize * 0.5;
              let house3X = row3Houses.length * house3Width;
              row3Houses.push({
                img: assets[houseImages[layoutIndex % houseImages.length]],
                x: house3X,
                y,
                sentence,
                w: house3Width,
                h: smallBlockSize * 3.2
              });
              break;

            case 7:
              y = yPositions.cloud;
              x = (layoutIndex * (smallBlockSize + 20)) % p.width;
              illustrations.push({
                img: assets[cloudImages[layoutIndex % cloudImages.length]],
                x,
                baseX: x,
                y,
                sentence,
                w: smallBlockSize * 1.2,
                h: smallBlockSize,
                isCloud: true
              });
              break;

            case 8:
              y = yPositions.plane;
              x = (layoutIndex * (smallBlockSize * 2)) % p.width;
              illustrations.push({
                img: assets[planImages[layoutIndex % planImages.length]],
                x,
                y,
                sentence,
                w: smallBlockSize * 1.4,
                h: smallBlockSize * 0.6,
                isPlane: true,
                vx: -p.random(1.0, 1.5)
              });
              break;

            case 9:
              y = yPositions.mix;
              x = (layoutIndex * (smallBlockSize * 2)) % p.width;
              if (layoutIndex % 3 !== 0) {
                illustrations.push({
                  img: assets[planImages[layoutIndex % planImages.length]],
                  x,
                  y,
                  sentence,
                  w: smallBlockSize * 1.3,
                  h: smallBlockSize * 0.6,
                  isPlane: true,
                  vx: -p.random(1.0, 1.4)
                });
              } else {
                illustrations.push({
                  img: assets[cloudImages[layoutIndex % cloudImages.length]],
                  x,
                  baseX: x,
                  y,
                  sentence,
                  w: smallBlockSize * 1.3,
                  h: smallBlockSize,
                  isCloud: true
                });
              }
              break;

            case 10:
  if (!illustrations.some(el => el.isSun)) {
    y = yPositions.sun;
    illustrations.push({
      img: assets[sunImages[layoutIndex % sunImages.length]],
      x: 20,
      y,
      sentence,
      w: smallBlockSize * 1.5,
      h: smallBlockSize * 1.5,
      isSun: true
    });
  }
  break;

          }

          layoutIndex++;
        }
      });
  };

  p.draw = function () {
    p.background(255);
    if (backgroundImg) p.image(backgroundImg, 0, 0, p.width, p.height);
    if (trackImg) {
      let trackY = p.height - bottomPadding - blockSize + 10;
      p.image(trackImg, 0, trackY, p.width, trackImg.height * (p.width / trackImg.width));
    }

    let allElements = illustrations.concat(row3Houses, row2Houses, row1Houses);
    let hovered = null;

    for (let ill of allElements) {
      if (
        p.mouseX >= ill.x && p.mouseX <= ill.x + ill.w &&
        p.mouseY >= ill.y && p.mouseY <= ill.y + ill.h
      ) {
        hovered = ill;
        break;
      }
    }

    for (let ill of allElements) {
      if ((ill.isCar || ill.isPlane) && ill !== hovered) {
        ill.x += ill.vx;
        if (ill.x < -ill.w) ill.x = p.width;
      }
      if (ill.isTree && ill !== hovered) {
        ill.x = ill.baseX + 3 * Math.sin(p.millis() * 0.0025 + ill.baseX);
      }
      if (ill.isCloud && ill !== hovered) {
        ill.x = ill.baseX + 5 * Math.sin(p.millis() * 0.0015 + ill.baseX);
      }
      if (ill.img && ill.img.width > 0) {
        if (ill === hovered) {
          p.push();
          p.translate(ill.x + ill.w / 2, ill.y + ill.h / 2);
          p.scale(1.3);
          p.image(ill.img, -ill.w / 2, -ill.h / 2, ill.w, ill.h);
          p.pop();
        } else {
          p.image(ill.img, ill.x, ill.y, ill.w, ill.h);
        }
      }
    }

    if (hovered && hovered.sentence) {
      let text = hovered.sentence;
      p.textSize(14);
      let maxW = 300;
      if (p.textWidth(text) > maxW) {
        while (p.textWidth(text) > maxW - 20) text = text.slice(0, -1);
        text += "...";
      }

      let tx = p.mouseX + 15;
      let ty = p.mouseY - 25;
      if (tx + p.textWidth(text) + 16 > p.width) tx = p.width - p.textWidth(text) - 16;
      if (ty < 20) ty = p.mouseY + 25;

      p.fill(255, 255, 210);
      p.noStroke();
      p.rect(tx, ty - 20, p.textWidth(text) + 16, 24, 6);
      p.fill(0);
      p.text(text, tx + 8, ty);
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    setResponsiveSizes(); // 👈 Recalculate sizes
    p.setup(); // 👈 Reload layout with new sizes
  };

  function loadCategory(name, count) {
    imageMap[name] = [];
    for (let i = 1; i <= count; i++) {
      const fileName = `${name}${i}`;
      assets[fileName] = p.loadImage(`/static/assets/${fileName}.png`);
      imageMap[name].push(fileName);
    }
  }
};

window.citySketchInstance = new p5(citySketch);

const feedbackChannel = new BroadcastChannel("feedback_channel");
feedbackChannel.onmessage = (event) => {
  if (event.data === "new-feedback" && typeof window.citySketchInstance?.setup === "function") {
    window.citySketchInstance.setup();
  }
};
