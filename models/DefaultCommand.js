module.exports = (sequelize, DataTypes) => {
    const DefaultCommand = sequelize.define(
        "DefaultCommand",
        {
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            command: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            response: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
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
            tableName: "default_commands",
            underscored: true,
        }
    );

    DefaultCommand.associate = (models) => {
        DefaultCommand.belongsTo(models.User, {
            foreignKey: {
                name: "userId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });
    };

    return DefaultCommand;
};
