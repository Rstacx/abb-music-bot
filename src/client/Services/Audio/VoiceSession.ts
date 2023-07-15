import { TextChannel, User, VoiceChannel } from "discord.js";
import { Song } from "../../Interfaces/VoiceSession/Song";
import { 
    YouTubeStream, 
    SoundCloudStream, 
    video_basic_info, 
    InfoData, 
    YouTubePlayList, 
    stream } from "play-dl";
import { 
    AudioResource, 
    VoiceConnection, 
    joinVoiceChannel, 
    AudioPlayer, 
    createAudioPlayer, 
    NoSubscriberBehavior, 
    AudioPlayerStatus,
    VoiceConnectionStatus,
    createAudioResource } from "@discordjs/voice";
import { errorEmbed, nowPlayingEmbed } from "../../Utils/VoiceSessionEmbeds"
import { bot } from "../../main";
import { AddQueueOptions } from "../../Interfaces/VoiceSession/AddQueueOptions";
import formatDuration from "format-duration";
import { SongDuration } from "../../Interfaces/VoiceSession/SongDuration";

export class VoiceSession {
    private client:bot;
    private voice:VoiceChannel;
    private text:TextChannel;
    private queue:Array<Song>;
    private preventDisconnect:boolean;
    private alreadyDestroyed:boolean;
    private stream:YouTubeStream|SoundCloudStream;
    private resource:AudioResource<any>;
    private nowPlaying:Song;
    private loopTrack:boolean;
    private loopQueue:boolean;
    private volume:number;
    private timeout:any;
    private connection:VoiceConnection;
    private player:AudioPlayer;

    constructor(client:bot, voiceChannel:VoiceChannel, textChannel:TextChannel) {
        this.client = client;
        this.voice = voiceChannel;
        this.text = textChannel;

        this.queue = [];

        // -- Prevent timeout disconnection, including in initial state before playing a stream.
        this.preventDisconnect = true;
        // -- if connection already destroyed, prevent destroying again in kill function
        this.alreadyDestroyed = false;

        this.stream = null;
        this.resource = null;
        this.nowPlaying = null;

        this.loopTrack = false;
        this.loopQueue = false;

        this.volume = 1;

        this.timeout = null;

        // -- Create voice channel connection
        console.log(`🎵 • Connecting to #${this.voice.name} (${this.voice.guild.name})`);
        this.connection = joinVoiceChannel({
            channelId:this.voice.id,
            guildId:this.voice.guild.id,
            adapterCreator:this.voice.guild.voiceAdapterCreator
        });

        // -- Create audio player for connection to subscribe to
        console.log(`🎵 • Starting audio player for #${this.voice.name} (${this.voice.guild.name})`);
        this.player = createAudioPlayer({
            behaviors:{
                noSubscriber:NoSubscriberBehavior.Stop
            }
        });
        this.connection.subscribe(this.player);

        // -- Log and manage state changes
        this.connection.on("stateChange", (oldState, newState) => {
            console.log(`🚦 • #${this.voice.name} (${this.voice.guild.name}) connection state change: ${oldState.status} => ${newState.status}`);
        });
        this.player.on("stateChange", (oldState, newState) => {
            console.log(`🚦 • #${this.voice.name} (${this.voice.guild.name}) player state change: ${oldState.status} => ${newState.status}`);

            if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
                console.log(`⏸ • Audio player in #${this.voice.name} (${this.voice.guild.name}) is now idle`)
                
                if (this.loopTrack && this.nowPlaying || this.loopQueue && this.nowPlaying || this.queue.length >= 1) {
                    this.playFromQueue();
                } else {
                    this.nowPlaying = null;
                    if (!this.preventDisconnect) {
                        this.timeout = setTimeout(() => {
                            this.kill();
                        }, 120000);
                    };
                };
            };            

            if (newState.status === AudioPlayerStatus.Playing) {
                const playable = this.player.checkPlayable();   
                if (!playable) {
                    const embed = errorEmbed("Something went while wrong trying to play this song");
                    return this.text.send({embeds:[embed]});
                };
            };
        });

        this.player.on("error", err => {
            console.error(err);
            const embed = errorEmbed(err);
            return this.text.send({embeds:[embed]});
        });

        this.connection.on(VoiceConnectionStatus.Disconnected, () => {
            this.kill();
        });

        this.connection.on(VoiceConnectionStatus.Destroyed, () => {
            this.alreadyDestroyed = true;
        });
    };

    // -- Destory the session
    public kill() {
        console.log(`❌ • Destroying session in #${this.voice.name} (${this.voice.guild.name})`);
        this.preventDisconnect = true;
        this.loopTrack = false;
        this.loopQueue = false;
        this.clearQueue();
        if (!this.alreadyDestroyed) this.connection.destroy();
        this.client.services.audioSession.destroy(this.voice.id);
    };

    // -- Add a song to the queue
    public addToQueue(url:string, user:User, options?:AddQueueOptions) {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
            this.preventDisconnect = true;
        };

        return new Promise<Song>(async (resolve, reject) => {
            try {
                const info:InfoData = await video_basic_info(url);
                const song:Song = {
                    video:info.video_details,
                    user:user.username
                };

                // -- If play top is requested, place song at top of queue. Else place at end of queue.
                if (options?.playTop) {
                    this.queue.unshift(song);
                } else {
                    this.queue.push(song);
                };

                if (options?.playTop || this.preventDisconnect) this.playFromQueue();
                
                console.log(`🎵 • Added ${song.video.title} to queue in #${this.voice.name} (${this.voice.guild.name})`);

                return resolve(song);
            } catch (err) {
                return reject(err);
            }
        });
    };

    // -- Batch add to queue
    public batchAddToQueue(playlist:YouTubePlayList, user:User) {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
            this.preventDisconnect = true;
        };

        return new Promise<boolean>(async (resolve, reject) => {
            let i = 0;
            try {
                const videos = await playlist.all_videos();

                videos.map(video => {
                    i++;
                    const song:Song = {
                        video:video,
                        user:user.username
                    };
                    this.queue.push(song);

                    if (i > videos.length-1) {
                        console.log(`🎵 • Added playlist to queue (${videos.length} songs) in #${this.voice.name} (${this.voice.guild.name})`);
                        if (this.preventDisconnect) this.playFromQueue();
                        return resolve(true);
                    };
                });
            } catch (err) {
                return reject(err);
            }
        });
    };

    // -- Get the queue
    public getQueue() {
        return this.queue;
    }

    // -- Clear the queue
    public clearQueue() {
        this.queue = [];
    };

    // -- Play from queue
    public async playFromQueue() {
        try {
            let song:Song;

            if (this.loopTrack) {
                song = this.nowPlaying;
            } else {
                song = this.queue.shift();
                if (this.loopQueue) this.queue.push(this.nowPlaying);
            };

            if (!song) return;

            this.nowPlaying = song;

            console.log(`🎵 • Getting stream from YouTube`);
            this.stream = await stream(song.video.url);
            this.resource = createAudioResource(this.stream.stream, {
                inputType:this.stream.type,
                inlineVolume:true
            });
            this.resource.volume.setVolume(this.volume);

            console.log(`🎵 • Playing ${song.video.title} in #${this.voice.name} (${this.voice.guild.name})`);
            this.player.play(this.resource);

            this.postNowPlaying();

            this.preventDisconnect = false;
        } catch (err) {
            console.error(err);
            const embed = errorEmbed("Something went wrong while playing from the queue");
            return this.text.send({embeds:[embed]});
        };
    };

    // -- Post the currently playing song into the text channel
    public postNowPlaying() {
        const embed = nowPlayingEmbed(this.nowPlaying, this.voice);
        this.text.send({embeds:[embed]});
    };

    // -- Pause active playback
    public pause() {
        if (this.player.state.status === AudioPlayerStatus.Playing) {
            this.player.pause();
            this.timeout = setTimeout(() => {
                console.log(`❌ • Destroying connection in #${this.voice.name} (${this.voice.guild.name}) due to inactivity`);
                this.kill();
            }, 120000);
            return "PAUSE";
        } else if (this.player.state.status === AudioPlayerStatus.Paused) {
            this.player.unpause();
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            };
            return "PLAY";
        } else {
            return "ERROR";
        }
    };

    // -- Skip to next song by stopping player, moving to next item in queue.
    public skip() {
        this.player.stop();
    };

    // -- Set the loop track option
    public toggleLoopTrack() {
        this.loopTrack = !this.loopTrack;
        if (this.loopTrack) {
            return "LOOPING"
        } else {
            return "NOT_LOOPING";
        };
    };

    // -- Set the loop queue option
    public toggleLoopQueue() {
        this.loopQueue = !this.loopQueue;
        if (this.loopQueue) {
            return "LOOPING";
        } else {
            return "NOT_LOOPING";
        };
    };

    // -- Get current loop track option
    public getLoopTrack() {
        return this.loopTrack;
    }

    // -- Get current loop queue option
    public getLoopQueue() {
        return this.loopQueue;
    }

    // -- Shuffle the queue
    public shuffle() {
        this.shuffleArray(this.queue);
        return this.queue;
    };
    // -- Private: Shuffle array function
    private shuffleArray(array:Array<any>) {
        let currentIndex = array.length,  randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        };
        return array;
    };

    // -- Set the playback volume
    public setVolume(vol:number) {
        if (vol > 1 || vol < 0.1) return false;
        this.volume = vol;

        if (this.resource) {
            this.resource.volume.setVolume(this.volume);
        };

        return this.volume;
    };

    // -- Get now playing song
    public getNowPlaying() {
        return this.nowPlaying;
    };

    // -- Get now playing song duration
    public getDuration() {
        if (this.player.state.status === AudioPlayerStatus.Playing && this.nowPlaying) {
            const playbackMs = this.player.state.playbackDuration;
            const totalMs = this.nowPlaying.video.durationInSec;
            const playback = formatDuration(playbackMs);
            const total = formatDuration(totalMs*1000);

            const songDuration:SongDuration = {
                playback:playback,
                total:total
            };
            return songDuration;
        } else {
            const songDuration:SongDuration = {
                playback:"00:00",
                total:"00:00"
            }
            return songDuration;
        };
    };

    // -- Get voice channel ID
    getVoiceChannelId() {
        return this.voice.id;
    }
};