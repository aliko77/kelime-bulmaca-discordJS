const Discord = require('discord.js');
const fs = require('fs');
const request = require('request');
const settings_path = 'Veriler/kelime_bulmaca/settings.json';

module.exports = (client, message) => {
  if(message.channel.type === 'dm')return;
	if(message.author.bot)return;
	if (message.content.indexOf(client.config.prefix) == 0){
        const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        const cmd = client.commands.get(command);
        if (!cmd) return;
        cmd.execute(message,args);
    }
    else{
        if(message.content.indexOf('.') == 0)return;
        var settings_channels = global.fullarr.channels;
        var settings_game_bool = global.fullarr.game_bool;
        var settings_son_kelime_yazan = global.fullarr.son_kelime_yazan;
        var settings_son_kelime = global.fullarr.son_kelime;
        var settings_kullanilan_kelimeler_guilds = global.fullarr.kullanilan_kelimeler_guilds;
        var settings_puanlar_guilds = global.fullarr.puanlar;
        var puanlar_guilds_index = settings_puanlar_guilds.findIndex(find => find.guild_id === message.guild.id);
        var puanlar_client_index = settings_puanlar_guilds[puanlar_guilds_index].puanlar.findIndex(find => find.client_id === message.author.id);
        let kanal_index = settings_channels.findIndex(find => find.guild_id === message.guild.id);
        let game_bool_index = settings_game_bool.findIndex(find => find.guild_id === message.guild.id);
        let son_kelime_index = settings_son_kelime.findIndex(find => find.guild_id === message.guild.id);
        let son_kelime_yazan_index = settings_son_kelime_yazan.findIndex(find => find.guild_id === message.guild.id);
        let kullanilan_kelimeler_guilds_index = settings_kullanilan_kelimeler_guilds.findIndex(find => find.guild_id === message.guild.id);
        if(settings_game_bool[game_bool_index].game_bool == 'true' && settings_channels[kanal_index].channel_id == message.channel.id){
            let sonharf = message.content.length;
            let kelime = message.content.toLowerCase();
            sonharf = kelime.charAt(sonharf - 1);
            if(settings_son_kelime_yazan[son_kelime_yazan_index].son_kelime_yazan == message.author.id){
                const embed = new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL(),"https://leaderclan.com")
                    .setDescription(`${message.author.username}, üst üste yazamazsınız.`)
                    .setColor("#FFFFFF");
                message.channel.send(embed).then(del => del.delete({timeout:2000} , message.delete({timeout:2000})));
                return;
            }
            if(settings_son_kelime[son_kelime_index].son_harf && settings_son_kelime[son_kelime_index].son_harf !== kelime[0]){
                let stngssonharf = settings_son_kelime[son_kelime_index].son_harf;
                const embed = new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL(),"https://leaderclan.com")
                    .setDescription(`**${kelime}**, bu kelime **${stngssonharf}** ile başlamıyor.`)
                    .setColor("#FFFFFF");
                message.channel.send(embed).then(del => del.delete({timeout:2000} , message.delete({timeout:2000})));
                return;
            }
            if(settings_kullanilan_kelimeler_guilds[kullanilan_kelimeler_guilds_index].kullanilan_kelimeler.includes(kelime)){
                const embed = new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL(),"https://leaderclan.com")
                    .setDescription(`**${kelime}**, bu kelime daha önce kullanılmış.`)
                    .setColor("#FFFFFF");
                message.channel.send(embed).then(del => del.delete({timeout:2000} , message.delete({timeout:2000})));
                return;
            }
            if(sonharf == 'ğ' && settings_kullanilan_kelimeler_guilds[kullanilan_kelimeler_guilds_index].kullanilan_kelimeler.length < 3000){
                let kalan_kelime = 3000 - settings_kullanilan_kelimeler_guilds[kullanilan_kelimeler_guilds_index].kullanilan_kelimeler.length;
                const embed = new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL(),"https://leaderclan.com")
                    .setDescription(`Oyun bitirici kelimeleri yazmak için biraz daha oynamanız gerekmekte.\nKalan kelime sayısı ${kalan_kelime}`)
                    .setColor("#FFFFFF");
                message.channel.send(embed).then(del => del.delete({timeout:2000} , message.delete({timeout:2000})));
                return;
            }
            let link = encodeURI("https://sozluk.gov.tr/gts?ara=" + kelime); 
            request.post(
                link,
                {
                    json: {key: 'value',},
                },
                (error, res, body) => {
                    if (error) {
                        console.error(error);
                        const embed = new Discord.MessageEmbed()
                            .setAuthor(message.author.username, message.author.avatarURL(),"https://leaderclan.com")
                            .setDescription(`Bir sorun oluştu lütfen yöneticiyle iletişime geçin. ${error}`)
                            .setColor("#FFFFFF");
                        message.channel.send(embed);
                        return;
                    }
                    if(body.error){
                        const embed = new Discord.MessageEmbed()
                            .setAuthor(message.author.username, message.author.avatarURL(),"https://leaderclan.com")
                            .setDescription(`**${kelime}**, bu kelime **Türk Dil Kurumunda** bulunamadı.`)
                            .setColor("#FFFFFF");
                            message.channel.send(embed).then(del => del.delete({timeout:2000} , message.delete({timeout:2000})));
                        return;
                    }
                    if(settings_kullanilan_kelimeler_guilds[kullanilan_kelimeler_guilds_index].kullanilan_kelimeler.includes(kelime)){
                        const embed = new Discord.MessageEmbed()
                            .setAuthor(message.author.username, message.author.avatarURL(),"https://leaderclan.com")
                            .setDescription(`**${kelime}**, bu kelime daha önce kullanılmış.`)
                            .setColor("#FFFFFF");
                        message.channel.send(embed).then(del => del.delete({timeout:2000} , message.delete({timeout:2000})));
                        return;
                    }
		    settings_kullanilan_kelimeler_guilds[kullanilan_kelimeler_guilds_index].kullanilan_kelimeler.push(kelime);
                    message.react('✔️');
                    if(puanlar_client_index == -1){
                        settings_puanlar_guilds[puanlar_guilds_index].puanlar.push({
                            client_id : message.author.id,
                            puan : 3
                        });
                    }else{
                        settings_puanlar_guilds[puanlar_guilds_index].puanlar[puanlar_client_index].puan += 3;
                    }
                    settings_son_kelime_yazan[son_kelime_yazan_index].son_kelime_yazan = message.author.id;
                    settings_son_kelime[son_kelime_index].son_kelime = kelime;
                    settings_son_kelime[son_kelime_index].son_harf = sonharf;
                    if(sonharf == 'ğ' && settings_kullanilan_kelimeler_guilds[kullanilan_kelimeler_guilds_index].kullanilan_kelimeler.length >= 3000){
                        const embed = new Discord.MessageEmbed()
                            .setAuthor(message.author.username, message.author.avatarURL(),"https://leaderclan.com")
                            .setDescription(`${message.author},  Kilit kelimeyi yazarak oyunu bitirdi tebrikler birazdan yeni oyun başlayacak <3.`)
                            .setColor("#FFFFFF");
                        message.channel.send(embed);
                        settings_puanlar_guilds[puanlar_guilds_index].puanlar[puanlar_client_index].puan += 50;
                        settings_game_bool[game_bool_index].game_bool = 'false';
                        fs.writeFile(settings_path, JSON.stringify(global.fullarr, null, 2), 'utf-8', function(err) {
                            if (err) throw err;
                            setTimeout(() => {
                                let rastgele_kelimeler = settings_kullanilan_kelimeler_guilds[kullanilan_kelimeler_guilds_index].kullanilan_kelimeler;
                                let sansli_isim = rastgele_kelimeler[Math.floor(Math.random() * (rastgele_kelimeler.length - 1))];
                                let sonharf = sansli_isim.length;
                                sonharf = sansli_isim.charAt(sonharf - 1);
                                delete settings_son_kelime_yazan[son_kelime_yazan_index].son_kelime_yazan;
                                settings_son_kelime[son_kelime_index].son_kelime = sansli_isim;
                                settings_son_kelime[son_kelime_index].son_harf = sonharf;
                                settings_kullanilan_kelimeler_guilds[kullanilan_kelimeler_guilds_index].kullanilan_kelimeler = [sansli_isim];
                                settings_game_bool[game_bool_index].game_bool = 'true';
                                fs.writeFile(settings_path, JSON.stringify(global.fullarr, null, 2), 'utf-8', function(err) {
                                    if (err) throw err;
                                    const embed = new Discord.MessageEmbed()
                                        .setTitle('Yeni Kelime Oyunu')
                                        .setDescription(`Yeni oyun başladı herkese iyi eğlenceler\nBaşlangıç kelimesi: **${sansli_isim}**.`)
                                        .setColor("#FFFFFF");
                                    message.channel.send(embed);
                                });
                            }, 5000);
                        });
                        return;
                    }
                    fs.writeFile(settings_path, JSON.stringify(global.fullarr, null, 2), 'utf-8', function(err) {
                        if (err) throw err;
                    });
                }
            );
        }
    }
};
