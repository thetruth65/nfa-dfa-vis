import type { NFA, AnimationFrame, DFAStateInfo, DFATransitionInfo, TableRow } from '../types';
import { EPSILON } from '../types';
import { getEpsilonClosure, getReachableStates, subsetKey, subsetDisplay, subsetNodeId } from './automata';

export function generateAnimationFrames(nfa: NFA): AnimationFrame[] {
  const frames: AnimationFrame[] = [];
  const alphabet = nfa.alphabet.filter(a => a !== EPSILON);

  let discoveredSubsets: string[][] = [];
  let dfaTransitionsList: DFATransitionInfo[] = [];
  let tableRowsList: TableRow[] = [];

  const buildDFAStates = (
    startSubset: string[],
    activeSubset: string[] | null = null,
    newSubset: string[] | null = null,
    targetSubset: string[] | null = null,
  ): DFAStateInfo[] => {
    return discoveredSubsets.map(subset => ({
      id: subsetNodeId(subset),
      displayName: subsetDisplay(subset),
      subset,
      isAccept: subset.some(s => nfa.acceptStates.includes(s)),
      isStart: subsetKey(subset) === subsetKey(startSubset),
      isActive: activeSubset !== null && subsetKey(subset) === subsetKey(activeSubset),
      isNew: newSubset !== null && subsetKey(subset) === subsetKey(newSubset),
      isTarget: targetSubset !== null && subsetKey(subset) === subsetKey(targetSubset),
    }));
  };

  const snapshot = (
    startSubset: string[],
    phase: string,
    message: string,
    pseudoCodeLine: number,
    opts: {
      nfaHighlightStates?: Array<{ state: string; color: string }>;
      nfaHighlightTransitions?: string[];
      activeSubset?: string[] | null;
      newSubset?: string[] | null;
      targetSubset?: string[] | null;
      currentReach?: string[];
      currentClosure?: string[];
      activeTableRow?: Partial<TableRow> | null;
      newTransition?: DFATransitionInfo | null;
    } = {}
  ) => {
    const {
      nfaHighlightStates = [],
      nfaHighlightTransitions = [],
      activeSubset = null,
      newSubset = null,
      targetSubset = null,
      currentReach = [],
      currentClosure = [],
      activeTableRow = null,
      newTransition = null,
    } = opts;

    frames.push({
      phase,
      message,
      pseudoCodeLine,
      nfaHighlightStates,
      nfaHighlightTransitions,
      dfaStates: buildDFAStates(startSubset, activeSubset, newSubset, targetSubset),
      dfaTransitions: newTransition
        ? [...dfaTransitionsList, newTransition]
        : [...dfaTransitionsList],
      tableRows: [...tableRowsList],
      activeTableRow,
      currentReach,
      currentClosure,
    });
  };

  // Compute start state
  const startSubset = getEpsilonClosure([nfa.startState], nfa.transitions);

  snapshot(startSubset, 'init',
    `Computing ε-closure of NFA start state {${nfa.startState}}`,
    2,
    { nfaHighlightStates: [{ state: nfa.startState, color: '#FFD700' }] }
  );

  discoveredSubsets.push(startSubset);

  snapshot(startSubset, 'init_done',
    `ε-closure({${nfa.startState}}) = ${subsetDisplay(startSubset)}  →  DFA start state`,
    2,
    {
      nfaHighlightStates: startSubset.map(s => ({ state: s, color: '#4CAF50' })),
      newSubset: startSubset,
    }
  );

  const worklist: string[][] = [startSubset];
  const processed = new Set<string>();

  snapshot(startSubset, 'worklist_init',
    `WorkList = { ${subsetDisplay(startSubset)} }. Starting main loop...`,
    3,
    {
      nfaHighlightStates: startSubset.map(s => ({ state: s, color: '#4CAF50' })),
      activeSubset: startSubset,
    }
  );

  while (worklist.length > 0) {
    const currentSubset = worklist.shift()!;
    const currentKey = subsetKey(currentSubset);
    if (processed.has(currentKey)) continue;
    processed.add(currentKey);

    snapshot(startSubset, 'pick_state',
      `Processing DFA state ${subsetDisplay(currentSubset)}. Checking each symbol in Σ = {${alphabet.join(', ')}}`,
      7,
      {
        activeSubset: currentSubset,
        nfaHighlightStates: currentSubset.map(s => ({ state: s, color: '#2196F3' })),
      }
    );

    for (const symbol of alphabet) {
      snapshot(startSubset, 'pick_symbol',
        `δ(${subsetDisplay(currentSubset)}, '${symbol}') — computing move then ε-closure`,
        9,
        {
          activeSubset: currentSubset,
          nfaHighlightStates: currentSubset.map(s => ({ state: s, color: '#2196F3' })),
        }
      );

      const reach = getReachableStates(currentSubset, symbol, nfa.transitions);
      const highlightedTransitions = nfa.transitions
        .filter(t => currentSubset.includes(t.from) && t.symbol === symbol)
        .map(t => t.id);

      snapshot(startSubset, 'compute_move',
        `move(${subsetDisplay(currentSubset)}, '${symbol}') = ${subsetDisplay(reach)}`,
        10,
        {
          activeSubset: currentSubset,
          nfaHighlightStates: [
            ...currentSubset.map(s => ({ state: s, color: '#2196F3' })),
            ...reach.map(s => ({ state: s, color: '#FF9800' })),
          ],
          nfaHighlightTransitions: highlightedTransitions,
          currentReach: reach,
          activeTableRow: { dfaStateName: subsetDisplay(currentSubset), symbol, reach: subsetDisplay(reach) },
        }
      );

      const nextSubset = getEpsilonClosure(reach, nfa.transitions);
      const epsilonTransIds = reach.length > 0
        ? nfa.transitions.filter(t => reach.includes(t.from) && t.symbol === EPSILON).map(t => t.id)
        : [];

      snapshot(startSubset, 'compute_closure',
        reach.length > 0
          ? `ε-closure(${subsetDisplay(reach)}) = ${subsetDisplay(nextSubset)}`
          : `move = ∅, next DFA state = ∅`,
        10,
        {
          activeSubset: currentSubset,
          nfaHighlightStates: [
            ...currentSubset.map(s => ({ state: s, color: '#2196F3' })),
            ...nextSubset.map(s => ({ state: s, color: '#E91E63' })),
          ],
          nfaHighlightTransitions: epsilonTransIds,
          currentReach: reach,
          currentClosure: nextSubset,
          activeTableRow: {
            dfaStateName: subsetDisplay(currentSubset),
            symbol,
            reach: subsetDisplay(reach),
            closure: subsetDisplay(nextSubset),
          },
        }
      );

      const nextKey = subsetKey(nextSubset);
      const alreadyKnown = discoveredSubsets.some(s => subsetKey(s) === nextKey);
      const isEmpty = nextSubset.length === 0;

      if (!alreadyKnown && !isEmpty) {
        discoveredSubsets.push(nextSubset);
        worklist.push(nextSubset);

        snapshot(startSubset, 'new_state',
          `New DFA state discovered: ${subsetDisplay(nextSubset)} — added to WorkList`,
          12,
          {
            activeSubset: currentSubset,
            newSubset: nextSubset,
            nfaHighlightStates: nextSubset.map(s => ({ state: s, color: '#4CAF50' })),
            currentClosure: nextSubset,
            activeTableRow: {
              dfaStateName: subsetDisplay(currentSubset),
              symbol,
              reach: subsetDisplay(reach),
              closure: subsetDisplay(nextSubset),
            },
          }
        );
      } else {
        snapshot(startSubset, 'known_state',
          alreadyKnown
            ? `${subsetDisplay(nextSubset)} already discovered — no duplicate added`
            : `move = ∅, dead/trap state (not added to worklist)`,
          12,
          {
            activeSubset: currentSubset,
            targetSubset: alreadyKnown ? nextSubset : null,
            nfaHighlightStates: [
              ...currentSubset.map(s => ({ state: s, color: '#2196F3' })),
              ...nextSubset.map(s => ({ state: s, color: '#9C27B0' })),
            ],
          }
        );
      }

      const transId = `t_${currentKey}_${symbol}_${nextKey}`;
      const newTrans: DFATransitionInfo = {
        id: transId,
        from: subsetDisplay(currentSubset),
        to: isEmpty ? '∅' : subsetDisplay(nextSubset),
        symbol,
        isNew: true,
      };

      tableRowsList.push({
        dfaStateName: subsetDisplay(currentSubset),
        symbol,
        reach: subsetDisplay(reach),
        closure: subsetDisplay(nextSubset),
      });

      dfaTransitionsList.push(newTrans);

      snapshot(startSubset, 'record_transition',
        `Recorded: δ(${subsetDisplay(currentSubset)}, '${symbol}') = ${subsetDisplay(nextSubset)}`,
        11,
        {
          activeSubset: currentSubset,
          targetSubset: !isEmpty ? nextSubset : null,
          newTransition: newTrans,
          nfaHighlightStates: currentSubset.map(s => ({ state: s, color: '#2196F3' })),
        }
      );
    }

    snapshot(startSubset, 'state_done',
      `Finished ${subsetDisplay(currentSubset)}. WorkList has ${worklist.length} state(s) remaining.`,
      7,
      {
        nfaHighlightStates: currentSubset.map(s => ({ state: s, color: '#4CAF50' })),
      }
    );
  }

  const acceptStates = discoveredSubsets
    .filter(s => s.some(state => nfa.acceptStates.includes(state)))
    .map(s => subsetDisplay(s));

  snapshot(startSubset, 'mark_accept',
    `Accept states in DFA: ${acceptStates.length > 0 ? acceptStates.join(', ') : 'none'}`,
    14,
    { nfaHighlightStates: nfa.acceptStates.map(s => ({ state: s, color: '#4CAF50' })) }
  );

  snapshot(startSubset, 'done',
    `✓ Conversion complete! DFA has ${discoveredSubsets.length} state(s) and ${dfaTransitionsList.length} transition(s).`,
    15,
    {}
  );

  return frames;
}