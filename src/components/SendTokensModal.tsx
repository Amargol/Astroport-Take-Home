import { Box, Button, FormControl, FormHelperText, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
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

  const { isOpen, onOpen, onClose } = props
  const [ recipient, setRecipient ] = useState<string>("");
  const [ amount, setAmount ] = useState<string>("");

  const isInputValid = () : boolean => {
    return !!recipient && !!amount && recipient.indexOf("terra") == 0
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
      onClose()
    })
    .catch((error: unknown) => {
      console.log(error)
    });
  }
  
  return (
    <Box>
      {props.coin && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Send {props.coin.denom}</ModalHeader>
            <ModalCloseButton />
            <ModalBody display={"flex"} flexDir={"column"} gap={5}>
              <FormControl>
                <FormLabel>Recipient</FormLabel>
                <Input
                  placeholder='terra12y5m2n9f7e2nmwz5fxtfvujv2ru23trr6pnk6f'
                  type="text" value={recipient}
                  onChange={(e) => {setRecipient(e.target.value)}}
                />
                {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
              </FormControl>
              <FormControl>
                <FormLabel>Amount</FormLabel>
                <Input
                  placeholder='100'
                  type="number" value={amount}
                  onChange={(e) => {setAmount(e.target.value)}}
                />
                {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
              </FormControl>
            </ModalBody>
            <ModalFooter>
              {/* <Button variant='ghost'>Secondary Action</Button> */}
              <Button disabled={!isInputValid()} colorScheme='blue' isFullWidth={true} onClick={sendTokens}>
                Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
    
  );
}
