// UKCW session relay
//
// Watches the sessions channel and forwards every announcement to the website,
// so the status panel follows whatever bot (ERM, Melonly, a custom one) posts
// the startup / full / shutdown embeds. Also adds a /session command for staff
// to set the status by hand.

import { Client, Events, GatewayIntentBits, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

const { DISCORD_TOKEN, SESSION_CHANNEL_ID, SITE_URL, SESSION_WEBHOOK_SECRET } = process.env;
for (const [k, v] of Object.entries({ DISCORD_TOKEN, SESSION_CHANNEL_ID, SITE_URL, SESSION_WEBHOOK_SECRET })) {
  if (!v) throw new Error(`Missing ${k}`);
}

const endpoint = new URL("/api/session", SITE_URL).toString();

async function push(body) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${SESSION_WEBHOOK_SECRET}` },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  console.log(`[relay] ${res.status}`, json.session?.state ?? (json.ignored ? "ignored" : json.error));
  return res.ok;
}

function toPayload(message) {
  return {
    content: message.content,
    embeds: message.embeds.map((e) => ({
      title: e.title ?? undefined,
      description: e.description ?? undefined,
      fields: e.fields.map((f) => ({ name: f.name, value: f.value })),
    })),
  };
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const command = new SlashCommandBuilder()
  .setName("session")
  .setDescription("Update the session status shown on the website")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
  .addStringOption((o) =>
    o
      .setName("state")
      .setDescription("Current state")
      .setRequired(true)
      .addChoices(
        { name: "Startup vote", value: "vote" },
        { name: "Startup / in session", value: "active" },
        { name: "Full", value: "full" },
        { name: "Shutdown", value: "offline" },
      ),
  )
  .addIntegerOption((o) => o.setName("players").setDescription("Players in server").setMinValue(0).setMaxValue(49))
  .addStringOption((o) => o.setName("code").setDescription("Private server code"));

client.once(Events.ClientReady, async (c) => {
  await c.application.commands.set([command.toJSON()]);
  console.log(`[relay] ready as ${c.user.tag}, watching #${SESSION_CHANNEL_ID}`);
});

client.on(Events.MessageCreate, (message) => {
  if (message.channelId !== SESSION_CHANNEL_ID) return;
  push(toPayload(message)).catch((err) => console.error("[relay]", err));
});

// Some bots edit the startup embed in place (e.g. to "Session Full").
client.on(Events.MessageUpdate, async (_old, message) => {
  if (message.channelId !== SESSION_CHANNEL_ID) return;
  if (message.partial) message = await message.fetch();
  push(toPayload(message)).catch((err) => console.error("[relay]", err));
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand() || interaction.commandName !== "session") return;
  const ok = await push({
    state: interaction.options.getString("state", true),
    players: interaction.options.getInteger("players") ?? undefined,
    joinCode: interaction.options.getString("code") ?? undefined,
    host: interaction.member?.displayName ?? interaction.user.username,
  }).catch(() => false);
  await interaction.reply({ content: ok ? "Website status updated." : "Couldn't reach the website.", ephemeral: true });
});

client.login(DISCORD_TOKEN);
