import './App.css';
import { useState, useEffect } from 'react'
import React from 'react';
import TopBar from './TopBar';

function App() {
  // New state for flashing effect
  const [flash, setFlash] = useState(false);

  const [burnTotal, setBurnTotal] = useState('');
  const [queueAmount, setQueueAmount] = useState('');
  const [emaidTotal, setEmaidTotal] = useState('');
  
  const [lastUpdate, setLastUpdate] = useState('')

  const [burnedPercentage, setBurnedPercentage] = useState('')
  const [maidCirculating, setMaidCirculating] = useState('')
  const [uniswapTicker, setUniswapTicker] = useState({
    "feeTier": "-1",
    "id": "0x35593881b7723b39a5bdbcb421e55c1ff1953f4b",
    "tick": "",
    "ticks": [
      {
        "liquidityNet": "",
        "tickIdx": ""
      }
    ],
    "token0": {
      "id": "0x329c6e459ffa7475718838145e5e85802db2a303",
      "name": "MaidSafeCoin",
      "symbol": "eMAID"
    },
    "token0Price": "-1",
    "token1": {
      "id": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      "name": "USD Coin",
      "symbol": "USDC"
    },
    "token1Price": "-1"
  })
  const [bitmartTicker, setBitmartTicker] = useState({
    "symbol": "EMAID_USDT",
    "last": "-1",
    "v_24h": "-1",
    "qv_24h":  "-1",
    "open_24h":  "-1",
    "high_24h":  "-1",
    "low_24h":  "-1",
    "fluctuation":  "-1",
    "bid_px":  "-1",
    "bid_sz":  "-1",
    "ask_px":  "-1",
    "ask_sz":  "-1",
    "ts":  "-1"
  })
  
  async function getAPI() {
    const response = await fetch('/api',);
    const { omni_burned, gnosis_pending, smart_contract_minted, last_update, burned_percentage_total_maid, maid_total_circulating_cap, uniswap_data, bitmart_data } = await response.json();

    setBurnTotal(omni_burned);
    setQueueAmount(gnosis_pending);
    setEmaidTotal(smart_contract_minted);
    setBurnedPercentage(burned_percentage_total_maid)
    setMaidCirculating(maid_total_circulating_cap)
    setUniswapTicker(uniswap_data)
    setBitmartTicker(bitmart_data)
    setLastUpdate(last_update);

    console.log(omni_burned, gnosis_pending, smart_contract_minted, last_update, burnedPercentage, maidCirculating, uniswapTicker)
  }

  useEffect(() => {
    setFlash(true);
  
    // Set a timeout to reset the flash state after a certain duration
    const timeoutId = setTimeout(() => {
      setFlash(false);
    }, 1000);
  
    // Clear the timeout if the component unmounts or lastUpdate changes
    return () => clearTimeout(timeoutId);
  }, [lastUpdate]);

  useEffect(() => {
    getAPI();     
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Retrieving new update from API!');
      getAPI();
    }, 1000);
  
    return () => clearInterval(interval);
  }, []);

  const ext_links = [
    { id: 1, url: 'https://www.autonomi.com/', text: 'Autonomi White Paper' },
    { id: 2, url: 'https://autonomi.community/', text: 'Autonomi Forum' },
    { id: 3, url: 'https://maidsafe.net/', text: 'MaidSafe Company' },
    { id: 4, url: 'https://alt.co/', text: 'Altcoinomy' },
  ];

  const tickers = [
    { 
      label: 'Uniswap eMAID/USDC', 
      price: parseFloat(uniswapTicker['token1Price']).toFixed(3) 
    },
    { 
      label: 'Uniswap USDC/eMAID', 
      price: parseFloat(uniswapTicker['token0Price']).toFixed(3) 
    },
    { 
      label: 'BitMart eMAID/USDT', 
      price: parseFloat(bitmartTicker['last']).toFixed(3) 
    }
  ];

  return (
    <div className='app'>
        <TopBar links={ext_links} tickers={tickers}/>

        <div className='titles'>
          <p className='safe-title'>Autonomi Network: Privacy. Security. Freedom.</p>
          <p className='safe-undertitle'>Users of the Autonomi Network have full control over their data, while software developers can focus their time building on top of a secure infrastructure.</p>
          <p className='safe-community-title'>Community Tracker for MaidSafeCoin to Ethereum eMAID</p>
        </div>

        <div className='counters-div'>
          <div className='counter omaid'>
            <p>MAID burned</p>
            <h1>{(burnTotal !== -1) ? burnTotal : 'API Error'}</h1>
            <h1>omni MAID</h1>
          </div>
          <div className='counter emaid'>
            <p>eMAID minted</p>
            <h1>{(emaidTotal !== -1) ? emaidTotal : 'API Error'}</h1>
            <h1>ERC-20 eMAID</h1>
          </div>
          <div className='counter emaid-pending'>
            <p>eMAID pending</p>
            <h1>{(queueAmount !== -1) ? queueAmount : 'API Error'}</h1>
            <h1>ERC-20 eMAID</h1>
          </div>
          <div className='counter combined'>
            <p>Minted & Pending</p>
            <h1>{(queueAmount !== -1) ? emaidTotal + queueAmount : emaidTotal + ' + API Error'}</h1>
            <h1>ERC-20 eMAID</h1>
          </div>
        </div>

        <div className={`refresh-status-div ${flash ? 'flash' : ''}`}>
          <div className='status' style={(burnTotal >= emaidTotal + queueAmount )?{backgroundColor: 'lightgreen'}:{backgroundColor:'red'}}>
            <p style={{color:'white'}}>{(burnTotal >= emaidTotal + queueAmount ) ? '[OK] The total burned amount is larger or equal to the combined amount of eMAID minted and in the queue.' : '[Alert] The  total of minted eMAID + eMAID queued to be minted is larger than the burned MAID.'}</p>
          </div>
          <div className='refresh-div'>
            <p>Last updated UTC: </p>
            <p>{lastUpdate}</p>
          </div>
        </div>

        <div className='footer'>
          <div className='api-urls-div'>
            <h1>Migration Links</h1>
            <p>Do NOT send any MAID here before completing the Altcoinomy progress!</p>
            <div>
              <ul>
                <li>
                  <a className='omaid-color' href='https://www.omniexplorer.info/address/1LastStepBurnMaidToEMaidXXXXUJ9ChK'>Omni MAID Burn Address</a>
                </li>
                <li>
                  <a className='emaid-color' href='https://app.safe.global/eth:0x981B048fec7CB1ADE6e331691DF339c2F833D165/transactions/queue'>eMAID Gnosis Minting Queue</a>
                </li>
                <li>
                  <a className='emaid-color' href='https://etherscan.io/token/0x329c6e459ffa7475718838145e5e85802db2a303'>eMAID Ethereum Contract</a>
                </li>
                <li>
                  <a className='emaid-color' href='https://info.uniswap.org/#/pools/0x35593881b7723b39a5bdbcb421e55c1ff1953f4b'>Uniswap eMAID/USDC</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className='footer-b'>
          <div className='contact-div'>
              <p><i>Contact @DeusNexus for any issues regarding the tracker. Thank you!</i></p>
          </div>
        </div>

    </div>
  );
}

export default App;
