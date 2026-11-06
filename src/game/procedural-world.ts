import * as THREE from 'three';

// Reusable procedural textures using HTML5 canvas
export function createAsphaltTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  
  // Base asphalt
  ctx.fillStyle = '#262f3d';
  ctx.fillRect(0, 0, 512, 512);

  // Grain & fine aggregate
  for (let i = 0; i < 30000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const b = Math.random() * 45 + 30;
    ctx.fillStyle = `rgb(${b},${b + 5},${b + 12})`;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Yellow road center divider line
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 8;
  ctx.setLineDash([28, 20]);
  ctx.beginPath();
  ctx.moveTo(256, 0);
  ctx.lineTo(256, 512);
  ctx.stroke();

  // White lane border lines
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 6;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(60, 0);
  ctx.lineTo(60, 512);
  ctx.moveTo(452, 0);
  ctx.lineTo(452, 512);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createContainerTexture(color: string, label: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 512, 256);

  // Vertical corrugations
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  for (let x = 0; x < 512; x += 16) {
    ctx.fillRect(x, 0, 8, 256);
  }

  // Text stencil
  ctx.fillStyle = '#f0f0f0';
  ctx.font = 'bold 24px monospace';
  ctx.fillText(label, 30, 60);
  ctx.font = '14px monospace';
  ctx.fillText('ISO 668 • SEC-34A-LOG', 30, 90);
  ctx.fillText('MAX GROSS: 30,480 KG', 30, 115);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createWarehouseWallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#2d3748';
  ctx.fillRect(0, 0, 512, 512);

  // Metal panel horizontal seams
  ctx.fillStyle = '#1a202c';
  for (let y = 0; y < 512; y += 32) {
    ctx.fillRect(0, y, 512, 3);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export interface WorldProps {
  scene: THREE.Scene;
  colliders: THREE.Box3[];
}

export function buildIndustrialPark(scene: THREE.Scene): { colliders: THREE.Box3[] } {
  const colliders: THREE.Box3[] = [];

  const addCollider = (mesh: THREE.Object3D) => {
    mesh.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(mesh);
    colliders.push(box);
  };

  // 1. Ground Plane
  const groundGeo = new THREE.PlaneGeometry(160, 160);
  const groundMat = new THREE.MeshStandardMaterial({
    map: createAsphaltTexture(),
    roughness: 0.85,
    metalness: 0.1
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // 2. Perimeter Fences (4 sides)
  const fenceMat = new THREE.MeshStandardMaterial({
    color: 0x4a5568,
    metalness: 0.6,
    roughness: 0.4,
    wireframe: false
  });
  const fencePostMat = new THREE.MeshStandardMaterial({ color: 0x2d3748, metalness: 0.8, roughness: 0.3 });

  const buildFenceSegment = (x1: number, z1: number, x2: number, z2: number, isDamaged: boolean = false) => {
    const group = new THREE.Group();
    const length = Math.hypot(x2 - x1, z2 - z1);
    const angle = Math.atan2(x2 - x1, z2 - z1);

    // Fence wire panels
    const postCount = Math.floor(length / 4);
    for (let i = 0; i <= postCount; i++) {
      const px = (i / postCount) * length;
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.2, 8), fencePostMat);
      post.position.set(0, 1.6, px);
      post.castShadow = true;
      group.add(post);
    }

    // Horizontal rails
    const railTop = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, length, 6), fencePostMat);
    railTop.rotation.x = Math.PI / 2;
    railTop.position.set(0, 3.0, length / 2);
    group.add(railTop);

    const railBot = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, length, 6), fencePostMat);
    railBot.rotation.x = Math.PI / 2;
    railBot.position.set(0, 0.2, length / 2);
    group.add(railBot);

    // Mesh panel
    if (!isDamaged) {
      const meshPanel = new THREE.Mesh(new THREE.PlaneGeometry(0.02, 2.8), fenceMat);
      meshPanel.scale.set(1, 1, length);
      meshPanel.rotation.y = Math.PI / 2;
      meshPanel.position.set(0, 1.5, length / 2);
      group.add(meshPanel);
    } else {
      // Sektor C damaged hole: 2 partial pieces with a clear 3m hole
      const halfLen = length * 0.35;
      const p1 = new THREE.Mesh(new THREE.PlaneGeometry(0.02, 2.8), fenceMat);
      p1.scale.set(1, 1, halfLen);
      p1.rotation.y = Math.PI / 2;
      p1.position.set(0, 1.5, halfLen / 2);
      group.add(p1);

      const p2 = new THREE.Mesh(new THREE.PlaneGeometry(0.02, 2.8), fenceMat);
      p2.scale.set(1, 1, halfLen);
      p2.rotation.y = Math.PI / 2;
      p2.position.set(0, 1.5, length - halfLen / 2);
      group.add(p2);

      // Warning sign on fence
      const sign = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.6, 0.9),
        new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 })
      );
      sign.position.set(0.1, 2.0, halfLen - 0.5);
      group.add(sign);
    }

    group.position.set(x1, 0, z1);
    group.rotation.y = angle;
    scene.add(group);

    // Add collision box
    const colBox = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.5, length), new THREE.MeshBasicMaterial({ visible: false }));
    colBox.position.set(x1 + (x2 - x1) / 2, 1.75, z1 + (z2 - z1) / 2);
    colBox.rotation.y = angle;
    if (!isDamaged) {
      addCollider(colBox);
    }
  };

  // Build 4 boundary fence walls
  buildFenceSegment(-50, -50, 50, -50); // North
  buildFenceSegment(50, -50, 50, 50);   // East
  buildFenceSegment(-50, 50, -6, 50);   // South Left
  buildFenceSegment(6, 50, 50, 50);     // South Right (entrance gap)
  buildFenceSegment(-50, 50, -50, -50); // West

  // Inner Fence at Sektor C with Damaged Hole
  buildFenceSegment(15, -28, 45, -28, true);

  // 3. Guardhouse / Leitstelle (Wachgebäude) at entrance (x: -12, z: 32)
  const guardhouse = new THREE.Group();
  const ghBody = new THREE.Mesh(
    new THREE.BoxGeometry(10, 4.5, 8),
    new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 })
  );
  ghBody.position.set(0, 2.25, 0);
  ghBody.castShadow = true;
  ghBody.receiveShadow = true;
  guardhouse.add(ghBody);

  // Roof overhang
  const ghRoof = new THREE.Mesh(
    new THREE.BoxGeometry(11, 0.4, 9),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.3 })
  );
  ghRoof.position.set(0, 4.6, 0);
  ghRoof.castShadow = true;
  guardhouse.add(ghRoof);

  // Panoramic windows facing entrance
  const ghWindow = new THREE.Mesh(
    new THREE.BoxGeometry(7, 1.8, 0.2),
    new THREE.MeshPhysicalMaterial({ color: 0x60a5fa, transmission: 0.6, opacity: 0.8, roughness: 0.1, transparent: true })
  );
  ghWindow.position.set(0, 2.4, 4.05);
  guardhouse.add(ghWindow);

  // Illuminated CCTV desk inside guardhouse
  const cctvDesk = new THREE.Mesh(
    new THREE.BoxGeometry(4, 1.1, 1.5),
    new THREE.MeshStandardMaterial({ color: 0x1e293b })
  );
  cctvDesk.position.set(0, 0.55, 2.6);
  guardhouse.add(cctvDesk);

  // 4 glowing CCTV terminal monitors
  for (let i = 0; i < 4; i++) {
    const mon = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.6, 0.1),
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        emissive: 0x22d3ee,
        emissiveIntensity: 0.8
      })
    );
    mon.position.set(-1.2 + i * 0.8, 1.4, 2.4);
    guardhouse.add(mon);
  }

  // Guardhouse entrance door
  const ghDoor = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 2.6, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.5 })
  );
  ghDoor.position.set(3.5, 1.3, 4.05);
  guardhouse.add(ghDoor);

  guardhouse.position.set(-14, 0, 36);
  scene.add(guardhouse);
  addCollider(ghBody);

  // Entrance Barrier / Schranke at (0, 0, 48)
  const barrierPoleL = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.3, 0.6), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
  barrierPoleL.position.set(-3, 0.65, 46);
  scene.add(barrierPoleL);

  const barrierArm = new THREE.Mesh(
    new THREE.BoxGeometry(6, 0.15, 0.15),
    new THREE.MeshStandardMaterial({ color: 0xef4444 })
  );
  barrierArm.position.set(0, 1.0, 46);
  scene.add(barrierArm);

  // 4. Lagerhallen (Warehouses)
  const warehouseMat = new THREE.MeshStandardMaterial({
    map: createWarehouseWallTexture(),
    roughness: 0.65,
    metalness: 0.25
  });

  const buildWarehouse = (x: number, z: number, w: number, d: number, h: number, name: string, isLager3: boolean = false) => {
    const wh = new THREE.Group();

    // Main hall structure
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), warehouseMat);
    body.position.set(0, h / 2, 0);
    body.castShadow = true;
    body.receiveShadow = true;
    wh.add(body);

    // Pitched roof
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(w + 1.5, 0.6, d + 1.5),
      new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.8 })
    );
    roof.position.set(0, h + 0.3, 0);
    wh.add(roof);

    // Roll gates
    for (let r = 0; r < 2; r++) {
      const gate = new THREE.Mesh(
        new THREE.BoxGeometry(5.0, 4.2, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.6, roughness: 0.3 })
      );
      gate.position.set(-w / 4 + r * (w / 2), 2.1, d / 2 + 0.05);
      wh.add(gate);
    }

    // Name banner on front
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 128);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 6;
    ctx.strokeRect(4, 4, 504, 120);
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name, 256, 75);

    const signTex = new THREE.CanvasTexture(canvas);
    signTex.colorSpace = THREE.SRGBColorSpace;
    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 1.5),
      new THREE.MeshBasicMaterial({ map: signTex })
    );
    sign.position.set(0, h - 1.2, d / 2 + 0.1);
    wh.add(sign);

    // Specific features for Lagerhalle 3 (Target of burglary)
    if (isLager3) {
      // Side emergency exit door with EMA magnetic contact
      const emergencyDoor = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 2.6, 1.4),
        new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.4 }) // Green emergency exit
      );
      emergencyDoor.position.set(w / 2 + 0.08, 1.3, -4);
      wh.add(emergencyDoor);

      // Flashing EMA alarm beacon on wall above door
      const alarmBeacon = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.2, 0.4, 8),
        new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.9 })
      );
      alarmBeacon.position.set(w / 2 + 0.2, 3.2, -4);
      alarmBeacon.name = 'lager3_alarm_beacon';
      wh.add(alarmBeacon);
    }

    wh.position.set(x, 0, z);
    scene.add(wh);
    addCollider(body);
  };

  // Lagerhalle 1 & 2 on the west side
  buildWarehouse(-28, -20, 24, 28, 8, 'LAGERHALLE 1 - LOGISTIK');
  buildWarehouse(-28, 12, 22, 18, 7, 'LAGERHALLE 2 - ELEKTRONIK');

  // Lagerhalle 3 on the east side (Main objective)
  buildWarehouse(22, 4, 26, 26, 8, 'LAGERHALLE 3 - HOCHWERTGÜTER', true);

  // 5. Cargo Shipping Containers Stacked
  const containerBlueTex = createContainerTexture('#1e40af', 'HAPAG-LLOYD');
  const containerRustTex = createContainerTexture('#c2410c', 'MAERSK LINE');
  const containerGreenTex = createContainerTexture('#15803d', 'EVERGREEN');

  const containerGeo = new THREE.BoxGeometry(6.0, 2.6, 2.4);

  const placeContainer = (x: number, y: number, z: number, rotY: number, mat: THREE.Material) => {
    const cont = new THREE.Mesh(containerGeo, mat);
    cont.position.set(x, y + 1.3, z);
    cont.rotation.y = rotY;
    cont.castShadow = true;
    cont.receiveShadow = true;
    scene.add(cont);
    addCollider(cont);
  };

  const matBlue = new THREE.MeshStandardMaterial({ map: containerBlueTex, roughness: 0.6 });
  const matRust = new THREE.MeshStandardMaterial({ map: containerRustTex, roughness: 0.6 });
  const matGreen = new THREE.MeshStandardMaterial({ map: containerGreenTex, roughness: 0.6 });

  // Container rows providing stealth alleys
  placeContainer(-4, 0, -12, 0, matBlue);
  placeContainer(-4, 2.6, -12, 0, matRust);
  placeContainer(3, 0, -12, 0, matGreen);
  
  placeContainer(-4, 0, -16, 0, matRust);
  placeContainer(3, 0, -16, 0, matBlue);
  placeContainer(3, 2.6, -16, 0, matGreen);

  placeContainer(-4, 0, -20, 0, matGreen);
  placeContainer(3, 0, -20, 0, matRust);

  // 6. Trucks and Semi-Trailers
  const buildTruck = (x: number, z: number, angle: number) => {
    const truck = new THREE.Group();

    // Tractor Cab
    const cab = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 3.4, 3.2),
      new THREE.MeshStandardMaterial({ color: 0xb91c1c, metalness: 0.4, roughness: 0.4 })
    );
    cab.position.set(0, 1.7, 5.0);
    cab.castShadow = true;
    truck.add(cab);

    // Windshield
    const glass = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 1.2, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x93c5fd, roughness: 0.1 })
    );
    glass.position.set(0, 2.4, 6.62);
    truck.add(glass);

    // Headlights
    [-1, 1].forEach(side => {
      const lightMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.3, 0.1),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      lightMesh.position.set(side * 1.0, 0.8, 6.62);
      truck.add(lightMesh);
    });

    // Trailer Box
    const trailer = new THREE.Mesh(
      new THREE.BoxGeometry(2.9, 3.6, 9.0),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 })
    );
    trailer.position.set(0, 2.2, -1.0);
    trailer.castShadow = true;
    truck.add(trailer);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 12);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
    [-1.4, 1.4].forEach(wx => {
      [5.0, 3.5, -2.5, -4.5].forEach(wz => {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, 0.5, wz);
        truck.add(wheel);
      });
    });

    truck.position.set(x, 0, z);
    truck.rotation.y = angle;
    scene.add(truck);
    addCollider(trailer);
  };

  buildTruck(-10, 4, Math.PI / 2);
  buildTruck(-10, -2, Math.PI / 2);
  buildTruck(20, -20, 0);

  // 7. Light Poles with downlights
  const buildLightPole = (x: number, z: number) => {
    const pole = new THREE.Group();

    const mast = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.16, 7.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.2 })
    );
    mast.position.set(0, 3.75, 0);
    pole.add(mast);

    const head = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.25, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x1e293b })
    );
    head.position.set(0, 7.5, 0.6);
    pole.add(head);

    // Glowing emitter bulb
    const bulb = new THREE.Mesh(
      new THREE.PlaneGeometry(0.6, 1.0),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );
    bulb.rotation.x = Math.PI / 2;
    bulb.position.set(0, 7.37, 0.6);
    pole.add(bulb);

    // Warm radial point light illuminating ground and structures
    const ptLight = new THREE.PointLight(0xfef08a, 5.0, 22);
    ptLight.position.set(0, 7.0, 0.6);
    pole.add(ptLight);

    // Spotlight projecting down onto asphalt
    const spot = new THREE.SpotLight(0xfffbeb, 15, 30, Math.PI / 3, 0.4, 1.2);
    spot.position.set(0, 7.4, 0.6);
    spot.target.position.set(0, 0, 0.6);
    pole.add(spot);
    pole.add(spot.target);

    pole.position.set(x, 0, z);
    scene.add(pole);
  };

  buildLightPole(6, 18);
  buildLightPole(-6, 18);
  buildLightPole(16, 2);
  buildLightPole(-16, 2);
  buildLightPole(0, -6);
  buildLightPole(26, -10);
  buildLightPole(-18, -14);

  // 8. RFID Checkpoint terminals (KP 1 to KP 5)
  const checkpointPositions = [
    { id: 'kp-1', x: 0, z: 22, name: 'KP 01 - Werkstor Süd' },
    { id: 'kp-2', x: 28, z: -18, name: 'KP 02 - Sektor C Zaun' },
    { id: 'kp-3', x: -18, z: -8, name: 'KP 03 - Container-Depot' },
    { id: 'kp-4', x: 18, z: 6, name: 'KP 04 - Lager 3 Notausgang' },
    { id: 'kp-5', x: -26, z: 16, name: 'KP 05 - Transformator' }
  ];

  checkpointPositions.forEach(cp => {
    const box = new THREE.Group();
    // Yellow terminal pedestal
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8),
      new THREE.MeshStandardMaterial({ color: 0x334155 })
    );
    post.position.set(0, 0.6, 0);
    box.add(post);

    const head = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.4, 0.25),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 })
    );
    head.position.set(0, 1.3, 0);
    box.add(head);

    // Glowing LED target sensor
    const led = new THREE.Mesh(
      new THREE.CircleGeometry(0.08, 16),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    led.position.set(0, 1.3, 0.13);
    box.add(led);

    box.position.set(cp.x, 0, cp.z);
    box.name = `checkpoint_${cp.id}`;
    scene.add(box);
  });

  return { colliders };
}
