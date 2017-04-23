import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { PlayerStatus } from '../../models/player-status.model';

declare const YT;
const RETRY_INTERVAL = 100; // msec
const UPDATE_INTERVAL = 1000; // msec

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.scss']
})
export class YoutubeComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  url: string;

  @Input()
  roomId: string;

  @Input()
  allowSync: boolean = true;

  @Input()
  shouldUpdate: boolean = false;

  @Input()
  statusObservable$: Observable<PlayerStatus>;

  @Input()
  loadingDelay: number = 1; // seconds

  @Output()
  changeStatus = new EventEmitter<PlayerStatus>();

  playerHeight: number = 360;
  playerWidth: number = 640;
  marginWidth: number = 64; // 32 * 2

  currentStatus: PlayerStatus;
  currentStatus$: Observable<PlayerStatus>;

  subs: Subscription = new Subscription();

  // youtube player
  player;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.url && !this.player) {
      const regexp = /https?:\/\/((www\.youtube\.com\/watch\?v=)|(youtu\.be\/))([a-zA-Z0-9_-]+)/;

      const match = this.url.match(regexp);
      if (match && match.length >= 5) {
        const videoId = match[4];
        this.onYouTubeIframeAPIReady(videoId);
      }
    }

    if (this.shouldUpdate) {
      let status = new PlayerStatus();
    }

    // Do not subscribe more than twice to avoid memory leaks.
    if (this.statusObservable$ && !this.currentStatus$) {
      this.currentStatus$ = this.statusObservable$
      this.subs.add(this.currentStatus$.subscribe(status => {
        this.syncVideoWith(status);
      }));
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.currentStatus$ = null;
    try {
      let status = new PlayerStatus();
      this.changeStatus.emit(status);
    } finally {
      this.player = null;
    }
  }

  syncVideoWith(status: PlayerStatus) {
    this.currentStatus = status;

    if (this.player && this.allowSync) {
      switch (status.playerState) {
        case YT.PlayerState.ENDED:
          break;
        case YT.PlayerState.PLAYING:
          this.playVideo(this.player);
          break;
        case YT.PlayerState.PAUSED:
          this.stopVideo(this.player);
          break;
        case YT.PlayerState.BUFFERING:
          this.stopVideo(this.player);
          break;
        case YT.PlayerState.CUE:
          break;
      }
    }
  }

  onResize(event) {
    if (window.innerWidth <= this.playerWidth + this.marginWidth) {
      this.playerWidth = window.innerWidth - this.marginWidth;
    } else {
      this.playerWidth = 640;
    }
    this.player.setSize(this.playerWidth, this.playerHeight);
  }

  onYouTubeIframeAPIReady(videoId: string) {

    const onPlayerReady = (event) => {
      this.player = event.target;
      this.playVideo(this.player);
    }

    const onPlayerStateChange = (event) => {
      if (this.shouldUpdate && this.allowSync) {
        let status = new PlayerStatus();
        if (this.player) {
          status.fromPlayer(this.player);
          this.changeStatus.emit(status)
        }
      }
    }

    const onPlayerError = (event) => {
      console.error(event);
    }

    const stopVideo = () => {
      this.player.stopVideo();
    }

    let interval = setInterval(() => {
      try {
        if (window.innerWidth <= this.playerWidth + this.marginWidth) {
          this.playerWidth = window.innerWidth - this.marginWidth;
        }

        this.player = new YT.Player('youtube-player', {
          height: '' + this.playerHeight,
          width: '' + this.playerWidth,
          videoId: videoId,
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError,
          }
        });

        if (this.player) {
          // stop interval after script loaded
          clearInterval(interval);
        }

      } catch (e) {
        console.warn(e);
      }
    }, RETRY_INTERVAL);

  }

  playVideo(player) {
    if (!player) {
      console.warn("player not ready...");
      return;
    }

    if (this.currentStatus && this.currentStatus.createdAt && this.allowSync && !this.shouldUpdate) {
      let seektime = this.currentStatus.currentTime;
      let now = new Date()

      switch (this.currentStatus.playerState) {
        case YT.PlayerState.ENDED:
          seektime = 0;
          break;
        case YT.PlayerState.PLAYING:
          seektime += (now.getTime() - this.currentStatus.createdAt) / 1000 + this.loadingDelay;
          if (seektime >= this.currentStatus.duration) {
            seektime = 0;
          }
          break;
        case YT.PlayerState.PAUSED:
          break;
        case YT.PlayerState.BUFFERING:
          break;
        case YT.PlayerState.CUE:
          break;
        default:
      }
      player.seekTo(seektime, true);
    }

    player.playVideo();
  }

  stopVideo(player) {
    player.stopVideo();
  }

}
