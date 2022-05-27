# NEAR Notary

This project was initially coded on Ethereum and was presented to HackFS 2021.
It has been ported to NEAR as part of the NEAR certified developper certification.

The aim of the project is to provide a decentralized solution to document signing and certification. 

## Safe document storage

NEAR notary leverage the public IPFS network (through web3.storage) to store documents. Users don't have to care about storing and backing up their documents as this feature is provided by the underlying technology. 

## Document templating

NEAR notary provide standard documents customizable templates. Users can quickly create documents by entering few details and save time.

## Next steps

* Implement documents browsing;
* Improve UI;
* Implement document encryption;
* Implement NFT minting to store encrypted info needed to access the file: NFT won't act as an authorization token and token transfer won't grant access to the file to the new owner;
