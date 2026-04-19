const { Client } = require('bedrock-protocol');
const express = require('express');

const app = express();
app.get('/', (req, res) => {
  res.send('<h2>✅ MC AFK Bot Running!</h2>');
});
app.listen(3000, () => console.log('🌐 Keep-alive server running!'));

const config = {
  host: 'mrgrill20.aternos.me',
  port: 23782,
  username: 'AFKBot',
  version: '1.26.0',
  offline: true
};

let client;
let afkTimer;

function createBot() {
  console.log('🔄 Connecting to mrgrill20.aternos.me:23782...');
  try {
    client = new Client(config);

    client.on('join', () => {
      console.log('✅ Bot connected!');
      startAntiAFK();
    });

    client.on('disconnect', (packet) => {
      console.log('❌ Disconnected:', packet?.message || 'Unknown');
      stopAntiAFK();
      setTimeout(createBot, 10000);
    });

    client.on('error', (err) => {
      console.log('⚠️ Error:', err.message);
      stopAntiAFK();
      setTimeout(createBot, 10000);
    });

  } catch (err) {
    console.log('❌ Failed:', err.message);
    setTimeout(createBot, 10000);
  }
}

function startAntiAFK() {
  stopAntiAFK();
  let toggle = false;
  afkTimer = setInterval(() => {
    try {
      toggle = !toggle;
      client.queue('player_action', {
        action: toggle ? 'jump' : 'stop_sneak',
        position: { x: 0, y: 0, z: 0 },
        result_position: { x: 0, y: 0, z: 0 },
        face: 0,
        entity_id: 0n
      });
      console.log('🏃 Anti-AFK active!');
    } catch (e) {
      console.log('⚠️ Anti-AFK error:', e.message);
    }
  }, 30000);
}

function stopAntiAFK() {
  if (afkTimer) { clearInterval(afkTimer); afkTimer = null; }
}

createBot();
