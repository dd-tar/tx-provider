import {
    Box,
    ChakraProvider,
    Text
} from "@chakra-ui/react";
import React, {
    useEffect,
    useState
} from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import Web3 from 'web3';
import TokenABI from '../abi/DAOToken.json';

/* global BigInt */

// PRICE & AMOUNT IN WEI !!!

export default function MintToken() {

    const params = useParams();
    const token_address = params.token_address;
    const amount = params.amount;
    let price = 0;
    let provider = null;

    const [result, setResult] = useState("");

    useEffect(() => {
        setResult('');
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8080");
        const accounts =  async() => {await web3.eth.getAccounts()};

        console.log("use effect started")
        console.log("amount = ", amount)
        console.log("token = ", token_address)
        if(typeof window.ethereum !== 'undefined') {
            // Ethereum user detected. You can now use the provider.
            provider = window['ethereum']
            console.log('metamask found');
        }
        else
            alert("Install MetaMask extension!")
        provider.enable()
            .then(function (accounts) {
                const ethersProvider = new ethers.providers.Web3Provider(provider);
                const tokenContract = new ethers.Contract(token_address, TokenABI, ethersProvider.getSigner());
                // получить price
                const getPrice = async() => {
                    const pr = await tokenContract.getPrice();
                    console.log("pr = ", pr)
                    price = pr; // wei: 1e18;
                    console.log("price getPrice through BigInt = ", parseInt(price))
                    return pr;
                };
                getPrice().then( function () {
                    console.log(accounts);
                    console.log("account: ", accounts[0]);

                    console.log("price: ", price)

                    tokenContract.on("TokensMinted", (from, to, value, event) => {
                        console.log({
                            from: from,
                            to: to,
                            value: value,
                            event: event
                        });

                        const ethPrice = price/1e18;
                        setResult("Minted " + amount + " tokens!" +
                            "\nToken address: " + token_address +
                            "\nToken price: " + ethPrice + " ETH"
                        );

                    });

                    // calculate tx value
                    const floatAmount = parseFloat(amount);
                    const ETHCost = ((price / 1e18) * floatAmount).toString();
                    // calculate amount of token wei to mint
                    const weiAmount = BigInt(floatAmount * 1e18);
                        console.log(
                            "wei price: " + price +
                            "\nwei amount: " + weiAmount +
                            "\nETH cost: " + ETHCost
                        );

                    const options = {value: ethers.utils.parseEther(ETHCost)} //ETH to wei
                    console.log(options.value.toString())

                    let transaction = tokenContract.mint(weiAmount, options);
                    console.log(transaction);

                })//then - price
            })//then - provider
            .catch(function (error) {
                // Handle error. Likely the user rejected the login
                // alert.call(error);
                console.error(error)
            })
    }, [token_address, amount]);

    return (
        <ChakraProvider>
            <Box minW='max-content' borderWidth='2px' borderRadius='lg' overflow='hidden' fontSize='2xl' alignItems='center' align='center' gap='2'>
                <br /><h3>You're about to mint <b>{amount}</b> tokens <br />of <b>{token_address}</b> contract.</h3><br />
                <Text>In order to sign or cancel the mint transaction, please use MetaMask.</Text>
                <Text>In the mobile version, it will open in a new browser tab.</Text> <br />
            </Box>
            <Text color='green' fontSize='2xl' align='center' whiteSpace = 'pre-line'> {result}</Text>
        </ChakraProvider>
    );
}