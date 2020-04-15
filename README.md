# Stream Video Chat With Texting Using Vonage Video API

This series of tutorials will explore the [Vonage Video API (formerly TokBox OpenTok)](https://tokbox.com/developer/) and what you can build with it. The Video API is very robust and highly customisable, and in each post, we’ll show how to implement a specific feature using the API. This time we will look at how to provide an option for people to watch a stream of your video chat and interact with each other via text chat.

We will not be using any front-end frameworks for this series, just vanilla Javascript to keep the focus on the Video API itself. At the end of this tutorial, you should be able to have two options for your people to join your video chat, as a viewer or as a guest. Viewers can see all published video streams and participate via text chat, while participants can additionally publish their video to the chat.

![Screenshot of viewer page with text chat open](https://cdn.glitch.com/89dd6641-affd-4e68-814e-3d04c276235b%2Fviewer.jpg?v=1586847376576)

## Running on your local machine

1. `git clone https://github.com/nexmo-community/stream-video-with-textchat.git`
2. `npm install`
3. `node server.js`

## Code of Conduct

In the interest of fostering an open and welcoming environment, we strive to make participation in our project and our community a harassment-free experience for everyone. Please check out our [Code of Conduct][coc] in full.

## License

This project is subject to the [MIT License][license]

[coc]: CODE_OF_CONDUCT.md "Code of Conduct"
[license]: LICENSE "MIT License"