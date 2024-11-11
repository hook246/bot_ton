import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import Ton from './walletTon'
import { TonConnectButton,TonConnectUIProvider } from '@tonconnect/ui-react';

const FloatingWalletComponent = () => {
  const [showComponent, setShowComponent] = useState(false);

  const toggle = () => {
    setShowComponent(!showComponent);
  };

  return (
    <div>
      <Button onClick={toggle}>
        {showComponent ? 'Hide Component' : 'Show Component'}
      </Button>
      {showComponent && (
        <Box
          sx={{
            padding: 2,
            marginTop: 2,
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        >

          {/* <TonConnectUIProvider manifestUrl="https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json">
          <TonConnectButton/>
          </TonConnectUIProvider> */}
          <p>This is the content that will be shown or hidden.</p>
        </Box>
      )}
    </div>
  );
};

export default FloatingWalletComponent;