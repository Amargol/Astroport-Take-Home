import { Button } from '@chakra-ui/react';
import { ConnectType, useWallet, WalletStatus } from '@terra-money/wallet-provider';
import React from 'react';

export function Connect() {
  const {
    status,
    network,
    wallets,
    availableConnectTypes,
    availableInstallTypes,
    availableConnections,
    supportFeatures,
    connect,
    install,
    disconnect,
  } = useWallet();

  return (
    <div>
      
      {status === WalletStatus.WALLET_NOT_CONNECTED && (
        <Button isFullWidth={true} colorScheme="teal" onClick={() => {connect(ConnectType.EXTENSION)}}>Connect Wallet</Button>
      )}

      {status === WalletStatus.WALLET_CONNECTED && (
        <Button isFullWidth={true} colorScheme="teal" className="button" title="disconnect" onClick={() => {disconnect()}}>{wallets[0].terraAddress}</Button>
      )}
    </div>
  );
}