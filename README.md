
# Basic Ethereum Wallet App

A basic Ethereum Wallet App that let's you create an Ethereum Wallet and make transactions



## Instructions

Clone the repository

```
  git clone https://github.com/TomasMartinez0017/ethereum-wallet-app.git
  cd ethereum-wallet-app
```
Install dependencies

```
  npm i
```    
Go to [Alchemy](https://auth.alchemy.com/) and create an account.

Inside Alchemy go to "Apps" and select "Create new app".

Select "Ethereum" for the "Chain" and "Ethereum Sepolia" for the "Network".

The name of the application is up to you but I recommend naming it "My Wallet".

Once the app is created click on "API Key".

Copy the "HTTPS" link.

Go to `App.tsx` file and change the provider URL with the URL copied before:

```
    const provider = new JsonRpcProvider(
      // This link is from my Alchemy account.
      // Change it with your account as explained in the README
      'https://eth-sepolia.g.alchemy.com/v2/_G7OFTzhrUX6QCZRFCvlP8XMIhHaYYOX' 👈
    );
```

You are ready now to run the application:
```
   npm run dev
```
## Sepolia Faucet

Once you create a wallet with the application you might want to add some ETH to it.

Go to https://sepoliafaucet.com/ and insert the address of the wallet you just created. Then click on "Send Me ETH". This will send 0.5 ETH to your new wallet.

You can send 0.5 ETH per day.


## Further recommendations
If you want to test the "Transfet to" functionality I recommend creating a [Metamask](https://metamask.io/) account and creating a wallet there.

### Note
If you don't see the ETH transfered in your Metamask account it's possible you are on the wrong network. You have to select "Show tests networks" and click on Sepolia.
