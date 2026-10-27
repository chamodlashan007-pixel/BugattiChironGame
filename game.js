import * as THREE from "three";

// =====================================================
// BUGATTI CHIRON CITY DRIVE
// PART 1 - SCENE, GRASS, ROADS, ZEBRA CROSSINGS
// =====================================================

// =====================================================
// SCENE
// =====================================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x82b7e8);

scene.fog = new THREE.Fog(
    0x82b7e8,
    180,
    900
);

// =====================================================
// CAMERA
// =====================================================

const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    1200
);

camera.position.set(0, 6, 14);

// =====================================================
// RENDERER
// =====================================================

const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: "high-performance"
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 1)
);

renderer.shadowMap.enabled = false;

document.body.style.margin = "0";
document.body.style.overflow = "hidden";

document.body.appendChild(renderer.domElement);

// =====================================================
// LIGHTING
// =====================================================

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

// =====================================================
// MATERIAL CACHE
// =====================================================

const materials = {};

function mat(color) {

    const key = String(color);

    if (!materials[key]) {

        materials[key] =
            new THREE.MeshLambertMaterial({
                color: color
            });

    }

    return materials[key];
}

// =====================================================
// GROUND - LIGHT GREEN GRASS
// =====================================================

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(1800, 1800),
    mat(0x90EE90)
);

ground.rotation.x = -Math.PI / 2;

ground.position.y = -0.04;

scene.add(ground);

// =====================================================
// ROADS
// =====================================================

const roadMat = mat(0x292929);

const lineMat = mat(0xf4f4f4);

const yellowMat = mat(0xffd900);

const roadPositions = [
    -600,
    -300,
    0,
    300,
    600
];

// =====================================================
// VERTICAL ROADS
// =====================================================

for (const x of roadPositions) {

    const road = new THREE.Mesh(
        new THREE.BoxGeometry(
            28,
            0.05,
            1500
        ),
        roadMat
    );

    road.position.set(
        x,
        0.025,
        0
    );

    scene.add(road);
}

// =====================================================
// HORIZONTAL ROADS
// =====================================================

for (const z of roadPositions) {

    const road = new THREE.Mesh(
        new THREE.BoxGeometry(
            1500,
            0.05,
            28
        ),
        roadMat
    );

    road.position.set(
        0,
        0.026,
        z
    );

    scene.add(road);
}

// =====================================================
// ZEBRA CROSSINGS
// =====================================================

const zebraMat = new THREE.MeshLambertMaterial({
    color: 0xffffff
});

function createZebraCrossing(x, z, horizontal = false) {

    for (let i = 0; i < 9; i++) {

        const stripe = new THREE.Mesh(
            new THREE.BoxGeometry(
                horizontal ? 0.8 : 1.5,
                0.06,
                horizontal ? 1.5 : 0.8
            ),
            zebraMat
        );

        if (horizontal) {

            stripe.position.set(
                x - 6 + i * 1.5,
                0.07,
                z
            );

        } else {

            stripe.position.set(
                x,
                0.07,
                z - 6 + i * 1.5
            );

        }

        scene.add(stripe);
    }
}

// =====================================================
// CREATE ZEBRA CROSSINGS AT INTERSECTIONS
// =====================================================

for (const x of roadPositions) {

    for (const z of roadPositions) {

        createZebraCrossing(
            x - 17,
            z,
            false
        );

        createZebraCrossing(
            x + 17,
            z,
            false
        );

        createZebraCrossing(
            x,
            z - 17,
            true
        );

        createZebraCrossing(
            x,
            z + 17,
            true
        );

    }
}

// =====================================================
// ROAD LINES
// =====================================================

const lineVertices = [];

for (const x of roadPositions) {

    for (let z = -740; z < 740; z += 30) {

        lineVertices.push(
            x - 0.6, 0.06, z,
            x + 0.6, 0.06, z
        );

    }
}

for (const z of roadPositions) {

    for (let x = -740; x < 740; x += 30) {

        lineVertices.push(
            x, 0.061, z - 0.6,
            x, 0.061, z + 0.6
        );

    }
}

const lineGeometry = new THREE.BufferGeometry();

lineGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
        lineVertices,
        3
    )
);

const roadLines = new THREE.LineSegments(
    lineGeometry,
    lineMat
);

scene.add(roadLines);

// =====================================================
// TRAFFIC LIGHTS
// =====================================================

const poleMat = mat(0x333333);

const trafficLightBoxMat = mat(0x111111);

const redMat = new THREE.MeshBasicMaterial({
    color: 0xff0000
});

const yellowTrafficMat = new THREE.MeshBasicMaterial({
    color: 0x333300
});

const greenTrafficMat = new THREE.MeshBasicMaterial({
    color: 0x003300
});

// Store all traffic lights here
const trafficSignals = [];

// =====================================================
// CREATE ONE TRAFFIC LIGHT
// =====================================================

function createTrafficLight(x, z) {

    const group = new THREE.Group();

    // Pole
    const pole = new THREE.Mesh(
        new THREE.BoxGeometry(
            0.3,
            6,
            0.3
        ),
        poleMat
    );

    pole.position.y = 3;

    group.add(pole);

    // Traffic light housing
    const box = new THREE.Mesh(
        new THREE.BoxGeometry(
            1.1,
            2.8,
            0.7
        ),
        trafficLightBoxMat
    );

    box.position.y = 6.8;

    group.add(box);

    // Red light
    const red = new THREE.Mesh(
        new THREE.SphereGeometry(
            0.3,
            12,
            12
        ),
        redMat
    );

    red.position.set(
        0,
        7.6,
        0.38
    );

    group.add(red);

    // Yellow light
    const yellow = new THREE.Mesh(
        new THREE.SphereGeometry(
            0.3,
            12,
            12
        ),
        yellowTrafficMat
    );

    yellow.position.set(
        0,
        6.8,
        0.38
    );

    group.add(yellow);

    // Green light
    const green = new THREE.Mesh(
        new THREE.SphereGeometry(
            0.3,
            12,
            12
        ),
        greenTrafficMat
    );

    green.position.set(
        0,
        6,
        0.38
    );

    group.add(green);

    group.position.set(
        x,
        0,
        z
    );

    scene.add(group);

    trafficSignals.push({
        group: group,
        red: red,
        yellow: yellow,
        green: green
    });

}

// =====================================================
// ADD TRAFFIC LIGHTS TO INTERSECTIONS
// =====================================================

for (const x of roadPositions) {

    for (const z of roadPositions) {

        createTrafficLight(
            x + 19,
            z + 19
        );

        createTrafficLight(
            x - 19,
            z - 19
        );

    }
}

// =====================================================
// AUTOMATIC TRAFFIC LIGHT SYSTEM
// =====================================================

function updateTrafficLights() {

    const time = performance.now() / 1000;

    const phase = time % 12;

    let currentLight;

    if (phase < 5) {

        currentLight = "green";

    } else if (phase < 7) {

        currentLight = "yellow";

    } else {

        currentLight = "red";

    }

    for (const signal of trafficSignals) {

        signal.red.material.color.set(
            currentLight === "red"
                ? 0xff0000
                : 0x330000
        );

        signal.yellow.material.color.set(
            currentLight === "yellow"
                ? 0xffff00
                : 0x333300
        );

        signal.green.material.color.set(
            currentLight === "green"
                ? 0x00ff00
                : 0x003300
        );

    }

}

// =====================================================
// PART 1 END
// NEXT: BLUE BUGATTI + CAR CONTROLS
// =====================================================

// =====================================================
// BUGATTI CHIRON - PLAYER CAR
// =====================================================

const car = new THREE.Group();

scene.add(car);

// Car materials
const bodyMat = mat(0x0875e8);
const darkMat = mat(0x101010);

const glassMat = new THREE.MeshLambertMaterial({
    color: 0x102840,
    transparent: true,
    opacity: 0.8
});

// =====================================================
// CAR BODY
// =====================================================

const body = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.75, 6.2),
    bodyMat
);

body.position.y = 0.8;

car.add(body);

// =====================================================
// CAR ROOF
// =====================================================

const roof = new THREE.Mesh(
    new THREE.BoxGeometry(2.45, 0.65, 2.8),
    bodyMat
);

roof.position.set(0, 1.35, 0.25);

car.add(roof);

// =====================================================
// FRONT WINDSCREEN
// =====================================================

const frontGlass = new THREE.Mesh(
    new THREE.BoxGeometry(2.15, 0.45, 0.08),
    glassMat
);

frontGlass.position.set(0, 1.38, -1.18);

car.add(frontGlass);

// =====================================================
// REAR WINDSCREEN
// =====================================================

const rearGlass = new THREE.Mesh(
    new THREE.BoxGeometry(2.15, 0.45, 0.08),
    glassMat
);

rearGlass.position.set(0, 1.38, 1.65);

car.add(rearGlass);

// =====================================================
// FRONT HEADLIGHTS
// =====================================================

const headlightMat = new THREE.MeshBasicMaterial({
    color: 0xffffff
});

const headlightGeometry = new THREE.BoxGeometry(
    0.65,
    0.18,
    0.08
);

const leftHeadlight = new THREE.Mesh(
    headlightGeometry,
    headlightMat
);

leftHeadlight.position.set(
    -1.05,
    0.85,
    -3.12
);

car.add(leftHeadlight);

const rightHeadlight = new THREE.Mesh(
    headlightGeometry,
    headlightMat
);

rightHeadlight.position.set(
    1.05,
    0.85,
    -3.12
);

car.add(rightHeadlight);

// =====================================================
// REAR LIGHTS
// =====================================================

const rearLightMat = new THREE.MeshBasicMaterial({
    color: 0xff1111
});

const rearLightGeometry = new THREE.BoxGeometry(
    0.8,
    0.15,
    0.08
);

const leftRearLight = new THREE.Mesh(
    rearLightGeometry,
    rearLightMat
);

leftRearLight.position.set(
    -0.9,
    0.85,
    3.12
);

car.add(leftRearLight);

const rightRearLight = new THREE.Mesh(
    rearLightGeometry,
    rearLightMat
);

rightRearLight.position.set(
    0.9,
    0.85,
    3.12
);

car.add(rightRearLight);

// =====================================================
// WHEELS
// =====================================================

const wheelGeometry = new THREE.CylinderGeometry(
    0.48,
    0.48,
    0.35,
    12
);

function addWheel(x, z) {

    const wheel = new THREE.Mesh(
        wheelGeometry,
        darkMat
    );

    wheel.rotation.z = Math.PI / 2;

    wheel.position.set(
        x,
        0.48,
        z
    );

    car.add(wheel);

    return wheel;
}

const wheels = [];

wheels.push(addWheel(-1.65, -1.9));
wheels.push(addWheel(1.65, -1.9));
wheels.push(addWheel(-1.65, 1.9));
wheels.push(addWheel(1.65, 1.9));

// =====================================================
// CAR INITIAL POSITION
// =====================================================

car.position.set(
    0,
    0,
    80
);

let heading = Math.PI;

let speed = 0;

let steering = 0;

// =====================================================
// CAR SETTINGS
// =====================================================

const MAX_SPEED = 1.25;

const REVERSE_SPEED = -0.55;

const ACCELERATION = 0.025;

const FRICTION = 0.965;

const MAX_STEER = THREE.MathUtils.degToRad(30);

const WHEELBASE = 4.2;

// =====================================================
// KEYBOARD CONTROLS
// =====================================================

const keys = {};

window.addEventListener("keydown", function(event) {

    const key = event.key.toLowerCase();

    keys[key] = true;

    if (
        key.startsWith("arrow") ||
        key === " "
    ) {
        event.preventDefault();
    }

});

window.addEventListener("keyup", function(event) {

    keys[event.key.toLowerCase()] = false;

});

// =====================================================
// CAR UPDATE
// =====================================================
{

    const forward =
        keys["w"] ||
        keys["arrowup"];

    const backward =
        keys["s"] ||
        keys["arrowdown"];

    const left =
        keys["a"] ||
        keys["arrowleft"];

    const right =
        keys["d"] ||
        keys["arrowright"];

    // ACCELERATION

    if (forward) {
        speed += ACCELERATION;
    }

    if (backward) {
        speed -= ACCELERATION;
    }

    speed = THREE.MathUtils.clamp(
        speed,
        REVERSE_SPEED,
        MAX_SPEED
    );

    // FRICTION

    if (!forward && !backward) {
        speed *= FRICTION;
    }

    // STEERING

    let steerTarget = 0;

    if (left) {
        steerTarget = MAX_STEER;
    }

    if (right) {
        steerTarget = -MAX_STEER;
    }

    steering += (
        steerTarget - steering
    ) * 0.15;

    // TURNING

    if (
        Math.abs(speed) > 0.02 &&
        Math.abs(steering) > 0.001
    ) {

        const turn = (
            speed / WHEELBASE
        ) * Math.tan(steering);

        heading += turn * 0.055;

    }

    // MOVEMENT
    // Collision checking will be added in PART 3.

    car.position.x += Math.sin(heading) * speed;

    car.position.z += Math.cos(heading) * speed;

    car.rotation.y = heading;

    // MAP BOUNDARIES

    car.position.x = THREE.MathUtils.clamp(
        car.position.x,
        -850,
        850
    );

    car.position.z = THREE.MathUtils.clamp(
        car.position.z,
        -850,
        850
    );

    // WHEEL ROTATION

    for (const wheel of wheels) {
        wheel.rotation.x += speed * 0.15;
    }

}

// =====================================================
// CAMERA
// =====================================================

const cameraTarget = new THREE.Vector3();

const lookTarget = new THREE.Vector3();



// =====================================================
// PART 2 END
// NEXT: CITY, BUILDINGS, TREES & COLLISIONS
// =====================================================

// =====================================================
// PART 3 - CITY BUILDINGS, SHOPS, TREES
// PEDESTRIANS, TRAFFIC AND COLLISIONS
// =====================================================

// OBJECT LISTS
const buildings = [];
const trees = [];
const pedestrians = [];
const trafficCars = [];
const solidObjects = [];

// RANDOM NUMBER
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// =====================================================
// BUILDING CREATOR
// =====================================================

function createBuilding(x, z, width, height, depth, color) {
    const geometry = new THREE.BoxGeometry(
        width,
        height,
        depth
    );

    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.8
    });

    const building = new THREE.Mesh(
        geometry,
        material
    );

    building.position.set(
        x,
        height / 2,
        z
    );

    scene.add(building);

    buildings.push(building);

    solidObjects.push({
        x: x,
        z: z,
        width: width,
        depth: depth
    });

    // ROOF
    const roofGeometry = new THREE.BoxGeometry(
        width + 1,
        1,
        depth + 1
    );

    const roofMaterial = new THREE.MeshStandardMaterial({
        color: 0x444444
    });

    const roof = new THREE.Mesh(
        roofGeometry,
        roofMaterial
    );

    roof.position.set(
        x,
        height + 0.5,
        z
    );

    scene.add(roof);

    return building;
}

// =====================================================
// CITY BUILDINGS
// =====================================================

for (let x = -720; x <= 720; x += 80) {

    for (let z = -720; z <= 720; z += 80) {

        // KEEP ROADS CLEAR
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

        const width = random(35, 55);
        const depth = random(35, 55);
        const height = random(20, 100);

        const colors = [
            0xe0e0e0,
            0xc8d6e5,
            0xf5d7b2,
            0xd5d8dc,
            0xbfc9ca,
            0xf0f3f4,
            0xd7bde2
        ];

        const color = colors[
            Math.floor(Math.random() * colors.length)
        ];

        createBuilding(
            x + random(-8, 8),
            z + random(-8, 8),
            width,
            height,
            depth,
            color
        );
    }
}

// =====================================================
// SPECIAL SHOPS
// =====================================================

function createShop(x, z, name, color) {

    const shop = createBuilding(
        x,
        z,
        52,
        16,
        36,
        color
    );

    // SHOP SIGN
    const signGeometry = new THREE.BoxGeometry(
        32,
        5,
        1
    );

    const signMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: color,
        emissiveIntensity: 0.25
    });

    const sign = new THREE.Mesh(
        signGeometry,
        signMaterial
    );

    sign.position.set(
        x,
        13,
        z + 18.7
    );

    scene.add(sign);

    // DOOR
    const doorGeometry = new THREE.BoxGeometry(
        5,
        9,
        0.5
    );

    const doorMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333
    });

    const door = new THREE.Mesh(
        doorGeometry,
        doorMaterial
    );

    door.position.set(
        x,
        4.5,
        z + 18.4
    );

    scene.add(door);

    return shop;
}

createShop(-100, -100, "SUPER MARKET", 0x27ae60);
createShop(100, -100, "CAR SHOP", 0x2980b9);
createShop(-100, 100, "GARAGE", 0xe67e22);
createShop(100, 100, "BOOK SHOP", 0x8e44ad);

// =====================================================
// TREES
// =====================================================

function createTree(x, z) {

    const trunkGeometry = new THREE.CylinderGeometry(
        1,
        1.5,
        8,
        7
    );

    const trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0x795548
    });

    const trunk = new THREE.Mesh(
        trunkGeometry,
        trunkMaterial
    );

    trunk.position.set(
        x,
        4,
        z
    );

    scene.add(trunk);

    const leavesGeometry = new THREE.SphereGeometry(
        5,
        8,
        6
    );

    const leavesMaterial = new THREE.MeshStandardMaterial({
        color: 0x16852b
    });

    const leaves = new THREE.Mesh(
        leavesGeometry,
        leavesMaterial
    );

    leaves.position.set(
        x,
        10,
        z
    );

    scene.add(leaves);

    trees.push({
        x: x,
        z: z,
        trunk: trunk,
        leaves: leaves
    });

    solidObjects.push({
        x: x,
        z: z,
        width: 5,
        depth: 5
    });
}

// CREATE TREES BESIDE ROADS
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
            break;
        }
    }

    // KEEP PLAYER STARTING AREA CLEAR
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
// PEDESTRIAN CREATOR
// =====================================================

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
        new THREE.SphereGeometry(0.65, 8, 6),
        new THREE.MeshStandardMaterial({
            color: skinColor
        })
    );

    head.position.y = 4.3;
    person.add(head);

    // BODY
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 2, 0.7),
        new THREE.MeshStandardMaterial({
            color: shirtColor
        })
    );

    body.position.y = 2.7;
    person.add(body);

    // ARMS
    const armGeometry = new THREE.BoxGeometry(
        0.35,
        1.7,
        0.4
    );

    const armMaterial = new THREE.MeshStandardMaterial({
        color: skinColor
    });

    const leftArm = new THREE.Mesh(
        armGeometry,
        armMaterial
    );

    leftArm.position.set(-0.8, 2.8, 0);

    person.add(leftArm);

    const rightArm = new THREE.Mesh(
        armGeometry,
        armMaterial
    );

    rightArm.position.set(0.8, 2.8, 0);

    person.add(rightArm);

    // LEGS
    const legGeometry = new THREE.BoxGeometry(
        0.4,
        1.5,
        0.45
    );

    const legMaterial = new THREE.MeshStandardMaterial({
        color: 0x263238
    });

    const leftLeg = new THREE.Mesh(
        legGeometry,
        legMaterial
    );

    leftLeg.position.set(-0.3, 0.75, 0);

    person.add(leftLeg);

    const rightLeg = new THREE.Mesh(
        legGeometry,
        legMaterial
    );

    rightLeg.position.set(0.3, 0.75, 0);

    person.add(rightLeg);

    person.position.set(x, 0, z);

    scene.add(person);

    pedestrians.push({
        person: person,
        x: x,
        z: z,
        direction: Math.random() < 0.5 ? 1 : -1,
        speed: random(0.025, 0.055),
        leftLeg: leftLeg,
        rightLeg: rightLeg,
        startX: x,
        startZ: z
    });
}

// CREATE PEDESTRIANS BESIDE ROADS
for (let i = 0; i < 30; i++) {

    const road = roadPositions[
        Math.floor(Math.random() * roadPositions.length)
    ];

    const z = random(-650, 650);

    const side = Math.random() < 0.5 ? -1 : 1;

    const x = road + side * 19;

    createPedestrian(x, z);
}

// =====================================================
// TRAFFIC CAR CREATOR
// =====================================================

function createTrafficCar(x, z, color) {

    const trafficCar = new THREE.Group();

    // CAR BODY
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(4, 1.5, 7),
        new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.6
        })
    );

    body.position.y = 1.3;

    trafficCar.add(body);

    // WINDOWS
    const windows = new THREE.Mesh(
        new THREE.BoxGeometry(3, 1.1, 3),
        new THREE.MeshStandardMaterial({
            color: 0x263746,
            metalness: 0.2,
            roughness: 0.25
        })
    );

    windows.position.set(
        0,
        2.45,
        -0.3
    );

    trafficCar.add(windows);

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
                new THREE.MeshStandardMaterial({
                    color: 0x171717
                })
            );

            wheel.rotation.z = Math.PI / 2;

            wheel.position.set(
                wx,
                0.7,
                wz
            );

            trafficCar.add(wheel);
        }
    }

    trafficCar.position.set(
        x,
        0,
        z
    );

    scene.add(trafficCar);

    trafficCars.push({
        mesh: trafficCar,
        speed: random(0.15, 0.35),
        direction: Math.random() < 0.5 ? 1 : -1
    });
}

// CREATE TRAFFIC ON ROADS
const trafficColors = [
    0xe53935,
    0xffffff,
    0xffc107,
    0x212121,
    0x43a047,
    0x8e44ad
];

for (let i = 0; i < 18; i++) {

    const road = roadPositions[
        Math.floor(Math.random() * roadPositions.length)
    ];

    const z = random(-650, 650);

    const color = trafficColors[
        Math.floor(Math.random() * trafficColors.length)
    ];

    createTrafficCar(
        road + (Math.random() < 0.5 ? -7 : 7),
        z,
        color
    );
}

// =====================================================
// COLLISION CHECK
// =====================================================

function checkCollision(x, z) {

    // MAP BORDER
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

        const halfWidth = object.width / 2 + 3;
        const halfDepth = object.depth / 2 + 4;

        if (
            Math.abs(x - object.x) < halfWidth &&
            Math.abs(z - object.z) < halfDepth
        ) {
            return true;
        }
    }

    // OTHER CARS
    for (const traffic of trafficCars) {

        const dx = x - traffic.mesh.position.x;
        const dz = z - traffic.mesh.position.z;

        if (
            Math.abs(dx) < 4.5 &&
            Math.abs(dz) < 6
        ) {
            return true;
        }
    }

    return false;
}

// =====================================================
// UPDATE PEDESTRIANS
// =====================================================

function updatePedestrians() {
    for (const p of pedestrians) {
        p.z += p.speed * p.direction;

        if (Math.abs(p.z - p.startZ) > 12) {
            p.direction *= -1;
        }

        p.person.position.x = p.x;
        p.person.position.z = p.z;

        p.person.rotation.y =
            p.direction > 0 ? 0 : Math.PI;

        const step =
            Math.sin(performance.now() * 0.008 + p.startZ) * 0.45;

        p.leftLeg.rotation.x = step;
        p.rightLeg.rotation.x = -step;
    }
}

// =====================================================
// UPDATE TRAFFIC
// =====================================================

function updateTraffic() {

    for (const traffic of trafficCars) {

        traffic.mesh.position.z +=
            traffic.speed * traffic.direction;

        // KEEP TRAFFIC INSIDE MAP
        if (traffic.mesh.position.z > 750) {
            traffic.mesh.position.z = -750;
        }

        if (traffic.mesh.position.z < -750) {
            traffic.mesh.position.z = 750;
        }
    }
}

// =====================================================
// PART 3 END
// =====================================================

// =====================================================
// PART 4 - GAME CONTROLS AND GAME LOOP
// =====================================================

// PLAYER MOVEMENT
function updateCar() {

    const forward =
        keys["w"] || keys["arrowup"];

    const backward =
        keys["s"] || keys["arrowdown"];

    const left =
        keys["a"] || keys["arrowleft"];

    const right =
        keys["d"] || keys["arrowright"];

    // ACCELERATION
    if (forward) {
        speed += 0.018;
    }

    if (backward) {
        speed -= 0.018;
    }

    // SPEED LIMIT
    speed = Math.max(
        -0.45,
        Math.min(speed, 1.0)
    );

    // FRICTION
    if (!forward && !backward) {
        speed *= 0.975;
    }

    if (Math.abs(speed) < 0.002) {
        speed = 0;
    }

    // STEERING
    if (left && Math.abs(speed) > 0.01) {
        steering = Math.max(
            steering - 0.045,
            -0.55
        );
    }

    if (right && Math.abs(speed) > 0.01) {
        steering = Math.min(
            steering + 0.045,
            0.55
        );
    }

    if (!left && !right) {
        steering *= 0.82;
    }

    // TURN IN THE DIRECTION OF TRAVEL
    heading -= steering * speed * 0.055;

    car.rotation.y = heading + Math.PI;

    // PROPOSED NEW POSITION
    const nextX =
        car.position.x + Math.sin(heading) * speed;

    const nextZ =
        car.position.z + Math.cos(heading) * speed;

    // COLLISION DETECTION
    if (!checkCollision(nextX, nextZ)) {

        car.position.x = nextX;
        car.position.z = nextZ;

    } else {

        // STOP IF SOMETHING IS IN THE WAY
        speed = 0;
    }

    // KEEP CAR INSIDE CITY
    car.position.x = Math.max(
        -755,
        Math.min(car.position.x, 755)
    );

    car.position.z = Math.max(
        -755,
        Math.min(car.position.z, 755)
    );

    // ROTATE WHEELS
    if (typeof wheels !== "undefined") {
        for (const wheel of wheels) {
            wheel.rotation.x += speed * 0.15;
        }
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

// PRESS C TO CHANGE CAMERA
window.addEventListener("keydown", function (event) {

    if (event.key.toLowerCase() === "c") {
        cameraMode = (cameraMode + 1) % 2;
    }

    if (event.key.toLowerCase() === "n") {
        toggleNightMode();
    }
});

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

        if (typeof ambientLight !== "undefined") {
            ambientLight.intensity = 0.25;
        }

        if (typeof sunLight !== "undefined") {
            sunLight.intensity = 0.15;
        }

    } else {

        scene.background = new THREE.Color(0x82b7e8);
        scene.fog = new THREE.Fog(
            0x82b7e8,
            180,
            900
        );

        if (typeof ambientLight !== "undefined") {
            ambientLight.intensity = 1.0;
        }

        if (typeof sunLight !== "undefined") {
            sunLight.intensity = 1.5;
        }
    }
}

// =====================================================
// MOBILE BUTTONS
// =====================================================

function connectButton(id, key) {

    const button = document.getElementById(id);

    if (!button) return;

    button.addEventListener("pointerdown", function (event) {
        event.preventDefault();
        keys[key] = true;
    });

    button.addEventListener("pointerup", function () {
        keys[key] = false;
    });

    button.addEventListener("pointerleave", function () {
        keys[key] = false;
    });

    button.addEventListener("pointercancel", function () {
        keys[key] = false;
    });
}

// These IDs must match the buttons in index.html.
connectButton("gas", "w");
connectButton("brake", "s");
connectButton("left", "a");
connectButton("right", "d");

// =====================================================
// RESIZE
// =====================================================

window.addEventListener("resize", function () {

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

    renderer.render(scene, camera);
}

// START GAME
animate();

// =====================================================
// GAME READY
// =====================================================