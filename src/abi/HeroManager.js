export const HeroManager = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "heroid",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "burnid",
        type: "uint256",
      },
    ],
    name: "CradUpgrade",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "heorid",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "newtypeid",
        type: "uint256",
      },
    ],
    name: "HeroCompsed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "heroid",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "slotid",
        type: "uint256",
      },
    ],
    name: "HeroInSlot",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "heroid",
        type: "uint256",
      },
    ],
    name: "HeroRested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "newcooldown",
        type: "uint256",
      },
    ],
    name: "ReNewSprit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "heroid",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "getxp",
        type: "uint256",
      },
    ],
    name: "UseExpBook",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "mainTokenId",
        type: "uint256",
      },
      {
        internalType: "uint256[4]",
        name: "cards",
        type: "uint256[4]",
      },
    ],
    name: "ComposeHero1",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "mainTokenId",
        type: "uint256",
      },
      {
        internalType: "uint256[7]",
        name: "cards",
        type: "uint256[7]",
      },
    ],
    name: "ComposeHero2",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "mainTokenId",
        type: "uint256",
      },
      {
        internalType: "uint256[19]",
        name: "cards",
        type: "uint256[19]",
      },
    ],
    name: "ComposeHero3",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "slotid",
        type: "uint64",
      },
      {
        internalType: "uint256",
        name: "oldtokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "UpdateHeroSlot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64[]",
        name: "slotid",
        type: "uint64[]",
      },
      {
        internalType: "uint256[]",
        name: "oldtokenId",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "tokenId",
        type: "uint256[]",
      },
    ],
    name: "UpdateHeroSlotBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "mainTokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "subTokenId",
        type: "uint256",
      },
    ],
    name: "UpgradeHero",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "UseExpBookA",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "UseExpBookB",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "UseExpBookC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "UseSpiritDrug",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "resetCard",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nft",
        type: "address",
      },
      {
        internalType: "address",
        name: "drug",
        type: "address",
      },
      {
        internalType: "address",
        name: "door",
        type: "address",
      },
      {
        internalType: "address",
        name: "db",
        type: "address",
      },
      {
        internalType: "address",
        name: "gold",
        type: "address",
      },
      {
        internalType: "address",
        name: "herodata",
        type: "address",
      },
    ],
    name: "setAddresses",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        internalType: "bool",
        name: "cancall",
        type: "bool",
      },
    ],
    name: "setCaller",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "expbooka",
        type: "address",
      },
      {
        internalType: "address",
        name: "expbookb",
        type: "address",
      },
      {
        internalType: "address",
        name: "expbookc",
        type: "address",
      },
    ],
    name: "setExpBook",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenaddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "takeOutErrorTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
