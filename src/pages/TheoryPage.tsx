import React from 'react';
import { Container, Paper, Typography, Box, Divider, Chip, Alert } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const TheoryPage: React.FC = () => (
  <Container maxWidth="md" sx={{ py: 4 }}>
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
      <Typography variant="h4" gutterBottom align="center">Theory: NFA to DFA Conversion</Typography>
      <Typography color="text.secondary" align="center" sx={{ mb: 4 }}>
        The Subset Construction (Powerset) Method
      </Typography>

      <Divider sx={{ mb: 3 }}><Chip label="Key Definitions" /></Divider>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Nondeterministic Finite Automaton (NFA)</Typography>
        <Typography paragraph color="text.secondary">
          An NFA is defined by the 5-tuple (Q, Σ, δ, q₀, F) where the transition function
          δ: Q × (Σ ∪ {'{ε}'}) → 2^Q returns a <em>set</em> of states. This means from any
          state, on any input symbol, the machine can be in multiple possible successor states simultaneously.
          ε-transitions allow state changes without consuming any input.
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Deterministic Finite Automaton (DFA)</Typography>
        <Typography paragraph color="text.secondary">
          A DFA has δ: Q × Σ → Q — exactly one successor state per (state, symbol) pair.
          No ε-transitions. No ambiguity. Easier to simulate but may require exponentially more states.
        </Typography>
      </Box>

      <Alert severity="success" icon={<CheckCircleOutlineIcon />} sx={{ mb: 3 }}>
        <strong>Key theorem:</strong> Every NFA has an equivalent DFA that recognizes exactly the same language.
        Both models recognize precisely the class of <em>Regular Languages</em>.
      </Alert>

      <Divider sx={{ mb: 3 }}><Chip label="The Subset Construction Algorithm" /></Divider>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>ε-Closure</Typography>
        <Typography paragraph color="text.secondary">
          ε-closure(S) = the set of all NFA states reachable from any state in S by following
          zero or more ε-transitions, without consuming any input symbol.
          This is computed using BFS/DFS over ε-transitions.
        </Typography>
        <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1, fontFamily: 'monospace', fontSize: '0.85rem', color: 'text.primary' }}>
          ε-closure(&#123;q0&#125;) = &#123;q0, q1&#125;  // if q0 →ε→ q1
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>The move function</Typography>
        <Typography paragraph color="text.secondary">
          move(T, a) = the set of all NFA states reachable from any state in T by following
          exactly one transition labelled with symbol a.
        </Typography>
        <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1, fontFamily: 'monospace', fontSize: '0.85rem' }}>
          move(&#123;q0, q1&#125;, 'a') = &#123;q0, q1&#125;  // all states reachable via 'a'
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Core idea</Typography>
        <Typography paragraph color="text.secondary">
          Each DFA state represents a <em>subset</em> of NFA states — the set of NFA states
          the machine could possibly be in. We start with ε-closure(&#123;q₀&#125;) and repeatedly
          compute where each symbol takes us, adding new subsets until no new ones are found.
        </Typography>
        <Alert severity="info" icon={<InfoOutlinedIcon />}>
          Worst case: 2^n DFA states for an n-state NFA (one per subset of NFA states).
          In practice, most subsets are unreachable, so real DFAs are typically much smaller.
        </Alert>
      </Box>

      <Divider sx={{ mb: 3 }}><Chip label="Accept States & Complexity" /></Divider>

      <Typography paragraph color="text.secondary">
        A DFA state T is an <strong>accept state</strong> if and only if T contains at least one NFA accept state:
        F_DFA = &#123; T ∈ Q_DFA | T ∩ F_NFA ≠ ∅ &#125;
      </Typography>

      <Typography paragraph color="text.secondary">
        <strong>Space complexity:</strong> O(2^n × k) where n = NFA states, k = alphabet size.
        <br />
        <strong>Time complexity:</strong> O(2^n × n × k) for full construction.
        <br />
        <strong>Simulation after construction:</strong> O(m) per input string of length m — just one state lookup per character.
      </Typography>
    </Paper>
  </Container>
);

export default TheoryPage;