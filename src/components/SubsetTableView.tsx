import React from 'react';
import {
  Paper, TableContainer, Table, TableHead, TableBody,
  TableRow, TableCell, useTheme, Chip,
} from '@mui/material';
import type { TableRow as TRow } from '../types';

interface SubsetTableViewProps {
  rows: TRow[];
  activeRow: Partial<TRow> | null;
}

const SubsetTableView: React.FC<SubsetTableViewProps> = ({ rows, activeRow }) => {
  const theme = useTheme();

  const cellStyle = (isActive: boolean) => ({
    fontFamily: 'monospace',
    fontSize: '0.8rem',
    padding: '6px 12px',
    backgroundColor: isActive ? 'rgba(59,130,246,0.15)' : 'transparent',
    borderBottom: `1px solid ${theme.palette.divider}`,
    transition: 'background-color 0.3s ease',
  });

  return (
    <TableContainer component={Paper} elevation={2} sx={{ maxHeight: 280, overflow: 'auto' }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, bgcolor: 'background.paper' }}>DFA State T</TableCell>
            <TableCell sx={{ fontWeight: 700, bgcolor: 'background.paper' }}>Symbol a</TableCell>
            <TableCell sx={{ fontWeight: 700, bgcolor: 'background.paper' }}>move(T, a)</TableCell>
            <TableCell sx={{ fontWeight: 700, bgcolor: 'background.paper' }}>ε-closure</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              <TableCell sx={cellStyle(false)}>{row.dfaStateName}</TableCell>
              <TableCell sx={cellStyle(false)}>
                <Chip label={row.symbol} size="small" variant="outlined" sx={{ fontFamily: 'monospace' }} />
              </TableCell>
              <TableCell sx={{ ...cellStyle(false), color: '#FF9800' }}>{row.reach}</TableCell>
              <TableCell sx={{ ...cellStyle(false), color: '#10b981', fontWeight: 700 }}>{row.closure}</TableCell>
            </TableRow>
          ))}
          {activeRow && (
            <TableRow sx={{ bgcolor: 'rgba(59,130,246,0.08)' }}>
              <TableCell sx={{ ...cellStyle(true), color: '#60a5fa' }}>{activeRow.dfaStateName ?? '...'}</TableCell>
              <TableCell sx={cellStyle(true)}>
                {activeRow.symbol && (
                  <Chip label={activeRow.symbol} size="small" color="primary" sx={{ fontFamily: 'monospace' }} />
                )}
              </TableCell>
              <TableCell sx={{ ...cellStyle(true), color: '#FF9800' }}>{activeRow.reach ?? '...'}</TableCell>
              <TableCell sx={{ ...cellStyle(true), color: '#E91E63', fontWeight: 700 }}>
                {activeRow.closure ?? '...'}
              </TableCell>
            </TableRow>
          )}
          {rows.length === 0 && !activeRow && (
            <TableRow>
              <TableCell colSpan={4} sx={{ textAlign: 'center', color: 'text.secondary', py: 3 }}>
                Steps will appear here as the algorithm runs...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SubsetTableView;