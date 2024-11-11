import React from 'react';
import { AppBar, Toolbar, Typography } from "@mui/material";
import { AllInbox } from "@mui/icons-material";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Header({ customButton, visible = true, size = 'normal' }) {
  const appbarStyle = {
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'auto' : 'none',
    transition: 'opacity 0.3s ease',
    width: size === 'small' ? '1px' : '100%', // 当 size 为 'small' 时宽度为 1px
    height: size === 'small' ? '1px' : 'auto', // 当 size 为 'small' 时高度为 1px
    overflow: 'hidden', // 隐藏超出部分
    position: 'absolute', // 绝对定位，可以根据需要进一步调整位置
  };

  return (
    <AppBar position="relative" style={appbarStyle}>
      <Toolbar>
        <AllInbox sx={{ mr: 4 }} />
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          WalletAdapterDemo
        </Typography>
        {customButton ? (
          <div onClick={window.openWalletS}>
            {customButton}
          </div>
        ) : (
          <WalletMultiButton />
        )}
      </Toolbar>
    </AppBar>
  );
}