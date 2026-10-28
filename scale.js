/**
 * Renpho Web Scale Bluetooth Driver
 * Manejador especializado para básculas inteligentes RENPHO y compatibles:
 * - Familia QN-Scale / Yolanda (ES-24M, ES-26M, ES-30M, ES-CS20M, Elis 1, Elis Go, etc.)
 * - Familia LeFu / Chipsea / 55AA (ES-26BB-B, Elis Solar R-A012, R-MSC04, etc.)
 * - Familia Bluetooth SIG estándar (Weight Scale 0x181D / 0x2A9D)
 */

class RenphoScaleDriver {
  constructor() {
    this.device = null;
    this.server = null;
    this.notifyCharacteristic = null;
    this.writeCharacteristic = null;
    this.ae01Characteristic = null;
    this.ae02Characteristic = null;
    this.protocol = 'Desconocido';
    this.connected = false;
    this.packetsReceived = 0;
    
    // Estado de la máquina de protocolos QN-Scale
    this.seenProtocolType = 0x00;
    this.weightScaleFactor = 100;
    this.scaleFactorKnown = false;
    this.handshakeStarted = false;

    this.callbacks = {
      onStatus: () => {},
      onWeight: () => {},
      onPacket: () => {},
      onBattery: () => {},
      onError: () => {},
      onDisconnect: () => {}
    };

    // UUIDs normalizados a 128 bits
    this.KNOWN_SERVICES = [
      '0000fff0-0000-1000-8000-00805f9b34fb', // QN Type 2
      '0000ffe0-0000-1000-8000-00805f9b34fb', // QN Type 1
      '0000ae00-0000-1000-8000-00805f9b34fb', // JieLi / QN Auth Service
      '00001a10-0000-1000-8000-00805f9b34fb', // LeFu / Chipsea
      '0000181d-0000-1000-8000-00805f9b34fb', // SIG Weight Scale
      '0000181b-0000-1000-8000-00805f9b34fb', // SIG Body Composition
      '0000181c-0000-1000-8000-00805f9b34fb', // SIG User Data
      '0000180f-0000-1000-8000-00805f9b34fb', // Battery Service
      '0000180a-0000-1000-8000-00805f9b34fb'  // Device Information
    ];
  }

  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event] = callback;
    }
  }

  isSupported() {
    return !!(navigator.bluetooth && navigator.bluetooth.requestDevice);
  }

  async connect(options = { acceptAll: true }) {
    if (!this.isSupported()) {
      throw new Error('Tu navegador no soporta Web Bluetooth. Usa Google Chrome en Mac, Windows, Linux o Android.');
    }

    try {
      this.callbacks.onStatus('searching', 'Abriendo selector de Bluetooth...');

      let requestParams = {
        optionalServices: this.KNOWN_SERVICES
      };

      if (options.acceptAll) {
        requestParams.acceptAllDevices = true;
      } else {
        requestParams.filters = [
          { namePrefix: 'Renpho' },
          { namePrefix: 'RENPHO' },
          { namePrefix: 'QN' },
          { namePrefix: 'ES-' },
          { namePrefix: 'CS' },
          { namePrefix: 'Elis' },
          { namePrefix: 'Scale' },
          { namePrefix: 'Yolanda' },
          { services: ['0000fff0-0000-1000-8000-00805f9b34fb'] },
          { services: ['0000ffe0-0000-1000-8000-00805f9b34fb'] },
          { services: ['00001a10-0000-1000-8000-00805f9b34fb'] },
          { services: ['0000181d-0000-1000-8000-00805f9b34fb'] }
        ];
      }

      this.device = await navigator.bluetooth.requestDevice(requestParams);

      this.callbacks.onStatus('connecting', `Conectando con ${this.device.name || 'Dispositivo'}...`);
      this.device.addEventListener('gattserverdisconnected', () => this.handleDisconnection());

      this.server = await this.device.gatt.connect();
      this.callbacks.onStatus('discovering', 'Explorando servicios y características...');

      await this.discoverServicesAndSetup();

      this.connected = true;
      this.callbacks.onStatus('connected', `¡Conectado a ${this.device.name || 'Báscula'}!`);

      // Intentar leer la batería en segundo plano
      this.readBatteryLevel();

    } catch (err) {
      this.connected = false;
      if (err.name === 'NotFoundError') {
        this.callbacks.onStatus('disconnected', 'Búsqueda cancelada o no se seleccionó dispositivo.');
      } else {
        this.callbacks.onError(err);
        this.callbacks.onStatus('disconnected', `Error: ${err.message}`);
      }
      throw err;
    }
  }

  async discoverServicesAndSetup() {
    const services = await this.server.getPrimaryServices();
    let serviceFound = null;
    let notifyChar = null;
    let writeChar = null;

    // Reset de estado para nueva sesión
    this.seenProtocolType = 0x00;
    this.weightScaleFactor = 100;
    this.scaleFactorKnown = false;
    this.handshakeStarted = false;

    // 1. Probar Familia QN-Scale Type 2 (0xFFF0 -> notify 0xFFF1, write 0xFFF2)
    for (const svc of services) {
      const uuid = svc.uuid.toLowerCase();
      if (uuid.includes('fff0')) {
        try {
          notifyChar = await svc.getCharacteristic('0000fff1-0000-1000-8000-00805f9b34fb');
          try {
            writeChar = await svc.getCharacteristic('0000fff2-0000-1000-8000-00805f9b34fb');
          } catch (e) { /* writeChar opcional */ }
          serviceFound = svc;
          this.protocol = 'QN-Scale (Type 2 - 0xFFF0)';
          break;
        } catch (e) {}
      }
    }

    // 2. Probar Familia QN-Scale Type 1 (0xFFE0 -> notify 0xFFE1, write 0xFFE3/0xFFE2)
    if (!notifyChar) {
      for (const svc of services) {
        const uuid = svc.uuid.toLowerCase();
        if (uuid.includes('ffe0')) {
          try {
            notifyChar = await svc.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');
            try {
              writeChar = await svc.getCharacteristic('0000ffe3-0000-1000-8000-00805f9b34fb');
            } catch (e) {
              try {
                writeChar = await svc.getCharacteristic('0000ffe2-0000-1000-8000-00805f9b34fb');
              } catch (e2) {}
            }
            serviceFound = svc;
            this.protocol = 'QN-Scale (Type 1 - 0xFFE0)';
            break;
          } catch (e) {}
        }
      }
    }

    // 3. Probar Familia LeFu / Chipsea (0x1A10 -> notify 0x2A10, write 0x2A11)
    if (!notifyChar) {
      for (const svc of services) {
        const uuid = svc.uuid.toLowerCase();
        if (uuid.includes('1a10')) {
          try {
            notifyChar = await svc.getCharacteristic('00002a10-0000-1000-8000-00805f9b34fb');
            try {
              writeChar = await svc.getCharacteristic('00002a11-0000-1000-8000-00805f9b34fb');
            } catch (e) {}
            serviceFound = svc;
            this.protocol = 'LeFu / Chipsea 55AA (0x1A10)';
            break;
          } catch (e) {}
        }
      }
    }

    // 4. Probar SIG Weight Scale estándar (0x181D -> notify 0x2A9D)
    if (!notifyChar) {
      for (const svc of services) {
        const uuid = svc.uuid.toLowerCase();
        if (uuid.includes('181d')) {
          try {
            notifyChar = await svc.getCharacteristic('00002a9d-0000-1000-8000-00805f9b34fb');
            serviceFound = svc;
            this.protocol = 'Bluetooth SIG Weight Scale (0x181D)';
            break;
          } catch (e) {}
        }
      }
    }

    // 5. Fallback Universal: Primera característica con Notify o Indicate
    if (!notifyChar) {
      for (const svc of services) {
        const chars = await svc.getCharacteristics();
        for (const ch of chars) {
          if (ch.properties.notify || ch.properties.indicate) {
            notifyChar = ch;
            serviceFound = svc;
            this.protocol = `Universal Fallback (${ch.uuid.slice(4, 8)})`;
            break;
          }
        }
        if (notifyChar) break;
      }
    }

    if (!notifyChar) {
      throw new Error('No se encontró una característica de notificación compatible en la báscula.');
    }

    // Buscar características de autenticación opcionales (AE00 -> AE01 / AE02)
    for (const svc of services) {
      if (svc.uuid.toLowerCase().includes('ae00')) {
        try {
          this.ae01Characteristic = await svc.getCharacteristic('0000ae01-0000-1000-8000-00805f9b34fb');
        } catch (e) {}
        try {
          this.ae02Characteristic = await svc.getCharacteristic('0000ae02-0000-1000-8000-00805f9b34fb');
          await this.ae02Characteristic.startNotifications();
          this.ae02Characteristic.addEventListener('characteristicvaluechanged', (e) => this.handleIncomingData(e));
        } catch (e) {}
      }
    }

    this.notifyCharacteristic = notifyChar;
    this.writeCharacteristic = writeChar;

    // Subscribirse a notificaciones de peso
    await this.notifyCharacteristic.startNotifications();
    this.notifyCharacteristic.addEventListener('characteristicvaluechanged', (e) => this.handleIncomingData(e));

    // Enviar comandos de inicialización y sincronización
    await this.sendInitializationCommands();
  }

  async writeCmd(data) {
    if (!this.writeCharacteristic) return;
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
    try {
      if (this.writeCharacteristic.properties.writeWithoutResponse) {
        await this.writeCharacteristic.writeValueWithoutResponse(bytes);
      } else {
        await this.writeCharacteristic.writeValue(bytes);
      }
    } catch (e) {
      try {
        await this.writeCharacteristic.writeValue(bytes);
      } catch (e2) {
        console.warn('writeCmd no disponible o rechazado:', e2);
      }
    }
  }

  async writeAe01(data) {
    if (!this.ae01Characteristic) return;
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
    try {
      await this.ae01Characteristic.writeValueWithoutResponse(bytes);
    } catch (e) {
      try {
        await this.ae01Characteristic.writeValue(bytes);
      } catch (e2) {}
    }
  }

  async sendInitializationCommands() {
    if (!this.writeCharacteristic) return;

    try {
      if (this.protocol.includes('QN-Scale')) {
        // Handshake inicial proactivo de QN:
        // 1. Enviar desbloqueo inicial
        const unlock1 = new Uint8Array([0x13, 0x09, 0x00, 0x01, 0x01, 0x02]);
        const unlock2 = new Uint8Array([0x13, 0x09, 0x00, 0x01, 0x10, 0x00, 0x00, 0x00, 0x2d]);
        await this.writeCmd(unlock1);
        await new Promise(r => setTimeout(r, 80));
        await this.writeCmd(unlock2);
        await new Promise(r => setTimeout(r, 80));

        // 2. Sincronización horaria inicial (2000-epoch)
        const secs = Math.floor(Date.now() / 1000) - 946684800;
        const timeCmd = [0x20, 0x08, 0x00, secs & 0xff, (secs >> 8) & 0xff, (secs >> 16) & 0xff, (secs >> 24) & 0xff, 0];
        timeCmd[7] = timeCmd.slice(0, 7).reduce((a, b) => a + b, 0) & 0xff;
        await this.writeCmd(timeCmd);
        await new Promise(r => setTimeout(r, 80));

        // 3. Comando 0x22 de activación de medición
        const startCmd = [0x22, 0x06, 0x00, 0x00, 0x03, 0x2b];
        await this.writeCmd(startCmd);
        const startCmd4 = [0x22, 0x04, 0x00, 0x26];
        await this.writeCmd(startCmd4);
        await new Promise(r => setTimeout(r, 80));

        // 4. Disparador A2 (Trigger anchor)
        const trigger = [0xa2, 0x06, 0x01, 0x25, 0xe4, 0x00]; // 9700 = 97.00 kg
        trigger[5] = trigger.slice(0, 5).reduce((a, b) => a + b, 0) & 0xff;
        await this.writeCmd(trigger);

      } else if (this.protocol.includes('LeFu')) {
        const startCmd = new Uint8Array([0x55, 0xaa, 0x90, 0x00, 0x04, 0x01, 0x00, 0x00, 0x00, 0x94]);
        await this.writeCmd(startCmd);
      }
    } catch (e) {
      console.warn('Comando de inicialización:', e);
    }
  }

  handleIncomingData(event) {
    const value = event.target.value;
    if (!value || value.byteLength === 0) return;

    this.packetsReceived++;
    const bytes = new Uint8Array(value.buffer);
    const hexArray = Array.from(bytes).map(b => b.toString(16).padStart(2, '0'));
    const hexStr = hexArray.join(' ');

    this.callbacks.onPacket({
      rawHex: hexStr,
      bytes: bytes,
      length: bytes.length,
      timestamp: new Date()
    });

    // 1. Manejo de tramas de control del protocolo QN
    this.handleControlFrames(bytes, hexStr);

    // 2. Decodificación de peso (SOLO para tramas de medición auténticas)
    const decoded = this.decodeWeight(bytes);
    if (decoded) {
      this.callbacks.onWeight({
        weightKg: decoded.weightKg,
        isStable: decoded.isStable,
        rawHex: hexStr,
        protocol: decoded.protocol || this.protocol
      });
    }
  }

  /**
   * Máquina de estados de control para básculas QN-Scale:
   * 0x12 -> Responde con AE01 init + 0x13 Config
   * 0x14 -> Responde con 0x20 Time Sync + A2 Perfil + AE01 auth "pass"
   * 0x21 -> Responde con A00D Perfil + 0x22 Inicio de medición + Disparador A2
   */
  async handleControlFrames(bytes, hexStr) {
    const opcode = bytes[0];

    // ─────────────────────────────────────────────────────────────
    // 0x12: Scale Info Frame (Información de la báscula y versión)
    // ─────────────────────────────────────────────────────────────
    if (opcode === 0x12 && bytes.length >= 10) {
      if (bytes.length >= 18 && bytes[1] === bytes.length) {
        // Variante extendida (Renpho ES-26M / ES-CS20M)
        this.seenProtocolType = (bytes.length >= 19 && bytes[2] !== 0xff) ? bytes[2] : 0x00;
        this.weightScaleFactor = 10;
      } else {
        // Variante clásica
        this.seenProtocolType = bytes[2] || 0x00;
        this.weightScaleFactor = (bytes[10] === 1) ? 100 : 10;
      }
      this.scaleFactorKnown = true;

      // Paso 1: AE01 Init
      await this.writeAe01([0xfe, 0xdc, 0xba, 0xc0, 0x06, 0x00, 0x02, 0x01, 0x01, 0xef]);
      await new Promise(r => setTimeout(r, 100));

      // Paso 2: 0x13 Configuración de unidades (0x01 = kg)
      const configCmd = [0x13, 0x09, this.seenProtocolType, 0x01, 0x10, 0x00, 0x00, 0x00, 0x00];
      configCmd[8] = configCmd.slice(0, 8).reduce((a, b) => a + b, 0) & 0xff;
      await this.writeCmd(configCmd);
      return;
    }

    // ─────────────────────────────────────────────────────────────
    // 0x14: Ready / Config ACK Frame (Báscula lista para sincronizar)
    // NOTA: Este paquete causaba el bug de 51 kg cuando se leía erróneamente como peso.
    // Aquí se responde apropiadamente y NUNCA se decodifica como peso.
    // ─────────────────────────────────────────────────────────────
    if (opcode === 0x14) {
      // Paso 1: 0x20 Sincronización horaria (segundos desde 2000-01-01 en little-endian)
      const secs = Math.floor(Date.now() / 1000) - 946684800;
      const timeCmd = [
        0x20, 
        0x08, 
        this.seenProtocolType, 
        secs & 0xff, 
        (secs >> 8) & 0xff, 
        (secs >> 16) & 0xff, 
        (secs >> 24) & 0xff, 
        0x00
      ];
      timeCmd[7] = timeCmd.slice(0, 7).reduce((a, b) => a + b, 0) & 0xff;
      await this.writeCmd(timeCmd);
      await new Promise(r => setTimeout(r, 100));

      // Paso 2: Perfil / Disparador A2 (openScale standard adult)
      const a2Cmd = [0xa2, 0x06, 0x01, 0x32, 30, 0x00];
      a2Cmd[5] = a2Cmd.slice(0, 5).reduce((a, b) => a + b, 0) & 0xff;
      await this.writeCmd(a2Cmd);

      // Paso 3: Autenticación AE01 "pass"
      await this.writeAe01([0x02, 0x70, 0x61, 0x73, 0x73]);
      return;
    }

    // ─────────────────────────────────────────────────────────────
    // 0x21: Config Request Frame (Báscula solicita inicio de medición)
    // ─────────────────────────────────────────────────────────────
    if (opcode === 0x21) {
      // Paso 1: Trama de perfil de usuario A00D
      const msg2 = [0xa0, 0x0d, 0x02, 0x01, 0x00, 0x08, 0x00, 0x21, 0x06, 0xb8, 0x04, 0x02, 0x00];
      msg2[12] = msg2.slice(0, 12).reduce((a, b) => a + b, 0) & 0xff;
      await this.writeCmd(msg2);
      await new Promise(r => setTimeout(r, 120));

      // Paso 2: 0x22 Inicio de medición (Start Measurement)
      const startCmd = [0x22, 0x06, this.seenProtocolType, 0x00, 0x03, 0x00];
      startCmd[5] = startCmd.slice(0, 5).reduce((a, b) => a + b, 0) & 0xff;
      await this.writeCmd(startCmd);

      // Enviar también variante corta de 4 bytes para compatibilidad total de firmware
      const startCmd4 = [0x22, 0x04, this.seenProtocolType, (0x26 + this.seenProtocolType) & 0xff];
      await this.writeCmd(startCmd4);
      await new Promise(r => setTimeout(r, 75));

      // Paso 3: Disparador de medición post-start (Anchor trigger)
      const trigger = [0xa2, 0x06, 0x01, 0x25, 0xe4, 0x00]; // 9700 = 97.00 kg
      trigger[5] = trigger.slice(0, 5).reduce((a, b) => a + b, 0) & 0xff;
      await this.writeCmd(trigger);
      return;
    }
  }

  /**
   * Resuelve el peso en kilogramos aplicando el divisor adecuado (100 o 10)
   * garantizando que coincida con el rango fisiológico humano.
   */
  resolveWeight(raw) {
    if (!raw || raw <= 0) return 0;
    const w100 = raw / 100;
    const w10 = raw / 10;

    // Si el factor se conoce explícitamente desde la trama 0x12:
    if (this.scaleFactorKnown) {
      const primary = raw / this.weightScaleFactor;
      if (primary >= 5 && primary <= 300) return primary;
    }

    // Si el divisor 100 da un peso válido estándar (5 a 300 kg):
    if (w100 >= 5 && w100 <= 300) {
      return w100;
    }

    // Si el divisor 10 da un peso válido estándar (5 a 300 kg):
    if (w10 >= 5 && w10 <= 300) {
      return w10;
    }

    return w100;
  }

  /**
   * Decodificador de peso de alta precisión:
   * Rechaza categóricamente cualquier paquete de control (0x12, 0x14, 0x21, 0xA1, etc.)
   * para evitar falsos positivos como el error de los "51 kg".
   */
  decodeWeight(bytes) {
    const len = bytes.length;
    if (len < 4) return null;

    const opcode = bytes[0];

    // Descartar explícitamente paquetes de control y señalización
    const CONTROL_OPCODES = [
      0x12, 0x13, 0x14, 0x15, 0x16, 0x1f, 0x20, 0x21, 0x22,
      0xa0, 0xa1, 0xa2, 0xa3, 0xa4, 0xa5
    ];
    if (CONTROL_OPCODES.includes(opcode)) {
      return null;
    }

    // ─────────────────────────────────────────────────────────────
    // CASO 1: Formato QN-Scale / Yolanda (Comienza con 0x10)
    // ─────────────────────────────────────────────────────────────
    if (opcode === 0x10) {
      // 1.1 Formato QN clásico de 10/11 bytes:
      // [0]=0x10, [3..4]=Peso Big Endian, [5]=Estabilidad (1=estable, 0=midiendo en vivo)
      if (len >= 6 && len <= 12) {
        const raw = (bytes[3] << 8) | bytes[4];
        const isStable = (bytes[5] === 0x01);
        const weight = this.resolveWeight(raw);

        if (weight > 0.5 && weight < 350) {
          // Si es estable, confirmar a la báscula con el ACK 0x1F
          if (isStable) {
            const ackCmd = [0x1f, 0x05, this.seenProtocolType, 0x10, 0x00];
            ackCmd[4] = ackCmd.slice(0, 4).reduce((a, b) => a + b, 0) & 0xff;
            this.writeCmd(ackCmd);
          }
          return { weightKg: weight, isStable, protocol: 'QN-Scale (10-byte)' };
        }
      }

      // 1.2 Formato QN ES-30M de 13 a 16 bytes:
      // [4]=estado (0x00=midiendo, 0x01 o 0x02=estable), [5..6]=Peso
      if (len >= 13 && len <= 16) {
        const state = bytes[4];
        const raw = (bytes[5] << 8) | bytes[6];
        const isStable = (state === 0x02 || state === 0x01);
        const weight = this.resolveWeight(raw);

        if (weight > 0.5 && weight < 350) {
          if (isStable) {
            const ackCmd = [0x1f, 0x05, this.seenProtocolType, 0x10, 0x00];
            ackCmd[4] = ackCmd.slice(0, 4).reduce((a, b) => a + b, 0) & 0xff;
            this.writeCmd(ackCmd);
          }
          return { weightKg: weight, isStable, protocol: 'QN-Scale (14-byte)' };
        }
      }

      // 1.3 Formato QN de 20 bytes (Arboleaf / Elis / CS20M):
      // [5..6]=Peso Big Endian / 100, [3]=Estado (0x00 midiendo, 0x01/0x02 estable)
      if (len >= 19) {
        const raw = (bytes[5] << 8) | bytes[6];
        const weight = raw / 100;
        const status = bytes[3];
        const isStable = (status === 0x01 || status === 0x02 || bytes[4] === 0x01);

        if (weight > 0.5 && weight < 350) {
          if (isStable) {
            const ackCmd = [0x1f, 0x05, this.seenProtocolType, 0x10, 0x00];
            ackCmd[4] = ackCmd.slice(0, 4).reduce((a, b) => a + b, 0) & 0xff;
            this.writeCmd(ackCmd);
          }
          return { weightKg: weight, isStable, protocol: 'QN-Scale (20-byte)' };
        }
      }
    }

    // ─────────────────────────────────────────────────────────────
    // CASO 2: Registro histórico almacenado QN (Opcode 0x23)
    // ─────────────────────────────────────────────────────────────
    if (opcode === 0x23 && len >= 10) {
      // Registro en bytes [6..7] o [8..9]
      const raw1 = (bytes[6] << 8) | bytes[7];
      const w1 = raw1 / 100;
      if (w1 >= 10 && w1 <= 250) {
        return { weightKg: w1, isStable: true, protocol: 'QN-Scale (0x23 Historial)' };
      }

      const raw2 = (bytes[8] << 8) | bytes[9];
      const w2 = raw2 / 100;
      if (w2 >= 10 && w2 <= 250) {
        return { weightKg: w2, isStable: true, protocol: 'QN-Scale (0x23 Historial)' };
      }
    }

    // ─────────────────────────────────────────────────────────────
    // CASO 3: Formato LeFu / Chipsea 55AA (ES-26BB, R-A012, R-MSC04)
    // ─────────────────────────────────────────────────────────────
    if (bytes[0] === 0x55 && bytes[1] === 0xaa) {
      const cmd = bytes[2];
      // Live frame cmd 0x14: [5]=tipo (0x01 o 0x11 = final), peso en [6..7]
      if (cmd === 0x14 && len >= 8) {
        const isStable = (bytes[5] === 0x01 || bytes[5] === 0x11);
        let raw = 0;
        if (len >= 10 && bytes[6] === 0) {
          raw = (bytes[6] << 24) | (bytes[7] << 16) | (bytes[8] << 8) | bytes[9];
        } else {
          raw = (bytes[6] << 8) | bytes[7];
        }
        const weight = raw / 100;
        if (weight > 0.5 && weight < 350) {
          return { weightKg: weight, isStable, protocol: 'LeFu 55AA (0x14)' };
        }
      }

      // Live frame cmd 0x21 o 0x24 (R-MSC04):
      if ((cmd === 0x21 || cmd === 0x24) && len >= 8) {
        const raw = (bytes[6] << 8) | bytes[7];
        const weight = raw / 100;
        const isStable = (cmd === 0x24);
        if (weight > 0.5 && weight < 350) {
          return { weightKg: weight, isStable, protocol: `LeFu 55AA (0x${cmd.toString(16)})` };
        }
      }
    }

    // ─────────────────────────────────────────────────────────────
    // CASO 4: Formato Bluetooth SIG Estándar (0x2A9D)
    // ─────────────────────────────────────────────────────────────
    if (this.protocol.includes('SIG')) {
      const flags = bytes[0];
      const isLbs = (flags & 0x01) === 1;
      const raw = bytes[1] | (bytes[2] << 8); // Little Endian
      let weight = isLbs ? (raw * 0.1 * 0.453592) : (raw * 0.05);
      if (weight > 350) weight = raw * 0.005;
      if (weight > 0.5 && weight < 350) {
        return { weightKg: weight, isStable: true, protocol: 'Bluetooth SIG' };
      }
    }

    return null;
  }

  async readBatteryLevel() {
    try {
      const battSvc = await this.server.getPrimaryService('0000180f-0000-1000-8000-00805f9b34fb');
      const battChar = await battSvc.getCharacteristic('00002a19-0000-1000-8000-00805f9b34fb');
      const val = await battChar.readValue();
      const level = val.getUint8(0);
      this.callbacks.onBattery(level);
    } catch (e) {
      // Nivel de batería opcional
    }
  }

  handleDisconnection() {
    this.connected = false;
    this.callbacks.onStatus('disconnected', 'Báscula desconectada.');
    this.callbacks.onDisconnect();
  }

  disconnect() {
    if (this.device && this.device.gatt.connected) {
      this.device.gatt.disconnect();
    }
    this.connected = false;
    this.callbacks.onStatus('disconnected', 'Desconectado por el usuario.');
    this.callbacks.onDisconnect();
  }
}

window.RenphoScaleDriver = RenphoScaleDriver;
