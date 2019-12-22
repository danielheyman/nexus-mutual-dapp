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
  TableSortLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Grid,
  Divider
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

const styles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: "#f5f5f5",
    margin: 'auto',
    padding: 20,
  },
  title: {
    marginBottom: 30,
    display: 'inline-block',
  },
  row: {
    cursor: "pointer",
  },
  section: {
    margin: theme.spacing(3, 2),
  },
  text: {
    margin: theme.spacing(1, 0),
  },
  red: {
    color: "#ef9a9a",
  },
  green: {
    color: "#a5d6a7",
  },
}));

function stakes(stakes) {
  const classes = styles();
  const sortedStakes = stakes.sort((a, b) => a.created - b.created);
  return (
    <div className={classes.section}>
      <Grid container alignItems="center">
        <Grid item xs>
          <Typography gutterBottom variant="h4">
            Stakes
          </Typography>
        </Grid>
        <Grid item>
          <Typography gutterBottom variant="h6">
            {stakes.length}
          </Typography>
        </Grid>
      </Grid>
      {sortedStakes.map(stake => {
        const date = new Date(stake.created * 1000).toLocaleDateString();
        return (
          <Typography id={stake.id} color="textSecondary" variant="body2" className={classes.text}>
            <span>On {date}, user {stake.user.id.slice(0, 10)}... locked {stake.amount} NXM for {stake.daysToStake} days. </span>
            {stake.burntAmount} NXM has been burnt and {stake.unlockedAmount} NXM has been unlocked.
          </Typography>
        );
      })}
    </div>
  );
}

function covers(covers) {
  const classes = styles();
  const sortedCovers = covers.sort((a, b) => a.created - b.created);
  return (
    <div className={classes.section}>
      <Grid container alignItems="center">
        <Grid item xs>
          <Typography gutterBottom variant="h4">
            Covers
          </Typography>
        </Grid>
        <Grid item>
          <Typography gutterBottom variant="h6">
            {covers.length}
          </Typography>
        </Grid>
      </Grid>
      {sortedCovers.map(cover => {
        const date = new Date(cover.created * 1000).toLocaleDateString();
        const claim = cover.claims.length ? cover.claims[0] : null;
        const premium = parseInt(cover.premium * 1000) / 1000;
        return (
          <Typography id={cover.id} color="textSecondary" variant="body2" className={classes.text}>
            <span>On {date}, for a {premium} ETH premium, user {cover.user.id.slice(0, 10)}... covered {cover.amount} ETH for {cover.daysToCover} days. </span>
            {claim
              ? <span className={classes.red}>A claim has been made with status {claim.status} and verdict {claim.verdict}. It has {claim.voteCount} votes.</span>
              : <span className={classes.green}>No claims have been made.</span>
            }
          </Typography>
        );
      })}
    </div>
  );
}

export default function InsuredContract({ goBack, contract }) {
  const classes = styles();
  return (
    <div className={classes.table}>
      <div>
        <Typography variant="title" className={classes.title}>
          <IconButton
            aria-label="ArrowBackIos"
            color="secondary"
            onClick={goBack}
          >
            <ArrowBackIcon />
          </IconButton>
          Insured Contract {contract.id}
        </Typography>
      </div>
      <div className={classes.root}>
        {stakes(contract.stakes)}
        <Divider variant="middle" />
        {covers(contract.covers)}
      </div>
    </div>
  );
}