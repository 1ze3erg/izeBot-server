module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            avatar: DataTypes.STRING, 
            displayName: { 
                type: DataTypes.STRING, 
                allowNull: false 
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: { 
                    isEmail: true 
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            phoneNumber: DataTypes.STRING,
            address: DataTypes.STRING,
            country: DataTypes.STRING,
            postalCode: DataTypes.STRING,
        },
        {
            tableName: "users",
            underscored: true,
        }
    );

    User.associate = (models) => {
        User.hasMany(models.CustomCommand, {
            foreignKey: {
                name: "userId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });

        User.hasMany(models.Timer, {
            foreignKey: {
                name: "userId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });

        User.hasMany(models.ChatRoom, {
            foreignKey: {
                name: "hostUserId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });

        User.hasMany(models.ChatLog, {
            foreignKey: {
                name: "userId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });

        User.hasMany(models.UserRoom, {
            foreignKey: {
                name: "userId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        })
    };

    return User;
};
