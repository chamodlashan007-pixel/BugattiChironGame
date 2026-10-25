import * as THREE from "three";

export function createMap(scene) {
  const map = new THREE.Group();
  scene.add(map);

  // =========================
  // MATERIALS
  // =========================
  const grassMat = new THREE.MeshLambertMaterial({ color: 0x4f9b45 });
  const roadMat = new THREE.MeshLambertMaterial({ color: 0x30343b });
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const sidewalkMat = new THREE.MeshLambertMaterial({ color: 0x777777 });
  const waterMat = new THREE.MeshLambertMaterial({
    color: 0x2389d7,
    transparent: true,
    opacity: 0.85
  });

  const buildingMats = [
    new THREE.MeshLambertMaterial({ color: 0xd85c5c }),
    new THREE.MeshLambertMaterial({ color: 0x4f78c7 }),
    new THREE.MeshLambertMaterial({ color: 0xd5a84b }),
    new THREE.MeshLambertMaterial({ color: 0x8d63b8 }),
    new THREE.MeshLambertMaterial({ color: 0xe5e5e5 })
  ];

  // =========================
  // HELPER FUNCTIONS
  // =========================

  function box(w, h, d, x, y, z, material) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    map.add(mesh);
    return mesh;
  }

  function label(text, x, z) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, 512, 128);

    ctx.fillStyle = "white";
    ctx.font = "bold 42px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true
    });

    const geo = new THREE.PlaneGeometry(18, 4.5);
    const mesh = new THREE.Mesh(geo, mat);

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, 0.08, z);

    map.add(mesh);
  }

  function road(x, z, w, d) {
    box(w, 0.12, d, x, 0, z, roadMat);

    // sidewalk
    box(w + 3, 0.08, d + 3, x, -0.04, z, sidewalkMat);
    box(w, 0.14, d, x, 0.02, z, roadMat);
  }

  function tree(x, z) {
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x754523 });
    const leafMat = new THREE.MeshLambertMaterial({ color: 0x1f7d35 });

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.6, 4, 8),
      trunkMat
    );

    trunk.position.set(x, 2, z);
    map.add(trunk);

    const leaves = new THREE.Mesh(
      new THREE.SphereGeometry(2.2, 10, 10),
      leafMat
    );

    leaves.position.set(x, 5, z);
    leaves.castShadow = true;
    map.add(leaves);
  }

  function building(x, z, w = 20, h = 12, d = 20) {
    const mat =
      buildingMats[Math.floor(Math.random() * buildingMats.length)];

    box(w, h, d, x, h / 2, z, mat);

    // roof
    box(w + 0.5, 0.5, d + 0.5, x, h + 0.25, z, sidewalkMat);

    // windows
    for (let xx = -w / 3; xx <= w / 3; xx += w / 3) {
      for (let yy = 3; yy < h - 1; yy += 4) {
        const windowMat = new THREE.MeshBasicMaterial({
          color: 0x9bd7ff
        });

        const win = new THREE.Mesh(
          new THREE.BoxGeometry(2.2, 2, 0.15),
          windowMat
        );

        win.position.set(x + xx, yy, z - d / 2 - 0.1);
        map.add(win);
      }
    }
  }

  // =========================
  // GROUND
  // =========================

  box(
    1400,
    0.2,
    1400,
    0,
    -0.15,
    0,
    grassMat
  );

  // =========================
  // MAIN ROADS
  // =========================

  road(0, 0, 28, 1400);
  road(0, 0, 1400, 28);

  // secondary roads
  road(-220, 0, 18, 1400);
  road(220, 0, 18, 1400);

  road(0, -220, 1400, 18);
  road(0, 220, 1400, 18);

  // =========================
  // ROAD LINES
  // =========================

  for (let z = -680; z <= 680; z += 18) {
    box(0.5, 0.03, 8, 0, 0.08, z, lineMat);
  }

  for (let x = -680; x <= 680; x += 18) {
    box(8, 0.03, 0.5, x, 0.08, 0, lineMat);
  }

  // =========================
  // RIVER
  // =========================

  box(
    110,
    0.15,
    1400,
    -420,
    0,
    0,
    waterMat
  );

  // bridge
  box(
    150,
    0.5,
    45,
    -420,
    0.15,
    0,
    roadMat
  );

  box(
    150,
    0.1,
    3,
    -420,
    0.5,
    -15,
    lineMat
  );

  box(
    150,
    0.1,
    3,
    -420,
    0.5,
    15,
    lineMat
  );

  label("RIVER BRIDGE", -420, 0);

  // =========================
  // SCHOOL
  // =========================

  box(100, 1, 90, -100, 0.5, 420, sidewalkMat);

  box(
    65,
    18,
    35,
    -100,
    9,
    420,
    buildingMats[1]
  );

  box(
    40,
    10,
    25,
    -100,
    5,
    390,
    buildingMats[4]
  );

  // playground
  box(
    55,
    0.3,
    45,
    -100,
    1,
    475,
    new THREE.MeshLambertMaterial({ color: 0x65b85b })
  );

  label("SCHOOL", -100, 420);
  label("PLAYGROUND", -100, 475);

  // =========================
  // AIRPORT
  // =========================

  box(
    300,
    0.15,
    220,
    -520,
    0,
    -480,
    new THREE.MeshLambertMaterial({ color: 0x555555 })
  );

  // runway
  box(
    260,
    0.2,
    35,
    -520,
    0.15,
    -480,
    roadMat
  );

  for (let x = -630; x <= -410; x += 25) {
    box(12, 0.05, 2, x, 0.3, -480, lineMat);
  }

  // terminal
  box(
    80,
    18,
    40,
    -520,
    9,
    -350,
    buildingMats[4]
  );

  label("AIRPORT", -520, -350);
  label("RUNWAY", -520, -480);

  // =========================
  // RAILWAY STATION
  // =========================

  box(
    100,
    0.4,
    60,
    330,
    0.2,
    -350,
    sidewalkMat
  );

  box(
    70,
    12,
    25,
    330,
    6,
    -350,
    buildingMats[2]
  );

  // railway tracks
  for (let x = 285; x <= 375; x += 12) {
    box(
      2,
      0.2,
      80,
      x,
      0.5,
      -420,
      roadMat
    );
  }

  label("RAILWAY STATION", 330, -350);

  // =========================
  // POLICE STATION
  // =========================

  box(70, 12, 45, -300, 6, -300, buildingMats[1]);
  box(20, 5, 20, -300, 14, -300, buildingMats[4]);

  label("POLICE STATION", -300, -330);

  // =========================
  // GARAGE
  // =========================

  box(75, 10, 55, 100, 5, -100, buildingMats[3]);
  box(55, 7, 25, 100, 3.5, -70, buildingMats[4]);

  label("GARAGE", 100, -100);

  // =========================
  // CAR SHOP
  // =========================

  box(75, 12, 55, 100, 6, 100, buildingMats[0]);

  box(
    45,
    6,
    2,
    100,
    7,
    72,
    new THREE.MeshBasicMaterial({ color: 0x9bd7ff })
  );

  label("CAR SHOP", 100, 100);

  // =========================
  // SUPERMARKET
  // =========================

  box(80, 14, 60, -100, 7, -100, buildingMats[2]);

  label("SUPER MARKET", -100, -100);

  // =========================
  // BOOK SHOP
  // =========================

  box(65, 11, 50, 100, 5.5, 300, buildingMats[3]);

  label("BOOK SHOP", 100, 300);

  // =========================
  // FOOD CITY
  // =========================

  box(70, 13, 55, -300, 6.5, 200, buildingMats[2]);

  label("FOOD CITY", -300, 200);

  // =========================
  // TEMPLE
  // =========================

  box(
    75,
    0.5,
    75,
    300,
    0.25,
    150,
    new THREE.MeshLambertMaterial({ color: 0xd6bd73 })
  );

  box(
    30,
    18,
    30,
    300,
    9,
    150,
    new THREE.MeshLambertMaterial({ color: 0xffd36a })
  );

  // temple tower
  const tower = new THREE.Mesh(
    new THREE.ConeGeometry(10, 30, 4),
    new THREE.MeshLambertMaterial({ color: 0xf2b544 })
  );

  tower.position.set(300, 33, 150);
  map.add(tower);

  label("TEMPLE", 300, 190);

  // =========================
  // CHURCH
  // =========================

  box(65, 15, 45, 300, 7.5, 300, buildingMats[4]);

  const churchRoof = new THREE.Mesh(
    new THREE.ConeGeometry(20, 35, 4),
    buildingMats[0]
  );

  churchRoof.position.set(300, 32, 300);
  churchRoof.rotation.y = Math.PI / 4;
  map.add(churchRoof);

  label("CHURCH", 300, 340);

  // =========================
  // MOSQUE
  // =========================

  box(70, 12, 55, -300, 6, 320, buildingMats[4]);

  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(18, 16, 8),
    new THREE.MeshLambertMaterial({ color: 0x66a3d9 })
  );

  dome.scale.y = 0.6;
  dome.position.set(-300, 18, 320);
  map.add(dome);

  label("MOSQUE", -300, 365);

  // =========================
  // KOVIL
  // =========================

  box(
    70,
    10,
    60,
    -300,
    5,
    500,
    new THREE.MeshLambertMaterial({ color: 0xe7a84d })
  );

  const kovilTower = new THREE.Mesh(
    new THREE.ConeGeometry(16, 35, 6),
    new THREE.MeshLambertMaterial({ color: 0xe66a42 })
  );

  kovilTower.position.set(-300, 28, 500);
  map.add(kovilTower);

  label("KOVIL", -300, 545);

  // =========================
  // CRICKET STADIUM
  // =========================

  const cricketOuter = new THREE.Mesh(
    new THREE.CylinderGeometry(85, 85, 1, 48),
    new THREE.MeshLambertMaterial({ color: 0x777777 })
  );

  cricketOuter.position.set(450, 0.5, 250);
  map.add(cricketOuter);

  const cricketField = new THREE.Mesh(
    new THREE.CylinderGeometry(60, 60, 1.2, 48),
    new THREE.MeshLambertMaterial({ color: 0x4caf50 })
  );

  cricketField.position.set(450, 1, 250);
  map.add(cricketField);

  label("CRICKET STADIUM", 450, 350);

  // =========================
  // FOOTBALL STADIUM
  // =========================

  box(
    190,
    0.5,
    130,
    420,
    0.25,
    -150,
    sidewalkMat
  );

  box(
    130,
    0.8,
    75,
    420,
    1,
    -150,
    new THREE.MeshLambertMaterial({ color: 0x45a84a })
  );

  // stands
  box(180, 12, 10, 420, 6, -215, buildingMats[1]);
  box(180, 12, 10, 420, 6, -85, buildingMats[1]);

  label("FOOTBALL STADIUM", 420, -150);

  // =========================
  // BEACH
  // =========================

  box(
    260,
    0.2,
    140,
    400,
    0,
    560,
    new THREE.MeshLambertMaterial({ color: 0xe6cf8a })
  );

  box(
    260,
    0.15,
    120,
    400,
    -0.05,
    650,
    waterMat
  );

  label("BEACH", 400, 560);

  // =========================
  // CHILDREN PARK
  // =========================

  box(
    120,
    0.3,
    100,
    -100,
    0.2,
    650,
    new THREE.MeshLambertMaterial({ color: 0x65b85b })
  );

  // playground equipment
  box(35, 2, 3, -100, 6, 650, buildingMats[0]);
  box(3, 12, 3, -115, 6, 650, buildingMats[0]);
  box(3, 12, 3, -85, 6, 650, buildingMats[0]);

  label("CHILDREN PARK", -100, 650);

  // =========================
  // HOUSES
  // =========================

  const housePositions = [
    [-600, 200],
    [-600, 280],
    [-600, 360],
    [-520, 200],
    [-520, 280],
    [-520, 360],

    [600, 200],
    [600, 280],
    [600, 360],
    [520, 200],
    [520, 280],
    [520, 360],

    [-600, -100],
    [-600, -20],
    [-520, -100],
    [-520, -20],

    [600, -100],
    [600, -20],
    [520, -100],
    [520, -20]
  ];

  housePositions.forEach(([x, z]) => {
    building(x, z, 28, 10, 28);
  });

  // =========================
  // COMPANIES
  // =========================

  building(-500, 80, 55, 25, 50);
  building(-500, 160, 55, 20, 50);
  building(500, 80, 55, 25, 50);
  building(500, 160, 55, 20, 50);

  label("COMPANY", -500, 80);
  label("COMPANY", 500, 80);

  // =========================
  // TREES
  // =========================

  const treePositions = [
    [-180, -160],
    [-150, -160],
    [-120, -160],

    [180, -160],
    [150, -160],
    [120, -160],

    [-180, 160],
    [-150, 160],
    [-120, 160],

    [180, 160],
    [150, 160],
    [120, 160],

    [-250, 350],
    [-250, 400],
    [-250, 450],

    [250, 350],
    [250, 400],
    [250, 450],

    [400, 450],
    [450, 450],
    [500, 450]
  ];

  treePositions.forEach(([x, z]) => tree(x, z));

  // =========================
  // MORE CITY BUILDINGS
  // =========================

  const cityBuildings = [
    [-350, -100],
    [-350, -30],
    [-350, 40],

    [350, -20],
    [350, 50],

    [-350, 600],
    [-280, 600],

    [250, -400],
    [320, -400],
    [390, -400],

    [600, 500],
    [600, 580]
  ];

  cityBuildings.forEach(([x, z]) => {
    building(x, z, 25, 15, 25);
  });

  // =========================
  // STREET TREES
  // =========================

  for (let z = -600; z <= 600; z += 80) {
    if (Math.abs(z) > 35) {
      tree(-45, z);
      tree(45, z);
    }
  }

  for (let x = -600; x <= 600; x += 80) {
    if (Math.abs(x) > 35) {
      tree(x, -45);
      tree(x, 45);
    }
  }

  // =========================
  // MAP BOUNDARY
  // =========================

  box(
    10,
    15,
    1400,
    -700,
    7.5,
    0,
    buildingMats[4]
  );

  box(
    10,
    15,
    1400,
    700,
    7.5,
    0,
    buildingMats[4]
  );

  box(
    1400,
    15,
    10,
    0,
    7.5,
    -700,
    buildingMats[4]
  );

  box(
    1400,
    15,
    10,
    0,
    7.5,
    700,
    buildingMats[4]
  );

  return map;
}