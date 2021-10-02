module.exports = (sequelize, DataTypes) => {
    const CustomCommand = sequelize.define(
        "CustomCommand",
        {
            status: { 
                type: DataTypes.BOOLEAN, 
                allowNull: false, 
                defaultValue: true 
            },
            command: { 
                type: DataTypes.STRING, 
                allowNull: false, 
                unique: true 
            },
            response: { 
                type: DataTypes.STRING, 
                allowNull: false 
            },
            description: DataTypes.STRING,
            cooldown: { 
                type: DataTypes.INTEGER, 
                allowNull: false, 
                defaultValue: 5000,
                validate: {
                    isNumeric: true,
                    gt(value) {
                        if (value <= 0) {
                            throw new Error("must be greater than zero");
                        }
                    },
                }
            },
        },
        { 
            tableName: "custom_commands", 
            underscored: true 
        }
    );

    CustomCommand.associate = (models) => {
        CustomCommand.belongsTo(models.User, {
            foreignKey: {
                name: "userId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        })
    }

    return CustomCommand;
};
