// Utilidad para establecer la posición de un objeto


function simular() {
  const massA = parseFloat(document.getElementById("massA").value);
  const massB = parseFloat(document.getElementById("massB").value);
  const force = parseFloat(document.getElementById("force").value);

  const accelA = force / massA;
  const accelB = force / massB;

  document.getElementById("output").innerHTML = `
    Aceleración del personaje A: ${accelA.toFixed(2)} m/s²<br>
    Aceleración del objeto B: ${accelB.toFixed(2)} m/s²<br>
    Fuerza de reacción: ${force.toFixed(2)} N en sentido opuesto
  `;

  animar(accelA, accelB);
}

function animar(accelA, accelB) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  let posA = 60;
  let posB = 600;
  let t = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar personaje A (círculo con carita)
    ctx.beginPath();
    ctx.fillStyle = "#Ffffff";
    ctx.arc(posA, 150, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.fillStyle = "#000";
    ctx.font = "23px Arial";
    ctx.fillText("📦", posA - 12, 156); // emoji personaje

    // Dibujar objeto B (esfera grande)
    ctx.beginPath();
    ctx.fillStyle = "#Ffffff";
    ctx.arc(posB, 150, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.fillStyle = "";
    ctx.fillText("📦", posB - 12, 156); // emoji objeto

    if (t < 100) {
      posA += accelA * 0.4;
      posB -= accelB * 0.4;
      t++;
      requestAnimationFrame(draw);
    }
  }

  draw();
}
function setPosition(elementId, x, y) {
    const el = document.getElementById(elementId);
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
}

// Validación de entrada numérica
function getValidatedInput(id) {
    const value = parseFloat(document.getElementById(id).value);
    return isNaN(value) ? null : value;
}

// Inicializar objetos al cargar
window.onload = () => {
    setPosition("inertia-object", 10, 75);
    setPosition("dynamics-object", 50, 75);
    setPosition("action-object", 70, 75);
    setPosition("reaction-object", 180, 75);
};

// Primera Ley de Newton
function runInertiaDemo() {
    const friction = getValidatedInput("friction");
    const initialVelocity = getValidatedInput("initial-velocity");

    if (friction === null || initialVelocity === null) {
        document.getElementById("inertia-result").innerHTML = "<p>Por favor, ingresa valores válidos.</p>";
        return;
    }

    const object = document.getElementById("inertia-object");
    setPosition("inertia-object", 10, 75);

    let velocity = initialVelocity;
    let position = 10;

    clearInterval(window.inertiaInterval);
    document.getElementById("inertia-result").innerHTML = "<p>Simulación en progreso...</p>";

    window.inertiaInterval = setInterval(() => {
        velocity -= friction * 0.05 * velocity;
        position += velocity * 0.1;
        object.style.left = `${position}px`;

        const limit = document.getElementById("primera-ley-vis").offsetWidth - 50;
        if (velocity < 0.1 || position > limit) {
            clearInterval(window.inertiaInterval);
            document.getElementById("inertia-result").innerHTML = `
                <p><strong>Resultados:</strong></p>
                <p>Velocidad final: ${velocity.toFixed(2)} m/s</p>
                <p>Distancia recorrida: ${(position - 10).toFixed(2)} m</p>
                <p>La fricción desacelera el objeto en movimiento.</p>
            `;
        }
    }, 50);
}

// Segunda Ley de Newton
function calculateAcceleration() {
    const mass = getValidatedInput("mass");
    const force = getValidatedInput("force");

    if (!mass || !force || mass <= 0) {
        document.getElementById("acceleration-result").innerHTML = "<p>Por favor, ingresa valores válidos.</p>";
        return;
    }

    const acceleration = force / mass;
    const object = document.getElementById("dynamics-object");
    const arrow = document.getElementById("force-arrow");

    setPosition("dynamics-object", 50, 75);
    arrow.style.left = "100px";
    arrow.style.top = "100px";
    arrow.style.width = `${force * 3}px`;

    document.getElementById("acceleration-result").innerHTML = `
        <p><strong>Resultados:</strong></p>
        <p>Aceleración: ${acceleration.toFixed(2)} m/s²</p>
        <p>Fórmula aplicada: a = F / m</p>
    `;

    clearInterval(window.accelInterval);
    let position = 50;
    let velocity = 0;

    window.accelInterval = setInterval(() => {
        velocity += acceleration * 0.1;
        position += velocity * 0.1;
        object.style.left = `${position}px`;

        const limit = document.getElementById("segunda-ley-vis").offsetWidth - 50;
        if (position > limit) clearInterval(window.accelInterval);
    }, 50);
}

// Tercera Ley de Newton
function runActionReactionDemo() {
    const actionForce = getValidatedInput("action-force");

    if (!actionForce || actionForce <= 0) {
        document.getElementById("action-reaction-result").innerHTML = "<p>Ingresa una fuerza válida.</p>";
        return;
    }

    const actionObj = document.getElementById("action-object");
    const reactionObj = document.getElementById("reaction-object");

    setPosition("action-object", 70, 75);
    setPosition("reaction-object", 180, 75);
    document.getElementById("action-reaction-result").innerHTML = "<p>Simulación en progreso...</p>";

    clearTimeout(window.actionTimeout);
    clearInterval(window.actionAnim1);
    clearInterval(window.actionAnim2);

    let pos1 = 70;
    window.actionTimeout = setTimeout(() => {
        window.actionAnim1 = setInterval(() => {
            pos1 += 5;
            actionObj.style.left = `${pos1}px`;

            if (pos1 >= 130) {
                clearInterval(window.actionAnim1);
                let pos1After = 130;
                let pos2After = 180;

                window.actionAnim2 = setInterval(() => {
                    pos1After -= (actionForce / 20);
                    pos2After += (actionForce / 20);

                    actionObj.style.left = `${pos1After}px`;
                    reactionObj.style.left = `${pos2After}px`;

                    if (pos1After <= 50 || pos2After >= 250) {
                        clearInterval(window.actionAnim2);
                        document.getElementById("action-reaction-result").innerHTML = `
                            <p><strong>Resultados:</strong></p>
                            <p>Fuerza de acción: ${actionForce.toFixed(2)} N</p>
                            <p>Fuerza de reacción: ${(-actionForce).toFixed(2)} N</p>
                            <p>Ambos objetos reaccionan con fuerzas iguales y opuestas.</p>
                        `;
                    }
                }, 50);
            }
        }, 50);
    }, 500);
}

// Cálculo en plano inclinado
function calculateInclinedPlane() {
    const mass = getValidatedInput("object-mass");
    const angle = getValidatedInput("angle");
    const mu = getValidatedInput("friction-coef");

    if (!mass || !angle || !mu || mass <= 0 || angle < 0 || angle > 90) {
        document.getElementById("inclined-result").innerHTML = "<p>Ingresa valores válidos.</p>";
        return;
    }

    const g = 9.8;
    const rad = angle * Math.PI / 180;
    const weight = mass * g;
    const Fp = weight * Math.sin(rad);
    const Fn = weight * Math.cos(rad);
    const Ff = mu * Fn;
    const net = Fp - Ff;

    let msg = `
        <p><strong>Resultados:</strong></p>
        <p>Peso: ${weight.toFixed(2)} N</p>
        <p>Componente paralela: ${Fp.toFixed(2)} N</p>
        <p>Componente perpendicular: ${Fn.toFixed(2)} N</p>
        <p>Fricción: ${Ff.toFixed(2)} N</p>
        <p>Fuerza neta: ${net.toFixed(2)} N</p>
    `;

    if (net > 0) {
        const a = net / mass;
        msg += `<p>El objeto se desliza con aceleración: ${a.toFixed(2)} m/s²</p>`;
    } else {
        msg += `<p>El objeto no se desliza debido a la fricción.</p>`;
    }

    document.getElementById("inclined-result").innerHTML = msg;
}

// Navegación suave
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', e => {
        e.preventDefault();
        const id = anchor.getAttribute('href');
        const section = document.querySelector(id);
        window.scrollTo({
            top: section.offsetTop - 70,
            behavior: 'smooth'
        });
    });
});
