import styles from "./App.module.scss";

import { Match, Switch, createSignal } from 'solid-js';
import { Wallet, HDNodeWallet, JsonRpcProvider, formatEther } from 'ethers';
import { parseEther } from 'ethers';
import CryptoJS from 'crypto-js';

function App() {
  const [step, setStep] = createSignal(1);
  const [password, setPassword] = createSignal('');
  const [phrase, setPhrase] = createSignal('');
  const [wallet, setWallet] = createSignal<Wallet | HDNodeWallet | null>(null);

  const [balance, setBalance] = createSignal('0');
  const [recipientAddress, setRecipientAddress] = createSignal('');
  const [amount, setAmount] = createSignal('0');
  const [etherscanLink, setEtherscanLink] = createSignal('');

  const provider = new JsonRpcProvider(
    //This link is from my Alchemy account.
    'https://eth-sepolia.g.alchemy.com/v2/_G7OFTzhrUX6QCZRFCvlP8XMIhHaYYOX'
  );
  const key = localStorage.getItem('encryptedPrivateKey');

  const createWallet = () => {
    const mnemonic = Wallet.createRandom().mnemonic;
    mnemonic && setPhrase(mnemonic.phrase);

    const wallet = HDNodeWallet.fromMnemonic(mnemonic!);

    wallet.connect(provider);
    setWallet(wallet);

    encryptAndStorePrivateKey();

    setStep(2);
  };

  const encryptAndStorePrivateKey = () => {
    const encryptedPrivateKey = CryptoJS.AES.encrypt(
      wallet()!.privateKey,
      password()
    ).toString();

    localStorage.setItem('encryptedPrivateKey', encryptedPrivateKey);
  };

  const transfer = async () => {
    try {
      const transaction = await wallet()!.sendTransaction({
        to: recipientAddress(),
        value: parseEther(amount()),
      });
  
      setEtherscanLink(`https://sepolia.etherscan.io/tx/${transaction.hash}`);
    } catch (error) {
      console.error('Transaction error:', error);
    }
  };

  const loadWallet = async () => {
    const bytes = CryptoJS.AES.decrypt(key!, password());
    const privateKey = bytes.toString(CryptoJS.enc.Utf8);
  
    const wallet = new Wallet(privateKey, provider);
    setWallet(wallet);
  
    const balance = await wallet.provider!.getBalance(wallet.address);
    setBalance(formatEther(balance!));
    setStep(3);
  };

  return (
    <div class={styles.container}>
      <div class={styles.card}>
        <h1 class={styles.heading}>Ethereum Wallet App</h1>
        <Switch>
          <Match when={step() === 1}>
            <input
              type="password"
              placeholder="Enter password"
              value={password()}
              onChange={(e) => setPassword(e.target.value)}
              class={styles.input}
            />
            <button class={styles.button}onClick={() => (key ? loadWallet() : createWallet())}>
              {key ? 'Load Wallet' : 'Create Wallet'}
            </button>
          </Match>
          <Match when={step() === 2}>
            <p class={styles.label}>Save the following prhase in a secure location</p>
            <div class={styles.label}>{phrase()}</div>
            <button class={styles.button} onClick={() => setStep(3)}>Done</button>
          </Match>
          <Match when={step() === 3}>
            <p class={styles.label}>Wallet Address: {wallet()?.address}</p>
            <p class={styles.label}>Balance: {balance()}</p>

            <p class={styles.label}>Transfer to</p>

            <div class={styles.transferSection}>
              <input
                class={styles.input}
                placeholder="Recipient Address"
                value={recipientAddress()}
                onChange={(e) => setRecipientAddress(e.target.value)}
              />

              <input
                class={styles.input}
                placeholder="Amount"
                value={amount()}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {etherscanLink() && (
              <a class={styles.link} href={etherscanLink()} target="_blank">
                View on Etherscan
              </a>
            )}
            <button class={styles.button} onClick={transfer}>Transfer</button>
          </Match>
        </Switch>
      </div>
      
    </div>
  );
}

export default App;