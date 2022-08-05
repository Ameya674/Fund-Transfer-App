import React, { useEffect, useState } from 'react'
import './card.css'
import img1 from './images/ethereum.png'
import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'
import {loadContract} from './utils/load-contract';

function Card() {

    const [web3Api, setWeb3Api] = useState({
        provider: null,
        web3: null,
        contract: null
    });

    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);
    const [reload, setReload] = useState(null);

    const reloadEffect = () => setReload(!reload);

    useEffect(() => {
        const loadProvider = async () => {
          
            const provider = await detectEthereumProvider();
            const contract = await loadContract('Fund', provider);
            

            if (provider) {
                provider.request({method: 'eth_requestAccounts'});

                setWeb3Api({
                    web3: new Web3(provider),
                    provider,
                    contract
                });
            }

            else {
                console.error('Please insall Metamask.');
            }
        };

        loadProvider();

    },[]);

    useEffect(() => {
        const loadBalance = async () => {
            const {contract, web3} = web3Api;
            const balance = await web3.eth.getBalance(contract.address);
            setBalance(web3.utils.fromWei(balance, 'ether'));
        };

        web3Api.contract && loadBalance();
    },[web3Api, reload]);

    const transfer = async () => {
        const {contract, web3} = web3Api;
        await contract.transfer({
            from: account,
            value: web3.utils.toWei('2', 'ether')
        });

        reloadEffect();
    };

    const withdraw = async () => {
        const {contract, web3} = web3Api;
        const withdrawAmount = web3.utils.toWei('2', 'ether');
        await contract.withdraw(withdrawAmount, {
            from: account
        });

        reloadEffect();
    };

    useEffect(() => {
        const getAccount = async () => {
            const accounts =  await web3Api.web3.eth.getAccounts();
            setAccount(accounts[0]);
        };

        web3Api.web3 && getAccount();
    },[web3Api.web3]);


  return (
    <div className='container'>
        <div className='card'>
            <div className='box'>
                <div className='content'>
                    <img src = {img1} alt = 'Ethereum logo'/>
                    <h3>Contract Balance: {balance} ETH</h3>
                    <p id = 'head'>Account:</p>
                    <p id = 'account'>{account ? account: 'Please connect an account.'}</p>
                    <div className='buttons'>
                    <button onClick={transfer}><span>Transfer</span><i></i></button> 
                    <button onClick={withdraw}><span>Withdraw</span><i></i></button> 
                </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Card