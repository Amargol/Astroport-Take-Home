import { Box, Button, ChakraProvider, Flex, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { Fee, Int, MsgSend, Numeric } from '@terra-money/terra.js';
import { getChainOptions, TxResult, useConnectedWallet, useLCDClient, WalletProvider } from '@terra-money/wallet-provider';
import { Connect } from 'components/Connect';
import { ConnectSample } from 'components/ConnectSample';
import { CW20TokensSample } from 'components/CW20TokensSample';
import { NetworkSample } from 'components/NetworkSample';
import { QuerySample } from 'components/QuerySample';
import { SendTokensModal } from 'components/SendTokensModal';
import { SignBytesSample } from 'components/SignBytesSample';
import { SignSample } from 'components/SignSample';
import { TokenDescription } from 'components/TokenDescription';
import { TxSample } from 'components/TxSample';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './style.css';

export class Coin {
  denom: string;
  amount: string;
  decimals: number;

  constructor (denom : string, amount : string, decimals : number) {
    this.denom = denom
    this.amount = amount
    this.decimals = decimals
  }
}

function App() {

  const lcd = useLCDClient();
  const connectedWallet = useConnectedWallet();

  const [bank, setBank] = useState<Coin[]>([]);
  const [coin, setCoin] = useState<Coin>();
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    if (connectedWallet) {
      bank
      lcd.bank.balance(connectedWallet.walletAddress, ).then(([coins]) => {
        console.log(coins)
        console.log(coins.toString())

        coins.map((coin) => {console.log(coin.amount.toString())})
        
        let balances = coins.map(coin => new Coin(coin.denom, coin.amount.toString(), 0))
        setBank(balances)
      });
    } else {
      setBank([]);
    }
  }, [connectedWallet, lcd]);

  let openModal = (coin : Coin) => {
    setCoin(coin)
    onOpen()
  }

  return (
    <main
      // style={{ margin: 20, display: 'flex', flexDirection: 'column', gap: 40 }}
    >
      {connectedWallet && coin && 
        <SendTokensModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} coin={coin} connectedWallet={connectedWallet}/>
      }
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Flex direction="column" background="#000D37" color={"white"} p={12} rounded={6} width="100%" maxWidth={700} gap={3}>
          <Heading>Send Tokens</Heading>
          <Connect />
          {/* {bank && <pre>{bank}</pre>} */}
          <Flex flexDir={"column"} backgroundColor="#0D1840" borderWidth={"3px"} borderColor="#253054" p={6} rounded={6} gap={5}>
            {
              bank.map((coin) => (
                <TokenDescription key={coin.denom} coin={coin} onOpen={() => {openModal(coin)}} />
              ))
            }
          </Flex>
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
