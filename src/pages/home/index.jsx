import React, { useContext, useEffect, useState } from "react";
import { ParticleNetwork } from "@particle-network/auth";
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import axios from "axios";
import {EventBus, BUS_EVENT} from '../../eventBus'
import { Toast } from 'antd-mobile'
import { TonConnectUI } from '@tonconnect/ui'
import { WalletTgSdk } from '@uxuycom/web3-tg-sdk'
import { TonConnectButton } from '@tonconnect/ui-react';
import clsx from 'clsx'
import Modal from '../../components/tonWallet'
import CryptoJS from 'crypto-js'
import FloatingWalletComponent from "../../components/testTon";

window.isProduction = true

const BASE_URL = 'https://api.infinitytest.cc/api/v1';
const DEFAULT_CHAIN_ID_PRODUCTION = '0x38' // BSC
const DEFAULT_CHAIN_ID_DEV = '0x61' // BSC

const WALLET_TYPE = {
  "OKX Wallet": "okx",
  "Solflare": "solflare",
  "Trust": "trust",
  "Phantom": "phantom",
}

  let provider;
  let signer;
  let contract;
  let usdt;

const tokens = {
  USDT: {
      address: "0x5Edcc27AD022551fA16CE1AC9EdB3baB99e1da2D",
      decimals: 6,
      symbol: "USDT"
  },
  // 添加更多代币，确保地址正确
  /*BUSD: {
      address: "BUSD合约地址",
      decimals: 18,
      symbol: "BUSD"
  }*/
};

// Contract addresses
const contractAddress = "0xa86Db50F404336a73fD394097bAf13dE7C7B6531";
const usdtAddress = tokens.USDT.address;

// Contract ABI
const contractABI = [
  "function setUserLevel(address user, uint8 level)",
  "function getUserLevel(address user) view returns (tuple(uint8 level, uint256 dailyRewards, uint256 lastClaim))",
  "function claimReward(uint256 amount)",
  "function getContractBalance() view returns (uint256)",
  "function depositUSDT(uint256 amount)",
  "function setLevelWithSignature(address user, uint8 newLevel, bytes signature)",
];

const tokenABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

const production_contract = '0x4CEd119368511Ff582A937B19a68e977356e0BB6'
const dev_contract = '0xa86Db50F404336a73fD394097bAf13dE7C7B6531'


export default function HomePage() {

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const walletTgSdk = new WalletTgSdk()
  const { ethereum } = walletTgSdk
  window.uxuyethereum = ethereum
  const [ chainId ,setChainId] = useState(window.isProduction ? DEFAULT_CHAIN_ID_PRODUCTION : DEFAULT_CHAIN_ID_DEV)
  const [ address, setAddress ] = useState("")

  const [btnLoadingConnect, setBtnLoadingConnect] = useState(false)

  const [notification, setNotification] = useState(null)

  const showNotification = (message, isSuccess = true) => {
    setNotification({ message, isSuccess });
    Toast.show({
      content: (
        <div
          className={clsx('text-body2', 'font-normal', 'text-center', isSuccess ? 'text-White' : 'text-White')}
          style={{ 
            whiteSpace: 'nowrap', // 确保文本不会换行
            overflow: 'hidden', // 隐藏溢出的内容
            textOverflow: 'ellipsis', // 超出部分显示省略号
            fontSize: '13px', // 调整字体大小
            maxWidth: '100%', // 设置最大宽度为容器宽度，防止溢出
          }}
        >
          {message}
        </div>
      ),
      position: 'top',
      maskClassName: 'bg-bg_0',
      duration: 3000
    });
  };

  window.showNotification = showNotification

  useEffect(() => {
    //refresh()
    const tg = window?.Telegram?.WebApp;
    if(tg){
      tg.ready();
      tg.expand();

      try {
        tg.setHeaderColor('#000000')
      } catch (error) {
        tg.setHeaderColor('secondary_bg_color')
      }


    }
    // 先初始化, 再全屏设置

    //定义环境
    
    const spineJsonUrl = 'asserts/body.json';
    const spineAtlasUrl = 'asserts/body.atlas';
    const spineImageUrl = 'asserts/body.png';

    // const spinePlayer = new SpinePlayer({
    //   jsonUrl: 'asserts/body',
    //   atlasUrl: 'asserts/body',
    //   imgPathPrefix: 'asserts/body'
    // });

    // spinePlayer.addToDOM(document.body);
    // // 播放动画
    // spinePlayer.play('idle');

    // // 暂停动画
    // spinePlayer.pause();

    // // 恢复动画
    // spinePlayer.resume();

    window.axios = axios

    window.startCanvas()
    window.eventBus = new EventBus();
    window.gameLoaded = false
    window?.eventBus?.subscribe('GAME_VIEW_LOADED', async (data) => {

    });
    window?.eventBus?.subscribe('USE_WALLET_CONNECT', async (data) => {

    });
  }, []);

  const tonWalletConnect = async () =>{
    const ton = new TonConnectUI()
    await ton.openModal()
  }

  const switchChain = async (chainId) => {
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainId }],
      });
      showNotification("Chain switched successfully");
    } catch (error) {
      console.error("Chain switch failed:", error);
      showNotification("Failed to switch chain", false);
    }
  };

  const uxuyWalletConnect = async ()=>{
    setBtnLoadingConnect(true)
    try {
      await ethereum.request({
        method: 'eth_requestAccounts',
        params: [],
      })
      
      //const accounts = await ethereum.request({ method: 'eth_accounts', params: [] })
      //const chainId = await ethereum.request({ method: 'eth_chainId', params: [] })
      //setAddress(accounts[0])
      setChainId(chainId)
      showNotification('Wallet connected successfully')  

      switchChain(window.isProduction ? DEFAULT_CHAIN_ID_PRODUCTION : DEFAULT_CHAIN_ID_DEV)

      await initSigner()
      
    } catch (error) {
      console.error('Connection failed:', error)
      showNotification('Failed to connect wallet', false)
    }
    setBtnLoadingConnect(false)
  }

  const initSigner = async()=>{
    provider = new window.ethers.providers.Web3Provider(window.uxuyethereum);
    signer = provider.getSigner();
    contract = new window.ethers.Contract(window.isProduction ? production_contract : dev_contract, contractABI, signer);
    console.log('========contract', contract)
    window.contract = contract
  }

  const setLevelWithSignature = async (address, level, sig)=>{
    if (!contract) {
      //alert('Please connect wallet first');
      return;
    }
    try {
      const tx = await contract.setLevelWithSignature(address, level, sig);
      //const tx = await contract.setUserLevel(address, level);
      await tx.wait();
    } catch (error) {
      console.log('=====setLevel error')
    }


    console.log("Level updated successfully");
  }

  const claimReward = async (count)=> {
    try {
      if (!contract) {
          //alert('Please connect wallet first');
          return;
      }
      console.log('=====count_origin',count)
      const amount = window.ethers.utils.parseUnits(`${count}`, window.isProduction ? 18 : 6);
      console.log('=====amount',amount)
      const tx = await contract.claimReward(amount);
      window.recent_tx = tx
      console.log('=====tx',tx)
      await tx.wait();

      ///alert('Reward claimed successfully!');
      //await checkAllTokenBalances();
    } catch (error) {
        console.error('Error claiming reward:', error);
        alert('Error claiming reward: ' + error.message);
    }
  }

  const checkLevel = async (address)=>{
    try {
      if (!contract) {
          //alert('Please connect wallet first');
          return;
      }
      const userInfo = await contract.getUserLevel(address);
      return userInfo.level
  } catch (error) {
      console.error('Error checking user:', error);
      // ('Error checking user: ' + error.message);
  }
  }

  // 定义一个发送 HTTPS 请求的方法
  const postToAuth = (data, path) => {
    if(window.walletPosting){
      return
    }
    window.walletPosting = true
    window.eventBus.publish(BUS_EVENT.SHOW_LOADING);
    axios.post(`${BASE_URL}${path}`, data)
      .then((response) => {
        console.log('Response:', response.data);
        window.walletPosting = false
        //游戏登录页面
        window.eventBus.publish(BUS_EVENT.WALLET_LOGIN, response.data);
      })
      .catch((error) => {
        window.walletPosting = false
        window.walletLoginState = false
        console.error('Error:', error);
      });
  };

  window.tonWalletConnect = tonWalletConnect
  window.uxuyWalletConnect = uxuyWalletConnect

  window.initSigner = initSigner
  window.setLevelUpdate = setLevelWithSignature
  window.claimReward = claimReward
  window.checkLevel = checkLevel

  return (
    
    <div className="container">
      <div id="GameDiv">
    <canvas id="GameCanvas"></canvas>
    {/* <FloatingWalletComponent /> */}
    <div>
      {/* <button onClick={openModal}>打开模态框</button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h1>这是一个模态框</h1>
        <p>这里是一些内容...</p>
      </Modal> */}
    </div>
  </div>
    </div>
    
  );
}
