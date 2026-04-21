import React from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';

interface AnimationControlsProps {
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  onNext: () => void;
  onPrevious: () => void;
  isAnimating: boolean;
  isPaused: boolean;
  canStepForward: boolean;
  canStepBackward: boolean;
  currentFrame: number;
  totalFrames: number;
}

const AnimationControls: React.FC<AnimationControlsProps> = ({
  onPlay, onPause, onRestart, onNext, onPrevious,
  isAnimating, isPaused, canStepForward, canStepBackward,
  currentFrame, totalFrames,
}) => {
  const btnSx = {
    bgcolor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 1.5,
    color: 'primary.light',
    mx: 0.5,
    '&:hover': { bgcolor: 'primary.main', color: 'white' },
    '&.Mui-disabled': { opacity: 0.3 },
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
      <Tooltip title="Previous step">
        <span>
          <IconButton onClick={onPrevious} disabled={!canStepBackward} sx={btnSx}>
            <SkipPreviousIcon />
          </IconButton>
        </span>
      </Tooltip>

      {!isAnimating || isPaused ? (
        <Tooltip title={isPaused ? 'Resume' : 'Play'}>
          <IconButton onClick={onPlay} sx={btnSx}>
            <PlayArrowIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Pause">
          <IconButton onClick={onPause} sx={btnSx}>
            <PauseIcon />
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title="Next step">
        <span>
          <IconButton onClick={onNext} disabled={!canStepForward} sx={btnSx}>
            <SkipNextIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Restart">
        <span>
          <IconButton onClick={onRestart} sx={btnSx}>
            <ReplayIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
        Frame {currentFrame + 1} / {totalFrames}
      </Typography>
    </Box>
  );
};

export default AnimationControls;