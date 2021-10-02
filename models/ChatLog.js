module.exports = (sequelize, DataTypes) => {
    const ChatLog = sequelize.define(
        "ChatLog",
        {
            chatter: { 
                type: DataTypes.STRING, 
                allowNull: false 
            },
            message: { 
                type: DataTypes.STRING, 
                allowNull: false 
            },
        },
        { tableName: "chat_logs", underscored: true }
    );

    ChatLog.associate = (models) => {
        ChatLog.belongsTo(models.User, {
            foreignKey: {
                name: "userId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });

        ChatLog.belongsTo(models.ChatLog, {
            foreignKey: {
                name: "chatRoomId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });
    };

    return ChatLog;
};