// document.addEventListener('DOMContentLoaded', () => {
//   const rand = (min, max) => Math.random() * (max - min) + min;

//   // Elements
//   const sparkleCanvas = document.getElementById('sparkles');
//   const balloonLayer = document.getElementById('balloonLayer');
//   const toggleBalloonsBtn = document.getElementById('toggleBalloons');
//   const arrowDown = document.querySelector('.scroll-down');
//   const arrowUp = document.querySelector('.scroll-up');
//   const present3D = document.getElementById('present3D');

//   // Basic element checks
//   if (!sparkleCanvas) { console.error('Missing #sparkles canvas'); return; }
//   if (!balloonLayer) { console.error('Missing #balloonLayer'); return; }
//   if (!toggleBalloonsBtn) { console.error('Missing #toggleBalloons button'); return; }
//   if (!arrowDown || !arrowUp) { console.error('Missing scroll arrows (.scroll-down or .scroll-up)'); return; }
//   if (!present3D) { console.error('Missing #present3D container'); return; }

//   // ==============================
//   // Sparkles
//   // ==============================
//   const sCtx = sparkleCanvas.getContext('2d');
//   let sparkles = [];

//   function setupCanvas() {
//     const ratio = Math.min(window.devicePixelRatio || 1, 2);
//     sparkleCanvas.width = Math.floor(window.innerWidth * ratio);
//     sparkleCanvas.height = Math.floor(window.innerHeight * ratio);
//     sparkleCanvas.style.width = window.innerWidth + 'px';
//     sparkleCanvas.style.height = window.innerHeight + 'px';
//     sCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
//   }

//   function initSparkles(count = 120) {
//     sparkles = Array.from({ length: count }, () => ({
//       x: rand(0, window.innerWidth),
//       y: rand(0, window.innerHeight),
//       r: rand(0.6, 1.8),
//       a: rand(0.25, 0.95),
//       t: rand(0, Math.PI * 2)
//     }));
//   }

//   function drawSparkles() {
//     sCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
//     for (const p of sparkles) {
//       p.t += 0.02;
//       const pulse = (Math.sin(p.t * 2) + 1) / 2;
//       const alpha = p.a * (0.5 + pulse * 0.5);
//       sCtx.globalAlpha = alpha;

//       const grad = sCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
//       grad.addColorStop(0, 'rgba(255,255,255,0.95)');
//       grad.addColorStop(1, 'rgba(255,255,255,0)');
//       sCtx.fillStyle = grad;

//       sCtx.beginPath();
//       sCtx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
//       sCtx.fill();
//     }
//     sCtx.globalAlpha = 1;
//     requestAnimationFrame(drawSparkles);
//   }

//   setupCanvas();
//   initSparkles();
//   drawSparkles();
//   window.addEventListener('resize', () => {
//     setupCanvas();
//     initSparkles();
//   });

//   // ==============================
//   // Balloons
//   // ==============================
//   let balloonsOn = true;
//   let balloonTimer = null;

//   function spawnBalloon() {
//     if (!balloonsOn) return;
//     const b = document.createElement('div');
//     b.className = 'balloon';

//     const hue = Math.floor(rand(0, 360));
//     const color = `hsl(${hue} 85% 60%)`;
//     b.style.setProperty('--c', color);
//     b.style.setProperty('--t', `${rand(12, 22)}s`);
//     b.style.left = `${rand(5, 95)}vw`;
//     b.style.setProperty('--h', `${rand(16, 30)}vmin`);

//     const s = document.createElement('div');
//     s.className = 'string';
//     b.appendChild(s);

//     balloonLayer.appendChild(b);
//     setTimeout(() => b.remove(), 24000);
//   }

//   function startBalloons() {
//     if (!balloonTimer) balloonTimer = setInterval(spawnBalloon, 600);
//   }
//   function stopBalloons() {
//     if (balloonTimer) {
//       clearInterval(balloonTimer);
//       balloonTimer = null;
//     }
//   }

//   toggleBalloonsBtn.addEventListener('click', () => {
//     balloonsOn = !balloonsOn;
//     toggleBalloonsBtn.textContent = balloonsOn ? 'Hide Balloons' : 'Show Balloons';
//     if (balloonsOn) startBalloons();
//     else stopBalloons();
//   });

//   startBalloons();
//   for (let i = 0; i < 8; i++) setTimeout(spawnBalloon, i * 250);

//   // ==============================
//   // Scroll Arrows
//   // ==============================
//   arrowDown.addEventListener('click', () => {
//     window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
//     setTimeout(() => {
//       // show the 3D section then initialize Three.js once
//       present3D.style.display = 'block';
//       if (!present3D.dataset.init) {
//         initThree();
//         present3D.dataset.init = 'true';
//       } else {
//         // if already initialized, ensure renderer size is correct
//         const evt = new Event('resize');
//         window.dispatchEvent(evt);
//       }
//     }, 800);
//   });

//   arrowUp.addEventListener('click', () => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   });

//   window.addEventListener('scroll', () => {
//     arrowUp.style.display = window.scrollY > window.innerHeight / 2 ? 'block' : 'none';
//   });

//   // ==============================
//   // 3D Present (Three.js)
//   // ==============================
//   function initThree() {
//     // Scene + Camera
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x0b1220);

//     const camera = new THREE.PerspectiveCamera(
//       45,
//       present3D.clientWidth / present3D.clientHeight,
//       0.1,
//       1000
//     );
//     camera.position.set(5, 5, 7);
//     camera.lookAt(0, 0, 0);

//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(present3D.clientWidth, present3D.clientHeight);
//     renderer.shadowMap.enabled = true;
//     present3D.innerHTML = ""; // clear previous
//     present3D.appendChild(renderer.domElement);

//     // Orbit controls
//     const controls = new THREE.OrbitControls(camera, renderer.domElement);

//     // Lights
//     const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
//     dirLight.position.set(5, 10, 5);
//     dirLight.castShadow = true;
//     scene.add(dirLight);
//     scene.add(new THREE.AmbientLight(0x404040, 1.5));

//     // Ground plane to catch shadows
//     const groundGeo = new THREE.PlaneGeometry(20, 20);
//     const groundMat = new THREE.ShadowMaterial({ opacity: 0.3 });
//     const ground = new THREE.Mesh(groundGeo, groundMat);
//     ground.rotation.x = -Math.PI / 2;
//     ground.position.y = -1.1;
//     ground.receiveShadow = true;
//     scene.add(ground);

//     // Materials
//     const boxMaterial = new THREE.MeshPhysicalMaterial({
//       color: 0xff0000,
//       metalness: 0.4,
//       roughness: 0.3,
//       clearcoat: 0.6,
//       clearcoatRoughness: 0.1
//     });

//     const ribbonMaterial = new THREE.MeshStandardMaterial({
//       color: 0xffff00,
//       metalness: 0.5,
//       roughness: 0.3
//     });

//     // Box (main cube)
//     const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
//     const box = new THREE.Mesh(boxGeometry, boxMaterial);
//     box.castShadow = true;
//     box.receiveShadow = true;
//     scene.add(box);

//     // Lid (slightly bigger so it overlaps edges)
//     const lidGeometry = new THREE.BoxGeometry(2.1, 0.4, 2.1);
//     const lid = new THREE.Mesh(lidGeometry, boxMaterial);
//     lid.position.y = 1.2;
//     lid.castShadow = true;
//     lid.receiveShadow = true;
//     scene.add(lid);

//     // Ribbons (cylinders crossing the box)
//     const ribbonGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.2, 32);

//     const ribbon1 = new THREE.Mesh(ribbonGeo, ribbonMaterial);
//     ribbon1.rotation.z = Math.PI / 2;
//     ribbon1.castShadow = true;
//     scene.add(ribbon1);

//     const ribbon2 = new THREE.Mesh(ribbonGeo, ribbonMaterial);
//     ribbon2.rotation.x = Math.PI / 2;
//     ribbon2.castShadow = true;
//     scene.add(ribbon2);

//     // Click to toggle lid opening
//     let lidOpen = false;
//     present3D.addEventListener('click', () => {
//       lidOpen = !lidOpen;
//     });

//     // Make resize responsive for renderer & camera
//     window.addEventListener('resize', () => {
//       const w = present3D.clientWidth || window.innerWidth;
//       const h = present3D.clientHeight || window.innerHeight;
//       renderer.setSize(w, h);
//       camera.aspect = w / h;
//       camera.updateProjectionMatrix();
//     });

//     // Animation loop (lid can open when clicked)
//     function animate() {
//       requestAnimationFrame(animate);

//       // simple lid animation: rotate X to "open"
//       if (lidOpen) {
//         lid.rotation.x = Math.min(lid.rotation.x + 0.03, Math.PI / 2);
//       } else {
//         lid.rotation.x = Math.max(lid.rotation.x - 0.03, 0);
//       }

//       // small idle rotation for charm
//       box.rotation.y += 0.002;
//       ribbon1.rotation.y += 0.002;
//       ribbon2.rotation.y += 0.002;

//       controls.update();
//       renderer.render(scene, camera);
//     }
//     animate();
//   }
// });