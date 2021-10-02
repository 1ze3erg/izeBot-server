module.exports = (sequelize, DataTypes) => {
    const ChatRoom = sequelize.define(
        "ChatRoom",
        {
            chatRoomName: { 
                type: DataTypes.STRING, 
                allowNull: false 
            },
        },
        { 
            tableName: "chat_rooms", 
            underscored: true 
        }
    );

    ChatRoom.associate = (models) => {
        ChatRoom.belongsTo(models.User, {
            foreignKey: {
                name: "hostUserId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });

        ChatRoom.hasMany(models.ChatLog, {
            foreignKey: {
                name: "chatRoomId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });

        ChatRoom.hasMany(models.UserRoom, {
            foreignKey: {
                name: "chatRoomId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        })
    };

    return ChatRoom;
};
