import { Box, Button, FormControl, FormHelperText, FormLabel, Heading, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import { Account, Fee, MsgSend } from '@terra-money/terra.js';
import {
  ConnectedWallet,
  CreateTxFailed,
  Timeout,
  TxFailed,
  TxResult,
  TxUnspecifiedError,
  useConnectedWallet,
  useLCDClient,
  UserDenied,
} from '@terra-money/wallet-provider';
import { Coin } from 'index';
import React, { useCallback, useEffect, useState } from 'react';

interface SendTokensModalProps {
  coin: Coin
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  connectedWallet: ConnectedWallet
}


export function SendTokensModal(props : SendTokensModalProps) {

  const { isOpen, onOpen, onClose, connectedWallet } = props
  const [ recipient, setRecipient ] = useState<string>("");
  const [ amount, setAmount ] = useState<string>("");
  const [txResult, setTxResult] = useState<TxResult | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  const onCloseModal = () => {
    setRecipient("")
    setAmount("")
    setTxResult(null);
    setTxError(null);
    onClose()
  }

  const isInputValid = () : boolean => {
    return !!recipient && !!amount
  }

  const sendTokens = () => {
    let connectedWallet = props.connectedWallet

    if (!isInputValid()) {
      return;
    }

    let scaledAmount = Math.floor(parseFloat(amount) * 1000000)

    connectedWallet
    .post({
      fee: new Fee(1000000, '200000uusd'),
      msgs: [
        new MsgSend(connectedWallet.walletAddress, recipient, {
          [props.coin.denom]: scaledAmount,
        }),
      ],
    })
    .then((nextTxResult: TxResult) => {
      console.log(nextTxResult);
      setTxResult(nextTxResult);
    })
    .catch((error: unknown) => {
      if (error instanceof UserDenied) {
        setTxError('User Denied');
      } else if (error instanceof CreateTxFailed) {
        setTxError('Create Tx Failed: ' + error.message);
      } else if (error instanceof TxFailed) {
        setTxError('Tx Failed: ' + error.message);
      } else if (error instanceof Timeout) {
        setTxError('Timeout');
      } else if (error instanceof TxUnspecifiedError) {
        setTxError('Unspecified Error: ' + error.message);
      } else {
        setTxError(
          'Unknown Error: ' +
            (error instanceof Error ? error.message : String(error)),
        );
      }
    });
  }
  
  return (
    <Box>
      {props.coin && (
        <Modal isOpen={isOpen} onClose={onCloseModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Send {props.coin.denom}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {!txResult && !txError && (
                <Box display={"flex"} flexDir={"column"} gap={5}>
                  <FormControl>
                    <FormLabel>Recipient</FormLabel>
                    <Input
                      placeholder='terra12y5m2n9f7e2nmwz5fxtfvujv2ru23trr6pnk6f'
                      type="text" value={recipient}
                      onChange={(e) => {setRecipient(e.target.value)}}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Amount</FormLabel>
                    <Input
                      placeholder='100'
                      type="number" value={amount}
                      onChange={(e) => {setAmount(e.target.value)}}
                    />
                  </FormControl>
                </Box>
              )}
              {txResult && (
                <Box display={"flex"} flexDir={"column"} gap={5}>
                  <Heading>Success</Heading>
                  <Link
                    href={`https://finder.terra.money/${connectedWallet.network.chainID}/tx/${txResult.result.txhash}`}
                    target="_blank"
                  >                
                    <Button colorScheme={"green"} isFullWidth={true}>Open in Terra Finder</Button>
                  </Link>
                </Box>
              )}
              {txError && <Text>{txError}</Text>}
            </ModalBody>
            <ModalFooter>
              {!txResult && !txError && (
                <Button disabled={!isInputValid()} colorScheme='blue' isFullWidth={true} onClick={sendTokens}>
                  Submit
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
    
  );
}
