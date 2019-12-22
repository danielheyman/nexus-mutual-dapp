import React from 'react';
import ApolloClient, { gql, InMemoryCache } from 'apollo-boost';
import { ApolloProvider, Query } from 'react-apollo';
import {
  LinearProgress,
  Typography,
  Toolbar,
  AppBar,
  Button,
  makeStyles,
} from '@material-ui/core';
import './App.css';
import Error from './components/Error';
import InsuredContracts from './components/InsuredContracts';
import { GRAPHQL_ENDPOINTS } from './config';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

export default function App() {
  const [network, setNetwork] = React.useState('mainnet');
  const classes = useStyles();
  const isMainnet = network === 'mainnet';

  const client = new ApolloClient({
    uri: isMainnet ? GRAPHQL_ENDPOINTS.mainnet : GRAPHQL_ENDPOINTS.ropsten,
    cache: new InMemoryCache(),
  });
  
  const CONTRACTS_QUERY = gql`
    query insuredContracts {
      insuredContracts(first: 1000) {
        id
        ens
        covers {
          id
          daysToCover
          created
          premium
          amount
          status
          user {
            id
          }
          claims {
            id
            submitDate
            statusUpdateDate
            status
            verdict
            voteCount
            votes {
              submitDate
              verdict
            }
          }
        }
        stakes {
          id
          amount
          unlockedAmount
          burntAmount
          daysToStake
          created
          expires
          user {
            id
          }
        }
      }
    }
  `;

  return (
    <ApolloProvider client={client}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Nexus Mutual ({ network })
          </Typography>
          { isMainnet
            ? <Button color="inherit" onClick={() => setNetwork('ropsten')}>Switch To Ropsten</Button>
            : <Button color="inherit" onClick={() => setNetwork('mainnet')}>Switch To Mainnet</Button>
          }
        </Toolbar>
      </AppBar>
      <div className="App">
        <Query query={CONTRACTS_QUERY}>
          {({ data, error, loading }) => {
            return loading ? (
              <LinearProgress variant="query" style={{ width: '100%' }} />
            ) : error ? (
              <Error error={error} />
            ) : (
              <InsuredContracts contracts={data.insuredContracts} />
            )
          }}
        </Query>
      </div>
    </ApolloProvider>
  );
}