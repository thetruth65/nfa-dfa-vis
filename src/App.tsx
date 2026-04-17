import React, { useState, useMemo } from 'react';
import { Automaton, EPSILON, convertNfaToDfa, Transition } from '@/lib/automata';
import { AutomatonGraph } from '@/components/AutomatonGraph';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

const defaultNfa: Automaton = {
  states: ['q0', 'q1', 'q2'],
  alphabet: ['a', 'b', EPSILON],
  transitions: [
    { id: 't1', from: 'q0', symbol: 'a', to: 'q0' },
    { id: 't2', from: 'q0', symbol: 'b', to: 'q0' },
    { id: 't3', from: 'q0', symbol: 'a', to: 'q1' },
    { id: 't4', from: 'q1', symbol: 'b', to: 'q2' },
  ],
  startState: 'q0',
  acceptStates: ['q2'],
};

export default function App() {
  const [nfa, setNfa] = useState<Automaton>(defaultNfa);
  const [newTransition, setNewTransition] = useState({ from: '', symbol: '', to: '' });
  
  const { dfa, steps } = useMemo(() => convertNfaToDfa(nfa), [nfa]);

  const handleAddTransition = () => {
    if (!newTransition.from || !newTransition.symbol || !newTransition.to) return;
    
    setNfa(prev => {
      const newStates = new Set(prev.states);
      newStates.add(newTransition.from);
      newStates.add(newTransition.to);
      
      const newAlphabet = new Set(prev.alphabet);
      if (newTransition.symbol !== EPSILON) {
        newAlphabet.add(newTransition.symbol);
      }

      return {
        ...prev,
        states: Array.from(newStates),
        alphabet: Array.from(newAlphabet),
        transitions: [
          ...prev.transitions,
          { id: `t_${Date.now()}`, ...newTransition }
        ]
      };
    });
    setNewTransition({ from: '', symbol: '', to: '' });
  };

  const handleRemoveTransition = (id: string) => {
    setNfa(prev => ({
      ...prev,
      transitions: prev.transitions.filter(t => t.id !== id)
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">NFA to DFA Visualizer</h1>
          <p className="text-muted-foreground text-lg">
            Convert a Nondeterministic Finite Automaton (NFA) to a Deterministic Finite Automaton (DFA) using the Subset Construction Method.
          </p>
        </div>

        <Tabs defaultValue="input" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="input">1. Input NFA</TabsTrigger>
            <TabsTrigger value="nfa-graph">2. NFA Graph</TabsTrigger>
            <TabsTrigger value="steps">3. Conversion Steps</TabsTrigger>
            <TabsTrigger value="dfa-graph">4. DFA Graph</TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>NFA Definition</CardTitle>
                  <CardDescription>Define the states and alphabet of your NFA.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Start State</Label>
                    <Input 
                      value={nfa.startState} 
                      onChange={(e) => setNfa({ ...nfa, startState: e.target.value })}
                      placeholder="e.g. q0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Accept States (comma separated)</Label>
                    <Input 
                      value={nfa.acceptStates.join(', ')} 
                      onChange={(e) => setNfa({ ...nfa, acceptStates: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      placeholder="e.g. q2, q3"
                    />
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <Label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground font-semibold">Current States</Label>
                    <div className="flex flex-wrap gap-2">
                      {nfa.states.map(s => (
                        <Badge key={s} variant="secondary" className="font-mono">{s}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground font-semibold">Current Alphabet</Label>
                    <div className="flex flex-wrap gap-2">
                      {nfa.alphabet.map(a => (
                        <Badge key={a} variant="outline" className="font-mono">{a}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Transitions</CardTitle>
                  <CardDescription>Add transitions between states. Use 'ε' for epsilon transitions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 items-end">
                    <div className="space-y-2 flex-1">
                      <Label>From</Label>
                      <Input 
                        value={newTransition.from} 
                        onChange={(e) => setNewTransition({ ...newTransition, from: e.target.value })}
                        placeholder="q0"
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Label>Symbol</Label>
                      <Input 
                        value={newTransition.symbol} 
                        onChange={(e) => setNewTransition({ ...newTransition, symbol: e.target.value })}
                        placeholder="a"
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Label>To</Label>
                      <Input 
                        value={newTransition.to} 
                        onChange={(e) => setNewTransition({ ...newTransition, to: e.target.value })}
                        placeholder="q1"
                      />
                    </div>
                    <Button onClick={handleAddTransition} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <ScrollArea className="h-[250px] w-full rounded-md border p-4 bg-background">
                    <div className="space-y-2">
                      {nfa.transitions.map((t) => (
                        <div key={t.id} className="flex items-center justify-between bg-muted p-2 rounded-md border border-border">
                          <div className="flex items-center gap-2 font-mono text-sm">
                            <span className="font-semibold">{t.from}</span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <Badge variant="outline" className="bg-card text-foreground">{t.symbol}</Badge>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">{t.to}</span>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveTransition(t.id)} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/20">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {nfa.transitions.length === 0 && (
                        <p className="text-center text-muted-foreground text-sm py-4">No transitions added yet.</p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="nfa-graph" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>NFA Visualization</CardTitle>
                <CardDescription>Graphical representation of the input NFA.</CardDescription>
              </CardHeader>
              <CardContent>
                <AutomatonGraph automaton={nfa} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="steps" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Subset Construction Steps</CardTitle>
                <CardDescription>Step-by-step conversion from NFA to DFA.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] w-full rounded-md border bg-background">
                  <Table>
                    <TableHeader className="bg-muted sticky top-0 z-10">
                      <TableRow>
                        <TableHead className="text-muted-foreground font-normal">DFA State (Subset)</TableHead>
                        <TableHead className="text-muted-foreground font-normal">Input Symbol</TableHead>
                        <TableHead className="text-muted-foreground font-normal">Reachable NFA States</TableHead>
                        <TableHead className="text-muted-foreground font-normal">Epsilon Closure (Next DFA State)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {steps.map((step, index) => (
                        <TableRow key={index} className="border-border">
                          <TableCell className="font-mono font-medium">
                            {step.dfaState.length > 0 ? `{${step.dfaState.join(', ')}}` : '∅'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-card font-mono">{step.symbol}</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-muted-foreground">
                            {step.reachableStates.length > 0 ? `{${step.reachableStates.join(', ')}}` : '∅'}
                          </TableCell>
                          <TableCell className="font-mono font-semibold text-primary">
                            {step.nextDfaStateName === '∅' ? '∅' : `{${step.nextDfaStateName}}`}
                          </TableCell>
                        </TableRow>
                      ))}
                      {steps.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                            No steps generated. Please check your NFA definition.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dfa-graph" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>DFA Visualization</CardTitle>
                <CardDescription>Graphical representation of the resulting DFA.</CardDescription>
              </CardHeader>
              <CardContent>
                <AutomatonGraph automaton={dfa} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
