import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { CameraViewMode, Checkpoint, Intruder } from '../types';
import { CHECKPOINTS_DATA } from '../data/curriculum';
import { buildIndustrialPark } from './procedural-world';
import { GuardActor, IntruderActor, PoliceCarActor } from './actors';
import { sounds } from '../utils/audio';

export interface SimulationCallbacks {
  onLevelChange: (level: number) => void;
  onCheckpointScanned: (cp: Checkpoint) => void;
  onTriggerDecision: (level: number) => void;
  onAlarmStateChange: (active: boolean) => void;
  onRadioMessage: (msg: { sender: string; text: string; time: string }) => void;
}

export class SimulationEngine {
  public scene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  public camera: THREE.PerspectiveCamera;
  public cctvCameras: { [key: number]: THREE.PerspectiveCamera } = {};
  public currentCctvIndex: number = 7;
  public viewMode: CameraViewMode = 'third-person';

  public guard: GuardActor;
  public intruders: IntruderActor[] = [];
  public policeCar: PoliceCarActor;
  public checkpoints: Checkpoint[] = [];
  public colliders: THREE.Box3[] = [];

  // Movement inputs
  public keys: { [key: string]: boolean } = {
    KeyW: false,
    KeyS: false,
    KeyA: false,
    KeyD: false,
    ShiftLeft: false,
    ShiftRight: false
  };

  // Virtual touch controls for mobile/tablet
  public touchMove: { x: number; y: number } = { x: 0, y: 0 };

  private isSoftwareGl: boolean = false;
  private animationFrameId: number = 0;
  private lastTime: number = 0;
  private isRunning: boolean = false;
  private callbacks: SimulationCallbacks;

  public currentLevel: number = 1;
  public isAlarmActive: boolean = false;
  public activeDecisionLevel: number | null = null;

  // Player state
  public playerPos: THREE.Vector3 = new THREE.Vector3(0, 0, 18); // Spawn in open yard facing north
  public playerRotY: number = 0; // Facing north into the yard
  public moveSpeed: number = 4.5;
  public isSprinting: boolean = false;
  private footstepTimer: number = 0;

  constructor(container: HTMLElement, callbacks: SimulationCallbacks) {
    this.callbacks = callbacks;
    this.checkpoints = JSON.parse(JSON.stringify(CHECKPOINTS_DATA));

    // 1. Detect software WebGL as per Three.js guidelines
    this.isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Setup Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f172a); // Deep night sky
    this.scene.fog = new THREE.FogExp2(0x0f172a, 0.005); // Light atmospheric horizon fade

    // 3. Setup Cameras
    this.camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 200);
    this.camera.position.set(0, 3.8, 24.2);
    this.camera.lookAt(0, 1.2, 14);

    // Setup 4 Tactical CCTV Cameras
    this.setupCctvCameras();

    // 4. Setup Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // 5. Studio Environment Map (PMREMGenerator + RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 6. Balanced Lighting Rig - Night Industrial Park Atmosphere
    // Ambient / Hemisphere fill so geometry and actors are clearly visible
    const hemiLight = new THREE.HemisphereLight(0x60a5fa, 0x1e293b, 1.6);
    this.scene.add(hemiLight);

    // Directional moonlight key light
    const moonLight = new THREE.DirectionalLight(0xbae6fd, 2.4);
    moonLight.position.set(30, 50, -20);
    moonLight.castShadow = !this.isSoftwareGl;
    moonLight.shadow.mapSize.width = 1024;
    moonLight.shadow.mapSize.height = 1024;
    moonLight.shadow.camera.near = 5;
    moonLight.shadow.camera.far = 160;
    moonLight.shadow.camera.left = -60;
    moonLight.shadow.camera.right = 60;
    moonLight.shadow.camera.top = 60;
    moonLight.shadow.camera.bottom = -60;
    moonLight.shadow.bias = -0.0005;
    moonLight.shadow.normalBias = 0.02;
    this.scene.add(moonLight);

    // Central ambient yard light
    const yardLight = new THREE.PointLight(0x38bdf8, 4.0, 80);
    yardLight.position.set(0, 15, 0);
    this.scene.add(yardLight);

    // 7. Build World Geometry
    const world = buildIndustrialPark(this.scene);
    this.colliders = world.colliders;

    // 8. Spawn Actors
    this.guard = new GuardActor();
    this.guard.mesh.position.copy(this.playerPos);
    this.guard.mesh.rotation.y = this.playerRotY;
    this.scene.add(this.guard.mesh);

    this.policeCar = new PoliceCarActor();
    this.policeCar.mesh.position.set(0, 0, 36);
    this.scene.add(this.policeCar.mesh);

    this.spawnIntruders();

    // Bind event listeners
    this.bindInputs();
    this.startLoop();
  }

  private setupCctvCameras() {
    // Cam 1: Tor Süd / Eingang
    const c1 = new THREE.PerspectiveCamera(60, 16 / 9, 0.5, 120);
    c1.position.set(0, 7.5, 42);
    c1.lookAt(0, 1, 24);
    this.cctvCameras[1] = c1;

    // Cam 4: Lagerhalle 3 Notausgang / Ostwand
    const c4 = new THREE.PerspectiveCamera(60, 16 / 9, 0.5, 120);
    c4.position.set(28, 8.5, -4);
    c4.lookAt(20, 1.5, 4);
    this.cctvCameras[4] = c4;

    // Cam 7: Außenzaun Sektor C
    const c7 = new THREE.PerspectiveCamera(65, 16 / 9, 0.5, 120);
    c7.position.set(38, 7.5, -36);
    c7.lookAt(28, 1, -18);
    this.cctvCameras[7] = c7;

    // Cam 9: Lkw-Ladezone / Container
    const c9 = new THREE.PerspectiveCamera(60, 16 / 9, 0.5, 120);
    c9.position.set(-6, 9.0, -2);
    c9.lookAt(-4, 1.5, -16);
    this.cctvCameras[9] = c9;
  }

  private spawnIntruders() {
    // 3 Intruder actors as described in the specification
    const i1Data: Intruder = {
      id: 'int-1',
      name: 'Einbrecher 1 (Kletterer)',
      x: 28,
      z: -26,
      targetX: 28,
      targetZ: -18,
      state: 'waiting',
      hasStolenGoods: false,
      cooperativeLevel: 'timid',
      spotted: false
    };

    const i2Data: Intruder = {
      id: 'int-2',
      name: 'Einbrecher 2 (Helfer)',
      x: 32,
      z: -27,
      targetX: 30,
      targetZ: -19,
      state: 'waiting',
      hasStolenGoods: false,
      cooperativeLevel: 'cooperative',
      spotted: false
    };

    const i3Data: Intruder = {
      id: 'int-3',
      name: 'Einbrecher 3 (Späher)',
      x: 26,
      z: -32,
      targetX: 26,
      targetZ: -32,
      state: 'waiting',
      hasStolenGoods: false,
      cooperativeLevel: 'aggressive',
      spotted: false
    };

    [i1Data, i2Data, i3Data].forEach(d => {
      const actor = new IntruderActor(d);
      this.intruders.push(actor);
      this.scene.add(actor.mesh);
    });
  }

  public setLevel(lvl: number) {
    this.currentLevel = lvl;

    if (lvl === 2) {
      // Intruders penetrate fence
      this.intruders[0].data.state = 'climbing';
      this.intruders[0].data.targetX = 26;
      this.intruders[0].data.targetZ = -14;

      this.intruders[1].data.state = 'sneaking';
      this.intruders[1].data.targetX = 20;
      this.intruders[1].data.targetZ = -15;

      this.triggerAlarm(true);
      sounds.playRadioSquelch();
      this.callbacks.onRadioMessage({
        sender: 'LEITSTELLE',
        text: 'Achtung Streife 1! EMA-Sensor meldet Bewegung im Sektor C am Außenzaun! Kamera 7 prüfen!',
        time: '22:17'
      });
    } else if (lvl === 3) {
      // Intruders sneak between containers
      this.intruders[0].data.state = 'sneaking';
      this.intruders[0].data.targetX = 2;
      this.intruders[0].data.targetZ = -14;

      this.intruders[1].data.state = 'hiding';
      this.intruders[1].data.targetX = -3;
      this.intruders[1].data.targetZ = -18;

      sounds.playRadioSquelch();
      this.callbacks.onRadioMessage({
        sender: 'LEITSTELLE',
        text: 'Zwei Personen bewegen sich im Containerbereich. Halten Sie Abstand und beobachten Sie die Lage (Eigensicherung nach DGUV V23)!',
        time: '22:25'
      });
    } else if (lvl === 4) {
      // Intruder reaches Warehouse 3
      this.intruders[0].data.state = 'tampering';
      this.intruders[0].data.targetX = 18;
      this.intruders[0].data.targetZ = 6;
      this.triggerAlarm(true);
      sounds.startAlarm();

      this.callbacks.onRadioMessage({
        sender: 'LEITSTELLE',
        text: 'ALARM HOCHWERTGÜTER! EMA Lagerhalle 3 Notausgang ausgelöst! PIR-Sensor bestätigt Eindringen!',
        time: '22:31'
      });
    } else if (lvl === 5) {
      // Intruder exits warehouse with stolen carton
      this.intruders[0].data.hasStolenGoods = true;
      this.intruders[0].data.state = 'confronted';
      this.intruders[0].data.targetX = 14;
      this.intruders[0].data.targetZ = 12;

      // Add carton to mesh if not already added
      if (!this.intruders[0].cartonMesh) {
        const boxMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7 });
        const box = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.4, 0.5), boxMat);
        box.position.set(0, 1.25, 0.42);
        box.castShadow = true;
        this.intruders[0].mesh.add(box);
        this.intruders[0].cartonMesh = box;
      }

      sounds.stopAlarm();
      sounds.playRadioSquelch();
      this.callbacks.onRadioMessage({
        sender: 'LEITSTELLE',
        text: 'Täter tritt mit Diebesgut aus Lagerhalle 3! Sprechen Sie ihn an – Eigensicherung beachten, Fluchtwege sperren!',
        time: '22:38'
      });
    } else if (lvl === 6) {
      // Police arrival
      this.policeCar.mesh.visible = true;
      sounds.playPoliceArrival();
      sounds.playRadioSquelch();
      this.callbacks.onRadioMessage({
        sender: 'POLIZEI 110',
        text: 'Funkstreife Peter 44 am Werkstor Süd eingetroffen. Weisen Sie uns ein und übergeben Sie den Sachverhalt!',
        time: '22:46'
      });
    }
  }

  public triggerAlarm(active: boolean) {
    this.isAlarmActive = active;
    this.callbacks.onAlarmStateChange(active);
    if (active) {
      sounds.startAlarm();
    } else {
      sounds.stopAlarm();
    }
  }

  public toggleFlashlight(): boolean {
    const next = !this.guard.isFlashlightOn;
    this.guard.setFlashlight(next);
    sounds.playFlashlightClick();
    return next;
  }

  public toggleViewMode(): CameraViewMode {
    if (this.viewMode === 'third-person') {
      this.viewMode = 'first-person';
    } else if (this.viewMode === 'first-person') {
      this.viewMode = 'cctv';
    } else {
      this.viewMode = 'third-person';
    }
    return this.viewMode;
  }

  public setViewMode(mode: CameraViewMode) {
    this.viewMode = mode;
  }

  public setCctvCamera(camNum: number) {
    if (this.cctvCameras[camNum]) {
      this.currentCctvIndex = camNum;
      this.viewMode = 'cctv';
    }
  }

  public scanCurrentCheckpoint(): Checkpoint | null {
    // Check if player is near any unscanned checkpoint (< 2.8m)
    for (const cp of this.checkpoints) {
      const dist = Math.hypot(this.playerPos.x - cp.x, this.playerPos.z - cp.z);
      if (dist < 3.2 && !cp.scanned) {
        cp.scanned = true;
        sounds.playCheckpointBeep();
        this.callbacks.onCheckpointScanned(cp);

        // Turn terminal LED to green
        const obj = this.scene.getObjectByName(`checkpoint_${cp.id}`);
        if (obj) {
          obj.traverse(child => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
              child.material.color.setHex(0x10b981); // Emerald green
            }
          });
        }
        return cp;
      }
    }
    return null;
  }

  public interact(): { type: 'checkpoint' | 'door' | 'intruder' | 'none'; label: string } {
    // 1. Checkpoint interaction
    const cp = this.scanCurrentCheckpoint();
    if (cp) {
      return { type: 'checkpoint', label: `Wächterkontrollpunkt ${cp.name} erfasst.` };
    }

    // 2. Intruder interaction / confrontation
    for (const intr of this.intruders) {
      const dist = Math.hypot(this.playerPos.x - intr.data.x, this.playerPos.z - intr.data.z);
      if (dist < 4.5) {
        this.callbacks.onTriggerDecision(this.currentLevel);
        return { type: 'intruder', label: `Konfrontation mit ${intr.data.name}` };
      }
    }

    // 3. Guardhouse door or general interaction
    const distToGuardhouse = Math.hypot(this.playerPos.x - (-14), this.playerPos.z - 36);
    if (distToGuardhouse < 6.0) {
      return { type: 'door', label: 'Wachgebäude / Leitstelle Kontrollraum' };
    }

    return { type: 'none', label: 'Kein interaktives Objekt in Reichweite.' };
  }

  private bindInputs() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (['KeyW', 'KeyS', 'KeyA', 'KeyD', 'ShiftLeft', 'ShiftRight'].includes(e.code)) {
      this.keys[e.code] = true;
    }

    if (e.code === 'KeyT') {
      this.toggleFlashlight();
    } else if (e.code === 'KeyV') {
      this.toggleViewMode();
    } else if (e.code === 'KeyE') {
      this.interact();
    } else if (e.code === 'KeyF') {
      // Speak / address person
      this.interact();
    } else if (e.code === 'KeyR') {
      // Funkgerät / Radio check
      sounds.playRadioSquelch();
      this.callbacks.onRadioMessage({
        sender: 'STREIFE 1',
        text: 'Streife 1 an Zentrale: Standort und Technik funktionsbereit. Keine besonderen Vorkommnisse.',
        time: '22:00'
      });
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (this.keys[e.code] !== undefined) {
      this.keys[e.code] = false;
    }
  };

  public handleResize(width: number, height: number) {
    if (!this.renderer || !this.camera) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    Object.values(this.cctvCameras).forEach(cam => {
      cam.aspect = width / height;
      cam.updateProjectionMatrix();
    });

    this.renderer.setSize(width, height);
  }

  private startLoop() {
    this.isRunning = true;
    this.lastTime = performance.now();

    const tick = (currentTime: number) => {
      if (!this.isRunning) return;

      const delta = Math.min((currentTime - this.lastTime) / 1000, 0.1);
      this.lastTime = currentTime;

      this.update(delta, currentTime / 1000);
      this.render();

      if (this.isSoftwareGl) {
        this.afterDraw(() => {
          this.animationFrameId = requestAnimationFrame(tick);
        });
      } else {
        this.animationFrameId = requestAnimationFrame(tick);
      }
    };

    this.animationFrameId = requestAnimationFrame(tick);
  }

  private afterDraw(cb: () => void) {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        setTimeout(cb, 60);
      }
    };
    setTimeout(poll, 5);
  }

  private update(delta: number, time: number) {
    // 1. Process movement inputs
    let moveForward = 0;
    let moveTurn = 0;

    if (this.keys.KeyW) moveForward += 1;
    if (this.keys.KeyS) moveForward -= 1;
    if (this.keys.KeyA) moveTurn += 1;
    if (this.keys.KeyD) moveTurn -= 1;

    // Apply touch joystick input
    if (Math.abs(this.touchMove.y) > 0.1) moveForward += -this.touchMove.y;
    if (Math.abs(this.touchMove.x) > 0.1) moveTurn += -this.touchMove.x;

    this.isSprinting = !!(this.keys.ShiftLeft || this.keys.ShiftRight);
    const speed = (this.isSprinting ? this.moveSpeed * 1.6 : this.moveSpeed) * delta;

    // Turn player
    this.playerRotY += moveTurn * 2.2 * delta;

    // Move forward/back (forward is -Z when playerRotY = 0)
    const forwardVec = new THREE.Vector3(
      Math.sin(this.playerRotY),
      0,
      -Math.cos(this.playerRotY)
    );

    const nextPos = this.playerPos.clone().addScaledVector(forwardVec, moveForward * speed);

    // Collision check against world colliders
    const playerRadius = 0.6;
    let canMove = true;
    for (const box of this.colliders) {
      if (
        nextPos.x >= box.min.x - playerRadius &&
        nextPos.x <= box.max.x + playerRadius &&
        nextPos.z >= box.min.z - playerRadius &&
        nextPos.z <= box.max.z + playerRadius
      ) {
        canMove = false;
        break;
      }
    }

    // World boundary limits (-48 to 48)
    if (Math.abs(nextPos.x) > 48 || Math.abs(nextPos.z) > 48) {
      canMove = false;
    }

    const isMoving = canMove && Math.abs(moveForward) > 0.1;
    if (isMoving) {
      this.playerPos.copy(nextPos);
      this.footstepTimer += delta;
      if (this.footstepTimer > (this.isSprinting ? 0.28 : 0.42)) {
        sounds.playFootstep();
        this.footstepTimer = 0;
      }
    }

    // Update Guard mesh position & rotation
    this.guard.mesh.position.copy(this.playerPos);
    this.guard.mesh.rotation.y = this.playerRotY;
    this.guard.updateAnimation(isMoving, this.isSprinting ? 1.5 : 1.0, time);

    // 2. Camera Positioning
    if (this.viewMode === 'third-person') {
      const camDist = 6.0;
      const camHeight = 3.6;
      const camTargetPos = this.playerPos.clone().add(
        new THREE.Vector3(
          -Math.sin(this.playerRotY) * camDist,
          camHeight,
          Math.cos(this.playerRotY) * camDist
        )
      );
      this.camera.position.lerp(camTargetPos, 0.16);
      this.camera.lookAt(
        this.playerPos.x + Math.sin(this.playerRotY) * 3.0,
        this.playerPos.y + 1.2,
        this.playerPos.z - Math.cos(this.playerRotY) * 3.0
      );
    } else if (this.viewMode === 'first-person') {
      this.camera.position.set(this.playerPos.x, this.playerPos.y + 1.9, this.playerPos.z);
      const lookTarget = this.playerPos.clone().add(
        new THREE.Vector3(
          Math.sin(this.playerRotY) * 10,
          1.8,
          -Math.cos(this.playerRotY) * 10
        )
      );
      this.camera.lookAt(lookTarget);
    }

    // 3. Update Intruders AI
    this.intruders.forEach(intruder => {
      intruder.update(delta, time);

      // Check distance to player for auto-triggering level decisions
      const distToPlayer = Math.hypot(this.playerPos.x - intruder.data.x, this.playerPos.z - intruder.data.z);
      if (distToPlayer < 7.0 && !intruder.data.spotted) {
        intruder.data.spotted = true;
        if (this.currentLevel === 5) {
          this.callbacks.onTriggerDecision(5);
        }
      }
    });

    // 4. Update Police car lights
    this.policeCar.update(time);

    // 5. Checkpoint auto-detection hint
    this.checkpoints.forEach(cp => {
      const dist = Math.hypot(this.playerPos.x - cp.x, this.playerPos.z - cp.z);
      if (dist < 3.0 && !cp.scanned) {
        // Pulse LED slightly
        const obj = this.scene.getObjectByName(`checkpoint_${cp.id}`);
        if (obj) {
          obj.rotation.y = time * 2;
        }
      }
    });
  }

  private render() {
    const activeCamera = this.viewMode === 'cctv'
      ? (this.cctvCameras[this.currentCctvIndex] || this.camera)
      : this.camera;

    this.renderer.render(this.scene, activeCamera);
  }

  public dispose() {
    this.isRunning = false;
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    if (this.renderer.domElement && this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
