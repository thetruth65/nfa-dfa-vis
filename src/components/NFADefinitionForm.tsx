import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, IconButton,
  Chip, Divider, Alert, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { NFA, NFATransition } from '../types';
import { EPSILON } from '../types';

interface NFADefinitionFormProps {
  onSetNFA: (nfa: NFA) => void;
  initialNFA: NFA;
}

const NFADefinitionForm: React.FC<NFADefinitionFormProps> = ({ onSetNFA, initialNFA }) => {
  const [states, setStates] = useState(initialNFA.states.join(', '));
  const [alphabet, setAlphabet] = useState(initialNFA.alphabet.filter(a => a !== EPSILON).join(', '));
  const [startState, setStartState] = useState(initialNFA.startState);
  const [acceptStates, setAcceptStates] = useState(initialNFA.acceptStates.join(', '));
  const [transitions, setTransitions] = useState<NFATransition[]>(initialNFA.transitions);
  const [newTrans, setNewTrans] = useState({ from: '', symbol: '', to: '' });
  const [error, setError] = useState('');

  const addTransition = () => {
    if (!newTrans.from || !newTrans.symbol || !newTrans.to) return;
    setTransitions(prev => [
      ...prev,
      { id: `t_${Date.now()}`, ...newTrans }
    ]);
    setNewTrans(p => ({ ...p, symbol: '', to: '' }));
  };

  const removeTransition = (id: string) => {
    setTransitions(prev => prev.filter(t => t.id !== id));
  };

  const handleSubmit = () => {
    const stateList = states.split(',').map(s => s.trim()).filter(Boolean);
    const alphabetList = alphabet.split(',').map(s => s.trim()).filter(Boolean);
    const acceptList = acceptStates.split(',').map(s => s.trim()).filter(Boolean);
    const start = startState.trim();

    if (stateList.length === 0) { setError('At least one state required.'); return; }
    if (!start || !stateList.includes(start)) { setError('Start state must be in the states list.'); return; }

    setError('');
    const hasEpsilon = transitions.some(t => t.symbol === EPSILON);
    onSetNFA({
      states: stateList,
      alphabet: hasEpsilon ? [...alphabetList, EPSILON] : alphabetList,
      transitions,
      startState: start,
      acceptStates: acceptList,
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Define NFA</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
        <TextField label="States (comma-separated)" value={states} onChange={e => setStates(e.target.value)} size="small" placeholder="q0, q1, q2" />
        <TextField label="Alphabet (comma-separated)" value={alphabet} onChange={e => setAlphabet(e.target.value)} size="small" placeholder="a, b" />
        <TextField label="Start State" value={startState} onChange={e => setStartState(e.target.value)} size="small" placeholder="q0" />
        <TextField label="Accept States (comma-separated)" value={acceptStates} onChange={e => setAcceptStates(e.target.value)} size="small" placeholder="q2" />
      </Box>

      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2" gutterBottom>
        Transitions &nbsp;
        <Chip label={`ε = ${EPSILON}`} size="small" variant="outlined" sx={{ fontFamily: 'monospace' }} />
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <TextField label="From" value={newTrans.from} onChange={e => setNewTrans(p => ({ ...p, from: e.target.value }))} size="small" sx={{ width: 100 }} />
        <TextField label="Symbol (or ε)" value={newTrans.symbol} onChange={e => setNewTrans(p => ({ ...p, symbol: e.target.value }))} size="small" sx={{ width: 110 }} />
        <TextField label="To" value={newTrans.to} onChange={e => setNewTrans(p => ({ ...p, to: e.target.value }))} size="small" sx={{ width: 100 }} />
        <Tooltip title="Add transition">
          <IconButton onClick={addTransition} color="primary" sx={{ border: '1px solid', borderColor: 'primary.main' }}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, maxHeight: 120, overflow: 'auto' }}>
        {transitions.map(t => (
          <Chip
            key={t.id}
            label={`${t.from} →${t.symbol}→ ${t.to}`}
            onDelete={() => removeTransition(t.id)}
            deleteIcon={<DeleteIcon />}
            variant="outlined"
            size="small"
            sx={{ fontFamily: 'monospace' }}
          />
        ))}
        {transitions.length === 0 && (
          <Typography variant="caption" color="text.secondary">No transitions added yet</Typography>
        )}
      </Box>

      <Button variant="contained" onClick={handleSubmit} fullWidth>
        Set NFA &amp; Generate Animation
      </Button>
    </Box>
  );
};

export default NFADefinitionForm;