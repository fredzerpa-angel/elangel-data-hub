const USERS_MOCK = [
  {
    "_id": "642357e17aba75a778c7ee46",
    "imageUrl": "https://lh3.googleusercontent.com/a/AGNmyxaBbJSMHIQwHTKP8GtgZO5ud1lypDF769qqCfQQ=s96-c",
    "email": "fred.zerpa@elangel.edu.ve",
    "names": "Fred",
    "lastnames": "Zerpa",
    "fullname": "Fred Zerpa",
    "privileges": {
      "reports": {
        "read": true
      },
      "users": {
        "read": true,
        "upsert": true,
        "delete": true
      },
      "events": {
        "read": true,
        "upsert": true,
        "delete": true
      }
    },
    "notifications": {
      "students": {
        "assistance": true
      },
      "events": {
        "onGoing": true
      },
      "debts": {
        "onWatch": true
      }
    },
    "__v": 0
  },
  {
    "_id": "64238b7352b77ba094bb597c",
    "imageUrl": "https://elangel-datahub-images.s3.amazonaws.com/e94eecb1-e9bd-474e-9756-eca401101593.jpg",
    "email": "fredzerpa@gmail.com",
    "names": "Fred",
    "lastnames": "Zerpa",
    "fullname": "Fred Zerpa",
    "privileges": {
      "reports": {
        "read": true
      },
      "users": {
        "read": true,
        "upsert": true,
        "delete": true
      },
      "events": {
        "read": true,
        "upsert": true,
        "delete": true
      }
    },
    "notifications": {
      "students": {
        "assistance": true
      },
      "events": {
        "onGoing": true
      },
      "debts": {
        "onWatch": true
      }
    },
    "__v": 0
  },
  {
    "_id": "6423914d52b77ba094bb5981",
    "imageUrl": "https://elangel-datahub-images.s3.amazonaws.com/82868cf8-dc5e-4775-bf12-6c4cab71a6dd.jpg",
    "email": "test@gmail.com",
    "names": "Testing",
    "lastnames": "Test",
    "fullname": "Alec M. Thompson",
    "privileges": {
      "reports": {
        "read": true
      },
      "users": {
        "read": true,
        "upsert": false,
        "delete": false
      },
      "events": {
        "read": true,
        "upsert": false,
        "delete": false
      }
    },
    "notifications": {
      "students": {
        "assistance": true
      },
      "events": {
        "onGoing": true
      },
      "debts": {
        "onWatch": true
      }
    },
    "__v": 0,
    "phones": {
      "main": "(44) 123 1234 123"
    }
  },
]

export default USERS_MOCK;