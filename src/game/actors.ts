import * as THREE from 'three';
import { Intruder } from '../types';

export class GuardActor {
  public mesh: THREE.Group;
  public flashlight: THREE.SpotLight;
  public flashlightBulb: THREE.Mesh;
  public leftLeg: THREE.Mesh;
  public rightLeg: THREE.Mesh;
  public leftArm: THREE.Mesh;
  public rightArm: THREE.Mesh;
  public isFlashlightOn: boolean = true;

  constructor() {
    this.mesh = new THREE.Group();

    // 1. Torso with Security Vest
    const torsoMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Deep navy security uniform
      roughness: 0.6
    });
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.4), torsoMat);
    torso.position.set(0, 1.35, 0);
    torso.castShadow = true;
    this.mesh.add(torso);

    // High-vis yellow safety stripes & security badge
    const vestStripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 0.15, 0.42),
      new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.3 })
    );
    vestStripe.position.set(0, 1.45, 0);
    this.mesh.add(vestStripe);

    // 2. Head & Cap
    const headMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.8 }); // skin tone
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), headMat);
    head.position.set(0, 2.05, 0);
    head.castShadow = true;
    this.mesh.add(head);

    // Security peaked cap
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.12, 12),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 })
    );
    cap.position.set(0, 2.2, 0);
    this.mesh.add(cap);

    const capVisor = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.04, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.2 })
    );
    capVisor.position.set(0, 2.16, -0.2); // Forward facing (-Z)
    this.mesh.add(capVisor);

    // 3. Legs & Boots
    const legGeo = new THREE.BoxGeometry(0.24, 0.9, 0.26);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });

    this.leftLeg = new THREE.Mesh(legGeo, legMat);
    this.leftLeg.position.set(-0.2, 0.45, 0);
    this.leftLeg.castShadow = true;
    this.mesh.add(this.leftLeg);

    this.rightLeg = new THREE.Mesh(legGeo, legMat);
    this.rightLeg.position.set(0.2, 0.45, 0);
    this.rightLeg.castShadow = true;
    this.mesh.add(this.rightLeg);

    // 4. Arms
    const armGeo = new THREE.BoxGeometry(0.18, 0.8, 0.2);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });

    this.leftArm = new THREE.Mesh(armGeo, armMat);
    this.leftArm.position.set(-0.48, 1.35, 0);
    this.leftArm.castShadow = true;
    this.mesh.add(this.leftArm);

    this.rightArm = new THREE.Mesh(armGeo, armMat);
    this.rightArm.position.set(0.48, 1.35, 0);
    this.rightArm.castShadow = true;
    this.mesh.add(this.rightArm);

    // 5. Handheld Tactical Flashlight
    const flashlightMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.06, 0.35, 8),
      new THREE.MeshStandardMaterial({ color: 0x020617, metalness: 0.8, roughness: 0.2 })
    );
    flashlightMesh.rotation.x = -Math.PI / 2;
    flashlightMesh.position.set(0.48, 1.0, -0.25);
    this.mesh.add(flashlightMesh);

    this.flashlightBulb = new THREE.Mesh(
      new THREE.CircleGeometry(0.06, 8),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );
    this.flashlightBulb.rotation.y = Math.PI;
    this.flashlightBulb.position.set(0.48, 1.0, -0.43);
    this.mesh.add(this.flashlightBulb);

    // Powerful flashlight spotlight projecting forward (-Z)
    this.flashlight = new THREE.SpotLight(0xfffbeb, 25, 45, Math.PI / 5, 0.3, 1.2);
    this.flashlight.position.set(0.48, 1.3, -0.45);
    this.flashlight.target.position.set(0.48, 0.8, -18);
    this.flashlight.castShadow = true;
    this.mesh.add(this.flashlight);
    this.mesh.add(this.flashlight.target);
  }

  public setFlashlight(on: boolean) {
    this.isFlashlightOn = on;
    this.flashlight.visible = on;
    this.flashlightBulb.visible = on;
  }

  public updateAnimation(isMoving: boolean, speedMultiplier: number, time: number) {
    if (isMoving) {
      const swing = Math.sin(time * 10 * speedMultiplier) * 0.55;
      this.leftLeg.rotation.x = swing;
      this.rightLeg.rotation.x = -swing;
      this.leftArm.rotation.x = -swing * 0.7;
      this.rightArm.rotation.x = swing * 0.4;
    } else {
      this.leftLeg.rotation.x = 0;
      this.rightLeg.rotation.x = 0;
      this.leftArm.rotation.x = 0;
      this.rightArm.rotation.x = 0;
    }
  }
}

export class IntruderActor {
  public mesh: THREE.Group;
  public data: Intruder;
  public cartonMesh: THREE.Mesh | null = null;
  public leftLeg: THREE.Mesh;
  public rightLeg: THREE.Mesh;

  constructor(data: Intruder) {
    this.data = data;
    this.mesh = new THREE.Group();

    // Dark hoodie / jacket
    const hoodieMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.85, 0.35), hoodieMat);
    torso.position.set(0, 1.3, 0);
    torso.castShadow = true;
    this.mesh.add(torso);

    // Hood / Head
    const hood = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 10), hoodieMat);
    hood.position.set(0, 1.95, 0);
    this.mesh.add(hood);

    // Face shadow
    const faceMask = new THREE.Mesh(
      new THREE.PlaneGeometry(0.2, 0.2),
      new THREE.MeshBasicMaterial({ color: 0x09090b })
    );
    faceMask.position.set(0, 1.95, 0.22);
    this.mesh.add(faceMask);

    // Jeans
    const jeansMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    this.leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.85, 0.24), jeansMat);
    this.leftLeg.position.set(-0.18, 0.42, 0);
    this.leftLeg.castShadow = true;
    this.mesh.add(this.leftLeg);

    this.rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.85, 0.24), jeansMat);
    this.rightLeg.position.set(0.18, 0.42, 0);
    this.rightLeg.castShadow = true;
    this.mesh.add(this.rightLeg);

    // Stolen carton box for Intruder 1
    if (data.hasStolenGoods) {
      const boxMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7 });
      this.cartonMesh = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.4, 0.5), boxMat);
      this.cartonMesh.position.set(0, 1.25, 0.42);
      this.cartonMesh.castShadow = true;
      this.mesh.add(this.cartonMesh);
    }

    this.mesh.position.set(data.x, 0, data.z);
  }

  public update(delta: number, time: number) {
    // Animate legs when moving toward target
    const dx = this.data.targetX - this.data.x;
    const dz = this.data.targetZ - this.data.z;
    const dist = Math.hypot(dx, dz);

    if (dist > 0.5 && this.data.state !== 'confronted' && this.data.state !== 'subdued') {
      const moveSpeed = this.data.state === 'fleeing' ? 5.5 : 2.2;
      const step = Math.min(dist, moveSpeed * delta);
      this.data.x += (dx / dist) * step;
      this.data.z += (dz / dist) * step;
      this.mesh.position.set(this.data.x, 0, this.data.z);

      const angle = Math.atan2(dx, dz);
      this.mesh.rotation.y = angle;

      const swing = Math.sin(time * 8) * 0.5;
      this.leftLeg.rotation.x = swing;
      this.rightLeg.rotation.x = -swing;
    } else {
      this.leftLeg.rotation.x = 0;
      this.rightLeg.rotation.x = 0;
    }
  }
}

export class PoliceCarActor {
  public mesh: THREE.Group;
  public beaconBlue1: THREE.PointLight;
  public beaconBlue2: THREE.PointLight;
  public beaconMesh1: THREE.Mesh;
  public beaconMesh2: THREE.Mesh;

  constructor() {
    this.mesh = new THREE.Group();

    // Car Body - Silver & Blue (German Police style)
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.5, roughness: 0.2 });
    const carBody = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.1, 4.8), bodyMat);
    carBody.position.set(0, 0.8, 0);
    carBody.castShadow = true;
    this.mesh.add(carBody);

    // Silver side stripes
    const silverStripe = new THREE.Mesh(
      new THREE.BoxGeometry(2.42, 0.35, 4.2),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3 })
    );
    silverStripe.position.set(0, 0.85, 0);
    this.mesh.add(silverStripe);

    // Roof & Windshield
    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.9, 2.6),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 })
    );
    cabin.position.set(0, 1.7, -0.2);
    this.mesh.add(cabin);

    // Roof Lightbar with Dual Blue Beacons
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.15, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x334155 })
    );
    bar.position.set(0, 2.2, -0.2);
    this.mesh.add(bar);

    this.beaconMesh1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.2, 0.3),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    this.beaconMesh1.position.set(-0.6, 2.35, -0.2);
    this.mesh.add(this.beaconMesh1);

    this.beaconMesh2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.2, 0.3),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    this.beaconMesh2.position.set(0.6, 2.35, -0.2);
    this.mesh.add(this.beaconMesh2);

    this.beaconBlue1 = new THREE.PointLight(0x0284c7, 10, 25);
    this.beaconBlue1.position.set(-0.6, 2.4, -0.2);
    this.mesh.add(this.beaconBlue1);

    this.beaconBlue2 = new THREE.PointLight(0x0284c7, 10, 25);
    this.beaconBlue2.position.set(0.6, 2.4, -0.2);
    this.mesh.add(this.beaconBlue2);

    // Headlights
    const hl = new THREE.SpotLight(0xffffff, 8, 30, Math.PI / 4, 0.3);
    hl.position.set(0, 0.8, 2.4);
    hl.target.position.set(0, 0, 15);
    this.mesh.add(hl);
    this.mesh.add(hl.target);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 12);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
    [-1.2, 1.2].forEach(wx => {
      [1.5, -1.5].forEach(wz => {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, 0.4, wz);
        this.mesh.add(wheel);
      });
    });

    this.mesh.visible = false;
  }

  public update(time: number) {
    if (!this.mesh.visible) return;
    // Alternating blue flashing strobes
    const flash1 = Math.sin(time * 14) > 0;
    const flash2 = Math.sin(time * 14 + Math.PI) > 0;

    this.beaconBlue1.intensity = flash1 ? 15 : 0.5;
    this.beaconBlue2.intensity = flash2 ? 15 : 0.5;
    (this.beaconMesh1.material as THREE.MeshBasicMaterial).color.setHex(flash1 ? 0x38bdf8 : 0x0369a1);
    (this.beaconMesh2.material as THREE.MeshBasicMaterial).color.setHex(flash2 ? 0x38bdf8 : 0x0369a1);
  }
}
