const {
    MessageEmbed,
    MessageAttachment, Discord
  } = require("discord.js");
  const { MessageButton, MessageActionRow } = require('discord-buttons')
  const config = require("../../botconfig/config.json");
  var ee = require("../../botconfig/embed.json");
  const emoji = require(`../../botconfig/emojis.json`);
  const fetch = require("node-fetch");
  module.exports = {
    name: "fishington",
    category: "MiniGames",
    aliases: ["fish", "Fishington"],
    description: "Generate a link to play Fishington (through discord)",
    usage: "Fishington, Click on the button!",

    run: async (client, message, args, cmduser, text, prefix, es) => {
      try {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${emoji.msg.ERROR} Error | Please join a Voice Channel first`)
        );
        if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) {
          const nochannel = new MessageEmbed()
          .setDescription(`I need \`CREATE_INSTANT_INVITE\` permission!`)
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          return message.channel.send(nochannel);
        }
  
        fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: "814288819477020702", // fishington
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${process.env.token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(invite => {
                if (!invite.code) {
                  return message.channel.send(new MessageEmbed()
                  .setDescription(`Cannot start the Fishington, please retry`)
                  .setColor(ee.wrongcolor)
                  .setFooter(ee.footertext, es.footericon));
                }

      const embed = new MessageEmbed()
              .setDescription(`***\`\`\`yaml\nClick on the below button to join!\`\`\`***`)
              .setColor(ee.color)

      const join = new MessageButton().setStyle(`url`).setEmoji("🐟").setLabel(`Play Fishington`).setURL(`https://discord.com/invite/${invite.code}`)
        
      const row = new MessageActionRow()
      .addComponent([join])
      message.channel.send({components: [row], embed: embed})
            
            })
        } catch (e) {
            console.log(String(e.stack).bgRed)
            return message.channel.send(new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`${emoji.msg.ERROR} An error occurred`)
                .setDescription(`\`\`\`${String(JSON.stringify(e)).substr(0, 2000)}\`\`\``)
            );
        }
    }
  }
