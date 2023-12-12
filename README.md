# eMAID.online Tracker

This project provides a real-time tracker for MaidSafeCoin (MAID) to Ethereum eMAID conversions, including information on burned MAID, pending eMAID transactions, and more.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [External Links](#external-links)
- [Dependencies](#dependencies)
- [Contact](#contact)

## Overview

The eMAID.online Tracker is a web application built using React and Flask that fetches real-time data from various sources, including the Omni Explorer, Gnosis Safe, and Uniswap. It provides a dashboard with information on burned MAID, pending eMAID transactions, and the latest eMAID/USDC price on Uniswap.

## Features

- Real-time tracking of burned MAID, pending eMAID transactions, and more.
- Continuous updates every 10 seconds from various APIs.
- Displays eMAID/USDC price from Uniswap.

## Getting Started

To run the project locally, follow these steps:

1. Clone the repository:
```bash
git clone https://github.com/DeusNexus/emaid-online.git
cd emaid-online
```

2. Install dependencies:
```bash
npm install
pip install -r backend/FlaskAPI/requirements.txt
```

3. Run the Flask API server:
```bash
python3 backend/FlaskAPI/app.py
```

4. Serve the React website, e.g. on localhost
```bash
npm start
```

The app will be accessible at http://localhost:3000.

## Usage
Once the application is running, open your web browser and navigate to http://localhost:3000 to view the eMAID.online Tracker dashboard.
API Endpoints
    /api: Fetches real-time data including burned MAID, pending eMAID transactions, and more.

## External Links
eMAID Gnosis Minting Queue: https://app.safe.global/eth:0x981B048fec7CB1ADE6e331691DF339c2F833D165/transactions/queue
eMAID Ethereum Contract: https://etherscan.io/token/0x329c6e459ffa7475718838145e5e85802db2a303
Omni MAID Burn Address: https://www.omniexplorer.info/address/1LastStepBurnMaidToEMaidXXXXUJ9ChK

## Dependencies
    React
    Flask
    requests

## Contact
For any issues or questions regarding the tracker, please contact @DeusNexus.