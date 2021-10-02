module.exports = (sequelize, DataTypes) => {
    const UserRoom = sequelize.define(
        "UserRoom",
        {
            userId: { 
                primaryKey: true,
                type: DataTypes.INTEGER, 
                allowNull: false 
            },
            chatRoomId: { 
                primaryKey: true,
                type: DataTypes.INTEGER, 
                allowNull: false 
            },
            status: { 
                type: DataTypes.ENUM("JOIN", "PENDING", "CANCEL"), 
                allowNull: false 
            },
        },
        {
            tableName: "users_rooms",
            underscored: true,
        }
    );

    UserRoom.associate = (models) => {
        UserRoom.belongsTo(models.User, {
            foreignKey: {
                name: "userId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });

        UserRoom.belongsTo(models.ChatRoom, {
            foreignKey: {
                name: "chatRoomId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });

        UserRoom.belongsTo(models.Role, {
            foreignKey: {
                name: "roleId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });
    };

    return UserRoom;
};
