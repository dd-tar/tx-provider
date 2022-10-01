import { render } from "react-dom";
import React from 'react';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import App from './App';
import CreateToken from "./routes/create_token";
import MintToken from "./routes/mint_token";
import ChangePrice from "./routes/change_price";
import VerifyAddress from "./routes/verify_address";

export const daoFactoryAddress = "0x89F05c4206613DC4DEff8fAa6DcC336A85a3F38f";
export const baseURI = "http://127.0.0.1:5000"

const rootElement = document.getElementById('root');
render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />}>
                <Route path="create_token" element={<CreateToken />}>
                    <Route path=":name/:symbol/:price" element={<CreateToken />}/>
                </Route>
                <Route path="mint_token" element={<MintToken />}>
                    <Route path=":token_address/:amount" element={<MintToken />} />
                </Route>

                <Route path="change_price" element={<ChangePrice />}>
                    <Route path=":token_address/:new_price" element={<ChangePrice />} />
                </Route>

                <Route path="verify_address" element={<VerifyAddress />}>
                    <Route path=":user_address/:chat_id" element={<VerifyAddress />} />
                </Route>
                <Route
                    path="*"
                    element={
                        <main style={{ padding: "1rem" }}>
                            <p>There's nothing here!</p>
                        </main>
                    }
                />
            </Route>
        </Routes>
    </BrowserRouter>,
    rootElement
);
//  <React.StrictMode>

reportWebVitals();
