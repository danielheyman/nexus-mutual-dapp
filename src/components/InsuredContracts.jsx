import React from 'react';
import {
  Typography,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel
} from '@material-ui/core';
import InsuredContract from './InsuredContract';

const styles = makeStyles(({
  table: {
    minWidth: 700,
  },
  title: {
    marginBottom: 30,
    display: 'inline-block',
  },
  row: {
    cursor: "pointer",
  }
}));

function SortedHeader({ order, setOrder, fn, label, align }) {
  const handler = _event => {
    const isDesc = order.label === label && order.direction === 'desc';
    setOrder({
      label,
      direction: isDesc ? 'asc' : 'desc',
      fn
    });
  };
  return (
    <TableCell align={align}>
      <TableSortLabel
        active={order.label === label}
        direction={order.direction}
        onClick={handler}
      >
        { label }
      </TableSortLabel>
    </TableCell>
  );
}

function sumAmounts(items) {
  return items.reduce((agg, i) => agg + parseFloat(i.amount), 0);
}

function sumClaims(items) {
  return items.reduce((agg, i) => agg + i.claims.length, 0);
}

export default function InsuredContracts({ contracts }) {
  const classes = styles();
  const [order, setOrder] = React.useState({
    label: 'id',
    direction: 'asc',
    fn: c => c.id
  });
  const [selected, setSelected] = React.useState(null);

  if (selected) {
    const contract = contracts.find(c => c.id === selected);
    return <InsuredContract goBack={() => setSelected(null)} contract={contract} />;
  }

  const sortedContracts = contracts.sort((a, b) => {
    if (order.direction === 'asc') {
      return order.fn(a) > order.fn(b) ? 1 : -1;
    }
    return order.fn(a) < order.fn(b) ? 1 : -1;
  });

  return (
    <div className={classes.table}>
      <Typography variant="title" className={classes.title}>
        {contracts.length} Insured Contracts! You can sort them and click into them to learn more.
      </Typography>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <SortedHeader fn={c => c.id} label="id" order={order} setOrder={setOrder} />
              <SortedHeader fn={c => c.ens} label="ENS" order={order} setOrder={setOrder} />
              <SortedHeader fn={c => c.stakes.length} label="Stake Count" order={order} setOrder={setOrder} align='right' />
              <SortedHeader
                fn={c => sumAmounts(c.stakes)}
                label="NXM Staked"
                order={order}
                setOrder={setOrder}
                align='right' />
              <SortedHeader fn={c => c.covers.length} label="Cover Count" order={order} setOrder={setOrder} align='right' />
              <SortedHeader
                fn={c => sumAmounts(c.covers)}
                label="ETH Covered"
                order={order}
                setOrder={setOrder}
                align='right' />
                <SortedHeader
                  fn={c => sumClaims(c.covers)}
                  label="Claim Count"
                  order={order}
                  setOrder={setOrder}
                  align='right' />
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedContracts.map(({ id, ens, covers, stakes }) => (
              <TableRow className={classes.row} hover key={id} onClick={() => setSelected(id)}>
                <TableCell component="th" scope="row">{id}</TableCell>
                <TableCell>{ens}</TableCell>
                <TableCell align="right">{stakes.length}</TableCell>
                <TableCell align="right">{sumAmounts(stakes)}</TableCell>
                <TableCell align="right">{covers.length}</TableCell>
                <TableCell align="right">{sumAmounts(covers)}</TableCell>
                <TableCell align="right">{sumClaims(covers)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
