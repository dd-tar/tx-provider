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
import { ethers} from "ethers";
import Web3 from 'web3';
import { daoFactoryAddress } from "../index";
import FactoryABI from '../abi/DAOFactory.json';



export default function CreateToken() {

    const params = useParams();
    const name = params.name;
    const symbol = params.symbol;
    const price = params.price;
    let provider = null;

    const [result, setResult] = useState("");

    useEffect(() => {
        setResult('');
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8080");
        const accounts =  async() => {await web3.eth.getAccounts()};
        console.log("use effect started")
        console.log("name = ", name)
        if(typeof window.ethereum !== 'undefined') {
            // Ethereum user detected. You can now use the provider.
            provider = window['ethereum']
            console.log('metamask found');
        }
        provider.enable()
            .then(function (accounts) {
                const ethersProvider = new ethers.providers.Web3Provider(provider);
                const factoryContract = new ethers.Contract(daoFactoryAddress, FactoryABI, ethersProvider.getSigner());
                console.log(accounts)
                console.log("account: ",accounts[0]);
                factoryContract.on("DAOTokenCreated",(from, to, value, event)=>{
                    console.log({
                        from: from,
                        to: to,
                        value: value,
                        event: event
                        });

                    setResult("Token created!" +
                            "\nToken address: "+
                            (value['args']['1']).toString()+
                        "\nOwner Address: "+ from +
                            "\nTransaction Hash: "+
                            value['transactionHash']+
                    "\n\nPlease save the address of your token and it's owner address. " +
                        "You will need them to manage the token.");
                });

                const weiPrise = ethers.utils.parseEther(price);
                let transaction = factoryContract.createDAOToken(name, symbol, weiPrise, accounts[0]);
                console.log("tx: ", transaction)

            })
            .catch(function (error) {
                // Handle error. Likely the user rejected the login
                //alert.call(error);
                console.error(error)
            })
    }, [name, symbol, price]);

    return (
        <ChakraProvider>
            <Box minW='max-content' borderWidth='2px' borderRadius='lg' overflow='hidden' fontSize='2xl' alignItems='center' align='center' gap='2'>
                <br /><h3>You're about to create a Token with the following values:</h3><br />
                    <Text as='b' fontSize='3xl' align='center'> Token Name: {name} </Text> <br />
                    <Text as='b' fontSize='3xl' align='center'> Token Symbol: {symbol} </Text> <br />
                    <Text as='b' fontSize='3xl' align='center'> Price: {price} ETH </Text> <br /><br />
                <Text>In order to sign or cancel the creation transaction, please use MetaMask.</Text>
                <Text>In the mobile version, it will open in a new browser tab.</Text> <br />
            </Box>
            <Text color='green' fontSize='2xl' align='center' whiteSpace = 'pre-line'> {result}</Text>
        </ChakraProvider>
    );
}