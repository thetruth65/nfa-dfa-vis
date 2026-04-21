import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, Typography, Paper, Alert,
  Divider, Chip,
} from '@mui/material';
import NFADefinitionForm from '../components/NFADefinitionForm';
import AnimationControls from '../components/AnimationControls';
import { NFAGraph, DFAGraph } from '../components/AutomatonFlowGraph';
import SubsetTableView from '../components/SubsetTableView';
import PseudoCodeViewer from '../components/PseudoCodeViewer';
import { generateAnimationFrames } from '../lib/generateAnimation';
import type { NFA, AnimationFrame } from '../types';
import { EPSILON } from '../types';

const DEFAULT_NFA: NFA = {
  states: ['q0', 'q1', 'q2'],
  alphabet: ['a', 'b'],
  transitions: [
    { id: 't1', from: 'q0', symbol: 'a', to: 'q0' },
    { id: 't2', from: 'q0', symbol: 'b', to: 'q0' },
    { id: 't3', from: 'q0', symbol: 'a', to: 'q1' },
    { id: 't4', from: 'q1', symbol: 'b', to: 'q2' },
  ],
  startState: 'q0',
  acceptStates: ['q2'],
};

const phaseColors: Record<string, string> = {
  init: 'info',
  init_done: 'success',
  worklist_init: 'info',
  pick_state: 'primary',
  pick_symbol: 'secondary',
  compute_move: 'warning',
  compute_closure: 'error',
  new_state: 'success',
  known_state: 'secondary',
  record_transition: 'primary',
  state_done: 'success',
  mark_accept: 'success',
  done: 'success',
} as const;

const VisualizePage: React.FC = () => {
  const [nfa, setNfa] = useState<NFA>(DEFAULT_NFA);
  const [frames, setFrames] = useState<AnimationFrame[]>([]);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const initFrames = useCallback((newNfa: NFA) => {
    const f = generateAnimationFrames(newNfa);
    setFrames(f);
    setFrameIndex(0);
    setIsAnimating(false);
    setIsPaused(true);
  }, []);

  useEffect(() => { initFrames(nfa); }, []);

  const handleSetNFA = (newNfa: NFA) => {
    setNfa(newNfa);
    initFrames(newNfa);
  };

  // Auto-advance
  useEffect(() => {
    if (!isAnimating || isPaused) return;
    if (frameIndex >= frames.length - 1) {
      setIsAnimating(false);
      return;
    }
    const timer = setTimeout(() => setFrameIndex(p => p + 1), 900);
    return () => clearTimeout(timer);
  }, [isAnimating, isPaused, frameIndex, frames.length]);

  const handlePlay = () => { setIsAnimating(true); setIsPaused(false); };
  const handlePause = () => setIsPaused(true);
  const handleRestart = () => initFrames(nfa);
  const handleNext = () => { setIsPaused(true); setFrameIndex(p => Math.min(p + 1, frames.length - 1)); };
  const handlePrev = () => { setIsPaused(true); setFrameIndex(p => Math.max(0, p - 1)); };

  const frame: AnimationFrame | undefined = frames[frameIndex];
  const isFinished = frameIndex === frames.length - 1 && frames.length > 0;

  const hasEpsilon = nfa.alphabet.includes(EPSILON);

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Typography variant="h3" align="center" gutterBottom>
        NFA → DFA Subset Construction
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
        {/* Left: NFA input */}
        <Paper elevation={3} sx={{ p: 3, width: { xs: '100%', lg: '320px' }, flexShrink: 0 }}>
          <NFADefinitionForm onSetNFA={handleSetNFA} initialNFA={nfa} />
          {hasEpsilon && (
            <Alert severity="info" sx={{ mt: 2, fontSize: '0.75rem' }}>
              ε-transitions detected — epsilon closure will be computed at each step.
            </Alert>
          )}
        </Paper>

        {/* Right: Visualization */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Message bar */}
          {frame && (
            <Alert
              severity={(phaseColors[frame.phase] as 'info' | 'success' | 'warning' | 'error') || 'info'}
              sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
            >
              {frame.message}
            </Alert>
          )}

          {/* Controls */}
          <Paper elevation={2} sx={{ p: 2 }}>
            <AnimationControls
              isAnimating={isAnimating}
              isPaused={isPaused}
              canStepForward={frameIndex < frames.length - 1}
              canStepBackward={frameIndex > 0}
              onPlay={handlePlay}
              onPause={handlePause}
              onRestart={handleRestart}
              onNext={handleNext}
              onPrevious={handlePrev}
              currentFrame={frameIndex}
              totalFrames={frames.length}
            />
          </Paper>

          {/* Graphs side by side */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            <Paper elevation={3} sx={{ flex: 1 }}>
              <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2" fontWeight={700}>NFA</Typography>
                <Chip label={`${nfa.states.length} states`} size="small" variant="outlined" />
                <Chip label="input" size="small" color="primary" variant="outlined" />
              </Box>
              <Box sx={{ height: 280, position: 'relative' }}>
                {frame && (
                  <NFAGraph
                    nfa={nfa}
                    highlightStates={frame.nfaHighlightStates}
                    highlightTransitions={frame.nfaHighlightTransitions}
                  />
                )}
              </Box>
              <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip size="small" sx={{ bgcolor: '#FFD70030', border: '1px solid #FFD700' }} label="🟡 start state" />
                <Chip size="small" sx={{ bgcolor: '#4CAF5030', border: '1px solid #4CAF50' }} label="🟢 ε-closure / reached" />
                <Chip size="small" sx={{ bgcolor: '#FF980030', border: '1px solid #FF9800' }} label="🟠 move result" />
                <Chip size="small" sx={{ bgcolor: '#E91E6330', border: '1px solid #E91E63' }} label="🔴 ε-closure final" />
              </Box>
            </Paper>

            <Paper elevation={3} sx={{ flex: 1 }}>
              <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2" fontWeight={700}>DFA (being built)</Typography>
                {frame && <Chip label={`${frame.dfaStates.length} states discovered`} size="small" variant="outlined" />}
                <Chip label="output" size="small" color="secondary" variant="outlined" />
              </Box>
              <Box sx={{ height: 280, position: 'relative' }}>
                {frame && (
                  <DFAGraph
                    dfaStates={frame.dfaStates}
                    dfaTransitions={frame.dfaTransitions}
                  />
                )}
              </Box>
              <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip size="small" sx={{ bgcolor: '#3b82f630', border: '1px solid #3b82f6' }} label="🔵 active state" />
                <Chip size="small" sx={{ bgcolor: '#10b98130', border: '1px solid #10b981' }} label="🟢 new state" />
                <Chip size="small" sx={{ bgcolor: '#9c27b030', border: '1px solid #9c27b0' }} label="🟣 target (known)" />
                <Chip size="small" sx={{ border: '2px double #94a3b8' }} label="⬭ accept state" />
              </Box>
            </Paper>
          </Box>

          {/* Table + Pseudocode */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', xl: 'row' }, gap: 2 }}>
            <Box sx={{ flex: 1.2 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ px: 1 }}>
                Subset Construction Table
              </Typography>
              {frame && (
                <SubsetTableView
                  rows={frame.tableRows}
                  activeRow={frame.activeTableRow}
                />
              )}
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ px: 1 }}>
                Algorithm Pseudocode
              </Typography>
              <PseudoCodeViewer highlightedLine={frame?.pseudoCodeLine ?? 0} />
            </Box>
          </Box>

          {/* Completion summary */}
          {isFinished && frame && (
            <Paper elevation={3} sx={{ p: 3, border: '1px solid', borderColor: 'success.main' }}>
              <Typography variant="h6" color="success.main" gutterBottom>
                ✓ Conversion Complete
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">DFA States</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {frame.dfaStates.map(s => (
                      <Chip
                        key={s.id}
                        label={s.displayName}
                        size="small"
                        color={s.isAccept ? 'success' : 'default'}
                        variant={s.isAccept ? 'filled' : 'outlined'}
                        sx={{ fontFamily: 'monospace' }}
                      />
                    ))}
                  </Box>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Accept States</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {frame.dfaStates.filter(s => s.isAccept).map(s => (
                      <Chip key={s.id} label={s.displayName} size="small" color="success" sx={{ fontFamily: 'monospace' }} />
                    ))}
                    {frame.dfaStates.filter(s => s.isAccept).length === 0 && (
                      <Typography variant="caption" color="text.secondary">None</Typography>
                    )}
                  </Box>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Total transitions</Typography>
                  <Typography variant="body1" fontWeight={700}>{frame.dfaTransitions.length}</Typography>
                </Box>
              </Box>
            </Paper>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default VisualizePage;