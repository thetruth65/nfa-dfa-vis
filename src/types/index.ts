export const EPSILON = 'ε';

export interface NFATransition {
  id: string;
  from: string;
  symbol: string;
  to: string;
}

export interface NFA {
  states: string[];
  alphabet: string[];
  transitions: NFATransition[];
  startState: string;
  acceptStates: string[];
}

export interface DFAStateInfo {
  id: string;
  displayName: string;
  subset: string[];
  isAccept: boolean;
  isStart: boolean;
  isActive: boolean;
  isNew: boolean;
  isTarget: boolean;
}

export interface DFATransitionInfo {
  id: string;
  from: string;
  to: string;
  symbol: string;
  isNew: boolean;
}

export interface TableRow {
  dfaStateName: string;
  symbol: string;
  reach: string;
  closure: string;
}

export interface AnimationFrame {
  phase: string;
  message: string;
  pseudoCodeLine: number;
  nfaHighlightStates: Array<{ state: string; color: string }>;
  nfaHighlightTransitions: string[];
  dfaStates: DFAStateInfo[];
  dfaTransitions: DFATransitionInfo[];
  tableRows: TableRow[];
  activeTableRow: Partial<TableRow> | null;
  currentReach: string[];
  currentClosure: string[];
}