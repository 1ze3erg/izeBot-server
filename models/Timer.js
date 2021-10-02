module.exports = (sequelize, DataTypes) => {
    const Timer = sequelize.define(
        "Timer",
        {
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            timerName: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            response: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            interval: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isNumeric: true,
                    gt(value) {
                        if (value <= 0) {
                            throw new Error("must be greater than zero");
                        }
                    },
                },
            },
            description: DataTypes.STRING,
        },
        { 
            tableName: "timers", 
            underscored: true 
        }
    );

    Timer.associate = (models) => {
        Timer.belongsTo(models.User, {
            foreignKey: {
                name: "userId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });
    };

    return Timer;
};
