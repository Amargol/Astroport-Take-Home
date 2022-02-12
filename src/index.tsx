import { Box, Button, ChakraProvider, Flex, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure } from '@chakra-ui/react';
import { Fee, Int, MsgSend, Numeric } from '@terra-money/terra.js';
import { getChainOptions, TxResult, useConnectedWallet, useLCDClient, WalletProvider } from '@terra-money/wallet-provider';
import { ConnectWallet } from 'components/ConnectWallet';
import { SendTokensModal } from 'components/SendTokensModal';
import { TokenDescription } from 'components/TokenDescription';
import { TxSample } from 'components/TxSample';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './style.css';

export class Coin {
  denom: string;
  amount: Numeric.Output;

  getBalance () : string {
    let amount = this.amount.dividedBy(1000000)
    amount = amount.times(100).round().dividedBy(100)
    return amount.toString()
  }

  constructor (denom : string, amount : Numeric.Output) {
    this.denom = denom
    this.amount = amount
  }
}

function App() {

  const lcd = useLCDClient();
  const connectedWallet = useConnectedWallet();

  const [coins, setCoins] = useState<Coin[]>([]);
  const [activeCoin, setActiveCoin] = useState<Coin>();
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    if (connectedWallet) {
      coins
      lcd.bank.balance(connectedWallet.walletAddress, ).then(([coins]) => {
        console.log(coins)
        console.log(coins.toString())

        coins.map((coin) => {console.log(coin.amount.toString())})
        
        let balances = coins.map(coin => new Coin(coin.denom, coin.amount))
        setCoins(balances)
      });
    } else {
      setCoins([]);
    }
  }, [connectedWallet, lcd]);

  let openModal = (coin : Coin) => {
    setActiveCoin(coin)
    onOpen()
  }

  return (
    <main>
      {connectedWallet && activeCoin && 
        <SendTokensModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} coin={activeCoin} connectedWallet={connectedWallet}/>
      }
      <Flex height="100vh" alignItems="center" justifyContent="center" backgroundColor={"gray.200"} >
        <Flex direction="column" background="#000D37" color={"white"} p={12} rounded={20} width="100%" maxWidth={700} gap={3} boxShadow="dark-lg">
          <Heading>Send Tokens</Heading>
          <ConnectWallet />
          <Flex flexDir={"column"} backgroundColor="#0D1840" borderWidth={"3px"} borderColor="#253054" p={6} rounded={6} gap={5}>
            
            { // List all tokens
              coins.length != 0 &&
              coins.map((coin) => (
                <TokenDescription key={coin.denom} coin={coin} onPressSend={() => {openModal(coin)}} />
              ))
            }

            { // Loading Indicator
              coins.length == 0 && connectedWallet && 
              <Flex direction={"row"} alignItems={"center"} justifyContent={"center"} textAlign={"center"}>
                <Spinner mr={3}/>Fetching Your Tokens
              </Flex>
            }

            { // Connect Wallet Message
              !connectedWallet && 
              <Text align={"center"} opacity={.6}>Please connect wallet to continue</Text>
            }
          </Flex>
          </Flex>
      </Flex>
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
