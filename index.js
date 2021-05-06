const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.config = config;
const commandFolders = fs.readdirSync('./commands');

global.fullarr = {
    "game_bool": [],
    "channels": [],
    "son_kelime": [],
    "son_kelime_yazan": [],
    "puanlar": [],
    "kullanilan_kelimeler_guilds": []
}

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
        console.log(file + ' Yüklendi.');
	}
}

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0){
        console.log("Event bulunamadı.");
        return;
    }
    files.forEach(file => {
      const event = require(`./events/${file}`);
      let eventName = file.split(".")[0];
      client.on(eventName, event.bind(null, client));
    });
});
client.on('ready', async() => {
    const Guilds = client.guilds.cache.map(guild => guild.id);
    const settings_path = 'Veriler/kelime_bulmaca/settings.json';
    fs.readFile(settings_path, 'utf-8', function(err, data) {
        if (err) throw err
        var arrayOfObjects = JSON.parse(data);
        if(!arrayOfObjects.channels){
            arrayOfObjects.channels = [];
        }if(!arrayOfObjects.son_kelime){
            arrayOfObjects.son_kelime = [];
        }if(!arrayOfObjects.son_kelime_yazan){
            arrayOfObjects.son_kelime_yazan = [];
        }if(!arrayOfObjects.kullanilan_kelimeler_guilds){
            arrayOfObjects.kullanilan_kelimeler_guilds = [];
        }if(!arrayOfObjects.game_bool){
            arrayOfObjects.game_bool = [];
        }if(!arrayOfObjects.puanlar){
            arrayOfObjects.puanlar = [];
        }
        Guilds.forEach(element => {
            let kanal_index = arrayOfObjects.channels.findIndex(find => find.guild_id === element);
            let game_bool_index = arrayOfObjects.game_bool.findIndex(find => find.guild_id === element);
            let son_kelime_index = arrayOfObjects.son_kelime.findIndex(find => find.guild_id === element);
            let son_kelime_yazan_index = arrayOfObjects.son_kelime_yazan.findIndex(find => find.guild_id === element);
            let kullanilan_kelimeler_guilds_index = arrayOfObjects.kullanilan_kelimeler_guilds.findIndex(find => find.guild_id === element);
            let puan_index = arrayOfObjects.puanlar.findIndex(find => find.guild_id === element);
            if(puan_index == -1){
                arrayOfObjects.puanlar.push({
                    guild_id : element,
                    puanlar:[]
                });
            }
            if(game_bool_index == -1){
                arrayOfObjects.game_bool.push({
                    guild_id : element
                });
            }
            if(kanal_index == -1){
				arrayOfObjects.channels.push({
                    guild_id : element
                });
            }
            if(son_kelime_yazan_index == -1){
                arrayOfObjects.son_kelime_yazan.push({
                    guild_id : element
                });
            }
            if(kullanilan_kelimeler_guilds_index == -1){
                arrayOfObjects.kullanilan_kelimeler_guilds.push({
                    guild_id : element,
                    kullanilan_kelimeler : []
                });
            }
            if(son_kelime_index == -1){
                arrayOfObjects.son_kelime.push({
                    guild_id : element
                });
            }
        });
        global.fullarr.puanlar = arrayOfObjects.puanlar;
        global.fullarr.game_bool = arrayOfObjects.game_bool;
        global.fullarr.channels = arrayOfObjects.channels;
        global.fullarr.son_kelime_yazan = arrayOfObjects.son_kelime_yazan;
        global.fullarr.kullanilan_kelimeler_guilds = arrayOfObjects.kullanilan_kelimeler_guilds;
        global.fullarr.son_kelime = arrayOfObjects.son_kelime;
        fs.writeFile(settings_path, JSON.stringify(arrayOfObjects, null, 2), 'utf-8', function(err) {
            if (err) throw err;
        });
    });
    console.log(`Logged in as ${client.user.tag}! - ${client.guilds.cache.size}`);
});
client.login(config.token);
