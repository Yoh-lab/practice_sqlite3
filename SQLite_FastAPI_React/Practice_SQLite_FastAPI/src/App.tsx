import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import './App.css'
import Kyaku from "./pages/Kyaku";
import Error from "./pages/Error";
import Change from "./pages/Change";

function App() {
  const theme = extendTheme({
    fonts: {
      heading: `'Heading Font Name', sans-serif`,
      body: `'Body Font Name', sans-serif`,
    },
  });

  return (
    <>
      <div
        className="App"
        style={{
          display: "flex",
          minHeight: "100vh",
          textAlign: "center",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* アプリケーション全体のテーマを設定するためにThemeProviderを使用 */}
        <ChakraProvider theme={theme}>
          <div className="" style={{}}>
            {/* ルーティングを設定するためにBrowserRouterを使用 */}
            <BrowserRouter>
              <Routes>
                {/* ルートパスに対するルート要素としてSignInPageコンポーネントを設定 */}
                <Route path={`/`} element={<Kyaku />} />
                {/* /signupパスに対するルート要素としてSignUpPageコンポーネントを設定 */}
                <Route path={`/error`} element={<Error />} />
                {/* <Route path={`/change`} element={<Change />} /> */}
              </Routes>
            </BrowserRouter>
            <div className="progress-bar"></div>
          </div>
        </ChakraProvider>
      </div>
    </>
  );
}

export default App
