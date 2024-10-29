let sampleChats = [
    {
        chatName: "Chat with Alice",
        isGroupChat: false,
        users: [
            mongoose.Types.ObjectId("60d21b4667d0d8992e610c85"), // User ID for Alice
            mongoose.Types.ObjectId("60d21b4667d0d8992e610c86"), // User ID for Bob
        ],
        latestMessage: mongoose.Types.ObjectId("60d21b4667d0d8992e610c87"), // Message ID for the latest message
        groupAdmin: null, // Not applicable for one-on-one chats
    },
    {
        chatName: "Friends Group",
        isGroupChat: true,
        users: [
            mongoose.Types.ObjectId("60d21b4667d0d8992e610c85"), // User ID for Alice
            mongoose.Types.ObjectId("60d21b4667d0d8992e610c86"), // User ID for Bob
            mongoose.Types.ObjectId("60d21b4667d0d8992e610c88"), // User ID for Charlie
        ],
        latestMessage: mongoose.Types.ObjectId("60d21b4667d0d8992e610c89"), // Message ID for the latest message
        groupAdmin: mongoose.Types.ObjectId("60d21b4667d0d8992e610c85"), // User ID for Alice as the group admin
    },
];

const sampleMessages = [
    {
        sender: mongoose.Types.ObjectId("60d21b4667d0d8992e610c85"), // User ID for Alice
        content: "Hey Bob! How's it going?",
        chat: mongoose.Types.ObjectId("60d21b4667d0d8992e610c90"), // Chat ID for the chat with Bob
        createdAt: new Date(), // This will be set automatically if using timestamps
        updatedAt: new Date(), // This will also be set automatically
    },
    {
        sender: mongoose.Types.ObjectId("60d21b4667d0d8992e610c86"), // User ID for Bob
        content: "I'm doing well, Alice! How about you?",
        chat: mongoose.Types.ObjectId("60d21b4667d0d8992e610c90"), // Chat ID for the chat with Alice
        createdAt: new Date(),
        updatedAt: new Date(),
    }
]

const sampleUsers = [
    {
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        password: "hashed_password_1", // Replace with actual hashed password
        profile: "https://example.com/profiles/alice.jpg",
        createdAt: new Date(), // Will be set automatically with timestamps
        updatedAt: new Date(), // Will also be set automatically
    },
    {
        name: "Bob Smith",
        email: "bob.smith@example.com",
        password: "hashed_password_2", // Replace with actual hashed password
        profile: "https://example.com/profiles/bob.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
]