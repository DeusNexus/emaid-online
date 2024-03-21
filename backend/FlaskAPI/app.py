from datetime import datetime
from flask import Flask, jsonify
import requests
import threading
from time import sleep

ETH_DECI = 1000000000000000000

state = {
    "last_update": datetime.utcnow().strftime('%m/%d/%Y %H:%M:%S %Z'),
    "omni_burned": -1,
    "gnosis_pending": -1,
    "smart_contract_minted": -1,
    "burned_percentage_total_maid":-1,
    "maid_total_circulating_cap": 452552412,
    "uniswap_data": -1,
    "bitmart_data":-1
}

def set_interval(func, sec):
    def func_wrapper():
        set_interval(func, sec)
        func()
    t = threading.Timer(sec, func_wrapper)
    t.start()
    return t

def get_smart_contract():
    try:
        API_KEY = 'KGFI3PE4NBTR71GPCUK7U2SF1S49H32CZF'
        ETHERSCAN_URL = f'https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0x329c6e459ffa7475718838145e5e85802db2a303&apikey={API_KEY}'

        req = requests.get(ETHERSCAN_URL).json()
        amount_minted = int(int(req["result"]) / ETH_DECI)

        print(datetime.isoformat(datetime.now()),"Amount Minted: ",amount_minted, ' eMAID')
        return int(amount_minted)

    except Exception as e:
        print(datetime.isoformat(datetime.now()),"Etherscan Error:", e)
        return -1

def get_omni_explorer():
    ret_val = -1
    try:
        BURN_ADDRESS = '1LastStepBurnMaidToEMaidXXXXUJ9ChK'
        OMNI_REQUEST_URL = 'https://api.omniwallet.org/v2/address/addr/'

        headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
        }

        data = f'addr={BURN_ADDRESS}'
        req = requests.post(OMNI_REQUEST_URL,headers=headers,data=data).json()
        s = req[BURN_ADDRESS]["balance"]

        for i in s:
            if(i['id'] == '3'):
                print(datetime.isoformat(datetime.now()),"Total Burned: ",i['value'], 'MAID')
                ret_val = int(i['value'])
                return ret_val

    except Exception as e:
        print(datetime.isoformat(datetime.now()),'Error occured getting omniexplorer api: ',e)
        return ret_val

def get_gnosis_queue():
    try:
        pending = []
        pending_tokens = 0

        GNOSIS_SAFE_URL = 'https://safe-transaction-mainnet.safe.global/api/v1/safes/0x981B048fec7CB1ADE6e331691DF339c2F833D165/multisig-transactions/'
        response = requests.get(GNOSIS_SAFE_URL)

        if response.status_code != 200:
            print(datetime.isoformat(datetime.now()), 'Failed to retrieve data. Status code:', response.status_code)
            return -1

        req = response.json()

        if 'results' not in req:
            print(datetime.isoformat(datetime.now()), 'No "results" key in the response:', req)
            return -1

        for index, item in enumerate(req["results"]):
            try:
                if (
                    not item["executionDate"]
                    and 
                    item["isExecuted"] != True 
                    and 
                    datetime.now().timestamp() - datetime.strptime(item["submissionDate"], '%Y-%m-%dT%H:%M:%S.%fZ').timestamp() < 604800000
                ):
                    pending.append(item)
            except KeyError as key_error:
                print(datetime.isoformat(datetime.now()), 'KeyError in processing item:', key_error)
                continue
            except Exception as item_error:
                print(datetime.isoformat(datetime.now()), 'Error processing item:', item_error)
                continue

        for item in pending:
            try:
                data_decoded = item.get('dataDecoded')
                if data_decoded and 'parameters' in data_decoded:
                    parameter_value = data_decoded['parameters'][1]['value']
                    pending_tokens += int(int(parameter_value) / ETH_DECI)
                    print(datetime.isoformat(datetime.now()), 'Updated pending value:', pending_tokens, 'eMAID')
            except (KeyError, TypeError) as tokens_error:
                print(datetime.isoformat(datetime.now()), 'Error processing tokens:', tokens_error)
                continue

        print(datetime.isoformat(datetime.now()), 'Total New Pending:', pending_tokens, 'eMAID')
        return int(pending_tokens)

    except Exception as e:
        print(datetime.isoformat(datetime.now()), "Error occurred!", e)
        return -1

def uniswapv3():
    try:
        URL = 'https://gateway-arbitrum.network.thegraph.com/api/d298f4ad0c843c5e8af2167ae4efa1d0/subgraphs/id/HUZDsRpEVP2AvzDCyzDHtdc64dyDxx8FQjzsmqSg4H3B'
        query = '''
            {
            "query": "{ pool(id: \"0x35593881b7723b39a5bdbcb421e55c1ff1953f4b\") { id feeTier token0Price token1Price token0 { id name symbol } token1 { id name symbol } tick ticks { tickIdx liquidityNet } } }"
            }
        '''
        req = requests.post(URL, headers={'Content-Type':'application/json'},json={'query': query})
        print("Uniswap Response:",req.json())
        data = req.json()['data']['pool']

        print(datetime.isoformat(datetime.now()),f"Uniswap Updated: {data['token0Price']} {data['token1Price']}")
        return data

    except Exception as e:
        print(datetime.isoformat(datetime.now()),"Error occured at UniswapV3!", e)

def bitmart():
    try:
        URL = 'https://api-cloud.bitmart.com/spot/quotation/v3/ticker?symbol=EMAID_USDT'
        req = requests.get(URL)
        data = req.json()['data']

        print(datetime.isoformat(datetime.now()),f"BitMart Updated: {data['symbol']} {data['last']}")
        return data

    except Exception as e:
        print(datetime.isoformat(datetime.now()),"Error occured at BitMart API!", e)

def last_update():
    last_update_str = datetime.utcnow().strftime('%m/%d/%Y %H:%M:%S %Z')
    print( datetime.isoformat(datetime.now()) ,last_update_str)
    return last_update_str

def update_api():
    state["gnosis_pending"] = get_gnosis_queue()
    state["omni_burned"] = get_omni_explorer()
    state["smart_contract_minted"] = get_smart_contract()
    state["burned_percentage_total_maid"] = round((state["smart_contract_minted"] / state['maid_total_circulating_cap']) * 100, 5)
    state["uniswap_data"] = uniswapv3()
    state["bitmart_data"] = bitmart()
    state["last_update"] = last_update()
    print('\n')


#Update every 10 seconds - Get APIs
print("\n")
print(datetime.isoformat(datetime.now()),'Starting api for emaid.online! Initializmaid_btc_price_bittrexing state on first call, then polling every 15 seconds.')
update_api()
sleep(5)
set_interval(update_api, 15)

#Serve API
app = Flask(__name__)

@app.route('/api', methods=['GET'])
def api():
    return jsonify(state), 200

if __name__ == '__main__':
    app.run(debug=False)
