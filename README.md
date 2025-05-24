# BetJS
Starting a project to maximise winning chance on platform like whatnot, voggt ...


# Installation

ON LINUX(WSL) :

```sudo apt update && sudo apt upgrade```

```curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -```
```sudo apt install -y nodejs```


###### to launch the server
```npx http-server .```

# Context

This program is designed to help you make the best decision when you participate in a Spot Game like you can see on platforms like whatnot, voggt ...

The purpose of this game(Spot game) is to place a bid to get a roll in a wheel. who give you the equal chance to win one of the price on list.

Each time the wheel is rolled, you need to specify the price that came out.
And the program will keep calculate the probabilities of each item and the expected value of the game.

# Usage

you will find a item.json file inside the project, you can edit it to add your items, their price and quantity.

```json
"items": [{
            "name": "Item1",
            "price": 70,
            "quantity": 2},
        {
            "name": "Item2",
            "price": 100,
            "quantity": 1
        }]
```

The program will automatically calculate all probabilities and give you a max bet price to keep wining on long term.