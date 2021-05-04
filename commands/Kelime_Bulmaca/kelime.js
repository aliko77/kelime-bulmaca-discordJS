const Discord = require('discord.js');
const fs = require('fs');
const settings_path = 'Veriler/kelime_bulmaca/settings.json';
const request = require('request');
module.exports = {
	name: 'kelime',
	description: 'Kelime oyunu.',
	execute(message, args) {
		if(!args[0])return;
        var settings_channels = global.fullarr.channels;
        var settings_game_bool = global.fullarr.game_bool;
        let kanal_index = settings_channels.findIndex(find => find.guild_id === message.guild.id);
        let game_bool_index = settings_game_bool.findIndex(find => find.guild_id === message.guild.id);
        let game_bool_value = settings_game_bool[game_bool_index].game_bool;
        if(!settings_channels[kanal_index].channel_id){
            if(!message.member.hasPermission('ADMINISTRATOR')){
                message.reply('Bu komutu kullanamazsınız.').then(msg => msg.delete({timeout:5000}));
                message.delete({timeout:5000});
                return;
            }
            let mention_kanal = message.mentions.channels.first();
            if(mention_kanal){
                settings_channels[kanal_index].channel_id = mention_kanal.id;
                const embed = new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL(),"https://leaderclan.com")
                    .setDescription('Kelime kanalı ayarlandı.')
                    .addField('Kelime Kanalı', mention_kanal)
                    .setColor("#FFFFFF");
                message.channel.send(embed);
                fs.writeFile(settings_path, JSON.stringify(global.fullarr, null, 2), 'utf-8', function(err) {
                    if (err) throw err;
                });
                return;
            }
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL(),"https://leaderclan.com")
                .setDescription('Kelime oyunu fonksiyonları için bir kanal ayarlanmalı.\nAyarlamak için **!kelime kanal #kanal**')
                .setColor("#FFFFFF");
            message.channel.send(embed);
            return;
        }
        switch (args[0]) {
            case 'kanal':
                if(!message.member.hasPermission('ADMINISTRATOR')){
                    message.reply('Bu komutu kullanamazsınız.').then(msg => msg.delete({timeout:5000}));
                    message.delete({timeout:5000});
                    return;
                }
                if(settings_channels[kanal_index].channel_id && !args[1]){
                    let available_channel = message.guild.channels.cache.get(settings_channels[kanal_index].channel_id);
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL(),"https://leaderclan.com")
                        .addField('Ayarlı Kelime Kanalı', available_channel)
                        .setFooter('Değiştirmek için !kelime kanal #kanal')
                        .setColor("#FFFFFF");
                    message.channel.send(embed);
                    return;
                }
                if(settings_channels[kanal_index].channel_id && args[1]){
                    let mention_kanal = message.mentions.channels.first();
                    if(!mention_kanal){
                        const embed = new Discord.MessageEmbed()
                            .setAuthor(message.author.username, message.author.avatarURL(),"https://leaderclan.com")
                            .setDescription('Kullanım: !kelime kanal #kanal')
                            .setColor("#FFFFFF");
                        message.channel.send(embed);
                        return;
                    }
                    settings_channels[kanal_index].channel_id = mention_kanal.id;
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL(),"https://leaderclan.com")
                        .setDescription('Kelime kanalı güncellendi.')
                        .addField('Yeni Kelime Kanalı', mention_kanal)
                        .setColor("#FFFFFF");
                    message.channel.send(embed);
                    fs.writeFile(settings_path, JSON.stringify(global.fullarr, null, 2), 'utf-8', function(err) {
                        if (err) throw err;
                    });
                    return;
                }
            break;
            case 'başlat':
                if(settings_channels[kanal_index].channel_id && settings_channels[kanal_index].channel_id != message.channel.id){
                    return;
                }
                if(!message.member.hasPermission('ADMINISTRATOR')){
                    message.reply('Bu komutu kullanamazsınız.').then(msg => msg.delete({timeout:5000}));
                    message.delete({timeout:5000});
                    return;
                }
                if(game_bool_index && game_bool_value == 'true'){
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL(),"https://leaderclan.com")
                        .setDescription('Kelime oyunu zaten aktif.')
                        .setColor("#FFFFFF");
                    message.channel.send(embed);
                    return;
                }
                settings_game_bool[game_bool_index].game_bool = 'true';
                const embed = new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL(),"https://leaderclan.com")
                    .setDescription('Kelime oyunu aktif hale getirildi.')
                    .setColor("#FFFFFF");
                message.channel.send(embed);
                fs.writeFile(settings_path, JSON.stringify(global.fullarr, null, 2), 'utf-8', function(err) {
                    if (err) throw err;
                });
            break;
            case 'durdur':
                if(settings_channels[kanal_index].channel_id && settings_channels[kanal_index].channel_id != message.channel.id){
                    return;
                }
                if(!message.member.hasPermission('ADMINISTRATOR')){
                    message.reply('Bu komutu kullanamazsınız.').then(msg => msg.delete({timeout:5000}));
                    message.delete({timeout:5000});
                    return;
                }
                if(game_bool_index && game_bool_value == 'false'){
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL(),"https://leaderclan.com")
                        .setDescription('Kelime oyunu zaten deaktif.')
                        .setColor("#FFFFFF");
                    message.channel.send(embed);
                    return;
                }
                settings_game_bool[game_bool_index].game_bool = 'false';
                const embeds = new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL(),"https://leaderclan.com")
                    .setDescription('Kelime oyunu deaktif hale getirildi.')
                    .setColor("#FFFFFF");
                message.channel.send(embeds);
                fs.writeFile(settings_path, JSON.stringify(global.fullarr, null, 2), 'utf-8', function(err) {
                    if (err) throw err;
                });
            break;
            case 'sıfırla':
                if(settings_channels[kanal_index].channel_id && settings_channels[kanal_index].channel_id != message.channel.id){
                    return;
                }
                if(!message.member.hasPermission('ADMINISTRATOR')){
                    message.reply('Bu komutu kullanamazsınız.').then(msg => msg.delete({timeout:5000}));
                    message.delete({timeout:5000});
                    return;
                }
                settings_game_bool[game_bool_index].game_bool = 'false';
                fs.writeFile(settings_path, JSON.stringify(global.fullarr, null, 2), 'utf-8', function(err) {
                    if (err) throw err;
                    var settings_son_kelime_yazan = global.fullarr.son_kelime_yazan;
                    var settings_son_kelime = global.fullarr.son_kelime;
                    var settings_kullanilan_kelimeler_guilds = global.fullarr.kullanilan_kelimeler_guilds;
                    let son_kelime_index = settings_son_kelime.findIndex(find => find.guild_id === message.guild.id);
                    let son_kelime_yazan_index = settings_son_kelime_yazan.findIndex(find => find.guild_id === message.guild.id);
                    let kullanilan_kelimeler_guilds_index = settings_kullanilan_kelimeler_guilds.findIndex(find => find.guild_id === message.guild.id);                    
                    let rastgele_kelimeler = ["selam","merhaba","soğan","çayda çıra","kaset","kusmuk","saat","mektep","asparagas","rastgele","çay","vişne suyu","kestane","kazak","tarak","yarak","yara","para","kesici"];
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
                            .setDescription(`Oyun Sıfırlandı ve yeni oyun başlatıldı herkese iyi eğlenceler\nBaşlangıç kelimesi: **${sansli_isim}**.`)
                            .setColor("#FFFFFF");
                        message.channel.send(embed);
                    });
                });
            break;
            case 'anlam':
                var kelime = args.slice(1).join(' ');
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
                            const embeds = new Discord.MessageEmbed()
                                .setTitle('Nedir ?')
                                .setDescription(`**${kelime}**, bu kelime **Türk Dil Kurumunda** bulunamadı.`)
                                .setColor("#FFFFFF");
                            message.channel.send(embeds).then(del => del.delete({timeout:2000} , message.delete({timeout:2000})));
                            return;
                        }
                        const embedss = new Discord.MessageEmbed()
                            .setTitle(`(${kelime}) Nedir ?`)
                            .setDescription(`**Kelime anlamı:** ` + body[0].anlamlarListe[0].anlam)
                            .setColor("#FFFFFF");
                        message.channel.send(embedss).then(del => del.delete({timeout:15000} , message.delete({timeout:15000})));
                    });
            break;
            case 'puan':
                var settings_puanlar_guilds = global.fullarr.puanlar;
                let puanlar_guilds_index = settings_puanlar_guilds.findIndex(find => find.guild_id === message.guild.id);
                let puanlar_client_index = settings_puanlar_guilds[puanlar_guilds_index].puanlar.findIndex(find => find.client_id === message.author.id);
                let client_puan;
                if(puanlar_client_index != -1){
                    client_puan = settings_puanlar_guilds[puanlar_guilds_index].puanlar[puanlar_client_index].puan;
                }else{
                    client_puan = 0;
                }
                const embedd = new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL(),"https://leaderclan.com")
                    .setDescription(`Kelime oyundaki toplam puanın: **${client_puan}**`)
                    .setColor("#FFFFFF");
                message.channel.send(embedd).then(del => del.delete({timeout:15000} , message.delete({timeout:15000})));
            break;
            default:
                const embedsss = new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL(),"https://leaderclan.com")
                    .setDescription('Bilinmeyen komut.')
                    .setColor("#FFFFFF");
                message.channel.send(embedsss).then(del => del.delete({timeout:7000} , message.delete({timeout:7000})));
            break;
        }
    return;
    }
};