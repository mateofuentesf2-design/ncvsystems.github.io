document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('secureContactForm');
  if (!form) return;

  const emailInput = document.getElementById('email');
  const urgencySelect = document.getElementById('urgency');
  const submitBtn = document.getElementById('submitBtn');
  
  const emailFeedback = document.getElementById('emailFeedback');
  const consoleContainer = document.getElementById('consoleContainer');
  const consoleBody = document.getElementById('consoleBody');

  // --- DYNAMIC URGENCY SELECT STYLE ---
  urgencySelect.addEventListener('change', () => {
    const value = urgencySelect.value;
    
    // Clear existing urgency classes
    urgencySelect.classList.remove('urgencia-low', 'urgencia-medium', 'urgencia-critical');
    
    if (value === 'low') {
      urgencySelect.classList.add('urgencia-low');
    } else if (value === 'medium') {
      urgencySelect.classList.add('urgency-medium');
    } else if (value === 'critical') {
      urgencySelect.classList.add('urgency-critical');
    }
  });

  // --- B2B EMAIL DOMAIN VALIDATION ---
  const personalDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'live.com', 
    'outlook.com', 'icloud.com', 'aol.com', 'zoho.com'
  ];

  emailInput.addEventListener('input', () => {
    const value = emailInput.value.trim().toLowerCase();
    emailFeedback.textContent = '';
    emailFeedback.className = 'form-feedback';

    if (!value) return;

    // Basic regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      emailFeedback.textContent = '// ESTRUCTURA DE CORREO INVÁLIDA';
      emailFeedback.classList.add('error');
      return;
    }

    // Check domain
    const domain = value.split('@')[1];
    if (personalDomains.includes(domain)) {
      emailFeedback.textContent = '▲ ALERTA: SE SUGIERE UTILIZAR DIRECCIÓN DE CORREO CORPORATIVA';
      emailFeedback.classList.add('warning');
    } else {
      emailFeedback.textContent = '✓ CORREO CORPORATIVO DETECTADO';
      emailFeedback.classList.add('success');
    }
  });

  // --- CRYPTO TRANSMISSION HANDSHAKE SIMULATION ---
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Client-side validation check
    const name = document.getElementById('name').value.trim();
    const email = emailInput.value.trim();
    const company = document.getElementById('company').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !company || !message) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    // 2. Disable form elements
    const inputs = form.querySelectorAll('input, select, textarea, button');
    inputs.forEach(el => el.disabled = true);

    // 3. Show Console Log
    consoleContainer.style.display = 'block';
    consoleBody.innerHTML = ''; // Clear logs
    consoleContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Stream lines in terminal simulation
    const logLines = [
      { text: `[NCV SYSTEM SECURE ENVELOPE INITIALIZED]`, type: 'info' },
      { text: `Generando par de llaves efímeras ECDH (Curve25519)...`, type: 'info' },
      { text: `Estableciendo conexión con gateway.ncvsystems.com...`, type: 'info' },
      { text: `Intercambio de claves completado de extremo a extremo.`, type: 'success' },
      { text: `Derivando secreto compartido AES-256-GCM...`, type: 'info' },
      { text: `Cifrando carga de datos (Nombre, Empresa, Mensaje)...`, type: 'info' },
      { text: `Payload cifrado generado con éxito:`, type: 'info' },
      { text: `  CIPHER: ${generateMockCipher()}`, type: 'warning' },
      { text: `Calculando firma criptográfica SHA-256 HMAC...`, type: 'info' },
      { text: `Transmitiendo paquete cifrado seguro...`, type: 'info' },
      { text: `Servidor de Destino: Confirmación de entrega recibida.`, type: 'success' },
      { text: `PAQUETE ENVIADO Y ARCHIVADO CORRECTAMENTE // GRACIAS.`, type: 'success' }
    ];

    let currentLine = 0;

    function addConsoleLine() {
      if (currentLine >= logLines.length) {
        // Animation finished, show final success
        setTimeout(() => {
          alert('Mensaje enviado de forma segura. Nos pondremos en contacto contigo a la brevedad.');
          // Reset Form and re-enable inputs
          form.reset();
          urgencySelect.classList.remove('urgencia-low', 'urgencia-medium', 'urgencia-critical');
          inputs.forEach(el => el.disabled = false);
          emailFeedback.textContent = '';
          consoleContainer.style.display = 'none';
        }, 1500);
        return;
      }

      const lineData = logLines[currentLine];
      const line = document.createElement('div');
      line.className = 'console-line';
      
      if (lineData.type === 'success') {
        line.classList.add('success');
      } else if (lineData.type === 'warning') {
        line.classList.add('warning');
      }
      
      // If it's the cipher mock, we show it instantly, else simulate typewriter or small pause
      line.textContent = lineData.text;
      consoleBody.appendChild(line);
      consoleBody.scrollTop = consoleBody.scrollHeight; // Auto scroll to bottom

      currentLine++;
      // Random delay between lines to simulate actual computing/network lag
      const nextDelay = lineData.type === 'success' ? 800 : 350 + Math.random() * 400;
      setTimeout(addConsoleLine, nextDelay);
    }

    addConsoleLine();
  });

  function generateMockCipher() {
    const chars = '0123456789ABCDEF';
    let result = 'U2FsdGVkX1';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result + '...';
  }
});
