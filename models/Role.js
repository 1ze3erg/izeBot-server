module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define(
        "Role",
        {
            roleName: { 
                type: DataTypes.STRING, 
                allowNull: false, 
                unique: true 
            },
            roleIcon: { 
                type: DataTypes.STRING, 
                allowNull: false 
            },
            roleStyle: DataTypes.STRING,
            roleLimit: {
                type: DataTypes.INTEGER,
                validate: {
                    isNumeric: true,
                    gt(value) {
                        if (value <= 0) {
                            throw new Error("must be greater than zero");
                        }
                    },
                }
            }
        },
        { 
            tableName: "roles", 
            underscored: true 
        }
    );

    Role.associate = (models) => {
        Role.hasMany(models.UserRoom, {
            foreignKey: {
                name: "roleId",
                allowNull: false,
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
        });
    };

    return Role;
}