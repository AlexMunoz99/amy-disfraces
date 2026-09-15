/**
 * AMY Disfraces - Logotipo 3D Interactivo y Rotatorio
 * Desarrollado con Three.js
 * Características:
 * - Rotación 360° continua con movimiento orgánico de levitación
 * - Interacción con el cursor y toque (arrastrar para girar en cualquier ángulo)
 * - Biselado metálico con reflejos dinámicos de luz
 * - Sombra reactiva en el suelo
 * - Partículas de fantasía flotantes en los colores de la marca
 * - Optimizado con IntersectionObserver para pausar cuando no está en pantalla
 */

(function () {
  function init3DLogo() {
    const container = document.getElementById("logo-3d-container");
    if (!container || typeof THREE === "undefined") return;

    // Dimensiones del contenedor
    const width = container.clientWidth || 420;
    const height = container.clientHeight || 380;

    // Escena, Cámara y Renderizador
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(4, 6, 5);
    scene.add(mainLight);

    const rimLight = new THREE.PointLight(0x006d39, 1.5, 10);
    rimLight.position.set(-4, -2, 3);
    scene.add(rimLight);

    const warmLight = new THREE.PointLight(0x800c32, 1.2, 10);
    warmLight.position.set(3, -2, -3);
    scene.add(warmLight);

    const topGlint = new THREE.PointLight(0x4a8eff, 1.8, 8);
    topGlint.position.set(0, 4, 3);
    scene.add(topGlint);

    // Grupo raíz del logotipo 3D
    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    // Crear Textura del Frente con Canvas (Alta resolución)
    function createFrontTexture(img) {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");

      // Fondo blanco suave con degradado radial sutil
      const grad = ctx.createRadialGradient(512, 256, 50, 512, 256, 500);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(1, "#f1f5f9");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);

      // Marco decorativo con los colores de AMY
      ctx.lineWidth = 14;
      ctx.strokeStyle = "#003c8a"; // Azul A
      ctx.strokeRect(20, 20, 984, 472);

      // Dibujar imagen del logotipo centrada
      const aspect = img.width / img.height;
      let drawW = 860;
      let drawH = drawW / aspect;
      if (drawH > 400) {
        drawH = 400;
        drawW = drawH * aspect;
      }
      const drawX = (1024 - drawW) / 2;
      const drawY = (512 - drawH) / 2;
      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return texture;
    }

    // Crear Textura del Reverso
    function createBackTexture() {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");

      // Fondo degradado elegante
      const grad = ctx.createLinearGradient(0, 0, 1024, 512);
      grad.addColorStop(0, "#002860");
      grad.addColorStop(0.5, "#003c8a");
      grad.addColorStop(1, "#0056b3");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);

      // Marco dorado
      ctx.lineWidth = 12;
      ctx.strokeStyle = "#facc15";
      ctx.strokeRect(24, 24, 976, 464);

      // Texto de reverso
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.font = "bold 60px 'Outfit', sans-serif";
      ctx.fillText("AMY DISFRACES", 512, 190);

      ctx.fillStyle = "#8df9ad";
      ctx.font = "600 32px 'Outfit', sans-serif";
      ctx.fillText("Y ACCESORIOS", 512, 245);

      ctx.fillStyle = "#ffdad6";
      ctx.font = "400 24px 'Outfit', sans-serif";
      ctx.fillText("✨ Magia, Fantasía y Calidad en Cada Detalle ✨", 512, 310);

      ctx.fillStyle = "#facc15";
      ctx.font = "bold 22px 'Outfit', sans-serif";
      ctx.fillText("VENTA & RENTA • CIUDAD CREATIVA", 512, 370);

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return texture;
    }

    // Cargar imagen del logotipo
    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    logoImg.src = "assets/logo.png";
    logoImg.onload = function () {
      build3DPlacard(logoImg);
    };
    logoImg.onerror = function () {
      // Fallback a logo.jpg si png no carga
      const fallbackImg = new Image();
      fallbackImg.src = "assets/logo.jpg";
      fallbackImg.onload = function () {
        build3DPlacard(fallbackImg);
      };
    };

    function build3DPlacard(img) {
      const frontTex = createFrontTexture(img);
      const backTex = createBackTexture();

      // Geometría del medallón / placa 3D con esquinas redondeadas
      const w = 3.6;
      const h = 1.85;
      const r = 0.22;
      const shape = new THREE.Shape();
      shape.moveTo(-w / 2 + r, -h / 2);
      shape.lineTo(w / 2 - r, -h / 2);
      shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      shape.lineTo(w / 2, h / 2 - r);
      shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      shape.lineTo(-w / 2 + r, h / 2);
      shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      shape.lineTo(-w / 2, -h / 2 + r);
      shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

      const extrudeSettings = {
        depth: 0.16,
        bevelEnabled: true,
        bevelSegments: 5,
        steps: 1,
        bevelSize: 0.04,
        bevelThickness: 0.04
      };

      const baseGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      baseGeo.center();

      // Material biselado plateado / dorado brillante
      const rimMaterial = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        metalness: 0.85,
        roughness: 0.18
      });

      const frontMaterial = new THREE.MeshStandardMaterial({
        map: frontTex,
        roughness: 0.35,
        metalness: 0.1
      });

      const backMaterial = new THREE.MeshStandardMaterial({
        map: backTex,
        roughness: 0.35,
        metalness: 0.15
      });

      // Malla base biselada
      const baseMesh = new THREE.Mesh(baseGeo, rimMaterial);
      logoGroup.add(baseMesh);

      // Cara frontal
      const planeGeo = new THREE.PlaneGeometry(w, h);
      const frontMesh = new THREE.Mesh(planeGeo, frontMaterial);
      frontMesh.position.z = 0.125;
      logoGroup.add(frontMesh);

      // Cara posterior
      const backMesh = new THREE.Mesh(planeGeo, backMaterial);
      backMesh.position.z = -0.125;
      backMesh.rotation.y = Math.PI;
      logoGroup.add(backMesh);

      // Sombra reactiva en el piso
      const shadowCanvas = document.createElement("canvas");
      shadowCanvas.width = 256;
      shadowCanvas.height = 256;
      const sCtx = shadowCanvas.getContext("2d");
      const sGrad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
      sGrad.addColorStop(0, "rgba(15, 23, 42, 0.45)");
      sGrad.addColorStop(0.5, "rgba(15, 23, 42, 0.15)");
      sGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      sCtx.fillStyle = sGrad;
      sCtx.fillRect(0, 0, 256, 256);

      const shadowTex = new THREE.CanvasTexture(shadowCanvas);
      const shadowGeo = new THREE.PlaneGeometry(3.6, 1.8);
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.7
      });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.y = -1.65;
      scene.add(shadowMesh);

      // Partículas de fantasía flotantes (estrellitas/chispas)
      const particleCount = 40;
      const pGeo = new THREE.BufferGeometry();
      const pPos = new Float32Array(particleCount * 3);
      const pColors = new Float32Array(particleCount * 3);

      const brandColors = [
        new THREE.Color(0x004398), // Azul A
        new THREE.Color(0x00833e), // Verde M
        new THREE.Color(0x84142d), // Vino Y
        new THREE.Color(0xfacc15)  // Dorado
      ];

      for (let i = 0; i < particleCount; i++) {
        pPos[i * 3] = (Math.random() - 0.5) * 6;
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 4;
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 3;

        const color = brandColors[i % brandColors.length];
        pColors[i * 3] = color.r;
        pColors[i * 3 + 1] = color.g;
        pColors[i * 3 + 2] = color.b;
      }
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      pGeo.setAttribute("color", new THREE.BufferAttribute(pColors, 3));

      const pMat = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.85
      });
      const particleSystem = new THREE.Points(pGeo, pMat);
      scene.add(particleSystem);

      // Guardar referencias para animación
      window.__amy3D = {
        logoGroup,
        shadowMesh,
        particleSystem
      };
    }

    // Variables de control de interacción (Mouse y Touch)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationY = 0;
    let targetRotationX = 0;
    let autoRotateSpeed = 0.012;

    container.addEventListener("pointerdown", (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener("pointermove", (e) => {
      if (!isDragging) {
        // Efecto de inclinación ligera hacia el cursor cuando está sobre el contenedor
        const rect = container.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          const normX = (e.clientX - rect.left) / rect.width - 0.5;
          const normY = (e.clientY - rect.top) / rect.height - 0.5;
          targetRotationX = normY * 0.4;
        } else {
          targetRotationX = 0;
        }
        return;
      }

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      logoGroup.rotation.y += deltaX * 0.015;
      logoGroup.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener("pointerup", () => {
      isDragging = false;
    });

    // Doble clic o tap para darle un impulso de giro divertido
    container.addEventListener("dblclick", () => {
      autoRotateSpeed = 0.08;
      setTimeout(() => {
        autoRotateSpeed = 0.012;
      }, 1500);
    });

    // Control de visibilidad para ahorrar recursos
    let isVisible = true;
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
      }, { threshold: 0.1 });
      observer.observe(container);
    }

    // Bucle de Animación
    let clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      if (window.__amy3D) {
        const { logoGroup, shadowMesh, particleSystem } = window.__amy3D;

        // Auto-rotación continua
        if (!isDragging) {
          logoGroup.rotation.y += autoRotateSpeed;
          // Inclinación suave
          logoGroup.rotation.x += (targetRotationX - logoGroup.rotation.x) * 0.05;
        }

        // Levitación sinusoidal orgánica
        const floatOffset = Math.sin(elapsedTime * 2.2) * 0.12;
        logoGroup.position.y = floatOffset;

        // La sombra se expande y atenúa al flotar
        if (shadowMesh) {
          const shadowScale = 1 - floatOffset * 0.8;
          shadowMesh.scale.set(shadowScale, shadowScale, shadowScale);
          shadowMesh.material.opacity = 0.65 - floatOffset * 0.8;
        }

        // Movimiento lento de las partículas
        if (particleSystem) {
          particleSystem.rotation.y = elapsedTime * 0.05;
          particleSystem.rotation.x = Math.sin(elapsedTime * 0.5) * 0.05;
        }
      }

      renderer.render(scene, camera);
    }

    animate();

    // Redimensionamiento responsivo
    function onResize() {
      const newW = container.clientWidth || 420;
      const newH = container.clientHeight || 380;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    }

    window.addEventListener("resize", onResize);
  }

  // Carga e inicialización
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init3DLogo);
  } else {
    init3DLogo();
  }
})();
