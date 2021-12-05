import React from "react";
import "./App.css";
import Web3 from "web3";

interface Web3ControllerEventListener {
  onUpdate: () => void;
}

class Web3Controller {
  private web3 = new Web3(Web3.givenProvider);

  private eventListeners: Web3ControllerEventListener[] = [];

  private _accounts: string[] = [];
  public get accounts(): string[] {
    return this._accounts;
  }

  public async requestAccounts() {
    this._accounts = await this.web3.eth.requestAccounts();
    this.dispatchEvent("onUpdate");
  }

  public addEventListener(listener: Web3ControllerEventListener) {
    this.eventListeners.push(listener);
  }

  private dispatchEvent(event: keyof Web3ControllerEventListener) {
    this.eventListeners.forEach((listener) => listener[event]());
  }
}

function App() {
  const web3Ref = React.useRef<Web3Controller>();
  const [accounts, setAccounts] = React.useState<string[]>([]);
  const [selectedAccount, setSelectedASccount] = React.useState<
    string | undefined
  >();
  React.useEffect(() => {
    web3Ref.current = new Web3Controller();
    web3Ref.current.addEventListener({
      onUpdate() {
        setAccounts(web3Ref.current?.accounts ?? []);
        setSelectedASccount(web3Ref.current?.accounts[0]);
      },
    });
  }, []);
  const handleOnClick = () => {
    web3Ref.current?.requestAccounts();
  };

  return (
    <div className="App">
      <button onClick={handleOnClick}>Connect Metamask</button>
      {selectedAccount && <h1>{selectedAccount}</h1>}
    </div>
  );
}

export default App;
