import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Outlet } from "react-router-dom";
import './App.css';
import {
    ChakraProvider,
    Text
} from "@chakra-ui/react";

export default function App() {
  return (
      <ChakraProvider>
          {/* Calling all values which we have stored in usestate */}
          <Text fontSize='3xl' align='center'><b>ComTokBot Provider</b></Text>

          <Outlet />
      </ChakraProvider>
  );
}
