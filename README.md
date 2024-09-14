#### About this project:

Project developed with the following technologies: TypeScript, Nodejs, Expressjs, MongoDB and Socket.io.

This is a chat application where users can chat with other users in real time if they are in the same room.

## Testing the project:

To test run this project, run the command on the terminal npm run start:dev and visit the URL localhost:4000. You should see this on the terminal:


Next, pick a room and enter an username:


Open two more tabs on your browser and visit the same URL localhost:4000. Join the same room you joined on the first tab on the second tab. On the third tab, join a different one than the first two ones.


Then send some test messages in both the first and second tabs. You will see only they can see these messages, users from different room cannot see it.
Also, users who joined within a time frame of 2 minutes will be able to see all the room message. The time limit was chosen to be 2 minutes on purpose for demonstration purposes.
