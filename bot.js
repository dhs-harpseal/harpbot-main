const Discord = require('discord.js');
const fs = require("fs");
const client = new Discord.Client();
const config = require('./config.json');
var trecords = JSON.parse(fs.readFileSync('time_records.json'));
var testChannel;
var announceChannel;
var gamerChannel;
var trm;

function startTimeCount (userIDMeasured) {
	if (!trecords[userIDMeasured]) {
		trecords[userIDMeasured] = {
			totalTime: 0,
			jointime: 0,
			demerit: 0,
			level: 0
		}
	}
	var currentTime = new Date();
	trecords[userIDMeasured].jointime = Date.parse(currentTime);
	fs.writeFile("time_records.json", JSON.stringify(trecords), function (err) {
    	if (err) console.error(err)
    });
	testChannel.send("Updated jointime for user " + trm.members.get(userIDMeasured).nickname + " at " + trecords[userIDMeasured].jointime + ".");
};

function endTimeCount (userIDMeasured) {
	if (trecords[userIDMeasured].jointime == 0) return;
	if (!trecords[userIDMeasured]) {
		trecords[userIDMeasured] = {
			totalTime: 0,
			jointime: 0,
			demerit: 0,
			level: 0
		}
	}
	var currentTime = new Date();
	var timeToAdd = Date.parse(currentTime) - trecords[userIDMeasured].jointime;
	trecords[userIDMeasured].totalTime += timeToAdd;
	testChannel.send("Updated total time for user " + trm.members.get(userIDMeasured).nickname + " adding" + timeToAdd + ". Now " + trecords[userIDMeasured].totalTime + ".");
	trecords[userIDMeasured].jointime = 0; 
	fs.writeFile("time_records.json", JSON.stringify(trecords), function (err) {
    	if (err) console.error(err)
    });
};

function updateRank () {
	for (member in trecords) {
  		var tic = trecords[member].totalTime;
  		var level = Math.floor(trecords[member].totalTime / 3600000) - (trecords[member].demerit);
  		trecords[member].level = level;
  		testChannel.send("Updated level for " + trm.members.get(member).nickname + " " + trecords[member].level);
  		fs.writeFile("time_records.json", JSON.stringify(trecords), function (err) {
    		if (err) console.error(err)
    	});
  	}
}

client.on('ready', () => {
  	console.log(`Logged in as ${client.user.tag}!`);
  	trm = client.guilds.get("330334624687325185")
  	testChannel = trm.channels.get("386041022800723969");
  	announceChannel = trm.channels.get("419726871433838606");
  	gamerChannel = trm.channels.get("330334624687325186");
  	gamerChannel.members.forEach(function (member) {
  		startTimeCount(member.id);
  	}) 
});

client.on('message', function(msg) {
	if (msg.author.bot) return;
  	if (msg.content.startsWith("!")) {
  		var args = msg.content.substring(1).split(" ");
  		var cmd = args[0];
  		switch (cmd) {
  			case "info":
  				msg.channel.send("hi kid im harpbot you may remember me but now im permanently here NOOB");
  				break;
  			case "game":
  				if (!msg.member.roles.has("386048251721154560")) {
  					msg.channel.send("not announcer la noob nice try");
  					return;
  				}
  				var gameRole;
  				var gameName;
  				var currentPlayers;
  				var requester = "<@" + msg.author.id + ">";
  				currentPlayers = msg.member.voiceChannel.members.array().length;
  				if (!args[1]) {
  					msg.channel.send("specify some game pls");
  					return;
  				}
  				switch (args[1]) {
  					case "ow":
  						gameRole = "386037525887844353";
  						gameName = "TILT GAME";
  						break;
  				}
  				announceChannel.send("<@&" + gameRole + ">! " + requester + " wants to play " + gameName + " now NOOBS! " + "People in channel: " + currentPlayers + ". COME NOOBS!");
  				break;
  			case "rank":
  				var count = 0;
  				var arr = [];
  				updateRank();
  				for (member in trecords) {
  					arr.push([member,trecords[member].level,trecords[member].demerit]);
  				}
  				arr.sort(function(a, b) {
    				return b[1] - a[1];
    			});
    			console.log(arr);
    			arr.forEach(function(member) {
    				count++;
    				msg.channel.send(count + ". " + trm.members.get(member[0]).nickname + " : Level " + member[1] + ", " + member[2] + " demerits.");
    			});
    			break;

  			// ADMIN COMMANDS 
  			case "updateRank":
  				if (!msg.member.roles.has("338277493565816834")) {
  					msg.channel.send("kids try to use admin power??? demerit!!!");
  					return;
  				}
  				updateRank();
  				break;
  			case "merit":
  				if (!msg.member.roles.has("338277493565816834")) {
  					msg.channel.send("kids try to use admin power??? demerit!!!");
  					return;
  				}
  				if (!args[1]) {
  					msg.channel.send("specify some kid pls");
  					return;
  				}
  				var name = args[1].slice(3, 21);
  				if (!trecords[name]) {
					trecords[name] = {
						totalTime: 0,
						jointime: 0,
						demerit: 0,
						level: 0
					}
				}	
  				trecords[name].demerit -= 1;
  				testChannel.send("Merited " + trm.members.get(name).nickname);
  				fs.writeFile("time_records.json", JSON.stringify(trecords), function (err) {
    				if (err) console.error(err);
   				 });
  				break;
  			case "demerit":
  				if (!msg.member.roles.has("338277493565816834")) {
  					msg.channel.send("kids try to use admin power??? demerit!!!");
  					return;
  				}
  				if (!args[1]) {
  					msg.channel.send("specify some kid pls");
  					return;
  				}
  				var name = args[1].slice(3, 21);
  				if (!trecords[name]) {
					trecords[name] = {
						totalTime: 0,
						jointime: 0,
						demerit: 0,
						level: 0
					}
				}	
  				trecords[name].demerit += 1;
  				testChannel.send("Demerited " + trm.members.get(name).nickname);
  				fs.writeFile("time_records.json", JSON.stringify(trecords), function (err) {
    				if (err) console.error(err);
   				 });
  				break;
  			case "silence":
  				if (!msg.member.roles.has("338277493565816834")) {
  					msg.channel.send("kids try to use admin power??? demerit!!!");
  					return;
  				}
  				if (!args[1]) {
  					msg.channel.send("specify some kid pls");
  					return;
  				}
  				var name = args[1].slice(3, 21);
  				var time = args[2]*60000;
  				trm.members.get(name).remove("CONNECT");
  				setTimeout(trm.members.get(name).add("CONNECT"),time);
  				break;

  		}
  	}
});

client.on("voiceStateUpdate", function (oldMember, newMember) {
	var vcid = newMember.voiceChannelID;
	var vcidOld = oldMember.voiceChannelID;
	if (!vcidOld || oldMember.deaf == true && newMember.deaf == false || vcidOld == "347376453459116032" && vcid != "347376453459116032") {
		startTimeCount(newMember.id);
	}
	if (!vcid || oldMember.deaf == false && newMember.deaf == true || vcidOld != "347376453459116032" && vcid == "347376453459116032") {
		endTimeCount(newMember.id);
	}
});

client.login(config.token);
