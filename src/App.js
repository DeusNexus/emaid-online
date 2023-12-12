import './App.css';
import {useState, useEffect} from 'react'
import React from 'react';

function App() {
  const [burnTotal, setBurnTotal] = useState('');
  const [queueAmount, setQueueAmount] = useState('');
  const [emaidTotal, setEmaidTotal] = useState('');
  const [lastUpdate, setLastUpdate] = useState('Never')
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
  // New state for flashing effect
  const [flash, setFlash] = useState(false);
  
  async function getAPI() {
    const response = await fetch('/api',);
    const { omni_burned, gnosis_pending, smart_contract_minted, last_update, burned_percentage_total_maid, maid_total_circulating_cap, uniswap_data } = await response.json();
    
    setBurnTotal(omni_burned);
    setQueueAmount(gnosis_pending);
    setEmaidTotal(smart_contract_minted);
    setBurnedPercentage(burned_percentage_total_maid)
    setMaidCirculating(maid_total_circulating_cap)
    setUniswapTicker(uniswap_data)

    // Set the flash state to true to trigger the flashing effect
    setFlash(true);

    // Set a timeout to reset the flash state after a certain duration
    setTimeout(() => {
      setFlash(false);
    }, 1000);

    // Update the last update time
    setLastUpdate(last_update);
    console.log(omni_burned, gnosis_pending, smart_contract_minted, last_update, burnedPercentage, maidCirculating, uniswapTicker)
  }

  useEffect(() => {
    getAPI();     
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Retrieving new update from API!');
      getAPI();
    }, 10000);
  
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='app'>
        <div className='titles'>
          <p className='safe-title'>Safe Network: Privacy. Security. Freedom.</p>
          <p className='safe-undertitle'>Users of the SAFE Network have full control over their data, while software developers can focus their time building on top of a secure infrastructure.</p>
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
          <div className='refresh-div'>
            <p>Last updated UTC: </p>
            <p>{lastUpdate}</p>
          </div>
          <div className='status' style={(burnTotal >= emaidTotal + queueAmount )?{backgroundColor: 'lightgreen'}:{backgroundColor:'red'}}>
            <p style={{color:'white'}}>{(burnTotal >= emaidTotal + queueAmount ) ? '[OK] The total burned amount is larger or equal to the combined amount of eMAID minted and in the queue.' : '[Alert] The  total of minted eMAID + eMAID queued to be minted is larger than the burned MAID.'}</p>
          </div>
        </div>

        <div className='footer'>
          <div className='api-urls-div'>
            <p><b>eMAID Gnosis Minting Queue</b></p>
            <a href='https://app.safe.global/eth:0x981B048fec7CB1ADE6e331691DF339c2F833D165/transactions/queue' className='emaid-color'><code>https://app.safe.global/eth:0x981B048fec7CB1ADE6e331691DF339c2F833D165/transactions/queue</code></a>
            <p><b>eMAID Ethereum Contract</b></p>
            <a href='https://etherscan.io/token/0x329c6e459ffa7475718838145e5e85802db2a303' className='emaid-color'><code>https://etherscan.io/token/0x329c6e459ffa7475718838145e5e85802db2a303</code></a>
            <p><b>Omni MAID Burn Address - Do NOT send any MAID here before completing the Altcoinomy progress!</b></p>
            <a href='https://www.omniexplorer.info/address/1LastStepBurnMaidToEMaidXXXXUJ9ChK' className='omaid-color'><code>https://www.omniexplorer.info/address/1LastStepBurnMaidToEMaidXXXXUJ9ChK</code></a>
          </div>
        </div>

        <div className='ticker-div'>
          <div className='ticker emaid'>
            <p className='ticker-symbol'>eMAID/USDC Price: </p>
            <p className='ticker-value'>{parseFloat(uniswapTicker['token1Price']).toFixed(3)}</p>
          </div>
          <div className='ticker emaid'>
            <p className='ticker-symbol'>USDC/eMAID Price: </p>
            <p className='ticker-value'>{parseFloat(uniswapTicker['token0Price']).toFixed(3)}</p>
          </div>
        </div>

        <div className='external-links external-links-div'>
          <a href='https://safenetwork.org/'>Safe Network Primer</a>
          <a href='https://safenetforum.org/'>Safe Network Forum</a>
          <a href='https://maidsafe.net/'>MaidSafe Company</a>
          <a href='https://alt.co/'>Altcoinomy</a>
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
