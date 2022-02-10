import { Button, ChakraProvider, Flex, Heading } from '@chakra-ui/react';
import { getChainOptions, WalletProvider } from '@terra-money/wallet-provider';
import { Connect } from 'components/Connect';
import { ConnectSample } from 'components/ConnectSample';
import { CW20TokensSample } from 'components/CW20TokensSample';
import { NetworkSample } from 'components/NetworkSample';
import { QuerySample } from 'components/QuerySample';
import { SignBytesSample } from 'components/SignBytesSample';
import { SignSample } from 'components/SignSample';
import { TxSample } from 'components/TxSample';
import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';

function App() {
  return (
    <main
      // style={{ margin: 20, display: 'flex', flexDirection: 'column', gap: 40 }}
    >
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Flex direction="column" background="gray.100" p={12} rounded={6} width="100%" maxWidth={700}>
          <Heading>Send Tokens</Heading>
          <Connect />
        </Flex>
      </Flex>
      <div className="content">
        <Connect />
      </div>
      <ConnectSample />
      <QuerySample />
      <TxSample />
      <SignSample />
      <SignBytesSample />
      <CW20TokensSample />
      <NetworkSample />
    </main>
  );
}

getChainOptions().then((chainOptions) => {
  ReactDOM.render(
    <WalletProvider {...chainOptions}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </WalletProvider>,
    document.getElementById('root'),
  );
});
