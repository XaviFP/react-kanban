# Ongoing Kanban React-Node.js pet project

## How to run:

```sh
$ docker-compose up
```

## Running tests:

Server:

```sh
$ cd server/
$ npm test
```

Client:

```sh
$ cd client/
$ npm test
```

and follow the instructions.

### Next steps:

- [ ] Frontend Overhaul.
- [ ] Bring back reducer tests removed after major refactor.
- [ ] Allow Boards to be modified and deleted.
- [ ] Implement login.
- [ ] Extend task contents.
- [ ] ...


## Examples:

### Create and move column:
![Create and move column](example_gifs/kanban_create_and_move_column.gif)


### Create and move task
![Create and move task](example_gifs/kanban_create_and_move_task.gif)


### Select and move board
![Select and move board](example_gifs/kanban_select_and_move_board.gif)



### Real time websockets update
![Real time websockets update](example_gifs/kanban_websockets_update.gif)
