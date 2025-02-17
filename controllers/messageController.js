/*const Message = require('../models/Message');

const sendMessage = async (req, res) => {
  const { sender, receiver, content } = req.body;

  // Log the incoming request data
  console.log("Received message request:", { sender, receiver, content });

  try {
    // Save the message to the database
    const message = new Message({ sender, receiver, content });

    console.log("Saving message to database...");

    await message.save();

    console.log("Message saved:", message);

    // Emit the message to the receiver
    console.log(`Emitting message to receiver: ${receiver}`);

    req.io.to(receiver).emit('receiveMessage', {
      sender,
      receiver,
      content,
    });

    // Emit the message to the sender (optional for immediate feedback)
    console.log(`Emitting message to sender: ${sender}`);

    req.io.to(sender).emit('receiveMessage', {
      sender,
      receiver,
      content,
    });

    // Send the saved message as a response
    res.status(200).json(message);

  } catch (error) {
    console.error("Error sending message:", error);  // Log the error if something goes wrong
    res.status(500).json({ error: 'Failed to send message' });
  }
};

const getMessages = async (req, res) => {
    const { sender, receiver } = req.params;
  
    console.log(`Fetching messages for sender: ${sender}, receiver: ${receiver}`);
  
    try {
      // Fetch messages for the sender and receiver
      const messages = await Message.find({
        $or: [
          { sender, receiver },
          { sender: receiver, receiver: sender },
        ],
      }).sort({ timestamp: 1 });
  
      // Check if no messages are found
      if (!messages || messages.length === 0) {
        console.log("No messages found for this conversation.");
        return res.status(200).json([]);  // Return an empty array if no messages found
      }
  
      console.log("Messages retrieved:", messages);
      res.status(200).json(messages);
  
    } catch (error) {
      console.error("Error fetching messages:", error);  // Log the error if something goes wrong
      res.status(500).json({ error: 'Failed to retrieve messages' });
    }
  };
  

module.exports = { sendMessage, getMessages };*/

const Message = require('../models/Message');

const sendMessage = async (req, res) => {
    const { sender, receiver, content } = req.body;
  
    // Log the incoming request data
    console.log("Received message request:", { sender, receiver, content });
  
    try {
      // Save the message to the database
      const message = new Message({ sender, receiver, content });
  
      console.log("Saving message to database...");
  
      await message.save();
  
      console.log("Message saved:", message);

      console.log("Emitting message to receiver:", receiver);
      if (req.io) {
        req.io.to(receiver).emit('receiveMessage', {
        sender,
        receiver,
        content,
        });

  
      // Emit the message to the receiver via socket (via req.io)
      /*if (req.io) {
        console.log(`Emitting message to receiver: ${receiver}`);
        req.io.to(receiver).emit('receiveMessage', {
          sender,
          receiver,
          content,
        });*/
  
        // Optionally, emit to the sender as well (for immediate feedback)
        console.log(`Emitting message to sender: ${sender}`);
        req.io.to(sender).emit('receiveMessage', {
          sender,
          receiver,
          content,
        });
  
        console.log(`Message successfully emitted to both sender and receiver.`);
      } else {
        console.error('Socket.io not initialized');
      }
  
      // Send the saved message as a response
      res.status(200).json(message);
  
    } catch (error) {
      console.error("Error sending message:", error); // Log the error if something goes wrong
      res.status(500).json({ error: 'Failed to send message' });
    }
  };
  
const getMessages = async (req, res) => {
  const { sender, receiver } = req.params;

  console.log(`Fetching messages for sender: ${sender}, receiver: ${receiver}`);

  try {
    // Fetch messages for the sender and receiver
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ timestamp: 1 });

    // Check if no messages are found
    if (!messages || messages.length === 0) {
      console.log("No messages found for this conversation.");
      return res.status(200).json([]);  // Return an empty array if no messages found
    }

    console.log("Messages retrieved:", messages);
    res.status(200).json(messages);

  } catch (error) {
    console.error("Error fetching messages:", error);  // Log the error if something goes wrong
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};

module.exports = { sendMessage, getMessages };
