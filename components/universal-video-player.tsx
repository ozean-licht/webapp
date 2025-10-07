'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

interface UniversalVideoPlayerProps {
  url: string // YouTube or Vimeo URL
  title?: string
  onTimeUpdate?: (currentTime: number) => void
  onEnded?: () => void
  className?: string
}

// Helper: Extract video ID from URL
function getVideoInfo(url: string): { platform: 'youtube' | 'vimeo' | 'unknown', id: string } {
  // YouTube patterns
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const youtubeMatch = url.match(youtubeRegex)
  
  if (youtubeMatch) {
    return { platform: 'youtube', id: youtubeMatch[1] }
  }

  // Vimeo patterns
  const vimeoRegex = /(?:vimeo\.com\/)(\d+)/
  const vimeoMatch = url.match(vimeoRegex)
  
  if (vimeoMatch) {
    return { platform: 'vimeo', id: vimeoMatch[1] }
  }

  return { platform: 'unknown', id: '' }
}

export function UniversalVideoPlayer({
  url,
  title,
  onTimeUpdate,
  onEnded,
  className = ''
}: UniversalVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerRef = useRef<any>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout>()
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  const videoInfo = getVideoInfo(url)
  const { platform, id } = videoInfo
  
  // Debug
  console.log('🎬 UniversalVideoPlayer:', { url, platform, id })

  // Format time helper
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Initialize YouTube API
  useEffect(() => {
    if (platform !== 'youtube') return

    // Load YouTube IFrame API
    if (!(window as any).YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    // Wait for API to be ready
    const initPlayer = () => {
      if (!(window as any).YT || !(window as any).YT.Player) {
        setTimeout(initPlayer, 100)
        return
      }

      playerRef.current = new (window as any).YT.Player(iframeRef.current, {
        videoId: id,
        playerVars: {
          controls: 0,
          modestbranding: 1,
          rel: 0,
          enablejsapi: 1,
          fs: 0,
          iv_load_policy: 3,
          disablekb: 0,
          showinfo: 0,
        },
        events: {
          onReady: () => {
            setIsReady(true)
            // Wait a moment for player to fully initialize
            setTimeout(() => {
              if (playerRef.current && playerRef.current.getDuration) {
                try {
                  const dur = playerRef.current.getDuration()
                  if (dur && !isNaN(dur)) {
                    setDuration(dur)
                  }
                } catch (err) {
                  console.warn('Could not get duration:', err)
                }
              }
            }, 500)
          },
          onStateChange: (event: any) => {
            if (event.data === (window as any).YT.PlayerState.ENDED) {
              setIsPlaying(false)
              onEnded?.()
            } else if (event.data === (window as any).YT.PlayerState.PLAYING) {
              setIsPlaying(true)
              startProgressTracking()
              // Also try to get duration when playing starts
              if (!duration && playerRef.current && playerRef.current.getDuration) {
                try {
                  const dur = playerRef.current.getDuration()
                  if (dur && !isNaN(dur)) {
                    setDuration(dur)
                  }
                } catch (err) {
                  console.warn('Could not get duration:', err)
                }
              }
            } else if (event.data === (window as any).YT.PlayerState.PAUSED) {
              setIsPlaying(false)
              stopProgressTracking()
            }
          },
        },
      })
    }

    if ((window as any).YT && (window as any).YT.Player) {
      initPlayer()
    } else {
      (window as any).onYouTubeIframeAPIReady = initPlayer
    }

    return () => {
      stopProgressTracking()
    }
  }, [platform, id])

  // Initialize Vimeo API
  useEffect(() => {
    if (platform !== 'vimeo') return

    // Load Vimeo Player API
    if (!(window as any).Vimeo) {
      const script = document.createElement('script')
      script.src = 'https://player.vimeo.com/api/player.js'
      document.head.appendChild(script)
      
      script.onload = () => {
        initVimeoPlayer()
      }
    } else {
      initVimeoPlayer()
    }

    function initVimeoPlayer() {
      if (!iframeRef.current) return

      playerRef.current = new (window as any).Vimeo.Player(iframeRef.current)
      
      playerRef.current.ready().then(() => {
        setIsReady(true)
        playerRef.current.getDuration().then((dur: number) => {
          setDuration(dur)
        })
      })

      playerRef.current.on('play', () => {
        setIsPlaying(true)
        startProgressTracking()
      })

      playerRef.current.on('pause', () => {
        setIsPlaying(false)
        stopProgressTracking()
      })

      playerRef.current.on('ended', () => {
        setIsPlaying(false)
        stopProgressTracking()
        onEnded?.()
      })

      playerRef.current.on('timeupdate', (data: any) => {
        setCurrentTime(data.seconds)
        onTimeUpdate?.(data.seconds)
      })
    }

    return () => {
      stopProgressTracking()
    }
  }, [platform, id])

  // Progress tracking for YouTube
  const startProgressTracking = () => {
    if (platform !== 'youtube') return
    
    stopProgressTracking()
    progressIntervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const time = playerRef.current.getCurrentTime()
        setCurrentTime(time)
        onTimeUpdate?.(time)
      }
    }, 250)
  }

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }
  }

  // Play/Pause toggle
  const togglePlay = () => {
    if (!playerRef.current) return

    if (platform === 'youtube') {
      if (isPlaying) {
        playerRef.current.pauseVideo()
      } else {
        playerRef.current.playVideo()
      }
    } else if (platform === 'vimeo') {
      if (isPlaying) {
        playerRef.current.pause()
      } else {
        playerRef.current.play()
      }
    }
  }

  // Mute toggle
  const toggleMute = () => {
    if (!playerRef.current) return

    if (platform === 'youtube') {
      if (isMuted) {
        playerRef.current.unMute()
      } else {
        playerRef.current.mute()
      }
      setIsMuted(!isMuted)
    } else if (platform === 'vimeo') {
      playerRef.current.setMuted(!isMuted).then(() => {
        setIsMuted(!isMuted)
      })
    }
  }

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    const newTime = pos * duration

    if (platform === 'youtube') {
      playerRef.current.seekTo(newTime, true)
    } else if (platform === 'vimeo') {
      playerRef.current.setCurrentTime(newTime)
    }
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    if (!playerRef.current) return
    const newVolume = value[0]
    
    if (platform === 'youtube') {
      playerRef.current.setVolume(newVolume * 100)
      setVolume(newVolume)
      if (newVolume === 0) {
        setIsMuted(true)
      } else if (isMuted) {
        setIsMuted(false)
      }
    } else if (platform === 'vimeo') {
      playerRef.current.setVolume(newVolume).then(() => {
        setVolume(newVolume)
        if (newVolume === 0) {
          setIsMuted(true)
        } else if (isMuted) {
          setIsMuted(false)
        }
      })
    }
  }

  // Skip forward/backward
  const skip = (seconds: number) => {
    if (!playerRef.current) return
    const newTime = currentTime + seconds

    if (platform === 'youtube') {
      playerRef.current.seekTo(newTime, true)
    } else if (platform === 'vimeo') {
      playerRef.current.setCurrentTime(newTime)
    }
  }

  // Show controls temporarily
  const showControlsTemporarily = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault()
          togglePlay()
          break
        case 'm':
          e.preventDefault()
          toggleMute()
          break
        case 'f':
          e.preventDefault()
          toggleFullscreen()
          break
        case 'ArrowLeft':
          e.preventDefault()
          skip(-10)
          break
        case 'ArrowRight':
          e.preventDefault()
          skip(10)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, isMuted, currentTime])

  const progress = (currentTime / duration) * 100 || 0

  // Build embed URL
  const embedUrl = platform === 'youtube' 
    ? `https://www.youtube.com/embed/${id}?enablejsapi=1&controls=0&modestbranding=1&rel=0&fs=0&iv_load_policy=3&disablekb=0&showinfo=0`
    : platform === 'vimeo'
    ? `https://player.vimeo.com/video/${id}?controls=0`
    : ''

  if (platform === 'unknown') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <p className="text-white">Ungültige Video-URL</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-black overflow-hidden group ${className}`}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* IFrame */}
      <iframe
        ref={iframeRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        src={embedUrl}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      
      {/* Full overlay when not playing - hides YouTube UI completely */}
      {!isPlaying && (
        <div 
          className="absolute inset-0 bg-black z-10 cursor-pointer"
          onClick={togglePlay}
        />
      )}
      
      {/* Clickable overlay when playing - blocks YouTube UI interactions */}
      {isPlaying && (
        <div 
          className="absolute inset-0 pointer-events-auto cursor-pointer z-[5]"
          onClick={togglePlay}
          style={{ background: 'transparent' }}
        />
      )}

      {/* Play Button Overlay (center) */}
      {!isPlaying && isReady && (
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
          onClick={togglePlay}
        >
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-2xl animate-pulse">
            <Play className="h-8 w-8 md:h-12 md:w-12 text-white ml-1 md:ml-2" />
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="text-white text-lg font-cinzel animate-pulse">
            Lädt Video...
          </div>
        </div>
      )}

      {/* Title Overlay */}
      {title && (
        <div
          className={`absolute top-0 left-0 right-0 p-3 md:p-6 bg-gradient-to-b from-black/70 to-transparent transition-opacity duration-300 z-20 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h3 className="text-white text-lg md:text-xl font-cinzel truncate">{title}</h3>
          <p className="text-white/70 text-xs md:text-sm mt-1 capitalize">{platform}</p>
        </div>
      )}

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-all duration-300 z-20 ${
          showControls ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div className="px-4 md:px-6 pb-2">
          <div
            className="relative h-1.5 bg-white/20 rounded-full cursor-pointer hover:h-2 transition-all group"
            onClick={handleProgressClick}
          >
            {/* Current Progress */}
            <div
              className="absolute h-full bg-primary rounded-full transition-all"
              style={{ width: `${progress}%` }}
            >
              {/* Progress Handle */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {/* Control Bar */}
        <div className="bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-sm px-3 md:px-6 py-3">
          {/* Mobile Controls - Simple */}
          <div className="md:hidden flex items-center justify-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              className="text-white hover:text-primary hover:bg-white/10 transition-colors"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            <div className="text-white text-xs font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white hover:text-primary hover:bg-white/10 transition-colors"
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Desktop Controls - Full */}
          <div className="hidden md:flex items-center justify-between gap-4">
            {/* Left Controls */}
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                className="text-white hover:text-primary hover:bg-white/10 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>

              {/* Skip Backward */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => skip(-10)}
                className="text-white hover:text-primary hover:bg-white/10 transition-colors"
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              {/* Skip Forward */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => skip(10)}
                className="text-white hover:text-primary hover:bg-white/10 transition-colors"
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:text-primary hover:bg-white/10 transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>

                <div className="w-20">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              {/* Time */}
              <div className="text-white text-sm font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* Fullscreen */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:text-primary hover:bg-white/10 transition-colors"
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
