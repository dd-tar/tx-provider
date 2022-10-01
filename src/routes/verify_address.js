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
import {baseURI} from "../index";

/* global BigInt */

export default function VerifyAddress() {

    const params = useParams();
    const user_address = params.user_address;
    const chat_id = params.chat_id;
    let provider = null;

    const [result, setResult] = useState("");

    useEffect(() => {
        setResult('');
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8080");
        const accounts =  async() => {await web3.eth.getAccounts()};

        console.log("use effect started")
        console.log("user_address = ", user_address)
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

                console.log(accounts);
                console.log("account: ", accounts[0]);

                let message = "I am an owner of this address and I want to join " + chat_id + " group";
                let signature = "";
                const getSignature = async()=>{
                    var hex = ''
                    for(var i=0;i < message.length;i++){
                        hex += ''+message.charCodeAt(i).toString(16)
                    }
                    var hexMessage = "0x" + hex
                    console.log("Hex Message: ", hexMessage)
                    var signature = web3.eth.personal.sign(hexMessage, accounts[0])
                    console.log("signature: ", signature)
                    return signature
                };
                // THEN
                getSignature()
                    .then(function (signature){
                        console.log(signature)
                        setResult("Signature successfully received!");

                        // send sig for check to bot
                        const sendMsg = async(json) => {
                            const url = baseURI+'/approve_join';

                            const body = 'chat_id=' + encodeURIComponent(chat_id) + '&user_address=' +
                                encodeURIComponent(user_address) + '&signature=' + encodeURIComponent(signature);
                            let xhr = new XMLHttpRequest();
                            xhr.open('POST', url, true);
                            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                            xhr.send(body);
                        };
                        sendMsg()
                            .then(function (){
                            setResult("Signature successfully received!\nIf you successfully pass the token check," +
                                " you will receive a link to join the group, valid for 2 minutes.");
                        }) // then - SendMsg
                }) // then - getSignature
            }) // then - metamask provider
            .catch(function (error) {
                // Handle error. Likely the user rejected the login
                console.error(error)
            })
    }, [user_address, chat_id]);

    return (
        <ChakraProvider>
            <Box minW='max-content' borderWidth='2px' borderRadius='lg' overflow='hidden' fontSize='2xl' align='center' gap='2'>
                <br /><h3>You're about to sign a message to confirm that you are the owner of the address: <br/> <b>{user_address}</b> </h3><br />
                <Text>In order to sign this message please use MetaMask.</Text>
                <Text>In the mobile version, it will open in a new browser tab.</Text> <br />
            </Box>
            <br />
            <Text color='green' fontSize='2xl' align='center' whiteSpace = 'pre-line'> {result}</Text>
        </ChakraProvider>
    );
}