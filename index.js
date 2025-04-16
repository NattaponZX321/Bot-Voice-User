const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, Events } = require('discord.js');
const fs = require('fs');
const axios = require('axios');
const WebSocket = require('ws');

const botToken = " "; // ใส่ Token บอท
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const usersFile = "users.json";
if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, JSON.stringify({}));

function loadUsers() {
    return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
}

function saveUsers(data) {
    fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));
}

function startWebSocket(userToken, serverId, channelId) {
    let ws;
    let heartbeatInterval;
    
    function connect() {
        ws = new WebSocket("wss://gateway.discord.gg/?v=8&encoding=json");

        ws.on("open", () => {
            console.log(`✅ เชื่อมต่อ WebSocket สำหรับ User: ${userToken}`);
            
            ws.send(JSON.stringify({
                op: 2,
                d: {
                    token: userToken,
                    properties: {
                        "$os": "windows",
                        "$browser": "Discord",
                        "$device": "desktop"
                    }
                }
            }));

            ws.send(JSON.stringify({
                op: 4,
                d: {
                    guild_id: serverId,
                    channel_id: channelId,
                    self_mute: false,
                    self_deaf: true,
                    self_stream: false,
                    self_video: false
                }
            }));

            // ส่ง Heartbeat ทุก 30 วินาที
            heartbeatInterval = setInterval(() => {
                ws.send(JSON.stringify({ op: 1, d: null }));
            }, 30000);
        });

        ws.on("message", (message) => {
            console.log(`📩 Message: ${message}`);
        });

        ws.on("error", (error) => {
            console.error(`❌ WebSocket Error: ${error}`);
        });

        ws.on("close", () => {
            console.log(`🔴 WebSocket หลุด! พยายามเชื่อมต่อใหม่ใน 5 วินาที...`);
            clearInterval(heartbeatInterval);
            setTimeout(connect, 5000);
        });
    }

    connect();
}

client.once('ready', () => {
    console.log(`✅ บอทออนไลน์แล้ว: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.content === "!setup" && !message.author.bot) {
        const button = new ButtonBuilder()
            .setCustomId('setup')
            .setLabel('🔧 ตั้งค่า')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);

        const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle("🔊 ระบบออนห้องเสียง")
            .setDescription("🧩ระบบออนห้องเสียงสำหรับ สายออน")
            .setImage("https://img5.pic.in.th/file/secure-sv1/1000152468.gif")
            .setFooter({ text: "เทสระบบจ้า" });

        await message.reply({ embeds: [embed], components: [row] });
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "setup") {
        const modal = new ModalBuilder()
            .setCustomId("setupModal")
            .setTitle("🔧 ตั้งค่าข้อมูล");

        const tokenInput = new TextInputBuilder()
            .setCustomId("usertoken")
            .setLabel("🔑 ใส่ Token")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const serverIdInput = new TextInputBuilder()
            .setCustomId("serverId")
            .setLabel("🏠 Server ID")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const channelIdInput = new TextInputBuilder()
            .setCustomId("channelId")
            .setLabel("🔊 Voice Channel ID")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const row1 = new ActionRowBuilder().addComponents(tokenInput);
        const row2 = new ActionRowBuilder().addComponents(serverIdInput);
        const row3 = new ActionRowBuilder().addComponents(channelIdInput);

        modal.addComponents(row1, row2, row3);
        await interaction.showModal(modal);
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === "setupModal") {
        const usertoken = interaction.fields.getTextInputValue("usertoken");
        const serverId = interaction.fields.getTextInputValue("serverId");
        const channelId = interaction.fields.getTextInputValue("channelId");

        const headers = { Authorization: usertoken, "Content-Type": "application/json" };

        try {
            const userInfo = await axios.get("https://discord.com/api/v9/users/@me", { headers });
            const { username, discriminator, id } = userInfo.data;

            let users = loadUsers();
            users[interaction.user.id] = { usertoken, serverId, channelId };
            saveUsers(users);

            startWebSocket(usertoken, serverId, channelId);

            const embed = new EmbedBuilder()
                .setTitle("🧩 ออนห้องสำเร็จ")
                .setColor("#2ECC71")
                .setImage("https://img2.pic.in.th/pic/1000152469.gif")
                .setDescription(`✅ **ตั้งค่าเรียบร้อยแล้วครับ <@${interaction.user.id}>**\n🎤 เชื่อมต่อ Voice Channel **สำเร็จ**`);

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });

        } catch (error) {
            await interaction.reply({
                content: "❌ **Token ไม่ถูกต้อง โปรดตรวจสอบใหม่**",
                ephemeral: true
            });
        }
    }
});

client.login(botToken);
//โค้ดนี้พัฒนาโดยbot Nattapon
//https://discord.gg/CTNjjjw4vW
