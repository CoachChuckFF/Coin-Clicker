export type Upgrade = {
  "version": "0.1.0",
  "name": "upgrade",
  "instructions": [
    {
      "name": "start",
      "accounts": [
        {
          "name": "clicker",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "click",
      "accounts": [
        {
          "name": "clicker",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "upgrade",
      "accounts": [
        {
          "name": "clicker",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "upgrade",
          "type": "u64"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "clicker",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "dateCreated",
            "type": "i64"
          },
          {
            "name": "points",
            "type": "u64"
          },
          {
            "name": "clickerUpgrades",
            "type": {
              "array": [
                "u64",
                10
              ]
            }
          },
          {
            "name": "lastUpdated",
            "type": "i64"
          }
        ]
      }
    }
  ]
};

export const IDL: Upgrade = {
  "version": "0.1.0",
  "name": "upgrade",
  "instructions": [
    {
      "name": "start",
      "accounts": [
        {
          "name": "clicker",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "click",
      "accounts": [
        {
          "name": "clicker",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "upgrade",
      "accounts": [
        {
          "name": "clicker",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "upgrade",
          "type": "u64"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "clicker",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "dateCreated",
            "type": "i64"
          },
          {
            "name": "points",
            "type": "u64"
          },
          {
            "name": "clickerUpgrades",
            "type": {
              "array": [
                "u64",
                10
              ]
            }
          },
          {
            "name": "lastUpdated",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
