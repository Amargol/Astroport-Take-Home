import { Flex, Link, Text } from '@chakra-ui/react';
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

const TEST_TO_ADDRESS = 'terra12hnhh5vtyg5juqnzm43970nh4fw42pt27nw9g9';

interface TokenDescriptionProps {
  coin: Coin
  onPressSend: Function
}

export function TokenDescription(props : TokenDescriptionProps) {
  const [txResult, setTxResult] = useState<TxResult | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  return (
    <div>
      <Flex direction={"row"}>
        <Text flex={1}>{props.coin.denom}</Text>
        <Link onClick={() => {props.onPressSend()}} >&#x21AA;Send</Link>
      </Flex>
      <Text opacity={.6}>{props.coin.getBalance()}</Text>
    </div>
  );
}
