import {
  Box,
  Link,
  Typography
} from "@mui/material";
import { TonConnectButton, TonConnectUIProvider, THEME} from '@tonconnect/ui-react';
import Ton from './walletTon'

import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css'; // 引入样式文件

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        
        {
          <Ton/>
        }
        <button onClick={onClose}>关闭</button>
      </div>
    </>,
    document.body
  );
};

export default Modal;
