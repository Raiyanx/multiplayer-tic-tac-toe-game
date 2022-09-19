# Multiplayer tic-tac-toe game
This is a multiplayer tic-tac-toe game implemented using Socket.io.

Note: This still needs to be deployed.

To play this game, one can either:
### Create a new room
This will create a room with a specific code. This code can be shared with others who can join the room using the code. While creating the room the player can also 
choose to select the symbol they're using to play and whether they want to be the first or second player.

### Join a room
This will enable the player to join the room with that code. Only two players will be able to be part of the same room. More than one person cannot join the same room.


A game proceeds as a usual tic-tac-toe game. After a same ends the players can decide to restart the game.


To be implemented in the future:
- Keeping track of the number of wins/loses.
- Enabling players to change their symbol in the game.
- Adding a database in the back enabling users to signup and login and past game history.
