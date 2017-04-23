import { ApiInterface } from '../interfaces/api-interface';
import { ExtDate } from 'extdate/lib/ExtDate';

export class PlayerStatus implements ApiInterface {
  isMuted: boolean = false;
  volumne: number;
  playbackRate: number = 1.0;
  loadedFraction: number;
  playerState: number;
  currentTime: number; // sec
  playbackQuality: string;
  duration: number;
  videoUrl: string;
  playlist: any[];
  playlistIndex: number;
  createdAt: number;

  fromPlayer(player) {
    this.isMuted = player.isMuted();
    this.volumne = player.getVolume();
    this.playbackRate = player.getPlaybackRate();
    this.loadedFraction = player.getVideoLoadedFraction();
    this.playerState = player.getPlayerState();
    this.currentTime = player.getCurrentTime();
    this.playbackQuality = player.getPlaybackQuality();
    this.duration = player.getDuration();
    this.videoUrl = player.getVideoUrl();
    this.playlist = player.getPlaylist();
    this.playlistIndex = player.getPlaylistIndex();
    this.createdAt = (new ExtDate()).unixTime();
  }

  fromJson(obj: any) {
    this.isMuted = obj['isMuted'];
    this.volumne = obj['volumne'];
    this.playbackRate = obj['playbackRate'];
    this.playerState = obj['playerState'];
    this.currentTime = obj['currentTime'];
    this.playbackQuality = obj['playbackQuality'];
    this.duration = obj['duration'];
    this.videoUrl = obj['videoUrl'];
    this.playlist = obj['playlist'];
    this.playlistIndex = obj['playlistIndex'];
    this.createdAt = obj['createdAt'];
  }
}