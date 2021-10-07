module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define(
        "Admin",
        {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: "admins",
            underscored: true,
        }
    );

    return Admin;
};
