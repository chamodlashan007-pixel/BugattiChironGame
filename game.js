import * as THREE from "three";

// =====================================================
// BUGATTI CHIRON CITY DRIVE
// FULL GAME - PART 1
// =====================================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x82b7e8);
scene.fog = new THREE.Fog(0x82b7e8, 180, 1100);

// CAMERA
const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    1800
);

camera.position.set(0, 6, 14);

// RENDERER
const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: "high-performance"
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
renderer.shadowMap.enabled = false;

document.body.style.margin = "0";
document.body.style.overflow = "hidden";

document.body.appendChild(renderer.domElement);

// LIGHTING
const hemiLight = new THREE.HemisphereLight(
    0xffffff,
    0x557755,
    1.5
);

scene.add(hemiLight);

const sun = new THREE.DirectionalLight(
    0xffffff,
    1.4
);

sun.position.set(100, 200, 100);
scene.add(sun);

// MATERIALS
function makeMaterial(color) {
    return new THREE.MeshLambertMaterial({ color });
}

const grassMat = makeMaterial(0x90ee90);
const roadMat = makeMaterial(0x292929);
const whiteMat = makeMaterial(0xffffff);
const yellowMat = makeMaterial(0xffd900);

function random(min, max) {
    return Math.random() * (max - min) + min;
}

// ROAD POSITIONS
const roadPositions = [-600, -300, 0, 300, 600];

// =====================================================
// GROUND
// =====================================================

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(1800, 1800),
    grassMat
);

ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.05;

scene.add(ground);

// =====================================================
// ROADS
// =====================================================

for (const x of roadPositions) {

    const road = new THREE.Mesh(
        new THREE.BoxGeometry(28, 0.05, 1500),
        roadMat
    );

    road.position.set(x, 0, 0);
    scene.add(road);

    for (let z = -740; z < 740; z += 30) {

        const line = new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.06, 10),
            yellowMat
        );

        line.position.set(x, 0.06, z);
        scene.add(line);
    }
}

for (const z of roadPositions) {

    const road = new THREE.Mesh(
        new THREE.BoxGeometry(1500, 0.05, 28),
        roadMat
    );

    road.position.set(0, 0, z);
    scene.add(road);

    for (let x = -740; x < 740; x += 30) {

        const line = new THREE.Mesh(
            new THREE.BoxGeometry(10, 0.06, 1),
            whiteMat
        );

        line.position.set(x, 0.06, z);
        scene.add(line);
    }
}

// =====================================================
// ZEBRA CROSSINGS
// =====================================================

function createZebra(x, z, horizontal) {

    for (let i = 0; i < 9; i++) {

        const stripe = new THREE.Mesh(
            new THREE.BoxGeometry(
                horizontal ? 1.5 : 0.8,
                0.07,
                horizontal ? 0.8 : 1.5
            ),
            whiteMat
        );

        stripe.position.set(
            horizontal ? x - 6 + i * 1.5 : x,
            0.08,
            horizontal ? z : z - 6 + i * 1.5
        );

        scene.add(stripe);
    }
}

for (const x of roadPositions) {

    for (const z of roadPositions) {

        createZebra(x - 17, z, false);
        createZebra(x + 17, z, false);

        createZebra(x, z - 17, true);
        createZebra(x, z + 17, true);
    }
}

// =====================================================
// BUGATTI CHIRON
// =====================================================

const car = new THREE.Group();

scene.add(car);

const blueMat = makeMaterial(0x0875e8);
const blackMat = makeMaterial(0x101010);
const glassMat = makeMaterial(0x102840);

// BODY
const carBody = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.75, 6.2),
    blueMat
);

carBody.position.y = 0.8;
car.add(carBody);

// ROOF
const roof = new THREE.Mesh(
    new THREE.BoxGeometry(2.45, 0.65, 2.8),
    blueMat
);

roof.position.set(0, 1.35, 0.25);
car.add(roof);

// FRONT GLASS
const frontGlass = new THREE.Mesh(
    new THREE.BoxGeometry(2.15, 0.45, 0.08),
    glassMat
);

frontGlass.position.set(0, 1.38, -1.18);
car.add(frontGlass);

// REAR GLASS
const rearGlass = new THREE.Mesh(
    new THREE.BoxGeometry(2.15, 0.45, 0.08),
    glassMat
);

rearGlass.position.set(0, 1.38, 1.65);
car.add(rearGlass);

// HEADLIGHTS
const headlightMeshes = [];

for (const x of [-1.05, 1.05]) {

    const light = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 0.18, 0.08),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );

    light.position.set(x, 0.85, -3.12);

    car.add(light);
    headlightMeshes.push(light);
}

// BRAKE LIGHTS
const brakeLightMeshes = [];

for (const x of [-0.9, 0.9]) {

    const light = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.15, 0.08),
        new THREE.MeshBasicMaterial({ color: 0xff1111 })
    );

    light.position.set(x, 0.85, 3.12);

    car.add(light);
    brakeLightMeshes.push(light);
}

// WHEELS
const wheels = [];

const wheelGeometry = new THREE.CylinderGeometry(
    0.48,
    0.48,
    0.35,
    12
);

function addWheel(x, z) {

    const wheel = new THREE.Mesh(
        wheelGeometry,
        blackMat
    );

    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, 0.48, z);

    car.add(wheel);
    wheels.push(wheel);
}

addWheel(-1.65, -1.9);
addWheel(1.65, -1.9);
addWheel(-1.65, 1.9);
addWheel(1.65, 1.9);

// PLAYER POSITION
car.position.set(0, 0, 80);

let heading = 0;
let speed = 0;
let steering = 0;

const MAX_SPEED = 1.0;
const NITRO_SPEED = 1.8;

const keys = {};

// =====================================================
// HEADLIGHT SYSTEM
// =====================================================

const headlight1 = new THREE.PointLight(
    0xffffff,
    2.2,
    95
);

const headlight2 = new THREE.PointLight(
    0xffffff,
    2.2,
    95
);

headlight1.position.set(-1, 1, -3.5);
headlight2.position.set(1, 1, -3.5);

car.add(headlight1);
car.add(headlight2);

let headlightsOn = true;

function toggleHeadlights() {

    headlightsOn = !headlightsOn;

    headlight1.visible = headlightsOn;
    headlight2.visible = headlightsOn;

    headlightMeshes.forEach(light => {
        light.visible = headlightsOn;
    });
}

// =====================================================
// CITY OBJECTS
// =====================================================

const solidObjects = [];

function createBuilding(
    x,
    z,
    width,
    height,
    depth,
    color
) {

    const building = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        makeMaterial(color)
    );

    building.position.set(x, height / 2, z);

    scene.add(building);

    solidObjects.push({
        x,
        z,
        width,
        depth
    });

    const roofMesh = new THREE.Mesh(
        new THREE.BoxGeometry(
            width + 1,
            1,
            depth + 1
        ),
        makeMaterial(0x444444)
    );

    roofMesh.position.set(x, height + 0.5, z);

    scene.add(roofMesh);
}

// BUILDINGS
const buildingColors = [
    0xe0e0e0,
    0xc8d6e5,
    0xf5d7b2,
    0xd5d8dc,
    0xbfc9ca,
    0xf0f3f4,
    0xd7bde2
];

for (let x = -720; x <= 720; x += 80) {

    for (let z = -720; z <= 720; z += 80) {

        let nearRoad = false;

        for (const road of roadPositions) {

            if (
                Math.abs(x - road) < 48 ||
                Math.abs(z - road) < 48
            ) {
                nearRoad = true;
                break;
            }
        }

        if (nearRoad) continue;

        const color = buildingColors[
            Math.floor(Math.random() * buildingColors.length)
        ];

        createBuilding(
            x + random(-8, 8),
            z + random(-8, 8),
            random(35, 55),
            random(20, 100),
            random(35, 55),
            color
        );
    }
}

// SHOPS
function createShop(x, z, color) {

    createBuilding(
        x,
        z,
        52,
        16,
        36,
        color
    );

    const sign = new THREE.Mesh(
        new THREE.BoxGeometry(32, 5, 1),
        new THREE.MeshBasicMaterial({ color })
    );

    sign.position.set(x, 13, z + 18.7);

    scene.add(sign);
}

createShop(-100, -100, 0x27ae60);
createShop(100, -100, 0x2980b9);
createShop(-100, 100, 0xe67e22);
createShop(100, 100, 0x8e44ad);

// =====================================================
// TREES
// =====================================================

function createTree(x, z) {

    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1.5, 8, 8),
        makeMaterial(0x795548)
    );

    trunk.position.set(x, 4, z);
    scene.add(trunk);

    const leaves = new THREE.Mesh(
        new THREE.SphereGeometry(5, 8, 6),
        makeMaterial(0x16852b)
    );

    leaves.position.set(x, 10, z);
    scene.add(leaves);

    solidObjects.push({
        x,
        z,
        width: 5,
        depth: 5
    });
}

for (let i = 0; i < 90; i++) {

    const x = random(-700, 700);
    const z = random(-700, 700);

    let nearRoad = false;

    for (const road of roadPositions) {

        if (
            Math.abs(x - road) < 38 ||
            Math.abs(z - road) < 38
        ) {
            nearRoad = true;
        }
    }

    if (
        Math.abs(x) < 25 &&
        Math.abs(z - 80) < 25
    ) {
        nearRoad = true;
    }

    if (!nearRoad) {
        createTree(x, z);
    }
}

// =====================================================
// END OF PART 1
// =====================================================
// =====================================================
// PART 2 - PEDESTRIANS
// =====================================================

const pedestrians = [];

function createPedestrian(x, z) {

    const person = new THREE.Group();

    const skinColors = [
        0xf1c27d,
        0xd2a679,
        0x8d5524,
        0xffdbac
    ];

    const shirtColors = [
        0xe74c3c,
        0x3498db,
        0xf1c40f,
        0x8e44ad,
        0x2ecc71,
        0xffffff
    ];

    const skinColor = skinColors[
        Math.floor(Math.random() * skinColors.length)
    ];

    const shirtColor = shirtColors[
        Math.floor(Math.random() * shirtColors.length)
    ];

    // HEAD
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 8, 6),
        makeMaterial(skinColor)
    );

    head.position.y = 4.2;
    person.add(head);

    // BODY
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(1, 2, 0.65),
        makeMaterial(shirtColor)
    );

    body.position.y = 2.7;
    person.add(body);

    // ARMS
    const armGeometry = new THREE.BoxGeometry(
        0.3, 1.5, 0.35
    );

    const leftArm = new THREE.Mesh(
        armGeometry,
        makeMaterial(skinColor)
    );

    leftArm.position.set(-0.7, 2.8, 0);
    person.add(leftArm);

    const rightArm = new THREE.Mesh(
        armGeometry,
        makeMaterial(skinColor)
    );

    rightArm.position.set(0.7, 2.8, 0);
    person.add(rightArm);

    // LEGS
    const legGeometry = new THREE.BoxGeometry(
        0.35, 1.5, 0.4
    );

    const legMaterial = makeMaterial(0x263238);

    const leftLeg = new THREE.Mesh(
        legGeometry,
        legMaterial
    );

    leftLeg.position.set(-0.25, 0.75, 0);
    person.add(leftLeg);

    const rightLeg = new THREE.Mesh(
        legGeometry,
        legMaterial
    );

    rightLeg.position.set(0.25, 0.75, 0);
    person.add(rightLeg);

    person.position.set(x, 0, z);

    scene.add(person);

    pedestrians.push({
        person,
        leftLeg,
        rightLeg,
        startZ: z,
        roadX: Math.round(x / 300) * 300,
        direction: Math.random() < 0.5 ? 1 : -1,
        speed: random(0.025, 0.05),
        crossing: false,
        targetX: x,
        avoiding: false
    });
}

// CREATE 30 PEDESTRIANS
for (let i = 0; i < 30; i++) {

    const road = roadPositions[
        Math.floor(Math.random() * roadPositions.length)
    ];

    const z = random(-650, 650);

    const side = Math.random() < 0.5 ? -1 : 1;

    createPedestrian(
        road + side * 19,
        z
    );
}

// UPDATE PEDESTRIANS
function updatePedestrians() {

    for (const p of pedestrians) {

        const person = p.person;

        const dx = person.position.x - car.position.x;
        const dz = person.position.z - car.position.z;

        const distance = Math.hypot(dx, dz);

        // AVOID PLAYER CAR
        if (distance < 12) {

            p.avoiding = true;

            const side = dx >= 0 ? 1 : -1;

            person.position.x += side * 0.12;

        } else {

            p.avoiding = false;
        }

        // CROSS ROAD
        if (!p.crossing && !p.avoiding) {

            for (const roadZ of roadPositions) {

                if (
                    Math.abs(person.position.z - roadZ) < 1.5 &&
                    Math.abs(person.position.x - p.roadX) < 25
                ) {

                    p.crossing = true;

                    p.targetX =
                        p.roadX +
                        (person.position.x < p.roadX ? 19 : -19);

                    break;
                }
            }
        }

        if (p.crossing && !p.avoiding) {

            const diff =
                p.targetX - person.position.x;

            if (Math.abs(diff) < 0.35) {

                person.position.x = p.targetX;
                p.crossing = false;

            } else {

                person.position.x +=
                    Math.sign(diff) * p.speed;
            }

        } else if (!p.avoiding) {

            person.position.z +=
                p.speed * p.direction;

            if (
                Math.abs(person.position.z - p.startZ) > 35
            ) {
                p.direction *= -1;
            }
        }

        // WALK ANIMATION
        const step = Math.sin(
            performance.now() * 0.008 + p.startZ
        ) * 0.35;

        p.leftLeg.rotation.x = step;
        p.rightLeg.rotation.x = -step;

        person.rotation.y = p.crossing
            ? (
                p.targetX > person.position.x
                    ? -Math.PI / 2
                    : Math.PI / 2
            )
            : (
                p.direction > 0 ? 0 : Math.PI
            );
    }
}

// =====================================================
// TRAFFIC LIGHTS
// =====================================================

const trafficSignals = [];

function createTrafficLight(x, z) {

    const group = new THREE.Group();

    // POLE
    const pole = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 6, 0.3),
        makeMaterial(0x333333)
    );

    pole.position.y = 3;
    group.add(pole);

    // LIGHT BOX
    const box = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 2.8, 0.7),
        makeMaterial(0x111111)
    );

    box.position.y = 6.8;
    group.add(box);

    // RED
    const red = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 8, 6),
        new THREE.MeshBasicMaterial({
            color: 0x330000
        })
    );

    red.position.set(0, 7.6, 0.38);
    group.add(red);

    // YELLOW
    const yellow = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 8, 6),
        new THREE.MeshBasicMaterial({
            color: 0x333300
        })
    );

    yellow.position.set(0, 6.8, 0.38);
    group.add(yellow);

    // GREEN
    const green = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 8, 6),
        new THREE.MeshBasicMaterial({
            color: 0x003300
        })
    );

    green.position.set(0, 6, 0.38);
    group.add(green);

    group.position.set(x, 0, z);

    scene.add(group);

    trafficSignals.push({
        red,
        yellow,
        green
    });
}

// CREATE TRAFFIC LIGHTS
for (const x of roadPositions) {

    for (const z of roadPositions) {

        createTrafficLight(x + 19, z + 19);
        createTrafficLight(x - 19, z - 19);
    }
}

// TRAFFIC SIGNAL STATE
function getSignalState() {

    const phase =
        (performance.now() / 1000) % 12;

    if (phase < 5) return "green";

    if (phase < 7) return "yellow";

    return "red";
}

// UPDATE LIGHT COLORS
function updateTrafficLights() {

    const state = getSignalState();

    for (const s of trafficSignals) {

        s.red.material.color.set(
            state === "red"
                ? 0xff0000
                : 0x330000
        );

        s.yellow.material.color.set(
            state === "yellow"
                ? 0xffff00
                : 0x333300
        );

        s.green.material.color.set(
            state === "green"
                ? 0x00ff00
                : 0x003300
        );
    }
}

// =====================================================
// TRAFFIC CARS
// =====================================================

const trafficCars = [];

const trafficColors = [
    0xe53935,
    0xffffff,
    0xffc107,
    0x212121,
    0x43a047,
    0x8e44ad
];

function createTrafficCar(
    x,
    z,
    color,
    axis,
    direction
) {

    const vehicle = new THREE.Group();

    // BODY
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(4, 1.5, 7),
        makeMaterial(color)
    );

    body.position.y = 1.3;
    vehicle.add(body);

    // WINDOWS
    const windows = new THREE.Mesh(
        new THREE.BoxGeometry(3, 1.1, 3),
        makeMaterial(0x263746)
    );

    windows.position.set(0, 2.45, -0.3);
    vehicle.add(windows);

    // WHEELS
    for (const wx of [-2, 2]) {

        for (const wz of [-2.2, 2.2]) {

            const wheel = new THREE.Mesh(
                new THREE.CylinderGeometry(
                    0.65,
                    0.65,
                    0.45,
                    8
                ),
                blackMat
            );

            wheel.rotation.z = Math.PI / 2;

            wheel.position.set(
                wx,
                0.7,
                wz
            );

            vehicle.add(wheel);
        }
    }

    vehicle.position.set(x, 0, z);

    vehicle.rotation.y = axis === "x"
        ? (
            direction > 0
                ? -Math.PI / 2
                : Math.PI / 2
        )
        : (
            direction > 0 ? Math.PI : 0
        );

    scene.add(vehicle);

    trafficCars.push({
        mesh: vehicle,
        speed: random(0.15, 0.35),
        direction,
        axis
    });
}

// CREATE 30 TRAFFIC CARS
for (let i = 0; i < 30; i++) {

    const road = roadPositions[
        Math.floor(Math.random() * roadPositions.length)
    ];

    const axis = Math.random() < 0.5
        ? "x"
        : "z";

    const direction = Math.random() < 0.5
        ? 1
        : -1;

    const lane = Math.random() < 0.5
        ? -7
        : 7;

    const color = trafficColors[
        Math.floor(Math.random() * trafficColors.length)
    ];

    if (axis === "z") {

        createTrafficCar(
            road + lane,
            random(-650, 650),
            color,
            axis,
            direction
        );

    } else {

        createTrafficCar(
            random(-650, 650),
            road + lane,
            color,
            axis,
            direction
        );
    }
}

// UPDATE TRAFFIC
function updateTraffic() {

    const signalRed =
        getSignalState() === "red";

    for (const t of trafficCars) {

        const pos = t.mesh.position;

        let shouldStop = false;

        if (signalRed) {

            for (const road of roadPositions) {

                const distance = t.axis === "z"
                    ? (road - pos.z) * t.direction
                    : (road - pos.x) * t.direction;

                if (
                    distance > 0 &&
                    distance < 18
                ) {
                    shouldStop = true;
                    break;
                }
            }
        }

        if (shouldStop) continue;

        if (t.axis === "z") {

            pos.z += t.speed * t.direction;

            if (pos.z > 750) pos.z = -750;
            if (pos.z < -750) pos.z = 750;

        } else {

            pos.x += t.speed * t.direction;

            if (pos.x > 750) pos.x = -750;
            if (pos.x < -750) pos.x = 750;
        }
    }
}

// =====================================================
// COLLISION SYSTEM
// =====================================================

function checkCollision(x, z) {

    // CITY BOUNDARY
    if (
        x < -760 ||
        x > 760 ||
        z < -760 ||
        z > 760
    ) {
        return true;
    }

    // BUILDINGS AND TREES
    for (const object of solidObjects) {

        if (
            Math.abs(x - object.x) <
                object.width / 2 + 3 &&

            Math.abs(z - object.z) <
                object.depth / 2 + 4
        ) {
            return true;
        }
    }

    // TRAFFIC CARS
    for (const t of trafficCars) {

        const dx =
            x - t.mesh.position.x;

        const dz =
            z - t.mesh.position.z;

        if (
            Math.abs(dx) < 4.5 &&
            Math.abs(dz) < 6
        ) {
            return true;
        }
    }

    // PEDESTRIANS
    for (const p of pedestrians) {

        const dx =
            x - p.person.position.x;

        const dz =
            z - p.person.position.z;

        if (Math.hypot(dx, dz) < 2.5) {
            return true;
        }
    }

    return false;
}

// =====================================================
// END OF PART 2
// =====================================================
// =====================================================
// PART 3 - PLAYER CAR UPDATE
// =====================================================

function updateCar() {

    const forward =
        keys["w"] || keys["arrowup"];

    const backward =
        keys["s"] || keys["arrowdown"];

    const left =
        keys["a"] || keys["arrowleft"];

    const right =
        keys["d"] || keys["arrowright"];

    const nitro = keys["shift"];

    // ACCELERATION
    if (forward) {
        speed += nitro ? 0.045 : 0.018;
    }

    if (backward) {
        speed -= 0.018;
    }

    // SPEED LIMIT
    speed = THREE.MathUtils.clamp(
        speed,
        -0.45,
        nitro ? NITRO_SPEED : MAX_SPEED
    );

    // FRICTION
    if (!forward && !backward) {
        speed *= 0.975;
    }

    if (Math.abs(speed) < 0.002) {
        speed = 0;
    }

    // STEERING
    let steerTarget = 0;

    if (left) steerTarget = 0.55;
    if (right) steerTarget = -0.55;

    steering += (steerTarget - steering) * 0.15;

    // TURNING
    if (Math.abs(speed) > 0.01) {
        heading += steering * speed * 0.055;
    }

    car.rotation.y = heading + Math.PI;

    // NEXT POSITION
    const nextX =
        car.position.x + Math.sin(heading) * speed;

    const nextZ =
        car.position.z + Math.cos(heading) * speed;

    if (!checkCollision(nextX, nextZ)) {

        car.position.x = nextX;
        car.position.z = nextZ;

    } else {

        speed = 0;
    }

    // WHEEL ROTATION
    for (const wheel of wheels) {
        wheel.rotation.x += speed * 0.15;
    }

    // BRAKE LIGHTS
    const braking = backward || speed < 0;

    for (const light of brakeLightMeshes) {

        light.material.color.set(
            braking ? 0xff7777 : 0xff1111
        );
    }
}

// =====================================================
// CAMERA MODES
// =====================================================

let cameraMode = 0;

function updateCamera() {

    const distance = cameraMode === 0 ? 13 : 7;
    const height = cameraMode === 0 ? 6 : 3;

    const targetX =
        car.position.x - Math.sin(heading) * distance;

    const targetZ =
        car.position.z - Math.cos(heading) * distance;

    camera.position.lerp(
        new THREE.Vector3(
            targetX,
            car.position.y + height,
            targetZ
        ),
        0.08
    );

    camera.lookAt(
        car.position.x,
        car.position.y + 1.5,
        car.position.z
    );
}

// =====================================================
// NIGHT MODE
// =====================================================

let isNight = false;

function toggleNightMode() {

    isNight = !isNight;

    if (isNight) {

        scene.background = new THREE.Color(0x050816);

        scene.fog = new THREE.Fog(
            0x050816,
            180,
            900
        );

        hemiLight.intensity = 0.25;
        sun.intensity = 0.15;

    } else {

        scene.background = new THREE.Color(0x82b7e8);

        scene.fog = new THREE.Fog(
            0x82b7e8,
            180,
            1100
        );

        hemiLight.intensity = 1.5;
        sun.intensity = 1.4;
    }
}

// =====================================================
// ENGINE SOUND AND HORN
// =====================================================

let audioContext = null;
let engineOscillator = null;
let engineGain = null;

let hornOscillator = null;
let hornGain = null;

function startEngineSound() {

    if (audioContext) {

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        return;
    }

    audioContext = new (
        window.AudioContext ||
        window.webkitAudioContext
    )();

    engineOscillator =
        audioContext.createOscillator();

    engineGain =
        audioContext.createGain();

    engineOscillator.type = "sawtooth";

    engineOscillator.frequency.value = 65;

    engineGain.gain.value = 0.018;

    engineOscillator.connect(engineGain);

    engineGain.connect(
        audioContext.destination
    );

    engineOscillator.start();
}

function updateEngineSound() {

    if (!audioContext || !engineOscillator) {
        return;
    }

    const frequency =
        65 + Math.abs(speed) * 100;

    engineOscillator.frequency.setTargetAtTime(
        frequency,
        audioContext.currentTime,
        0.08
    );
}

function playHorn() {

    startEngineSound();

    if (hornOscillator) return;

    hornOscillator =
        audioContext.createOscillator();

    hornGain =
        audioContext.createGain();

    hornOscillator.type = "square";

    hornOscillator.frequency.value = 440;

    hornGain.gain.value = 0.06;

    hornOscillator.connect(hornGain);

    hornGain.connect(
        audioContext.destination
    );

    hornOscillator.start();
}

function stopHorn() {

    if (!hornOscillator) return;

    hornOscillator.stop();

    hornOscillator.disconnect();
    hornGain.disconnect();

    hornOscillator = null;
    hornGain = null;
}

// =====================================================
// KEYBOARD CONTROLS
// =====================================================

window.addEventListener("keydown", function(event) {

    const key = event.key.toLowerCase();

    keys[key] = true;

    if (
        key.startsWith("arrow") ||
        key === " "
    ) {
        event.preventDefault();
    }

    if (key === "c" && !event.repeat) {

        cameraMode =
            (cameraMode + 1) % 2;
    }

    if (key === "n" && !event.repeat) {
        toggleNightMode();
    }

    if (key === "l" && !event.repeat) {
        toggleHeadlights();
    }

    if (
        key === "w" ||
        key === "arrowup" ||
        key === "shift"
    ) {
        startEngineSound();
    }
});

window.addEventListener("keyup", function(event) {

    keys[event.key.toLowerCase()] = false;
});

// =====================================================
// MOBILE CONTROLS
// =====================================================

function connectButton(id, key) {

    const button =
        document.getElementById(id);

    if (!button) return;

    button.addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            keys[key] = true;

            startEngineSound();

            button.setPointerCapture?.(
                event.pointerId
            );
        }
    );

    function release(event) {

        if (event) {
            event.preventDefault();
        }

        keys[key] = false;
    }

    button.addEventListener("pointerup", release);

    button.addEventListener(
        "pointercancel",
        release
    );

    button.addEventListener(
        "lostpointercapture",
        release
    );
}

connectButton("gasButton", "w");
connectButton("brakeButton", "s");
connectButton("leftButton", "a");
connectButton("rightButton", "d");
connectButton("nitroButton", "shift");

// CAMERA BUTTON
const cameraButton =
    document.getElementById("cameraButton");

if (cameraButton) {

    cameraButton.addEventListener(
        "click",
        function() {

            cameraMode =
                (cameraMode + 1) % 2;
        }
    );
}

// NIGHT BUTTON
const nightButton =
    document.getElementById("nightButton");

if (nightButton) {

    nightButton.addEventListener(
        "click",
        toggleNightMode
    );
}

// HEADLIGHT BUTTON
const headlightButton =
    document.getElementById("headlightButton");

if (headlightButton) {

    headlightButton.addEventListener(
        "click",
        toggleHeadlights
    );
}

// HORN BUTTON
const hornButton =
    document.getElementById("horn");

if (hornButton) {

    hornButton.addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            playHorn();
        }
    );

    hornButton.addEventListener(
        "pointerup",
        stopHorn
    );

    hornButton.addEventListener(
        "pointerleave",
        stopHorn
    );

    hornButton.addEventListener(
        "pointercancel",
        stopHorn
    );
}

// =====================================================
// RESIZE
// =====================================================

window.addEventListener("resize", function() {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});

// =====================================================
// GAME LOOP
// =====================================================

function animate() {

    requestAnimationFrame(animate);

    updateCar();

    updateCamera();

    updatePedestrians();

    updateTraffic();

    updateTrafficLights();

    updateEngineSound();

    renderer.render(scene, camera);
}

// =====================================================
// START GAME
// =====================================================

animate();

console.log(
    "BUGATTI CHIRON CITY DRIVE READY!"
);