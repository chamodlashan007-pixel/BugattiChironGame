import * as THREE from "three";

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

document.body.appendChild(renderer.domElement);

// =====================================================
// LIGHT
// =====================================================

const hemiLight =
    new THREE.HemisphereLight(
        0xffffff,
        0x557755,
        1.5
    );

scene.add(hemiLight);

const sun =
    new THREE.DirectionalLight(
        0xffffff,
        1.4
    );

sun.position.set(
    100,
    200,
    100
);

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
// GROUND
// =====================================================

const ground =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            1800,
            1800
        ),
        mat(0x4d8b45)
    );

ground.rotation.x =
    -Math.PI / 2;

scene.add(ground);

// =====================================================
// ROADS
// =====================================================

const roadMat =
    mat(0x292929);

const lineMat =
    mat(0xf4f4f4);

const yellowMat =
    mat(0xffd900);

const roadPositions = [
    -600,
    -300,
    0,
    300,
    600
];

// Vertical roads

for (const x of roadPositions) {

    const road =
        new THREE.Mesh(
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

// Horizontal roads

for (const z of roadPositions) {

    const road =
        new THREE.Mesh(
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
// ROAD LINES
// =====================================================

const lineVertices = [];

for (const x of roadPositions) {

    for (
        let z = -740;
        z < 740;
        z += 30
    ) {

        lineVertices.push(
            x - 0.6,
            0.06,
            z,

            x + 0.6,
            0.06,
            z
        );

    }

}

for (const z of roadPositions) {

    for (
        let x = -740;
        x < 740;
        x += 30
    ) {

        lineVertices.push(
            x,
            0.061,
            z - 0.6,

            x,
            0.061,
            z + 0.6
        );

    }

}

const lineGeometry =
    new THREE.BufferGeometry();

lineGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
        lineVertices,
        3
    )
);

const roadLines =
    new THREE.LineSegments(
        lineGeometry,
        lineMat
    );

scene.add(roadLines);

// =====================================================
// PLAYER CAR
// =====================================================

const car =
    new THREE.Group();

scene.add(car);

const bodyMat =
    mat(0x0875e8);

const darkMat =
    mat(0x101010);

const glassMat =
    new THREE.MeshLambertMaterial({
        color: 0x102840,
        transparent: true,
        opacity: 0.8
    });

// Body

const body =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            3.2,
            0.75,
            6.2
        ),
        bodyMat
    );

body.position.y =
    0.8;

car.add(body);

// Roof

const roof =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            2.45,
            0.65,
            2.8
        ),
        bodyMat
    );

roof.position.set(
    0,
    1.35,
    0.25
);

car.add(roof);

// Front glass

const frontGlass =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            2.15,
            0.45,
            0.08
        ),
        glassMat
    );

frontGlass.position.set(
    0,
    1.38,
    -1.18
);

car.add(frontGlass);

// Rear glass

const rearGlass =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            2.15,
            0.45,
            0.08
        ),
        glassMat
    );

rearGlass.position.set(
    0,
    1.38,
    1.65
);

car.add(rearGlass);

// =====================================================
// WHEELS
// =====================================================

const wheelGeometry =
    new THREE.CylinderGeometry(
        0.48,
        0.48,
        0.35,
        12
    );

function addWheel(x, z) {

    const wheel =
        new THREE.Mesh(
            wheelGeometry,
            darkMat
        );

    wheel.rotation.z =
        Math.PI / 2;

    wheel.position.set(
        x,
        0.48,
        z
    );

    car.add(wheel);
}

addWheel(-1.65, -1.9);
addWheel(1.65, -1.9);
addWheel(-1.65, 1.9);
addWheel(1.65, 1.9);

// =====================================================
// CAR CONTROL
// =====================================================

car.position.set(
    0,
    0,
    80
);

let heading =
    Math.PI;

let speed = 0;

let steering = 0;

const MAX_SPEED = 1.25;
const REVERSE_SPEED = -0.55;

const ACCELERATION = 0.025;

const FRICTION = 0.965;

const MAX_STEER =
    THREE.MathUtils.degToRad(30);

const WHEELBASE = 4.2;

const keys = {};

window.addEventListener(
    "keydown",
    event => {

        keys[
            event.key.toLowerCase()
        ] = true;

    }
);

window.addEventListener(
    "keyup",
    event => {

        keys[
            event.key.toLowerCase()
        ] = false;

    }
);

// =====================================================
// BUILDINGS
// =====================================================

const buildings = [];

const buildingColors = [
    0x8b9299,
    0x707984,
    0xa7adb2,
    0x626b75,
    0x8b806e,
    0x777777
];

const buildingGeometry =
    new THREE.BoxGeometry(
        1,
        1,
        1
    );

// =====================================================
// WINDOWS - INSTANCED
// =====================================================

const windowGeometry =
    new THREE.BoxGeometry(
        0.75,
        0.45,
        0.05
    );

const windowMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x9ed9ff
    });

const MAX_WINDOWS = 14000;

const frontWindows =
    new THREE.InstancedMesh(
        windowGeometry,
        windowMaterial,
        MAX_WINDOWS
    );

const backWindows =
    new THREE.InstancedMesh(
        windowGeometry,
        windowMaterial,
        MAX_WINDOWS
    );

const leftWindows =
    new THREE.InstancedMesh(
        windowGeometry,
        windowMaterial,
        MAX_WINDOWS
    );

const rightWindows =
    new THREE.InstancedMesh(
        windowGeometry,
        windowMaterial,
        MAX_WINDOWS
    );

scene.add(frontWindows);
scene.add(backWindows);
scene.add(leftWindows);
scene.add(rightWindows);

let frontCount = 0;
let backCount = 0;
let leftCount = 0;
let rightCount = 0;

const dummy =
    new THREE.Object3D();

// =====================================================
// CREATE BUILDING
// =====================================================

function createBuilding(
    x,
    z,
    width,
    height,
    depth,
    color
) {

    const building =
        new THREE.Mesh(
            buildingGeometry,
            mat(color)
        );

    building.position.set(
        x,
        height / 2,
        z
    );

    building.scale.set(
        width,
        height,
        depth
    );

    scene.add(building);

    // SAVE BUILDING FOR COLLISION
    buildings.push({
        x: x,
        z: z,
        width: width,
        depth: depth
    });

    // -----------------------------
    // WINDOWS
    // -----------------------------

    const floors =
        Math.min(
            10,
            Math.max(
                3,
                Math.floor(
                    height / 9
                )
            )
        );

    const columns =
        Math.min(
            8,
            Math.max(
                3,
                Math.floor(
                    width / 7
                )
            )
        );

    for (
        let f = 0;
        f < floors;
        f++
    ) {

        const wy =
            5 +
            f *
            (
                (height - 10) /
                floors
            );

        for (
            let c = 0;
            c < columns;
            c++
        ) {

            const wx =
                -width / 2 +
                4 +
                c *
                (
                    (width - 8) /
                    Math.max(
                        1,
                        columns - 1
                    )
                );

            // FRONT

            if (
                frontCount <
                MAX_WINDOWS
            ) {

                dummy.position.set(
                    x + wx,
                    wy,
                    z -
                    depth / 2 -
                    0.04
                );

                dummy.rotation.set(
                    0,
                    0,
                    0
                );

                dummy.scale.set(
                    1,
                    1,
                    1
                );

                dummy.updateMatrix();

                frontWindows.setMatrixAt(
                    frontCount++,
                    dummy.matrix
                );

            }

            // BACK

            if (
                backCount <
                MAX_WINDOWS
            ) {

                dummy.position.set(
                    x + wx,
                    wy,
                    z +
                    depth / 2 +
                    0.04
                );

                dummy.rotation.set(
                    0,
                    0,
                    0
                );

                dummy.updateMatrix();

                backWindows.setMatrixAt(
                    backCount++,
                    dummy.matrix
                );

            }

        }

        // SIDE WINDOWS

        const sideColumns =
            Math.min(
                6,
                Math.max(
                    2,
                    Math.floor(
                        depth / 8
                    )
                )
            );

        for (
            let c = 0;
            c < sideColumns;
            c++
        ) {

            const wz =
                -depth / 2 +
                4 +
                c *
                (
                    (depth - 8) /
                    Math.max(
                        1,
                        sideColumns - 1
                    )
                );

            // LEFT

            if (
                leftCount <
                MAX_WINDOWS
            ) {

                dummy.position.set(
                    x -
                    width / 2 -
                    0.04,
                    wy,
                    z + wz
                );

                dummy.rotation.set(
                    0,
                    Math.PI / 2,
                    0
                );

                dummy.updateMatrix();

                leftWindows.setMatrixAt(
                    leftCount++,
                    dummy.matrix
                );

            }

            // RIGHT

            if (
                rightCount <
                MAX_WINDOWS
            ) {

                dummy.position.set(
                    x +
                    width / 2 +
                    0.04,
                    wy,
                    z + wz
                );

                dummy.rotation.set(
                    0,
                    Math.PI / 2,
                    0
                );

                dummy.updateMatrix();

                rightWindows.setMatrixAt(
                    rightCount++,
                    dummy.matrix
                );

            }

        }

    }

}

// =====================================================
// ROAD CHECK
// =====================================================

function nearRoad(
    x,
    z
) {

    for (
        const road
        of roadPositions
    ) {

        if (
            Math.abs(x - road) <
            48
        )
            return true;

        if (
            Math.abs(z - road) <
            48
        )
            return true;

    }

    return false;

}

// =====================================================
// CITY BUILDINGS
// =====================================================

for (
    let x = -720;
    x <= 720;
    x += 80
) {

    for (
        let z = -720;
        z <= 720;
        z += 80
    ) {

        if (
            nearRoad(x, z)
        )
            continue;

        if (
            Math.random() < 0.10
        )
            continue;

        const width =
            38 +
            Math.random() * 22;

        const depth =
            38 +
            Math.random() * 22;

        const height =
            30 +
            Math.random() * 100;

        const color =
            buildingColors[
                Math.floor(
                    Math.random() *
                    buildingColors.length
                )
            ];

        createBuilding(
            x,
            z,
            width,
            height,
            depth,
            color
        );

    }

}

// =====================================================
// UPDATE INSTANCED WINDOWS
// =====================================================

frontWindows.count =
    frontCount;

backWindows.count =
    backCount;

leftWindows.count =
    leftCount;

rightWindows.count =
    rightCount;

frontWindows
    .instanceMatrix
    .needsUpdate = true;

backWindows
    .instanceMatrix
    .needsUpdate = true;

leftWindows
    .instanceMatrix
    .needsUpdate = true;

rightWindows
    .instanceMatrix
    .needsUpdate = true;

// =====================================================
// SPECIAL BUILDINGS
// =====================================================

function createSpecialBuilding(
    name,
    x,
    z,
    color
) {

    const group =
        new THREE.Group();

    const building =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                70,
                25,
                55
            ),
            mat(color)
        );

    building.position.y =
        12.5;

    group.add(
        building
    );

    const signMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        });

    const sign =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                50,
                4,
                1
            ),
            signMaterial
        );

    sign.position.set(
        0,
        27,
        -28
    );

    group.add(sign);

    group.position.set(
        x,
        0,
        z
    );

    scene.add(group);

    // SPECIAL BUILDING COLLISION
    buildings.push({
        x: x,
        z: z,
        width: 70,
        depth: 55
    });

}

// =====================================================
// SHOPS
// =====================================================

createSpecialBuilding(
    "Super Market",
    -100,
    -100,
    0xe8e8e8
);

createSpecialBuilding(
    "Car Shop",
    100,
    -100,
    0xeeeeee
);

createSpecialBuilding(
    "Garage",
    -100,
    100,
    0x777777
);

createSpecialBuilding(
    "Book Shop",
    100,
    100,
    0xc5c5c5
);

// =====================================================
// TREES

const trees = [];

const trunkGeometry =
    new THREE.CylinderGeometry(
        0.8,
        1.1,
        7,
        8
    );
const leafGeometry =
    new THREE.SphereGeometry(
        4.5,
        8,
        6
    );

const trunkMaterial =
    mat(0x69442a);

const leafMaterial =
    mat(0x24752c);

for (
    let i = 0;
    i < 70;
    i++
) {

    const x =
        (
            Math.random() -
            0.5
        ) * 1400;

    const z =
        (
            Math.random() -
            0.5
        ) * 1400;

    if (
        nearRoad(x, z)
    )
        continue;

    const tree =
        new THREE.Group();

    const trunk =
        new THREE.Mesh(
            trunkGeometry,
            trunkMaterial
        );

    trunk.position.y =
        3.5;

    tree.add(trunk);

    const leaves =
        new THREE.Mesh(
            leafGeometry,
            leafMaterial
        );

    leaves.position.y =
        9;

    tree.add(leaves);

    tree.position.set(
        x,
        0,
        z
    );
trees.push(tree);
    scene.add(tree);

}
// ==========================================
// PEDESTRIANS
// ==========================================

const pedestrians = [];

const pedestrianSkinColors = [
    0xffcc99,
    0xd9a066,
    0xb87950,
    0xf1c27d,
    0x8d5524
];

const pedestrianShirtColors = [
    0xff3333,
    0x3366ff,
    0x33cc66,
    0xffcc00,
    0xffffff,
    0x9933ff,
    0xff8800
];

const pedestrianPantsColors = [
    0x222222,
    0x333366,
    0x555555,
    0x224422,
    0x777777
];

function pedestrianRandomColor(colors) {
    return colors[
        Math.floor(Math.random() * colors.length)
    ];
}

const pedestrianSkinMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff
});

const pedestrianHairMaterial = new THREE.MeshLambertMaterial({
    color: 0x222222
});

function createPedestrian(x, z, axis, direction) {

    const person = new THREE.Group();

    const skinMaterial = new THREE.MeshLambertMaterial({
        color: pedestrianRandomColor(
            pedestrianSkinColors
        )
    });

    const shirtMaterial = new THREE.MeshLambertMaterial({
        color: pedestrianRandomColor(
            pedestrianShirtColors
        )
    });

    const pantsMaterial = new THREE.MeshLambertMaterial({
        color: pedestrianRandomColor(
            pedestrianPantsColors
        )
    });

    // BODY
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 1.2, 0.45),
        shirtMaterial
    );

    body.position.y = 1.9;
    person.add(body);

    // HEAD
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 12, 12),
        skinMaterial
    );

    head.position.y = 2.8;
    person.add(head);

    // HAIR
    const hair = new THREE.Mesh(
        new THREE.SphereGeometry(0.31, 12, 8),
        pedestrianHairMaterial
    );

    hair.scale.set(1, 0.55, 1);
    hair.position.y = 2.98;
    person.add(hair);

    // LEFT ARM
    const leftArm = new THREE.Group();

    leftArm.position.set(-0.5, 2.35, 0);

    const leftArmMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.85, 0.25),
        shirtMaterial
    );

    leftArmMesh.position.y = -0.4;
    leftArm.add(leftArmMesh);

    person.add(leftArm);

    // RIGHT ARM
    const rightArm = new THREE.Group();

    rightArm.position.set(0.5, 2.35, 0);

    const rightArmMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.85, 0.25),
        shirtMaterial
    );

    rightArmMesh.position.y = -0.4;
    rightArm.add(rightArmMesh);

    person.add(rightArm);

    // LEFT LEG
    const leftLeg = new THREE.Group();

    leftLeg.position.set(-0.22, 1.35, 0);

    const leftLegMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.85, 0.32),
        pantsMaterial
    );

    leftLegMesh.position.y = -0.4;
    leftLeg.add(leftLegMesh);

    person.add(leftLeg);

    // RIGHT LEG
    const rightLeg = new THREE.Group();

    rightLeg.position.set(0.22, 1.35, 0);

    const rightLegMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.85, 0.32),
        pantsMaterial
    );

    rightLegMesh.position.y = -0.4;
    rightLeg.add(rightLegMesh);

    person.add(rightLeg);

    // POSITION
    person.position.set(x, 0, z);

    scene.add(person);

    pedestrians.push({
        mesh: person,
        axis: axis,
        direction: direction,
        speed: 0.025 + Math.random() * 0.025,
        phase: Math.random() * Math.PI * 2,
        leftArm: leftArm,
        rightArm: rightArm,
        leftLeg: leftLeg,
        rightLeg: rightLeg
    });
}


// CREATE PEDESTRIANS
function spawnPedestrians() {

    for (let i = 0; i < 30; i++) {

        const roadIndex = Math.floor(
            Math.random() * roadPositions.length
        );

        const roadPosition = roadPositions[roadIndex];

        const side = Math.random() < 0.5 ? -1 : 1;

        const direction = Math.random() < 0.5 ? -1 : 1;

        if (Math.random() < 0.5) {

            // WALK BESIDE VERTICAL ROADS
            const x = roadPosition + side * 19;

            const z = Math.random() * 1200 - 600;

            createPedestrian(
                x,
                z,
                "z",
                direction
            );

        } else {

            // WALK BESIDE HORIZONTAL ROADS
            const z = roadPosition + side * 19;

            const x = Math.random() * 1200 - 600;

            createPedestrian(
                x,
                z,
                "x",
                direction
            );
        }
    }
}

spawnPedestrians();


// UPDATE PEDESTRIANS
function updatePedestrians() {

    const time = performance.now() * 0.006;

    pedestrians.forEach(function (person) {

        const mesh = person.mesh;

        const walking = time + person.phase;

        // WALK FORWARD
        if (person.axis === "x") {

            mesh.position.x +=
                person.speed * person.direction;

        } else {

            mesh.position.z +=
                person.speed * person.direction;

        }

        // TURN TOWARD WALKING DIRECTION
        if (person.axis === "x") {

            mesh.rotation.y =
                person.direction > 0 ? 0 : Math.PI;

        } else {

            mesh.rotation.y =
                person.direction > 0
                    ? Math.PI / 2
                    : -Math.PI / 2;

        }

        // ANIMATE ARMS AND LEGS
        const swing = Math.sin(walking) * 0.45;

        person.leftArm.rotation.x = swing;
        person.rightArm.rotation.x = -swing;

        person.leftLeg.rotation.x = -swing;
        person.rightLeg.rotation.x = swing;

        // KEEP PEDESTRIANS IN THE CITY
        if (
            mesh.position.x > 710 ||
            mesh.position.x < -710 ||
            mesh.position.z > 710 ||
            mesh.position.z < -710
        ) {

            if (person.axis === "x") {

                mesh.position.x =
                    person.direction > 0 ? -710 : 710;

            } else {

                mesh.position.z =
                    person.direction > 0 ? -710 : 710;

            }
        }

    });
}

// =====================================================
// TRAFFIC
// =====================================================

const traffic = [];

const trafficColors = [
    0xff2222,
    0xffffff,
    0xffcc00,
    0x22cc55,
    0xaa44ff,
    0xff7700
];

function createTrafficCar(
    x,
    z,
    direction
) {

    const group =
        new THREE.Group();

    const color =
        trafficColors[
            Math.floor(
                Math.random() *
                trafficColors.length
            )
        ];

    const body =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.7,
                0.7,
                5
            ),
            mat(color)
        );

    body.position.y =
        0.7;

    group.add(body);

    const roof =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.1,
                0.6,
                2.2
            ),
            mat(0x333333)
        );

    roof.position.y =
        1.25;

    group.add(roof);

    group.position.set(
        x,
        0,
        z
    );

    group.rotation.y =
        direction === "x"
            ? Math.PI / 2
            : 0;

    scene.add(group);

    traffic.push({
        mesh: group,
        direction: direction,
        speed:
            0.25 +
            Math.random() * 0.3
    });

}

// =====================================================
// TRAFFIC SPAWN
// =====================================================

for (
    let i = 0;
    i < 24;
    i++
) {

    const road =
        roadPositions[
            Math.floor(
                Math.random() *
                roadPositions.length
            )
        ];

    if (
        i % 2 === 0
    ) {

        createTrafficCar(
            road + 7,
            -700 +
            Math.random() * 1400,
            "z"
        );

    } else {

        createTrafficCar(
            -700 +
            Math.random() * 1400,
            road + 7,
            "x"
        );

    }

}

// =====================================================
// TRAFFIC UPDATE
// =====================================================

function updateTraffic() {

    for (
        const t of traffic
    ) {

        if (
            t.direction === "z"
        ) {

            t.mesh.position.z +=
                t.speed;

            if (
                t.mesh.position.z >
                760
            ) {

                t.mesh.position.z =
                    -760;

            }

        } else {

            t.mesh.position.x +=
                t.speed;

            if (
                t.mesh.position.x >
                760
            ) {

                t.mesh.position.x =
                    -760;

            }

        }

    }

}


// =====================================================
// BUILDING COLLISION
// =====================================================

function isCollision(x, z) {

    // ==============================
    // BUILDING COLLISION
    // ==============================

    for (const b of buildings) {

        if (
            Math.abs(x - b.x) <
            b.width / 2 + 2.2 &&
            Math.abs(z - b.z) <
            b.depth / 2 + 2.2
        ) {
            return true;
        }
    }

    // ==============================
    // TREE COLLISION
    // ==============================

    for (const tree of trees) {

        const dx =
            x - tree.position.x;

        const dz =
            z - tree.position.z;

        const distance =
            Math.sqrt(
                dx * dx +
                dz * dz
            );

        if (distance < 6) {
            return true;
        }
    }

    // ==============================
    // TRAFFIC CAR COLLISION
    // ==============================

    for (const t of traffic) {

        const dx =
            x - t.mesh.position.x;

        const dz =
            z - t.mesh.position.z;

        const distance =
            Math.sqrt(
                dx * dx +
                dz * dz
            );

        if (distance < 4.5) {
            return true;
        }
    }

    return false;
}

// =====================================================
// PLAYER UPDATE
// =====================================================

function updateCar() {

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

        speed +=
            ACCELERATION;

    }

    if (backward) {

        speed -=
            ACCELERATION;

    }

    speed =
        THREE.MathUtils.clamp(
            speed,
            REVERSE_SPEED,
            MAX_SPEED
        );

    // FRICTION

    if (
        !forward &&
        !backward
    ) {

        speed *=
            FRICTION;

    }

    // STEERING
    // A = LEFT
    // D = RIGHT

    let steerTarget = 0;

    if (left)
        steerTarget =
            MAX_STEER;

    if (right)
        steerTarget =
            -MAX_STEER;

    steering +=
        (
            steerTarget -
            steering
        ) * 0.15;

    // TURN

    if (
        Math.abs(speed) >
        0.02 &&
        Math.abs(steering) >
        0.001
    ) {

        const turn =
            (
                speed /
                WHEELBASE
            ) *
            Math.tan(
                steering
            );

        heading +=
            turn * 0.055;

    }

    // =================================================
    // COLLISION-SAFE MOVEMENT
    // =================================================

    const nextX =
        car.position.x +
        Math.sin(heading) *
        speed;

    const nextZ =
        car.position.z +
        Math.cos(heading) *
        speed;

    if (!isCollision(nextX, nextZ)) {

        car.position.x =
            nextX;

        car.position.z =
            nextZ;

    } else {

        // Stop the car when it hits a building
        speed = 0;

    }

    car.rotation.y =
        heading;

    // MAP LIMIT

    car.position.x =
        THREE.MathUtils.clamp(
            car.position.x,
            -850,
            850
        );

    car.position.z =
        THREE.MathUtils.clamp(
            car.position.z,
            -850,
            850
        );

}

// =====================================================
// CAMERA
// =====================================================

const cameraTarget =
    new THREE.Vector3();

const lookTarget =
    new THREE.Vector3();

function updateCamera() {

    const distance = 14;
    const height = 6;

    cameraTarget.set(
        car.position.x -
        Math.sin(heading) *
        distance,

        car.position.y +
        height,

        car.position.z -
        Math.cos(heading) *
        distance
    );

    camera.position.lerp(
        cameraTarget,
        0.08
    );

    lookTarget.set(
        car.position.x,
        car.position.y + 1,
        car.position.z
    );

    camera.lookAt(
        lookTarget
    );

}

// =====================================================
// NIGHT MODE
// =====================================================

let nightMode = false;

window.addEventListener(
    "keydown",
    event => {

        if (
            event.key.toLowerCase() ===
            "n"
        ) {

            nightMode =
                !nightMode;

            if (nightMode) {

                scene.background =
                    new THREE.Color(
                        0x050914
                    );

                scene.fog =
                    new THREE.Fog(
                        0x050914,
                        180,
                        850
                    );

                hemiLight.intensity =
                    0.35;

                sun.intensity =
                    0.25;

                windowMaterial.color.set(
                    0xffff99
                );

            } else {

                scene.background =
                    new THREE.Color(
                        0x82b7e8
                    );

                scene.fog =
                    new THREE.Fog(
                        0x82b7e8,
                        180,
                        900
                    );

                hemiLight.intensity =
                    1.5;

                sun.intensity =
                    1.4;

                windowMaterial.color.set(
                    0x9ed9ff
                );

            }

        }

    }
);

// =====================================================
// RESIZE
// =====================================================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);

// =====================================================
// GAME LOOP
// =====================================================

function animate() {

    requestAnimationFrame(
        animate
    );

    updateCar();

    updateTraffic();
updatePedestrians();
    updateCamera();

    renderer.render(
        scene,
        camera
    );

}

animate();updateTraffic();4