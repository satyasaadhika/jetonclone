// Three.js Scene Setup
let scene, camera, renderer, geometry, material, mesh;
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

// Initialize Three.js
function initThreeJS() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true, 
        antialias: true 
    });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);

    // Create animated geometry
    createAnimatedGeometry();
    
    // Position camera
    camera.position.z = 5;

    // Start animation loop
    animate();
}

function createAnimatedGeometry() {
    // Create multiple geometric shapes
    const shapes = [];
    
    // Main central torus (coin-like shape)
    const torusGeometry = new THREE.TorusGeometry(1.2, 0.3, 16, 100);
    const torusMaterial = new THREE.MeshPhongMaterial({
        color: 0xff6b9d,
        transparent: true,
        opacity: 0.8,
        shininess: 100
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);
    shapes.push({ mesh: torus, speed: 0.01, axis: 'y' });

    // Floating spheres
    for (let i = 0; i < 5; i++) {
        const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(Math.random(), 0.7, 0.7),
            transparent: true,
            opacity: 0.6
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        
        sphere.position.set(
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 2
        );
        
        scene.add(sphere);
        shapes.push({ 
            mesh: sphere, 
            speed: 0.005 + Math.random() * 0.01,
            axis: Math.random() > 0.5 ? 'x' : 'z',
            orbit: true,
            orbitRadius: 2 + Math.random() * 2,
            orbitSpeed: 0.01 + Math.random() * 0.01
        });
    }

    // Cylinder shapes (representing cards/tokens)
    for (let i = 0; i < 3; i++) {
        const cylinderGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 32);
        const cylinderMaterial = new THREE.MeshPhongMaterial({
            color: 0xff8e53,
            transparent: true,
            opacity: 0.7
        });
        const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        
        cylinder.position.set(
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 1
        );
        
        scene.add(cylinder);
        shapes.push({ 
            mesh: cylinder, 
            speed: 0.008,
            axis: 'y',
            float: true,
            floatSpeed: 0.02,
            floatRange: 0.3
        });
    }

    // Store shapes for animation
    window.animatedShapes = shapes;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xff6b9d, 1, 10);
    pointLight.position.set(-5, -5, 2);
    scene.add(pointLight);
}

function animate() {
    requestAnimationFrame(animate);

    // Mouse interaction
    targetX = (mouseX - windowHalfX) * 0.001;
    targetY = (mouseY - windowHalfY) * 0.001;

    if (window.animatedShapes) {
        window.animatedShapes.forEach((shape, index) => {
            const { mesh, speed, axis, orbit, orbitRadius, orbitSpeed, float, floatSpeed, floatRange } = shape;
            
            // Basic rotation
            if (axis === 'x') mesh.rotation.x += speed;
            if (axis === 'y') mesh.rotation.y += speed;
            if (axis === 'z') mesh.rotation.z += speed;

            // Orbital motion
            if (orbit) {
                const time = Date.now() * orbitSpeed;
                mesh.position.x = Math.cos(time + index) * orbitRadius;
                mesh.position.z = Math.sin(time + index) * orbitRadius;
            }

            // Floating motion
            if (float) {
                const time = Date.now() * floatSpeed;
                mesh.position.y += Math.sin(time + index) * floatRange * 0.01;
            }

            // Mouse interaction
            mesh.rotation.y += targetX;
            mesh.rotation.x += targetY;
        });
    }

    // Rotate camera slightly based on mouse
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (-targetY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

// Mouse movement tracking
function onDocumentMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}

// Window resize handler
function onWindowResize() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || !camera || !renderer) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Update window dimensions for mouse interaction
    windowHalfX = width / 2;
    windowHalfY = height / 2;
}

// Smooth scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Process steps interaction
function initProcessSteps() {
    const steps = document.querySelectorAll('.step');
    let currentStep = 0;

    function activateStep(index) {
        steps.forEach((step, i) => {
            step.classList.toggle('active', i === index);
        });
    }

    // Auto-advance steps
    setInterval(() => {
        currentStep = (currentStep + 1) % steps.length;
        activateStep(currentStep);
    }, 3000);

    // Manual step interaction
    steps.forEach((step, index) => {
        step.addEventListener('click', () => {
            currentStep = index;
            activateStep(currentStep);
        });
    });

    // Restart button
    const restartBtn = document.querySelector('.restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            currentStep = 0;
            activateStep(currentStep);
        });
    }
}

// Currency exchange animation
function initExchangeWidget() {
    const exchangeArrow = document.querySelector('.exchange-arrow');
    const eurInput = document.querySelector('.currency-input .amount-input');
    const gbpInput = document.querySelector('.currency-output .amount-input');

    if (exchangeArrow) {
        exchangeArrow.addEventListener('click', () => {
            exchangeArrow.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                exchangeArrow.style.transform = 'rotate(0deg)';
            }, 300);
        });
    }

    // Real-time conversion (mock)
    if (eurInput && gbpInput) {
        eurInput.addEventListener('input', (e) => {
            const eurValue = parseFloat(e.target.value) || 0;
            const gbpValue = (eurValue * 0.85).toFixed(2);
            gbpInput.value = gbpValue;
            
            // Add animation to the output
            gbpInput.style.transform = 'scale(1.05)';
            gbpInput.style.background = 'rgba(255, 255, 255, 0.2)';
            setTimeout(() => {
                gbpInput.style.transform = 'scale(1)';
                gbpInput.style.background = 'rgba(255, 255, 255, 0.1)';
            }, 200);
        });
    }
}

// Form animations
function initFormAnimations() {
    const formInputs = document.querySelectorAll('.form-input');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.transform = 'translateY(-2px)';
            input.style.boxShadow = '0 10px 30px rgba(255, 255, 255, 0.1)';
        });
        
        input.addEventListener('blur', () => {
            input.style.transform = 'translateY(0)';
            input.style.boxShadow = 'none';
        });
    });

    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.style.background = 'rgba(255, 255, 255, 0.7)';
            
            setTimeout(() => {
                submitBtn.textContent = 'Sent!';
                submitBtn.style.background = '#4CAF50';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = 'white';
                    contactForm.reset();
                }, 2000);
            }, 1500);
        });
    }
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Observe cards and buttons
    document.querySelectorAll('.feature-card, .testimonial, .step').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        observer.observe(card);
    });
}

// Button hover effects
function initButtonEffects() {
    document.querySelectorAll('button, .download-btn').forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js scene with error handling
    try {
        initThreeJS();
        console.log('Three.js initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Three.js:', error);
    }
    
    // Initialize all interactive features
    initSmoothScroll();
    initProcessSteps();
    initExchangeWidget();
    initTestimonialsCarousel();
    initFormAnimations();
    initScrollAnimations();
    initButtonEffects();
    
    // Add event listeners with error handling
    document.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('resize', onWindowResize);
    
    // Add custom cursor effect
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Enhance cursor on interactive elements
    document.querySelectorAll('button, a, .step, .testimonial').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });
});

// Performance optimization
window.addEventListener('load', () => {
    // Preload animations
    document.body.style.animation = 'none';
    
    // Initialize additional features after load
    setTimeout(() => {
        // Add particle effects on scroll
        let ticking = false;
        
        function updateParticles() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (window.animatedShapes) {
                window.animatedShapes.forEach((shape, index) => {
                    if (shape.mesh) {
                        shape.mesh.position.y += Math.sin(Date.now() * 0.001 + index) * 0.001;
                    }
                });
            }
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParticles);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
    }, 1000);
});