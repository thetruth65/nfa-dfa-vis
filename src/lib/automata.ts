export const EPSILON = 'ε';

export type State = string;
export type Symbol = string;

export interface Transition {
  id: string;
  from: State;
  symbol: Symbol;
  to: State;
}

export interface Automaton {
  states: State[];
  alphabet: Symbol[];
  transitions: Transition[];
  startState: State;
  acceptStates: State[];
}

export interface ConversionStep {
  dfaState: State[]; // The subset of NFA states
  symbol: Symbol;
  reachableStates: State[]; // NFA states reachable via symbol
  epsilonClosure: State[]; // Epsilon closure of reachableStates (the next DFA state)
  nextDfaStateName: string; // Name of the next DFA state
}

export function getEpsilonClosure(states: State[], transitions: Transition[]): State[] {
  const closure = new Set<State>(states);
  const stack = [...states];

  while (stack.length > 0) {
    const currentState = stack.pop()!;
    for (const t of transitions) {
      if (t.from === currentState && t.symbol === EPSILON && !closure.has(t.to)) {
        closure.add(t.to);
        stack.push(t.to);
      }
    }
  }

  return Array.from(closure).sort();
}

export function getReachableStates(states: State[], symbol: Symbol, transitions: Transition[]): State[] {
  const reachable = new Set<State>();
  for (const state of states) {
    for (const t of transitions) {
      if (t.from === state && t.symbol === symbol) {
        reachable.add(t.to);
      }
    }
  }
  return Array.from(reachable).sort();
}

export function convertNfaToDfa(nfa: Automaton): { dfa: Automaton, steps: ConversionStep[] } {
  const dfaStates: State[][] = [];
  const dfaTransitions: Transition[] = [];
  const steps: ConversionStep[] = [];
  
  const startSubset = getEpsilonClosure([nfa.startState], nfa.transitions);
  dfaStates.push(startSubset);
  
  const dfaStartStateName = startSubset.length > 0 ? startSubset.join(',') : '∅';
  
  const queue = [startSubset];
  const processed = new Set<string>();
  
  let transitionIdCounter = 0;

  while (queue.length > 0) {
    const currentSubset = queue.shift()!;
    const currentSubsetName = currentSubset.length > 0 ? currentSubset.join(',') : '∅';
    
    if (processed.has(currentSubsetName)) continue;
    processed.add(currentSubsetName);
    
    for (const symbol of nfa.alphabet) {
      if (symbol === EPSILON) continue;
      
      const reachable = getReachableStates(currentSubset, symbol, nfa.transitions);
      const nextSubset = getEpsilonClosure(reachable, nfa.transitions);
      const nextSubsetName = nextSubset.length > 0 ? nextSubset.join(',') : '∅';
      
      steps.push({
        dfaState: currentSubset,
        symbol,
        reachableStates: reachable,
        epsilonClosure: nextSubset,
        nextDfaStateName: nextSubsetName
      });
      
      dfaTransitions.push({
        id: `t_${transitionIdCounter++}`,
        from: currentSubsetName,
        symbol,
        to: nextSubsetName
      });
      
      if (!processed.has(nextSubsetName) && !queue.some(s => (s.length > 0 ? s.join(',') : '∅') === nextSubsetName)) {
        queue.push(nextSubset);
        dfaStates.push(nextSubset);
      }
    }
  }
  
  const dfaAcceptStates = dfaStates
    .filter(subset => subset.some(s => nfa.acceptStates.includes(s)))
    .map(subset => subset.length > 0 ? subset.join(',') : '∅');
    
  const dfa: Automaton = {
    states: dfaStates.map(s => s.length > 0 ? s.join(',') : '∅'),
    alphabet: nfa.alphabet.filter(a => a !== EPSILON),
    transitions: dfaTransitions,
    startState: dfaStartStateName,
    acceptStates: dfaAcceptStates
  };
  
  return { dfa, steps };
}
