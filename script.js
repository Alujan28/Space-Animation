const canvas = document.getElementById('spaceCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();  

const celestialObjects = [];
const particles = [];

class Particle {
    constructor(x, y, size, color, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speed = speed;
        this.angle = Math.random() * Math.PI * 2;
        this.life = 100;
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.life--;
        this.size *= 0.99;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life / 100;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

class CelestialObject {
    constructor(x, y, size, type) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.type = type;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.2 + 0.1;
        this.hue = Math.random() * 360;
        this.saturation = Math.random() * 50 + 50;
        this.lightness = Math.random() * 50 + 25;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        if (this.type === 'galaxy') {
            this.drawGalaxy();
        } else if (this.type === 'cluster') {
            this.drawCluster();
        } else if (this.type === 'nebula') {
            this.drawNebula();
        } else if (this.type === 'bigbank') {
            this.drawBigBank();
        }

        ctx.restore();
    }

    drawGalaxy() {
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 1)`);
        gradient.addColorStop(1, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0)`);

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();

        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0.5)`;
            ctx.lineWidth = 2;
            ctx.arc(0, 0, this.size * (0.2 + i * 0.2), 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    drawCluster() {
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * this.size;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            const starSize = Math.random() * 2 + 1;

            ctx.beginPath();
            ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${Math.random() * 0.5 + 0.5})`;
            ctx.arc(x, y, starSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawNebula() {
        ctx.filter = 'blur(5px)';
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0.8)`);
        gradient.addColorStop(0.5, `hsla(${this.hue + 30}, ${this.saturation}%, ${this.lightness}%, 0.4)`);
        gradient.addColorStop(1, `hsla(${this.hue + 60}, ${this.saturation}%, ${this.lightness}%, 0)`);

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.filter = 'none';
    }

    drawBigBank() {
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 1)`);
        gradient.addColorStop(1, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0)`);

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        
        for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * this.size * 1.5;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            const starSize = Math.random() * 3 + 2;

            ctx.beginPath();
            ctx.fillStyle = `hsla(${this.hue + 180}, ${this.saturation}%, ${this.lightness}%, 0.8)`;
            ctx.arc(x, y, starSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    update() {
        this.angle += this.speed * 0.02;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (this.x < -this.size || this.x > canvas.width + this.size ||
            this.y < -this.size || this.y > canvas.height + this.size) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
        }

        if (Math.random() < 0.1) {
            particles.push(new Particle(
                this.x, 
                this.y, 
                Math.random() * 2 + 1, 
                `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`,
                Math.random() * 0.5 + 0.1
            ));
        }
    }
}

function createCelestialObject(type) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 50 + 25;
    celestialObjects.push(new CelestialObject(x, y, size, type));
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    celestialObjects.forEach(obj => {
        obj.update();
        obj.draw();
    });

    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        if (particle.life <= 0 || particle.size < 0.1) {
            particles.splice(index, 1);
        }
    });

    requestAnimationFrame(animate);
}


for (let i = 0; i < 5; i++) {
    createCelestialObject('galaxy');
    createCelestialObject('cluster');
    createCelestialObject('nebula');
    createCelestialObject('bigbank');
}

animate();


window.addEventListener('resize', resizeCanvas);
