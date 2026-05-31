document.addEventListener('DOMContentLoaded', () => {

    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });

    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    function renderGallery() {
        const grid = document.getElementById('galleryGrid');
        const data = window.GALLERY_DATA || [];

        grid.innerHTML = data.map(item => `
            <div class="gallery__item" data-category="${item.category}">
                <div class="gallery__item-image">
                    <img src="${item.src}" alt="${item.title}" loading="lazy"
                         onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                    <div class="gallery__placeholder" style="background: ${item.gradient}; display: none;">
                        <i class="fas ${item.icon}"></i>
                    </div>
                </div>
                <div class="gallery__item-overlay">
                    <h3>${item.title}</h3>
                    <p>${item.category === 'all' ? 'Proyecto' : item.category}</p>
                </div>
            </div>
        `).join('');

        const filterBtns = document.querySelectorAll('.gallery__filter');
        const galleryItems = grid.querySelectorAll('.gallery__item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = 'block';
                        item.style.opacity = '1';
                    } else {
                        item.style.display = 'none';
                        item.style.opacity = '0';
                    }
                });
            });
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        galleryItems.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    renderGallery();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.process__card, .testimonial__card, .pricing__card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    const canvas = document.getElementById('neuralCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H;
    let mouse = { x: -9999, y: -9999 };
    let nodes = [];
    const NODE_COUNT = 80;
    const CONNECTION_DIST = 160;
    const MOUSE_RADIUS = 140;
    const COLORS = [
        '#E59EDD', '#F2C8EE', '#A8D8EA', '#C8E6C9',
        '#FFF3CD', '#D4A8D4', '#F5E8E0', '#FFB7C5'
    ];

    const SHAPES = ['crown', 'star', 'planet', 'heart', 'bolt'];

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        W = canvas.width = rect.width;
        H = canvas.height = rect.height;
    }

    function initNodes() {
        nodes = [];
        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push({
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 5 + 4,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                shape: SHAPES[Math.floor(Math.random() * SHAPES.length)]
            });
        }
    }

    function drawStar(cx, cy, r) {
        const spikes = 5;
        const outerR = r;
        const innerR = r * 0.4;
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const rad = i % 2 === 0 ? outerR : innerR;
            const angle = (i * Math.PI) / spikes - Math.PI / 2;
            const x = cx + Math.cos(angle) * rad;
            const y = cy + Math.sin(angle) * rad;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
    }

    function drawHeart(cx, cy, r) {
        ctx.beginPath();
        const s = r * 0.6;
        ctx.moveTo(cx, cy + s * 0.8);
        ctx.bezierCurveTo(cx - s, cy - s * 0.5, cx - s, cy - s * 1.2, cx, cy - s * 0.4);
        ctx.bezierCurveTo(cx + s, cy - s * 1.2, cx + s, cy - s * 0.5, cx, cy + s * 0.8);
        ctx.fill();
    }

    function drawCrown(cx, cy, r) {
        const pts = 5;
        const base = r;
        ctx.beginPath();
        for (let i = 0; i < pts; i++) {
            const angle = (i * 2 * Math.PI) / pts - Math.PI / 2;
            const x = cx + Math.cos(angle) * base;
            const y = cy + Math.sin(angle) * base * 0.5;
            const tipR = base * 1.5;
            const tipAngle = angle + Math.PI / pts;
            const tx = cx + Math.cos(tipAngle) * tipR;
            const ty = cy + Math.sin(tipAngle) * tipR * 0.5;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            ctx.lineTo(tx, ty);
        }
        ctx.closePath();
        ctx.fill();
    }

    function drawPlanet(cx, cy, r) {
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * 1.2, r * 0.25, 0.3, 0, Math.PI * 2);
        ctx.stroke();
    }

    function drawBolt(cx, cy, r) {
        ctx.beginPath();
        const s = r * 0.8;
        ctx.moveTo(cx + s * 0.3, cy - s);
        ctx.lineTo(cx - s * 0.15, cy - s * 0.1);
        ctx.lineTo(cx + s * 0.05, cy - s * 0.1);
        ctx.lineTo(cx - s * 0.3, cy + s);
        ctx.lineTo(cx + s * 0.25, cy + s * 0.1);
        ctx.lineTo(cx + s * 0.05, cy + s * 0.1);
        ctx.closePath();
        ctx.fill();
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            node.x += node.vx;
            node.y += node.vy;

            if (node.x < 0 || node.x > W) node.vx *= -1;
            if (node.y < 0 || node.y > H) node.vy *= -1;

            const dx = mouse.x - node.x;
            const dy = mouse.y - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < MOUSE_RADIUS) {
                const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                node.x -= dx * force * 0.03;
                node.y -= dy * force * 0.03;
            }

            ctx.fillStyle = node.color;
            switch (node.shape) {
                case 'star': drawStar(node.x, node.y, node.radius); break;
                case 'heart': drawHeart(node.x, node.y, node.radius); break;
                case 'crown': drawCrown(node.x, node.y, node.radius); break;
                case 'planet': drawPlanet(node.x, node.y, node.radius); break;
                case 'bolt': drawBolt(node.x, node.y, node.radius); break;
                default:
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                    ctx.fill();
            }

            for (let j = i + 1; j < nodes.length; j++) {
                const other = nodes[j];
                const dx2 = node.x - other.x;
                const dy2 = node.y - other.y;
                const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                if (dist2 < CONNECTION_DIST) {
                    const alpha = (1 - dist2 / CONNECTION_DIST) * 0.5;
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.strokeStyle = `rgba(229,158,221,${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    window.addEventListener('resize', () => {
        resize();
        initNodes();
    });

    resize();
    initNodes();
    draw();

    const modal = document.getElementById('quoteModal');
    const overlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('modalClose');
    const modalService = document.getElementById('modalService');
    const modalName = document.getElementById('modalName');
    const modalPhone = document.getElementById('modalPhone');
    const modalDetails = document.getElementById('modalDetails');
    const quoteForm = document.getElementById('quoteForm');

    const placeholders = {
        'Lámina Simple': 'Ej: Lámina sobre el sistema solar, tamaño carta, colores azul y verde. Incluir imágenes del sol y planetas. Entrega viernes.',
        'Lapbook Completo': 'Ej: Lapbook del ciclo del agua, 3 solapas interactivas, colores pastel. Incluir ventanas y desplegables. Medidas 60x40 cm.',
        'Identidad de Marca': 'Ej: Marca de cafetería artesanal, tonos marrón y crema, logo con grano de café. Necesito tarjetas y menú.',
    };

    document.querySelectorAll('.pricing__btn[data-plan]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const plan = btn.dataset.plan;
            modalService.value = plan;
            modalDetails.placeholder = placeholders[plan] || 'Describe los detalles de tu proyecto...';
            modalName.value = '';
            modalPhone.value = '';
            modalDetails.value = '';
            modal.classList.add('active');
        });
    });

    function closeModal() {
        modal.classList.remove('active');
    }

    overlay.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = modalName.value.trim();
        const phone = modalPhone.value.trim();
        const service = modalService.value.trim();
        const details = modalDetails.value.trim();

        if (!name || !phone) return;

        const msg = `Hola, quisiera solicitar una cotización:%0A%0A*Nombre:* ${encodeURIComponent(name)}%0A*Contacto:* ${encodeURIComponent(phone)}%0A*Servicio:* ${encodeURIComponent(service)}%0A*Detalles:* ${encodeURIComponent(details || 'Sin detalles adicionales')}`;

        window.open(`https://wa.me/584227994255?text=${msg}`, '_blank');
        closeModal();
    });

});
