import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";



const POLLING_INTERVAL = 12000;
const RPC_URLS = {
  1: "https://mainnet.infura.io/v3/84842078b09946638c03157f83405213",
  4: "https://rinkeby.infura.io/v3/84842078b09946638c03157f83405213"
};

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
});


// export default function  Content() {
//   const web3React = useWeb3React();

//   console.log(web3React);

//   useEffect(() => {
//     // web3React.activate(new InjectedConnector());

//     const walletconnect = new WalletConnectConnector({
//       rpc: {
//         4: "https://rinkeby.infura.io/v3/86aee73124664f888045b10fe9bdfd14"
//       },
//       bridge: "https://bridge.walletconnect.org",
//       qrcode: true,
//       pollingInterval: 12000
//     });

//     web3React.activate(walletconnect);
//   }, []);

//   useEffect(() => {
//     console.log("new chain id ", web3React.chainId);
//   }, [web3React.chainId]);

//   useEffect(() => {
//     console.log("new account ", web3React.account);

//     if (web3React.account) {
//       web3React.library
//         .getSigner(web3React.account)
//         .signMessage("👋")
//         .then((signature) => {
//           window.alert(`Success!\n\n${signature}`);
//         });
//     }
//   }, [web3React.account]);

//   return (
//     <div className="App">
//       <h1>Hello CodeSandbox</h1>
//       <h2>Start editing to see some magic happen!</h2>
//     </div>
//   );
// }
