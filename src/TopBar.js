import React from 'react';
import './TopBar.css'

const TopBar = ({ links, tickers }) => {
  return (
    <div className='top-bar'>
      <div className='links'>
        {links.map((link) => (
          <a key={link.id} href={link.url}>
            {link.text}
          </a>
        ))}
      </div>

      <div className='ticker-container'>
        <div class="hwrap"><div class="hmove">
          {tickers.map((ticker) => (
            <div key={ticker.label} className='hitem'>
              <p className='ticker-symbol'><b>{ticker.label}: </b></p>
              <p className='ticker-value'>{parseFloat(ticker.price).toFixed(3)}</p>
            </div>
          ))}
        </div></div>
      </div>
    </div>
  );
};

export default TopBar;
