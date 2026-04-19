const { Client } = require('bedrock-protocol');
const express = require('express');

const app = express();
app.get('/', (req, res) => {
  res.send('<h2>✅ MC AFK Bot Running!</h2>');
});
app.listen(process.env.PORT || 3000, () => {
  console.log('🌐 Keep-alive server running!');
});

const config = {
  host: 'mrgrill20.aternos.me',
  port: 23782,
  username: 'AFKBot',
  version: '1.26.14',
  offline: true
};

let client;
let afkTimer;
let reconnectCount = 0;

function createBot() {
  reconnectCount++;
  console.log(`🔄 Connection attempt #${reconnectCount}...`);

  try {
    client = new Client(config);

    client.on('join', () => {
      console.log('✅ Bot connected! Server staying online!');
      startAntiAFK();
    });

    client.on('spawn', () => {
      console.log('📍 Bot spawned in world!');
    });

    client.on('disconnect', (packet) => {
      console.log('❌ Disconnected:', JSON.stringify(packet));
      stopAntiAFK();
      setTimeout(createBot, 10000);
    });

    client.on('error', (err) => {
      console.log('⚠️ Error:', err.message);
      stopAntiAFK();
      setTimeout(createBot, 15000);
    });

    client.on('close', () => {
      console.log('🔌 Connection closed. Reconnecting...');
      stopAntiAFK();
      setTimeout(createBot, 10000);
    });

  } catch (err) {
    console.log('❌ Failed to create bot:', err.message);
    setTimeout(createBot, 15000);
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
  if (afkTimer) {
    clearInterval(afkTimer);
    afkTimer = null;
  }
}

createBot();
