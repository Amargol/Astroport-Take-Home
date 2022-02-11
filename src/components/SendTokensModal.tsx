import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { Fee, MsgSend } from '@terra-money/terra.js';
import {
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
  coin: Coin | undefined
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}


export function SendTokensModal(props : SendTokensModalProps) {

  let { isOpen, onOpen, onClose } = props

  return (
    <Box>
      {props.coin && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Send {props.coin.denom}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Hello bo
            </ModalBody>
            <ModalFooter>
              {/* <Button variant='ghost'>Secondary Action</Button> */}
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
    
  );
}
