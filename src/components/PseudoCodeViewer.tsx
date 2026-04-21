import React from 'react';
import { Paper, Typography } from '@mui/material';

interface PseudoCodeViewerProps {
  highlightedLine: number;
}

const lines = [
  '1:  function NFA_to_DFA(NFA):',
  '2:    S₀ = ε-closure({q₀})           // DFA start state',
  '3:    WorkList ← { S₀ }',
  '4:    Marked ← ∅',
  '5:    δ_DFA ← ∅',
  '6:    while WorkList ≠ ∅ do',
  '7:      T ← extract state from WorkList',
  '8:      Marked.add(T)',
  '9:      for each symbol a ∈ Σ do',
  '10:       U ← ε-closure(move(T, a))',
  '11:       δ_DFA[T, a] ← U',
  '12:       if U ∉ Marked and U ∉ WorkList then',
  '13:         WorkList.add(U)',
  '14:     F_DFA ← { T | T ∩ F_NFA ≠ ∅ }',
  '15:     return DFA(S₀, Σ, δ_DFA, F_DFA)',
];

const PseudoCodeViewer: React.FC<PseudoCodeViewerProps> = ({ highlightedLine }) => (
  <Paper
    elevation={2}
    sx={{
      bgcolor: '#0d1117',
      color: '#e6edf3',
      p: 2,
      borderRadius: 2,
      fontFamily: 'monospace',
      fontSize: '0.82rem',
      lineHeight: 1.8,
      overflow: 'auto',
    }}
  >
    {lines.map((line, i) => {
      const lineNum = i + 1;
      const isHighlighted = highlightedLine === lineNum;
      return (
        <Typography
          key={i}
          component="div"
          sx={{
            px: 1,
            py: 0.2,
            borderRadius: 1,
            bgcolor: isHighlighted ? 'rgba(255,220,0,0.18)' : 'transparent',
            borderLeft: isHighlighted ? '3px solid #FFD700' : '3px solid transparent',
            color: isHighlighted ? '#FFD700' : '#e6edf3',
            transition: 'all 0.25s ease',
            fontFamily: 'monospace',
            fontSize: '0.82rem',
            whiteSpace: 'pre',
          }}
        >
          {line}
        </Typography>
      );
    })}
  </Paper>
);

export default PseudoCodeViewer;